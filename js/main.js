/**
 * Created by MrTrustworthy on 11.01.2016.
 */


try {



// start loading bar first to show progress
    var loading_bar = document.getElementById("load_progress");
    loading_bar.max = 100;
    loading_bar.value = 10;


    var Animation = require("js/animation");
    var conf = require("js/conf");
    var Body = require("js/body");
    var Controller = require("js/controller");
    var Loader = require("js/loader");

    loading_bar.value += 10;

    var App = function () {

        var load_steps = (loading_bar.max - loading_bar.value) / (Object.keys(conf.textures).length * 2);


        var loaded_p = Loader.load_textures(conf.textures);

        loaded_p.then(function () {

            var animation = new Animation();

            (function add_all_children(body_info, parent) {

                var body = new Body(body_info, parent, animation.scene);
                animation.add_body(body);

                body_info.children.forEach(function (child_info) {
                    add_all_children(child_info, body);
                });

            })(conf.elements, null);

            loading_bar.style.display = "none";

            animation.start();


            this.controller = new Controller(animation);

            //module.exports.controller = main_controller;


        }.bind(this), function (err) {
            throw new URIError("Could not load Images", err);
        }, function () {
            loading_bar.value += load_steps;
        });

    };


    var app = new App();
    window.app = app; // debug helper


    module.exports = app;


} catch(e){
    document.write("Oops, something went wrong loading the page. Please make sure you are on a current Browser and have allowed WebGL for this Website.");
}