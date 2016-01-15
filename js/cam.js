/**
 * Created by MrTrustworthy on 11.01.2016.
 */

var THREE = require("js/lib/three");
var Circle = require("js/circle");
var Deferred = require("js/lib/mt-promise");

/**
 *
 * @constructor
 */
var Cam = function () {

    THREE.EventDispatcher.prototype.apply(this);



    this.is_tweening = false;
    this.is_in_close_view = false;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    this.circle = new Circle(1000, 0, -0.9);

    this.ORIGIN = new THREE.Vector3(0, 0, 0);
    this.current_view_target = this.ORIGIN;
    this.new_view_target = null;

    this.scroll(0);

};

/**
 *
 * @param amount
 */
Cam.prototype.scroll = function (amount) {

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
};


/**
 *
 * @param object
 * @param scene
 * @returns {boolean}
 */
Cam.prototype.lock_on = function (object, scene) {

    var deferred = new Deferred();

    if (this.is_tweening) {
        console.warn("#Cam: Can't start new movement, already tweening");
        deferred.reject();
        return deferred.promise;
    }

    this.new_view_target = object.mesh.position;

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
};


/**
 *
 * @param scene
 * @returns {boolean}
 */
Cam.prototype.remove_lock = function (scene) {

    var deferred = new Deferred();

    if (this.is_tweening) {
        console.warn("#Cam: Can't start new movement, already tweening");
        deferred.reject();
        return deferred.promise;
    }

    this.new_view_target = this.ORIGIN;
    var old = this.circle.get_next(0);


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

};

/**
 *
 * @param start
 * @param stop
 * @param scene
 */
Cam.prototype.tween = function (start, stop, scene) {

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


    // generate inbetween-points for rotation
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

};

module.exports = Cam;