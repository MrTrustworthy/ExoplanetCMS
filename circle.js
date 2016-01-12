/**
 * Created by MrTrustworthy on 11.01.2016.
 */


function Circle(radius, speed) {

    this.current = 0;
    this.radius = radius;
    this.speed = speed || 0.01;

    this.get_next = function () {
        this.current += this.speed * window.GLOBAL_SPEED.val;

        return {
            x: this.radius * Math.cos(this.current),
            y: this.radius * Math.sin(this.current)
        };
    }


}