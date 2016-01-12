/**
 * Created by MrTrustworthy on 11.01.2016.
 */

var Cam = function(){


    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;

    this.lock_on = function(){


    };


};