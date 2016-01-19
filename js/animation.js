"use strict";

var THREE = require("js/lib/three");
var Cam = require("js/cam");
var Body = require("js/body");
var Loader = require("js/loader");

/**
 * This class is responsible for the renderer, scene etc.
 * It basically handles all the animation-related stuff
 *
 * TODO: Handle window resize here
 */
class Animation {

    /**
     * Creates new Animation-Object and sets up the surrounding (everything but the bodies themselves)
     */
    constructor() {

        this.bodies = [];

        // setup the basics: camera, renderer, scene, lights and skybox
        this.scene = new THREE.Scene();
        THREE.EventDispatcher.prototype.apply(this.scene);


        this.cam = new Cam();

        this.canvas = document.getElementById("main_canvas");
        this.canvas.style.display = "block";
        this.context = this.canvas.getContext("webgl");

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            context: this.context,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);


        // lights
        // TODO: Not yet too happy with how the lights look
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        this.directionalLight.position.set(2, 1, 2 + Math.PI / 2);
        this.scene.add(this.directionalLight);
        this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
        this.directionalLight2.position.set(0, 1, -2);
        this.directionalLight2.intensity = 0.75;
        this.scene.add(this.directionalLight2);


        // skybox
        this._create_skybox();

    }

    /**
     * Create a skybox so it doesn't look too bland
     * @private
     */
    _create_skybox() {

        var geo = new THREE.SphereGeometry(2500, 32, 32);
        var material = new THREE.MeshPhongMaterial({
            map: Loader.textures["skybox"]
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


    /**
     * Adds a body and the bodies hover-text to the scene and registers it for moving each frame
     *
     * @param obj
     */
    add_body(obj) {
        this.scene.add(obj.mesh);
        this.scene.add(obj.text.mesh);
        // need to setup the text with the camera to allow the text to always focus in it's direction
        obj.text.register_cam(this.cam);
        this.bodies.push(obj);
    }


    /**
     * Starts the animation
     */
    start() {
        // recursive call
        requestAnimationFrame(this.start.bind(this));
        // move all bodies
        this.bodies.forEach(body => body.move());
        // this way we can hook tweens and stuff like that on each frame
        this.scene.dispatchEvent({type: "scene_updated"});

        this.renderer.render(this.scene, this.cam.camera);
    }



}

module.exports = Animation;