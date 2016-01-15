/**
 * Created by MrTrustworthy on 12.01.2016.
 */

var Deferred = require("js/lib/mt-promise");
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
    this.generate_content();

    // cancel on rightclick
    this.dlg.oncontextmenu = function () {
        require("js/main").controller.cancel_selection();
        return false;
    };

};


Dialog.FADE_IN_TIME = 2; // in seconds - needs to be the same as the animation in the .css
Dialog.FADE_OUT_TIME = 1;

/**
 *
 */
Dialog.prototype.show = function () {
    var deferred = new Deferred();
    this.dlg.show();
    this.dlg.classList.remove("body_dialog_closed");
    this.dlg.classList.add("body_dialog_open");

    setTimeout(deferred.resolve.bind(deferred), Dialog.FADE_IN_TIME * 1000);

    return deferred.promise;
};

//

/**
 *
 */
Dialog.prototype.close = function () {
    var deferred = new Deferred();
    this.dlg.classList.remove("body_dialog_open");
    this.dlg.classList.add("body_dialog_closed");
    window.setTimeout(function () {
        try {
            this.dlg.close();
        } catch (e) {
            console.warn("#Dialog Error:", e);
        } finally {
            deferred.resolve();

        }

    }.bind(this), 1000);
    return deferred.promise;
};

Dialog.prototype.generate_content = function () {

    /**
     * LEFT BOX
     */

    var left_box = this.dlg.querySelector(".dialog_content_left");

    var img = document.createElement("img");
    img.src = "/graphics/arrow_left.png";
    img.className = "move_left";

    img.onclick = function () {
        var controller = require("js/main").controller;
        if (this.body.parent) controller.select_object(this.body.parent);
        else controller.cancel_selection();
    }.bind(this);

    left_box.appendChild(img);

    /**
     * CENTER BOX
     */
    var center_box = this.dlg.querySelector(".dialog_content_middle");

    var header = document.createElement("h1");
    header.innerHTML = this.body.info.title;
    center_box.appendChild(header);

    var content = document.createElement("p");
    content.innerHTML = this.body.info.content;
    center_box.appendChild(content);

    /**
     * RIGHT BOX
     */
    var right_box = this.dlg.querySelector(".dialog_content_right");

    this.body.info.children.forEach(function (child) {

        var img = document.createElement("img");
        img.src = "graphics/arrow_right.png";
        img.className = "move_right";
        img.onclick = function () {
            require("js/main").controller.select_object(child.backref);
        };

        right_box.appendChild(img);

    }.bind(this));

};


module.exports = Dialog;
