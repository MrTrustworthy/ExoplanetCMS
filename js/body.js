"use strict";

var THREE = require("js/lib/three");
var Dialog = require("js/dialog");
var Circle = require("js/circle");
var GLOBAL_SPEED = require("js/conf").speed;
var Text = require("js/text");
var Loader = require("js/loader");
var Shaders = require("js/shaders");

/**
 *
 * A body is basically a Planet.
 * It gets created by the
 * @param info
 * @param parent
 * @constructor
 */
class Body {

    constructor(info, parent, scene) {

        // need eventhandling to stick the dialogs
        THREE.EventDispatcher.prototype.apply(this);

        this.info = info;
        this.parent = parent;

        // generate on demand
        // also avoids circular dependencies
        this.dialog = null;

        // setting backref on info allows us to traverse the solar system
        this.info.backref = this;


        // we want dem power of 2 amounts
        var segment_amount = Math.pow(2, Math.round(Math.log((info.size / 5) + 5) / Math.log(2))) * 2;

        // create the THREE Object
        this.geometry = new THREE.SphereBufferGeometry(info.size, segment_amount, segment_amount);

        if (info.custom_shader) {
            this.material = this._create_shader_material(info.texture, scene);
        } else {
            this.material = this._create_material(info.texture);
        }


        // mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.userData = this;

        // startposition and rotation;
        this.mesh.position.x = info.start_x;
        this.mesh.position.y = info.start_y;
        this.mesh.rotateX(Math.PI / 2);


        // calculate the rotation arc if this object rotates around a parent
        if (this.parent) {

            this.parent_pos = this.parent.mesh.position;
            // only relevant for non-static bodies
            this.speed = info.speed;
            this.radius = Math.sqrt(Math.pow(this.parent_pos.x - info.start_x, 2) + Math.pow(this.parent_pos.y - info.start_y, 2));
            this.circle = new Circle(this.radius, this.speed, info.start_time);
        }

        // create floating text
        this.text = new Text(this);
    }


    /**
     *
     * @param texture_name
     * @returns {THREE.MeshPhongMaterial}
     * @private
     */
    _create_material(texture_name) {
        var material = new THREE.MeshPhongMaterial({
            map: Loader.textures[texture_name]
        });
        material.bumpMap = Loader.textures[texture_name + "_bump"];
        material.bumpScale = 20;
        return material
    }


    /**
     *
     * @param texture_name
     * @param scene
     * @returns {*}
     * @private
     */
    _create_shader_material(texture_name, scene) {

        var uniforms = {
            time: {type: "f", value: 1.0},
            texture1: {type: "t", value: Loader.textures[texture_name]},
            texture2: {type: "t", value: Loader.textures[texture_name + "_bump"]}

        };

        uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.MirroredRepeatWrapping;
        uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.MirroredRepeatWrapping;

        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: Shaders.vertex_shaders.basic,
            fragmentShader: Shaders.fragment_shaders.basic
        });

        scene.addEventListener("scene_updated", function () {
            uniforms.time.value += 1;
            shaderMaterial.needsUpdate = true;
        }.bind(this));


        return shaderMaterial;
    }


    /**
     * Opens dialog
     * Promise resolves once the opening animation has been played or rejects if dialog can't be opened
     * @returns Promise
     */
    show_dialog() {
        if (!this.dialog) this.dialog = new Dialog(this);
        return this.dialog.show();
    }

    /**
     * Closes dialog
     * Promise resolves once the closing animation has been played or rejects if dialog can't be closed
     * @returns Promise
     */
    hide_dialog() {
        return this.dialog.close();
    }

    /**
     *
     * Move the body by the default amount as specified in Circle
     * @dispatch "body_moved" event
     */
    move() {

        if (this.parent) {
            var arc = this.circle.get_next();
            this.mesh.position.x = this.parent_pos.x + arc.x;
            this.mesh.position.y = this.parent_pos.y + arc.y;

            this.dispatchEvent({
                type: "body_moved",
                info: this
            })
        }

        // if global speed is stopped, still do minimal rotation (just looks better)
        this.mesh.rotation.x += this.info.rotate_x * Math.max(GLOBAL_SPEED.val, GLOBAL_SPEED.min);
        this.mesh.rotation.y += this.info.rotate_y * Math.max(GLOBAL_SPEED.val, GLOBAL_SPEED.min);
    }

}


module.exports = Body;