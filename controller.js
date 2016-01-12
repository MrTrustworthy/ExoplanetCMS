/**
 * Created by MrTrustworthy on 11.01.2016.
 */


var Controller = function (animation) {

    this.animation = animation;

    this.canvas = animation.canvas;

    this.current_mouse_move = null;
    this.current_selected = null;

    this.canvas.onclick = this.handle_click.bind(this);
    this.canvas.oncontextmenu = this.handle_rightclick.bind(this);
    this.canvas.onmousemove = this.handle_move.bind(this);
    this.canvas.onmousewheel = this.handle_scroll.bind(this);

    this.animation.scene.addEventListener("scene_updated", this.handle_update.bind(this));

};

window.ii = 0;

/**
 *
 * @param evt
 */
Controller.prototype.handle_click = function (evt) {


    // aehmmm.... gotta clean this up
    var objs = this.get_objects(evt);

    var obj = objs[0];
    while (!!obj && !(obj.object === undefined)) {
        obj = obj.object;
    }
    if (obj){
        if(this.current_selected) this.current_selected.hide_dialog();
        this.select_object(obj);
    }
    else this.cancel_selection();
};

/**
 *
 * @param object
 */
Controller.prototype.select_object = function (object) {

    var can_tween = this.animation.cam.lock_on(object, this.animation.scene);

    if (can_tween) {
        GLOBAL_SPEED.val = GLOBAL_SPEED.stop;
        GLOBAL_SPEED.locked = true;
        this.current_selected = object;
        object.show_dialog();
    }
};

/**
 *
 */
Controller.prototype.cancel_selection = function () {

    if (this.current_selected && this.animation.cam.remove_lock(this.animation.scene)) {
        GLOBAL_SPEED.val = GLOBAL_SPEED.max;
        GLOBAL_SPEED.locked = false;
        this.current_selected.hide_dialog();
        this.current_selected = null;
    }
};


/**
 *
 * @returns {boolean}
 */
Controller.prototype.handle_rightclick = function () {
    this.cancel_selection();
    return false;
};

/**
 *
 * @param evt
 */
Controller.prototype.handle_move = function (evt) {
    this.current_mouse_move = evt;
    var objects = this.get_objects(evt);

    if (GLOBAL_SPEED.locked) return;

    if (!objects[0]) {
        GLOBAL_SPEED.val = GLOBAL_SPEED.max;
    } else {
        GLOBAL_SPEED.val = GLOBAL_SPEED.min;
    }

};


/**
 *
 * @param evt
 */
Controller.prototype.handle_scroll = function (evt) {
    var val = evt.deltaY > 0 ? 1 : -1;
    this.animation.shift(val);
};


/**
 *
 */
Controller.prototype.handle_update = function () {
    if (this.current_mouse_move) this.handle_move(this.current_mouse_move);
};


/**
 *
 * @param event
 * @returns {*}
 */
Controller.prototype.get_objects = function (event) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / this.animation.renderer.domElement.width ) * 2 - 1;
    mouse.y = -( event.clientY / this.animation.renderer.domElement.height ) * 2 + 1;
    raycaster.setFromCamera(mouse, this.animation.cam.camera);

    return raycaster.intersectObjects(this.animation.scene.children);
};


