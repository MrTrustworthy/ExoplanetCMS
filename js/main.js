/**
 * Created by MrTrustworthy on 11.01.2016.
 */


var Animation = require("js/animation");
var conf = require("js/conf");
var Body = require("js/body");
var Controller = require("js/controller");

var animation = new Animation();

(function add_all_children(body_info, parent){

    var body = new Body(body_info, parent);
    animation.add(body);

    body_info.children.forEach(function(child_info){
        add_all_children(child_info, body);
    });

})(conf.elements, null);


animation.start();

module.exports.controller = new Controller(animation);