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
    //this.renderer.setClearColor(0x002244, 1);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(2, 1, 2 + Math.PI / 2);
    this.scene.add(this.directionalLight);

    this.skybox = null;

    var handle_load = function (texture) {

        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1500, 32, 32),
            new THREE.MeshBasicMaterial({
                map: texture,
                specularMap: texture,
                reflectivity: 100
            })
        );
        sphere.scale.x = -1;
        sphere.scale.y = -1;
        sphere.scale.z = -1;


        sphere.rotateX(Math.PI / 4);

        sphere.rotateY(-Math.PI / 2);

        this.skybox = sphere;

        this.scene.add(sphere);
    }.bind(this);


    var loader = new THREE.TextureLoader();


    loader.load(
        "graphics/skybox.jpg",
        handle_load,
        handle_load,
        handle_load
    );


    //this.scene.rotateX(-1);
    THREE.EventDispatcher.prototype.apply(this.scene);

};


Animation.prototype.add = function (obj) {
    this.scene.add(obj.mesh);
};


Animation.prototype.start = function start() {

    requestAnimationFrame(this.start.bind(this));
    this.scene.children.forEach(function (child) {
        if (child.userData instanceof Body) child.userData.move();
    });

    this.scene.dispatchEvent({type: "scene_updated"});

    this.renderer.render(this.scene, this.cam.camera);

};


