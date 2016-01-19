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

            // load all planets based on the config via recursive function calls to correctly
            // implement parent-child relationships
            (function add_all_children(body_info, parent) {

                var body = new Body(body_info, parent, animation.scene);
                animation.add_body(body);

                body_info.children.forEach(info => add_all_children(info, body));

            })(conf.elements, null);

            // hide loading bar to avoid it messing with the
            loading_bar.style.display = "none";

            animation.start();

            // initialize controller, which will take over the application from then on
            this.controller = new Controller(animation);


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
    console.log("#CRITICAL#", e);
    document.write("Oops, something went wrong loading the page. Please make sure you are on a current Browser and have allowed WebGL for this Website.");
}