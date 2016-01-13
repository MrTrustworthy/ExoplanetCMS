/**
 * Created by MrTrustworthy on 11.01.2016.
 */

BODY = {
    start_x: 0,
    start_y: 0,
    rotate_x: 0,
    rotate_y: 0.01,
    color: 0xff2a00,
    size: 90,
    speed: 0.1,
    segments: 16,
    backref: null,
    title: "Hello Planet 1",
    content: "Hello Planet 1",
    children: [
        {
            start_x: 350,
            start_y: 0,
            rotate_x: 0.07,
            rotate_y: -0.08,
            color: 0x53ff8f,
            size: 30,
            speed: 0.02,
            segments: 8,
            backref: null,
            title: "Hello Planet 2",
            content: "Hello Planet 2",
            children: [
                {
                    start_x: 450,
                    start_y: 0,
                    rotate_x: -0.1,
                    rotate_y: -0.06,
                    color: 0xe8b60c,
                    size: 15,
                    speed: 0.1,
                    segments: 5,
                    backref: null,
                    title: "Hello Moon 3",
                    content: "Hello Moon 3",
                    children: []
                },
                {
                    start_x: 450,
                    start_y: 0,
                    rotate_x: 0.1,
                    rotate_y: 0.23,
                    color: 0xb27b12,
                    size: 15,
                    speed: 0.1,
                    segments: 5,
                    backref: null,
                    title: "Hello Moon 4",
                    content: "Hello Moon 4",
                    start_time: 3,
                    children: []
                }
            ]
        }, {
            start_x: -675,
            start_y: 0,
            rotate_x: 0.07,
            rotate_y: -0.08,
            color: 0x53ff8f,
            size: 40,
            speed: 0.04,
            segments: 12,
            backref: null,
            title: "Hello Planet 3",
            content: "Hello Planet 3",
            children: [
                {
                    start_x: -550,
                    start_y: 0,
                    rotate_x: -0.15,
                    rotate_y: 0.09,
                    color: 0xe8b60c,
                    size: 17.5,
                    speed: 0.125,
                    segments: 5,
                    backref: null,
                    title: "Hello Moon 1",
                    content: "Hello Moon 1",
                    children: []
                },
                {
                    start_x: -800,
                    start_y: 0,
                    rotate_x: 0.1,
                    rotate_y: 0.23,
                    color: 0xb27b12,
                    size: 20,
                    speed: 0.125,
                    segments: 5,
                    backref: null,
                    title: "Hello Moon 2",
                    content: "Hello Moon 2",
                    start_time: 2,
                    children: []
                },
                {
                    start_x: -875,
                    start_y: 0,
                    rotate_x: 0.01,
                    rotate_y: 0.3,
                    color: 0xb27b12,
                    size: 15,
                    speed: 0.04,
                    segments: 5,
                    backref: null,
                    title: "Hello Moon x",
                    content: "Hello Moon x",
                    start_time: 1.1,
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