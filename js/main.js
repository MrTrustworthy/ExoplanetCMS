/**
 * Created by MrTrustworthy on 11.01.2016.
 */


var Animation = require("js/animation");
var conf = require("js/conf");
var Body = require("js/body");
var Controller = require("js/controller");
var Loader = require("js/loader");


var App = function(){



    var loaded_p = Loader.load_textures(conf.textures);

    loaded_p.then(function(){

        var animation = new Animation();

        (function add_all_children(body_info, parent) {

            var body = new Body(body_info, parent);
            animation.add_body(body);

            body_info.children.forEach(function (child_info) {
                add_all_children(child_info, body);
            });

        })(conf.elements, null);

        animation.start();


        this.controller = new Controller(animation);

        //module.exports.controller = main_controller;



    }.bind(this));

};


var app = new App();
window.app = app;


module.exports = app;


