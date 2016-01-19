"use strict";

var THREE = require("js/lib/three");
var Loader = require("js/loader");


/**
 * The Text class is responsible for the floating text above the planets
 *
 */
class Text {


    /**
     * Initialize a text object with a threejs-mesh based on text-geometry
     *
     * @param parent
     */
    constructor(parent) {

        this.cam = null;
        var height = 1;

        var geometry = new THREE.TextGeometry(parent.info.title, {
            size: Math.floor(parent.info.size / 2),
            height: height,
            font: 'helvetiker'
        });

        var material = new THREE.MeshLambertMaterial({
            color: 0x8FD8D8
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.geometry.center();
        this.mesh.position.z += parent.info.size * 1.5 + 10;
        this.mesh.userData = this;

        this.update_parent_position({target: parent});
        parent.addEventListener("body_moved", this.update_parent_position.bind(this));

    }


    /**
     * Gets called when the parent body moves and adapts the texts position to the parent position.
     *
     * @param evt - evt.target is the corresponding body object
     */
    update_parent_position(evt) {
        var parent = evt.target;
        this.mesh.position.x = parent.mesh.position.x;
        this.mesh.position.y = parent.mesh.position.y;

        if (this.cam) this._update_camera_angle({target: this.cam});
        else this.mesh.rotation.z = 0;


    };


    /**
     * Registers a camera for this text so the text can always face it
     *
     * @param cam
     */
    register_cam(cam) {
        this.cam = cam;
        this._update_camera_angle({target: this.cam});
        cam.addEventListener("cam_moved", this._update_camera_angle.bind(this));
    };

    /**
     * Internal function that gets called everytime the camera moves
     *
     * @param evt - the event gets emitted by the cam, so the target is the cam object
     * @private
     */
    _update_camera_angle(evt) {

        var cam = evt.target;
        this.mesh.lookAt(cam.camera.position);
        this.mesh.rotation.z = 0;
    };

}

module.exports = Text;
