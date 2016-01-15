/**
 * Created by MrTrustworthy on 15.01.2016.
 */

var THREE = require("js/lib/three");
var Loader = require("js/loader");

var Text = function (parent) {

    //this.parent_body = parent;

    this.cam = null;
    var height = 1;

    var geometry = new THREE.TextGeometry(parent.info.title, {
        size: Math.floor(parent.info.size / 2),
        height: height,
        font: 'helvetiker'
    });

    var material = new THREE.MeshPhongMaterial({
        map: Loader.textures["text_texture"]
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.geometry.center();
    this.mesh.position.z += parent.info.size * 1.5 + 10;
    this.mesh.userData = this;

    this.update_parent_position({target: parent});
    parent.addEventListener("body_moved", this.update_parent_position.bind(this));

};

Text.prototype.update_parent_position = function (evt) {
    var parent = evt.target;
    this.mesh.position.x = parent.mesh.position.x;
    this.mesh.position.y = parent.mesh.position.y;

    if (this.cam) this._update_camera_angle({target: this.cam});
    else this.mesh.rotation.z = 0;


};

Text.prototype.register_cam = function (cam) {
    this.cam = cam;
    this._update_camera_angle({target: this.cam});
    cam.addEventListener("cam_moved", this._update_camera_angle.bind(this));
};

Text.prototype._update_camera_angle = function (evt) {

    var cam = evt.target;
    this.mesh.lookAt(cam.camera.position);
    this.mesh.rotation.z = 0;
};

module.exports = Text;
