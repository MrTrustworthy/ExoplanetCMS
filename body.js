/**
 * Created by MrTrustworthy on 11.01.2016.
 */




function Body(info, parent) {

    this.info = info;
    this.parent = parent;

    // need eventhandling to stick the dialogs
    THREE.EventDispatcher.prototype.apply(this);


    this.geometry = new THREE.SphereGeometry(info.size, info.segments, info.segments);

    this.material = new THREE.MeshLambertMaterial(
        {
            color: info.color,
            wireframe: true
        }
    );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.object = this;

    this.mesh.position.x = info.start_x;
    this.mesh.position.y = info.start_y;

    this.dialog = new Dialog(info.content);


    if (this.parent) {

        this.parent_pos = this.parent.mesh.position;
        // only relevant for non-static bodies
        this.speed = info.speed;
        this.radius = Math.sqrt(Math.pow(this.parent_pos.x - info.start_x, 2) + Math.pow(this.parent_pos.y - info.start_y, 2));
        this.circle = new Circle(this.radius, this.speed, info.start_time);
    }

}

Body.prototype.show_dialog = function () {
    this.dialog.show();
};


Body.prototype.hide_dialog = function () {
    this.dialog.close();

};

/**
 *
 */
Body.prototype.move = function () {

    if (this.parent) {
        var arc = this.circle.get_next();
        this.mesh.position.x = this.parent_pos.x + arc.x;
        this.mesh.position.y = this.parent_pos.y + arc.y;

        this.dispatchEvent({
            type: "body_moved",
            info: this
        })
    }

    this.mesh.rotation.x += this.info.rotate_x * window.GLOBAL_SPEED.val;
    this.mesh.rotation.y += this.info.rotate_y * window.GLOBAL_SPEED.val;
};

