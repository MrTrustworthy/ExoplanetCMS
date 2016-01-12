/**
 * Created by MrTrustworthy on 11.01.2016.
 */




function Body(info, parent) {

    this.info = info;
    this.parent = parent;

    this.geometry = new THREE.SphereGeometry(info.size, 8, 8);
    this.material = new THREE.MeshBasicMaterial({color: info.color, wireframe: true});

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.object = this;

    this.mesh.position.x = info.start_x;
    this.mesh.position.y = info.start_y;

    var parent_pos;
    if(!parent){
        parent_pos = {
            x: 0,
            y: 0
        }
    }else{
        parent_pos = parent.mesh.position;
    }

    // only relevant for non-static bodies
    this.speed = info.speed;
    this.radius = Math.sqrt(Math.pow(parent_pos.x - info.start_x, 2) + Math.pow(parent_pos.y - info.start_y, 2));
    this.circle = new Circle(this.radius, this.speed);



    this.move = function () {

        var arc = this.circle.get_next();
        this.mesh.position.x = parent_pos.x + arc.x;
        this.mesh.position.y = parent_pos.y + arc.y;

        this.mesh.rotation.x += info.rotate_x * window.GLOBAL_SPEED.val;
        this.mesh.rotation.y += info.rotate_y * window.GLOBAL_SPEED.val;
    };

}
