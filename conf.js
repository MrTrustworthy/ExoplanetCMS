/**
 * Created by MrTrustworthy on 11.01.2016.
 */

BODY = {
    start_x: 0,
    start_y: 0,
    rotate_x: 0.01,
    rotate_y: 0.02,
    color: 0xff00ff,
    size: 120,
    speed: 0.1,
    children: [
        {
            start_x: 450,
            start_y: 0,
            rotate_x: 0.02,
            rotate_y: 0.06,
            color: 0xff00ff,
            size: 40,
            speed: 0.02,
            children: [
                {
                    start_x: 650,
                    start_y: 0,
                    rotate_x: 0.02,
                    rotate_y: 0.06,
                    color: 0xff00ff,
                    size: 20,
                    speed: 0.1,
                    children: []
                }
            ]
        }

    ]
};


GLOBAL_SPEED = {
    val: 0.5,
    max: 0.5,
    min: 0.01
};