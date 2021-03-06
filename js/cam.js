"use strict";

var THREE = require("js/lib/three");
var Circle = require("js/circle");
var Deferred = require("js/lib/mt-promise");


/**
 * A wrapper class for the three.js camera object to help with moving and rotating it
 */
class Cam {

    constructor() {
        // need eventhandling to send "cam_moved" event
        THREE.EventDispatcher.prototype.apply(this);

        // booleans needed by the controller to determine what to do
        this.is_tweening = false;
        this.is_in_close_view = false;

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

        // camera rotation arc, we'll use that amount for vertical values instead of horizontal ones like bodies do
        this.circle = new Circle(1000, 0, -0.9);

        // static variable so we can always look-at the origin point without having to create new Vectors
        this.ORIGIN = new THREE.Vector3(0, 0, 0);

        // those two are needed for tweening
        this.current_view_target = this.ORIGIN;
        this.new_view_target = null;

        this.scroll(2.25);
    }


    /**
     * Moves the camera in an arc vertical to the scene. Allows us to move between overview and side-view.
     * Capped at -1.5 (side-view) and 0 (top view)
     * @param amount integer determining scroll amount
     */
    scroll(amount) {

        amount = amount * -1;

        // avoid gimbal lock problems
        // also, we don't need to scroll that far, so why not just limit it
        if (this.circle.current >= 0 && amount > 0) return;
        else if (this.circle.current <= -1.5 && amount < 0) return;
        else if (this.is_tweening || this.is_in_close_view) return;

        var point = this.circle.get_next(amount * 0.1);
        this.camera.position.z = point.x; //!!
        this.camera.position.y = point.y;
        this.camera.lookAt(this.current_view_target);
        // dispatch change message
        this.dispatchEvent({
            type: "cam_moved",
            info: this
        });
    }


    /**
     *
     * Moves the camera to a given body by tweening it
     *
     * @param object
     * @param scene
     * @returns Promise resolves once tweening finished, rejects if cam is already moving
     */
    lock_on(object, scene) {

        var deferred = new Deferred();

        // abort if cam is already moving
        if (this.is_tweening) {
            console.warn("#Cam: Can't start new movement, already tweening");
            deferred.reject();
            return deferred.promise;
        }

        this.new_view_target = object.mesh.position;

        // execute tweening
        var p = this.tween(
            this.camera.position.clone(),

            new THREE.Vector3(
                object.mesh.position.x,
                object.mesh.position.y,
                object.info.size * 3
            ),

            scene
        );

        p.then(function () {
            this.is_in_close_view = true;
            deferred.resolve();
        }.bind(this));


        return deferred.promise;
    }


    /**
     *
     * Opposite of lock_on, see documentation for that
     *
     * @param scene
     * @returns promise
     */
    remove_lock(scene) {

        var deferred = new Deferred();

        // abort if cam is already moving
        if (this.is_tweening) {
            console.warn("#Cam: Can't start new movement, already tweening");
            deferred.reject();
            return deferred.promise;
        }

        this.new_view_target = this.ORIGIN;

        // cheap trick: we get the original position by asking for the current position in the circle :)
        var old = this.circle.get_next(0);

        //execute tween
        var p = this.tween(
            this.camera.position.clone(),
            new THREE.Vector3(0, old.y, old.x),
            scene
        );

        p.then(function () {

            this.is_in_close_view = false;
            deferred.resolve();

        }.bind(this));

        return deferred.promise;
    }


    /**
     *
     * Moves the camera between two points, performing a move every time the scene updates
     *
     * @param start
     * @param stop
     * @param scene
     * @returns promise - resolves when tweening is done
     * @dispatch "cam_moved" everytime an update is performed so the bodies text can face the camera again
     */
    tween(start, stop, scene) {

        var deferred = new Deferred();

        var frames = 60 * 1;
        var i = 0;
        this.is_tweening = true;

        // generate inbetween-points for translation
        var steps = new THREE.Vector3(
            (stop.x - start.x) / 60,
            (stop.y - start.y) / 60,
            (stop.z - start.z) / 60
        );


        // generate inbetween-points for rotation by creating a second camera and measuring it's rotation,
        // calculating intermediate points based on it's eventual rotation.
        // TODO: kinda needlessly complicated, replace once I find a better way to tween rotation
        var test_camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        test_camera.position.x = stop.x;
        test_camera.position.y = stop.y;
        test_camera.position.z = stop.z;
        test_camera.lookAt(this.new_view_target);

        var rotation_steps = new THREE.Euler(
            (test_camera.rotation.x - this.camera.rotation.x) / 60,
            (test_camera.rotation.y - this.camera.rotation.y) / 60,
            (test_camera.rotation.z - this.camera.rotation.z) / 60
        );


        // the actual tweening function. changes rotation and position each frame
        var move_tween_func = function () {

            i++;

            // tween movement
            this.camera.position.x += steps.x;
            this.camera.position.y += steps.y;
            this.camera.position.z += steps.z;


            // tween rotation
            this.camera.rotation.set(
                this.camera.rotation.x + rotation_steps.x,
                this.camera.rotation.y + rotation_steps.y,
                this.camera.rotation.z + rotation_steps.z
            );

            // dispatch change message
            this.dispatchEvent({
                type: "cam_moved",
                info: this
            });


            // when done
            if (i >= frames) {
                scene.removeEventListener("scene_updated", move_tween_func);
                this.current_view_target = this.new_view_target;
                this.new_view_target = null;
                this.is_tweening = false;
                deferred.resolve();
            }
        }.bind(this);

        scene.addEventListener("scene_updated", move_tween_func);
        return deferred.promise;

    }


}


module.exports = Cam;