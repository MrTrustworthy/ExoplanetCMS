/**
 * Created by MrTrustworthy on 11.01.2016.
 */

element_configuration = {
    start_x: 0,
    start_y: 0,
    rotate_x: 0,
    rotate_y: 0.01,
    color: 0xff2a00,
    size: 90,
    speed: 0.1,
    segments: 16,
    backref: null,
    title: "Home",
    content: "home_content",
    children: [
        {
            start_x: 175,
            start_y: 0,
            rotate_x: 0.02,
            rotate_y: -0.24,
            color: 0x53ff8f,
            size: 30,
            speed: 0.05,
            segments: 8,
            backref: null,
            title: "About",
            content: "about_content",
            start_time: 5,
            children: [
                {
                    start_x: 250,
                    start_y: 0,
                    rotate_x: -0.1,
                    rotate_y: -0.06,
                    color: 0xe8b60c,
                    size: 15,
                    speed: -0.03,
                    segments: 5,
                    backref: null,
                    title: "Contact",
                    content: "contact_content",
                    start_time: 0,
                    children: []
                }
            ]
        },
        {
            start_x: 425,
            start_y: 0,
            rotate_x: 0.13,
            rotate_y: -0.08,
            color: 0x53ff8f,
            size: 40,
            speed: 0.02,
            segments: 12,
            backref: null,
            title: "Projects",
            content: "projects_content",
            start_time: 1,
            children: [
                {
                    start_x: 500,
                    start_y: 0,
                    rotate_x: 0.2,
                    rotate_y: -0.19,
                    color: 0xe8b60c,
                    size: 17.5,
                    speed: -0.175,
                    segments: 5,
                    backref: null,
                    title: "Star CMS",
                    content: "content_starcms",
                    start_time: 5,
                    children: []
                },
                {
                    start_x: 550,
                    start_y: 0,
                    rotate_x: -0.3,
                    rotate_y: 0.04,
                    color: 0xb27b12,
                    size: 20,
                    speed: 0.05,
                    segments: 5,
                    backref: null,
                    title: "Github",
                    content: "content_github",
                    start_time: 0,
                    children: []
                }
            ]
        },
        {
            start_x: 700,
            start_y: 0,
            rotate_x: 0.07,
            rotate_y: -0.08,
            color: 0x53ff8f,
            size: 40,
            speed: 0.01,
            segments: 12,
            backref: null,
            title: "Technologies",
            content: "technologies_content",
            start_time: 3,
            children: [
                {
                    start_x: 600,
                    start_y: 0,
                    rotate_x: -0.15,
                    rotate_y: 0.09,
                    color: 0xe8b60c,
                    size: 17.5,
                    speed: -0.125,
                    segments: 5,
                    backref: null,
                    title: "Javascript",
                    content: "javascript_content",
                    start_time: 0,
                    children: []
                },
                {
                    start_x: 800,
                    start_y: 0,
                    rotate_x: 0.1,
                    rotate_y: -0.23,
                    color: 0xb27b12,
                    size: 20,
                    speed: -0.125,
                    segments: 5,
                    backref: null,
                    title: "Python",
                    content: "python_content",
                    start_time: 3,
                    children: []
                },
                {
                    start_x: 850,
                    start_y: 0,
                    rotate_x: 0.11,
                    rotate_y: 0.3,
                    color: 0xb27b12,
                    size: 15,
                    speed: 0.04,
                    segments: 5,
                    backref: null,
                    title: "Frameworks",
                    content: "frameworks_content",
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

module.exports = {
    elements: element_configuration,
    speed: GLOBAL_SPEED
};