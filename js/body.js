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

    if(info.custom_shader){
        this.material = this._create_shader_material(info.texture, scene);
    }else{
        this.material = this._create_material(info.texture);
    }


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
 * @param texture_name
 * @returns {THREE.MeshPhongMaterial}
 * @private
 */
Body.prototype._create_material = function(texture_name){
    var material = new THREE.MeshPhongMaterial({
        map: Loader.textures[texture_name]
    });
    material.bumpMap = Loader.textures[texture_name + "_bump"];
    material.bumpScale = 20;
    return material

};



/**
 *
 * @param texture_name
 * @param scene
 * @returns {*}
 * @private
 */
Body.prototype._create_shader_material = function (texture_name, scene) {

    var uniforms = {
        time: {type: "f", value: 1.0},
        texture1: {type: "t", value: Loader.textures[texture_name]},
        texture2: {type: "t", value: Loader.textures[texture_name + "_bump"]}

    };

    uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.MirroredRepeatWrapping;
    uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.MirroredRepeatWrapping;

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertex_shader,
        fragmentShader: fragment_shader
    });

    scene.addEventListener("scene_updated", function () {
        uniforms.time.value += 1;
        shaderMaterial.needsUpdate = true;
    }.bind(this));


    return shaderMaterial;


};

var vertex_shader = `
uniform float time;

varying vec2 vUv;

void main() {
    vUv = uv;

    float c = sin(time/25.0);
    vec3 newPosition = position + normal * vec3(c);

    gl_Position =   projectionMatrix *
                    modelViewMatrix *
                    vec4(newPosition,1.0);
}
`;


var fragment_shader = `
uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 vUv;

void main( void ) {

    float progress = time / 20.0;

    vec2 position = -1.0 + 2.0 * vUv;

    vec4 noise = texture2D( texture2, vUv );
    vec2 T1 = vUv + vec2( 1.5, -1.5 ) * progress  *0.02;
    vec2 T2 = vUv + vec2( -0.5, 2.0 ) * progress * 0.01;

    T1.x += noise.x * 2.0;
    T1.y += noise.y * 2.0;
    T2.x -= noise.y * 0.2;
    T2.y += noise.z * 0.2;

    float p = texture2D( texture2, T1 * 2.0 ).a;

    vec4 color = texture2D( texture1, T2 * 2.0 );
    vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

    if( temp.r > 1.0 ){ temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
    if( temp.g > 1.0 ){ temp.rb += temp.g - 1.0; }
    if( temp.b > 1.0 ){ temp.rg += temp.b - 1.0; }

    gl_FragColor = temp;

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