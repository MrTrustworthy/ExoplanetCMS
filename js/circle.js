/**
 * Created by MrTrustworthy on 11.01.2016.
 */

var GLOBAL_SPEED = require("js/conf").speed;

function Circle(radius, speed, current) {

    this.radius = radius;
    this.speed = speed || 0.01;
    this.current = current || 0;

    this.get_next = function (val) {
        if(val === undefined) val = this.speed * GLOBAL_SPEED.val;
        this.current += val;
        var scale_x = window.innerWidth / window.innerHeight;
        return {
            x: this.radius * Math.cos(this.current) * scale_x,
            y: this.radius * Math.sin(this.current)
        };
    }


}

module.exports = Circle;