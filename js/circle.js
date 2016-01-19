"use strict";

var GLOBAL_SPEED = require("js/conf").speed;

/**
 * The circle object is used to determine how a body should rotate around its parent
 */
class Circle {

    /**
     * Creates a circle object based on the current screen width.
     * TODO: Auto-update when changing window size
     * @param radius
     * @param speed
     * @param current
     */
    constructor(radius, speed, current) {

        this.radius = radius;
        this.speed = speed || 0.01;
        this.current = current || 0;
    }

    /**
     * Returns the next value in the circle if rotated by "val"-amount
     * @param val
     * @returns {{x: number, y: number}} X/Y-Position
     */
    get_next (val) {
        if (val === undefined) val = this.speed * GLOBAL_SPEED.val;
        this.current += val;
        // correct circle width depending on the screen
        var scale_x = Math.max(window.innerWidth / window.innerHeight, 1);
        return {
            x: this.radius * Math.cos(this.current) * scale_x,
            y: this.radius * Math.sin(this.current)
        };
    }


}

module.exports = Circle;