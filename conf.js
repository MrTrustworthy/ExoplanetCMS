/**
 * Created by MrTrustworthy on 11.01.2016.
 */

BODY = {
    start_x: 0,
    start_y: 0,
    rotate_x: 0,
    rotate_y: 0.01,
    color: 0xff2a00,
    size: 120,
    speed: 0.1,
    segments: 16,
    content: "Hello Planet 1",
    children: [
        {
            start_x: 350,
            start_y: 0,
            rotate_x: 0.07,
            rotate_y: -0.08,
            color: 0x53ff8f,
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
                    color: 0xe8b60c,
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
                    color: 0xb27b12,
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
    min: 0.0075,
    stop: 0,
    locked: false
};