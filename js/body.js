/**
 * Created by MrTrustworthy on 11.01.2016.
 */


/**
 *
 * @param info
 * @param parent
 * @constructor
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
            wireframe: true,
            wireframeLinewidth: Math.ceil(info.size / 100) * 10
        }
    );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData = this;

    // startposition and rotation;
    this.mesh.position.x = info.start_x;
    this.mesh.position.y = info.start_y;
    this.mesh.rotateX(Math.PI / 2);

    // generate on demand
    // also avoids circular dependencies
    this.dialog = null;

    // backref on info allows us to traverse the solar system
    this.info.backref = this;


    if (this.parent) {

        this.parent_pos = this.parent.mesh.position;
        // only relevant for non-static bodies
        this.speed = info.speed;
        this.radius = Math.sqrt(Math.pow(this.parent_pos.x - info.start_x, 2) + Math.pow(this.parent_pos.y - info.start_y, 2));
        this.circle = new Circle(this.radius, this.speed, info.start_time);
    }

}
/**
 *
 */
Body.prototype.show_dialog = function () {
    if (!this.dialog) this.dialog = new Dialog(this);
    this.dialog.show();
};

/**
 *
 */
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

