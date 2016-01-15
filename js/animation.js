/**
 * Created by MrTrustworthy on 11.01.2016.
 */

var THREE = require("js/lib/three");
var Cam = require("js/cam");
var Body = require("js/body");
var Loader = require("js/loader");

function Animation() {


    // basic renderer stuff
    this.scene = new THREE.Scene();
    THREE.EventDispatcher.prototype.apply(this.scene);


    this.cam = new Cam();

    this.canvas = document.getElementById("main_canvas");
    this.context = this.canvas.getContext("webgl");

    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        context: this.context,
        antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);


    // light2
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(2, 1, 2 + Math.PI / 2);
    this.scene.add(this.directionalLight);

    this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight2.position.set(0, 1, -2);
    this.directionalLight2.intensity = 0.75;
    this.scene.add(this.directionalLight2);


    // skybox

    var geo = new THREE.SphereGeometry(2500, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        map: Loader.textures["skybox"]
        //specularMap: Loader.textures["graphics/skybox_specular.jpg"]
    });
    material.bumpMap = Loader.textures["skybox_bump"];
    material.bumpScale = 4;

    var sphere = new THREE.Mesh(geo, material);
    sphere.scale.x = -1;
    sphere.scale.y = -1;
    sphere.scale.z = -1;


    sphere.rotateX(Math.PI / 4);

    sphere.rotateY(-Math.PI / 2);

    this.scene.add(sphere);


}


Animation.prototype.add_body = function (obj) {
    this.scene.add(obj.mesh);
    this.scene.add(obj.text.mesh);
    obj.text.register_cam(this.cam);
};


Animation.prototype.start = function start() {

    requestAnimationFrame(this.start.bind(this));
    this.scene.children.forEach(function (child) {
        if (child.userData instanceof Body) child.userData.move();
    });

    this.scene.dispatchEvent({type: "scene_updated"});

    this.renderer.render(this.scene, this.cam.camera);

};


module.exports = Animation;