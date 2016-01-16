/**
 * Created by MrTrustworthy on 11.01.2016.
 */


var THREE = require("js/lib/three");
var Dialog = require("js/dialog");
var Circle = require("js/circle");
var GLOBAL_SPEED = require("js/conf").speed;
var Text = require("js/text");
var Loader = require("js/loader");
/**
 *
 * @param info
 * @param parent
 * @constructor
 */
function Body(info, parent, scene) {

    this.info = info;
    this.parent = parent;

    // generate on demand
    // also avoids circular dependencies
    this.dialog = null;

    // backref on info allows us to traverse the solar system
    this.info.backref = this;

    // need eventhandling to stick the dialogs
    THREE.EventDispatcher.prototype.apply(this);

    // we want dem power of 2 amounts
    var segment_amount = Math.pow(2, Math.round(Math.log((info.size / 5) + 5) / Math.log(2))) * 2;


    // create the THREE Object
    this.geometry = new THREE.SphereBufferGeometry(info.size, segment_amount, segment_amount);

    this.material = this._create_material(info.texture, scene);

    // mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData = this;

    // startposition and rotation;
    this.mesh.position.x = info.start_x;
    this.mesh.position.y = info.start_y;
    this.mesh.rotateX(Math.PI / 2);



    //  don't do this for the root element
    if (this.parent) {

        this.parent_pos = this.parent.mesh.position;
        // only relevant for non-static bodies
        this.speed = info.speed;
        this.radius = Math.sqrt(Math.pow(this.parent_pos.x - info.start_x, 2) + Math.pow(this.parent_pos.y - info.start_y, 2));
        this.circle = new Circle(this.radius, this.speed, info.start_time);
    }

    // floating text
    this.text = new Text(this);

}

/**
 *
 * @param texture
 * @param scene
 * @returns {*}
 * @private
 */
Body.prototype._create_material = function (texture, scene) {

    if (texture !== "sun") {

        var material = new THREE.MeshPhongMaterial({
            map: Loader.textures[texture]
        });
        material.bumpMap = Loader.textures[texture + "_bump"];
        material.bumpScale = 20;
        return material
    }


    var uniforms = {

        amplitude: {type: "f", value: 1.0},
        color: {type: "c", value: new THREE.Color(0xff2200)},
        texture: {type: "t", value: Loader.textures["lavatile"]}

    };
    uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;


    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertex_shader,
        fragmentShader: fragment_shader
    });


    // transformations

    var displacement = new Float32Array(this.geometry.attributes.position.count);
    var noise = new Float32Array(this.geometry.attributes.position.count);

    for (var i = 0; i < displacement.length; i++) {
        noise[i] = Math.random() * 5;
    }

    this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

    var time = 0;
    scene.addEventListener("scene_updated", function () {
        time++;

        uniforms.amplitude.value = 2.5 * Math.sin(time * 0.0125);
        uniforms.color.value.offsetHSL(0.0005, 0, 0);

        for (var i = 0; i < displacement.length; i++) {

            displacement[i] = Math.sin(0.1 * i + time);

            noise[i] += 0.5 * ( 0.5 - Math.random() );
            noise[i] = THREE.Math.clamp(noise[i], -5, 5);

            displacement[i] += noise[i];

        }

        this.geometry.attributes.displacement.needsUpdate = true;


    }.bind(this));

    return shaderMaterial;


};


var vertex_shader = `

uniform float amplitude;

attribute float displacement;

varying vec3 vNormal;
varying vec2 vUv;

void main() {

    vNormal = normal;
    vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

    vec3 newPosition = position + amplitude * normal * vec3( displacement );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
`;

var fragment_shader = `
varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 color;
uniform sampler2D texture;

void main() {

    vec3 light = vec3( 0.5, 0.2, 1.0 );
    light = normalize( light );

    float dProd = dot( vNormal, light ) * 0.5 + 0.5;

    vec4 tcolor = texture2D( texture, vUv );
    vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );

    gl_FragColor = gray * vec4( vec3( dProd ) * vec3( color ), 1.0 );

}
`;

/**
 *
 */
Body.prototype.show_dialog = function () {
    if (!this.dialog) this.dialog = new Dialog(this);
    return this.dialog.show();
};

/**
 *
 */
Body.prototype.hide_dialog = function () {
    return this.dialog.close();

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

    this.mesh.rotation.x += this.info.rotate_x * Math.max(GLOBAL_SPEED.val, GLOBAL_SPEED.min);
    this.mesh.rotation.y += this.info.rotate_y * Math.max(GLOBAL_SPEED.val, GLOBAL_SPEED.min);
};

module.exports = Body;