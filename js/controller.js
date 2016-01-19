"use strict";


var GLOBAL_SPEED = require("js/conf").speed;
var THREE = require("js/lib/three");
var Body = require("js/body");


/**
 *
 */
class Controller {


    /**
     *
     * @param animation
     */
    constructor(animation) {

        this.animation = animation;

        this.canvas = animation.canvas;

        this.current_mouse_move = null;
        this.current_selected = null;

        this.canvas.onclick = this.handle_click.bind(this);
        this.canvas.oncontextmenu = this.handle_rightclick.bind(this);
        this.canvas.onmousemove = this.handle_move.bind(this);
        this.canvas.onmousewheel = this.handle_scroll.bind(this);

        this.animation.scene.addEventListener("scene_updated", this.handle_update.bind(this));

    }


    /**
     *
     * @param evt
     */
    handle_click(evt) {

        var obj = this.get_object(evt);
        if (obj) this.select_object(obj);
        else this.cancel_selection();
    }


    /**
     *
     * @param object
     */
    select_object(object) {

        var cam = this.animation.cam;

        if (cam.is_tweening) return;


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
     *
     */
    cancel_selection() {

        var cam = this.animation.cam;

        if (!this.current_selected || cam.is_tweening) return;

        this.current_selected.hide_dialog().then(function () {

            cam.remove_lock(this.animation.scene);
            GLOBAL_SPEED.val = GLOBAL_SPEED.max;
            GLOBAL_SPEED.locked = false;

            this.current_selected = null;
        }.bind(this));


    }


    /**
     *
     * @returns {boolean}
     */
    handle_rightclick() {
        this.cancel_selection();
        return false;
    }


    /**
     *
     * @param evt
     */
    handle_move(evt) {
        this.current_mouse_move = evt;

        var obj = this.get_object(evt);

        this.animation.canvas.style.cursor = !!obj ? "pointer" : "";

        if (GLOBAL_SPEED.locked) return;

        if (!obj) GLOBAL_SPEED.val = GLOBAL_SPEED.max;
        else GLOBAL_SPEED.val = GLOBAL_SPEED.min;

    }


    /**
     *
     * @param evt
     */
    handle_scroll(evt) {
        var val = evt.deltaY > 0 ? 1 : -1;
        this.animation.cam.scroll(val);
    }


    /**
     *
     */
    handle_update() {
        if (this.current_mouse_move) this.handle_move(this.current_mouse_move);
    }


    /**
     *
     * @param event
     * @returns {*}
     */
    get_object(event) {
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
