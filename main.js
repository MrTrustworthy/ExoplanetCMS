/**
 * Created by MrTrustworthy on 11.01.2016.
 */







window.onload = function load_bodies() {

    window.animation = new Animation();

    (function add_all_children(body_info, parent){

        var body = new Body(body_info, parent);
        animation.add(body);

        body_info.children.forEach(function(child_info){
            add_all_children(child_info, body);
        });

    })(BODY, null);


    animation.start();

    window.controller = new Controller(animation);
};


