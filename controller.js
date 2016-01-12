/**
 * Created by MrTrustworthy on 11.01.2016.
 */


var Controller = function (animation) {

    this.animation = animation;

    this.canvas = animation.canvas;

    this.current_mouse_move = null;

    this.current_dialog = null;
    this.current_object = null;
    this.current_update_func = null;

    this.canvas.onclick = this.handle_click.bind(this);
    this.canvas.oncontextmenu = this.handle_rightclick.bind(this);
    this.canvas.onmousemove = this.handle_move.bind(this);
    this.canvas.onmousewheel = this.handle_scroll.bind(this);

    this.animation.addEventListener("scene_updated", this.handle_update.bind(this));

};

/**
 *
 * @param evt
 */
Controller.prototype.handle_click = function (evt) {

    this.cancel_dialog();

    // aehmmm.... gotta clean this up
    var objs = this.get_objects(evt);

    var obj = objs[0];
    while ( !!obj && !(obj.object === undefined) ){
        obj = obj.object;
    }

    if(obj) this.select_object(obj);

};

/**
 *
 * @param object
 */
Controller.prototype.select_object = function(object){



    this.current_object = object;
    this.current_dialog =  new Dialog();

    /**
     *
     * @type {function(this:Controller)}
     */
    this.current_update_func = function(){

        //var p = new THREE.Vector3(x, y, z);
        var p = this.current_object.mesh.position.clone();
        var vector = p.project(this.animation.cam.camera);

        vector.x = (vector.x + 1) / 2 * this.animation.canvas.width;
        vector.y = -(vector.y - 1) / 2 * this.animation.canvas.height;


        this.current_dialog.update_position(vector);


    }.bind(this);


    this.current_object.addEventListener("body_moved", this.current_update_func);

    this.current_dialog.show();
};




/**
 *
 * @returns {boolean}
 */
Controller.prototype.handle_rightclick = function () {
    this.cancel_dialog();
    return false;
};

/**
 *
 */
Controller.prototype.cancel_dialog = function () {
    if (this.current_dialog){
        this.current_dialog.close();
        this.current_dialog = null;
    }
    if (this.current_object && this.current_update_func){
        this.current_object.removeEventListener("body_moved", this.current_update_func);
        this.current_object = null;
        this.current_update_func = null;

    }
};


/**
 *
 * @param evt
 */
Controller.prototype.handle_move = function (evt) {

    this.current_mouse_move = evt;

    var objects = this.get_objects(evt);

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