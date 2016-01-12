/**
 * Created by MrTrustworthy on 11.01.2016.
 */


var Controller = function (animation) {

    this.animation = animation;

    this.canvas = animation.canvas;

    this.current_mouse_move = null;

    this.canvas.onclick = this.handle_click.bind(this);
    this.canvas.oncontextmenu = this.handle_rightclick.bind(this);
    this.canvas.onmousemove = this.handle_move.bind(this);

    this.animation.addEventListener("scene_updated", this.handle_update.bind(this));

};

Controller.prototype.handle_click = function (evt) {
    console.log("clicked!", evt);


};

Controller.prototype.handle_move = function (evt) {

    this.current_mouse_move = evt;

    var objects = this.get_objects(evt);

    if (!objects[0]) {
        GLOBAL_SPEED.val = GLOBAL_SPEED.max;
    } else {
        GLOBAL_SPEED.val = GLOBAL_SPEED.min;
    }

};


Controller.prototype.handle_rightclick = function (evt) {
    console.log("clicked!", evt);

    return false;
};

Controller.prototype.handle_update = function () {
    console.log("update");
    if (this.current_mouse_move) this.handle_move(this.current_mouse_move);
};


Controller.prototype.get_objects = function (event) {
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2(); // create once


    mouse.x = ( event.clientX / this.animation.renderer.domElement.width ) * 2 - 1;
    mouse.y = -( event.clientY / this.animation.renderer.domElement.height ) * 2 + 1;

    raycaster.setFromCamera(mouse, this.animation.cam.camera);


    return raycaster.intersectObjects(this.animation.scene.children);
};