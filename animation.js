/**
 * Created by MrTrustworthy on 11.01.2016.
 */



function Animation() {

    this.scene = new THREE.Scene();

    this.cam = new Cam();

    this.canvas = document.getElementById("main_canvas");
    this.context = this.canvas.getContext("webgl");

    this.renderer = new THREE.WebGLRenderer(this.context);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x002244, 1);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(2, 1, 2 + Math.PI/2);
    this.scene.add(this.directionalLight);


    //this.scene.rotateX(-1);
    THREE.EventDispatcher.prototype.apply(this.scene);

    this.add = function (obj) {
        this.scene.add(obj.mesh);
    };


    this.start = function start() {

        requestAnimationFrame(this.start);
        this.scene.children.forEach(function (child) {
            if(child instanceof THREE.Mesh) child.object.move();
        });

        this.scene.dispatchEvent({type: "scene_updated"});

        this.renderer.render(this.scene, this.cam.camera);

    }.bind(this);

    this.shift = function (direction) {
        this.cam.scroll(direction);
    }

}
