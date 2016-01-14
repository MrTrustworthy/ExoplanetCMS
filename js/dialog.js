/**
 * Created by MrTrustworthy on 12.01.2016.
 */

var main_controller = require("js/main").controller;



/**
 *
 * @param content
 * @constructor
 */
var Dialog = function (body) {

    this.body = body;


    var dialog_id = this.body.info.title.replace(/[^A-Z0-9]+/ig, "_");

    // generate dialog element based on the HTML-template
    var dialog_template = document.getElementById("dialog_template").content;
    dialog_template.firstElementChild.id = dialog_id;
    document.body.appendChild(document.importNode(dialog_template, true));

    this.dlg = document.getElementById(dialog_id);

    this.dlg.oncontextmenu = function () {
        main_controller.cancel_selection();
        return false;
    };

};



/**
 *
 */
Dialog.prototype.show = function () {

    this.dlg.show();
    this.dlg.classList.remove("body_dialog_closed");
    this.dlg.classList.add("body_dialog_open");
};

//

/**
 *
 */
Dialog.prototype.close = function () {

    this.dlg.classList.remove("body_dialog_open");
    this.dlg.classList.add("body_dialog_closed");
    window.setTimeout(this.dlg.close.bind(this.dlg), 1000);
};

module.exports = Dialog;


//Dialog.prototype.generate_content = function () {
//
//    var container = document.createElement("div");
//    container.className = "dialog_container";
//    this.dlg.appendChild(container);
//
//
//    // create the 3 main containers and fill them
//    var dialog_content_container = document.createElement("div");
//    dialog_content_container.className = "dialog_content_container";
//    container.appendChild(dialog_content_container);
//
//    var dialog_back_container = document.createElement("div");
//    dialog_back_container.className = "dialog_back_container";
//    container.appendChild(dialog_back_container);
//
//    var dialog_forward_container = document.createElement("div");
//    dialog_forward_container.className = "dialog_forward_container";
//    container.appendChild(dialog_forward_container);
//
//
//    // generate center elements
//    var header = document.createElement("h1");
//    header.innerHTML = this.body.info.title;
//    dialog_content_container.appendChild(header);
//
//    var content = document.createElement("div");
//    content.innerHTML = this.body.info.content;
//    dialog_content_container.appendChild(content);
//
//    //generate back arrows
//    if (this.body.parent) {
//        dialog_back_container.innerHTML = this.body.parent.info.title;
//        dialog_back_container.onclick = window.controller.select_object.bind(window.controller, this.body.parent);
//    } else {
//        dialog_back_container.innerHTML = "k";
//        dialog_back_container.onclick = window.controller.cancel_selection.bind(window.controller);
//    }
//
//    //generate forward arrows
//    this.body.info.children.forEach(function (child) {
//        button = document.createElement("button");
//        button.innerHTML = "Go to " + child.title;
//        button.onclick = window.controller.select_object.bind(window.controller, child.backref);
//        dialog_forward_container.appendChild(button);
//    }.bind(this));
//
//};


/**
 // *
 // * @param new_pos
 // */
//Dialog.prototype.update_position = function (new_pos) {
//    console.log("update dlg pos", new_pos);
//
//    this.dlg.style.top = new_pos.y + "px";
//    this.dlg.style.left = new_pos.x + "px";
//};


///**
// *
// * @param to
// */
//Dialog.prototype.fade_to = function (to) {
//    this.dlg.style.opacity = to;
//};
