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
    segments: 16,
    content: "Hello Planet 1",
    children: [
        {
            start_x: 350,
            start_y: 0,
            rotate_x: 0.02,
            rotate_y: 0.06,
            color: 0xff00ff,
            size: 40,
            speed: 0.02,
            segments: 8,
            content: "Hello Planet 2",
            children: [
                {
                    start_x: 450,
                    start_y: 0,
                    rotate_x: -0.1,
                    rotate_y: -0.06,
                    color: 0xff00ff,
                    size: 20,
                    speed: 0.1,
                    segments: 5,
                    content: "Hello Planet 3",
                    children: []
                },
                {
                    start_x: 450,
                    start_y: 0,
                    rotate_x: 0.1,
                    rotate_y: 0.23,
                    color: 0xff00ff,
                    size: 20,
                    speed: 0.1,
                    segments: 5,
                    content: "Hello Planet 4",
                    start_time: 3,
                    children: []
                }
            ]
        }

    ]
};


GLOBAL_SPEED = {
    val: 0.3,
    max: 0.3,
    min: 0.01,
    stop: 0,
    locked: false
};