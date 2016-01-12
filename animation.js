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


    this.scene.rotateX(-1);
    THREE.EventDispatcher.prototype.apply(this);

    this.add = function (obj) {
        this.scene.add(obj.mesh);
    };


    this.start = function start() {

        requestAnimationFrame(this.start);
        this.scene.children.forEach(function (child) {
            child.object.move();
        });

        this.dispatchEvent({type: "scene_updated"});

        this.renderer.render(this.scene, this.cam.camera);

    }.bind(this);

    this.shift = function(direction){
        this.scene.rotateX(direction * 0.1);
    }

}
