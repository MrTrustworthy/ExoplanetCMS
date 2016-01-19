"use strict";


var GLOBAL_SPEED = require("js/conf").speed;
var THREE = require("js/lib/three");
var Body = require("js/body");
var Deferred = require("js/lib/mt-promise");


/**
 * The controller is the main... well... controller.
 *
 * It handles all events on the app, like mouseclicks, scrolls and even updates the cursor everytime
 * a new frame gets rendered to find out whether it's over a body now.
 */
class Controller {


    /**
     * Creates new Controller and sets up all event handlers
     * @param animation
     */
    constructor(animation) {


        this.animation = animation;

        this.current_mouse_move_event = null;
        this.current_selected = null;

        // attach event handlers to the source events
        this.animation.canvas.onclick = this.handle_click.bind(this);
        this.animation.canvas.oncontextmenu = this.handle_right_click.bind(this);
        this.animation.canvas.onmousemove = this.handle_move.bind(this);
        this.animation.canvas.onmousewheel = this.handle_scroll.bind(this);
        this.animation.scene.addEventListener("scene_updated", this.handle_update.bind(this));

    }


    /**
     * Handles mouseclick-events by selecting an object if one was clicked
     *
     * @param evt mouse-click event
     */
    handle_click(evt) {

        var obj = this.get_body_on_mouse_position(evt);
        if (obj) this.select_object(obj);
        else this.cancel_selection();
    }


    /**
     * @param object
     */
    select_object(object) {

        var cam = this.animation.cam;

        if (cam.is_tweening) return;

        // this function performs the selection
        var perform_selection_func = function () {
            GLOBAL_SPEED.val = GLOBAL_SPEED.stop;
            GLOBAL_SPEED.locked = true;
            this.current_selected = object;
            cam.lock_on(object, this.animation.scene).then(object.show_dialog.bind(object));
        }.bind(this);


        if (this.current_selected) this.current_selected.hide_dialog().then(perform_selection_func);
        else perform_selection_func();

    }


    /**
     * Cancels the selection, closes dialoges and moves the camera back to its origin
     *
     * @returns Promise - resolves when deselect has been executed, rejects immediately if not possible
     */
    cancel_selection() {

        var deferred = new Deferred();

        var cam = this.animation.cam;

        // abort right away if we have nothing selected or we're tweening already
        if (!this.current_selected || cam.is_tweening){
            deferred.reject();
            return deferred.promise;
        }

        // hides the dialog and resets the cam and speed
        this.current_selected.hide_dialog().then(function () {

            cam.remove_lock(this.animation.scene);
            GLOBAL_SPEED.val = GLOBAL_SPEED.max;
            GLOBAL_SPEED.locked = false;

            this.current_selected = null;

            deferred.resolve();

        }.bind(this));

        return deferred.promise;
    }


    /**
     * handles right click
     * @returns {boolean}
     */
    handle_right_click() {
        this.cancel_selection();
        return false;
    }


    /**
     * Handle mouse move events by checking whether it's on a body
     * and saving the mouse position so we can check every frame
     *
     * @param evt
     */
    handle_move(evt) {
        this.current_mouse_move_event = evt;

        var obj = this.get_body_on_mouse_position(evt);

        this.animation.canvas.style.cursor = !!obj ? "pointer" : "";

        if (GLOBAL_SPEED.locked) return;

        if (!obj) GLOBAL_SPEED.val = GLOBAL_SPEED.max;
        else GLOBAL_SPEED.val = GLOBAL_SPEED.min;

    }


    /**
     * Handles a Scroll event by rotating the camera
     *
     * @param evt
     */
    handle_scroll(evt) {
        var val = evt.deltaY > 0 ? 1 : -1;
        this.animation.cam.scroll(val);
    }


    /**
     * Handle a new frame provided by the scene
     */
    handle_update() {
        if (this.current_mouse_move_event) this.handle_move(this.current_mouse_move_event);
    }


    /**
     * Checks for bodies on a given mouse-event-position
     *
     * @param event
     * @returns Body or Null when no body was found
     */
    get_body_on_mouse_position(event) {
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        mouse.x = ( event.clientX / this.animation.renderer.domElement.width ) * 2 - 1;
        mouse.y = -( event.clientY / this.animation.renderer.domElement.height ) * 2 + 1;
        raycaster.setFromCamera(mouse, this.animation.cam.camera);

        var objs = raycaster.intersectObjects(this.animation.scene.children);

        var obj = objs[0];

        if (!obj) return null;

        while (obj.object) {
            obj = obj.object;
        }

        if (obj.userData && obj.userData instanceof Body) return obj.userData;
        else return null;

    }


}

module.exports = Controller;
