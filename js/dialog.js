"use strict";

var Deferred = require("js/lib/mt-promise");


/**
 * This is a wrapper class for the dialog object that allows us to easily create and show a dialog for
 * the bodies in our solar system. Also handles the animations and style stuff.
 */
class Dialog {


    /**
     * Creates a dialog element that references the respective body
     * @param body
     */
    constructor(body) {

        // in seconds - needs to be the same as the animation in the .css
        // TODO: find a better way to synchronize .css animation and js tween automatically
        this.FADE_IN_TIME = 1;
        this.FADE_OUT_TIME = 1;

        this.body = body;

        // don't want stupid dom-node-ID's if someone gives their planets stupid names
        var dialog_id = this.body.info.title.replace(/[^A-Z0-9]+/ig, "_");

        // generate dialog element based on the HTML-template
        var dialog_template = document.getElementById("dialog_template").content;


        // so we can find it later on if another dialog has been opened before
        dialog_template.firstElementChild.id = dialog_id;
        document.body.appendChild(document.importNode(dialog_template, true));

        this.dlg = document.getElementById(dialog_id);

        // #POLYFILL FOR THAT STUPID FIREFOX THAT DOESN'T WORK WITH DIALOG ELEMENTS#
        // # I MEAN WTF, DIALOG ELEMENTS SHOULD HAVE BEEN IN HTML LIKE 10 YEARS AGO MAN! #
        dialogPolyfill.registerDialog(this.dlg);
        // #POLYFILL_END#

        this.generate_content();

        // cancel on rightclick
        this.dlg.oncontextmenu = function () {
            require("js/main").controller.cancel_selection();
            return false;
        };

        // flag to indicate whether we're in the middle of an animation
        // need this to block new animations while the old ones are still running
        this._is_animating = false;


    }


    /**
     * Shows the dialog.
     *
     * Plays the dialog-popup animation and waits X amount of time before resolving to make sure the animation has played.
     *
     * @returns promise - resolved when showing the dialog is done
     */
    show() {
        var deferred = new Deferred();

        if (this._is_animating) {
            deferred.reject();
            return deferred.promise;
        }

        this.dlg.show();

        this.dlg.classList.remove("body_dialog_closed");
        this.dlg.classList.add("body_dialog_open");

        this._is_animating = true;

        setTimeout(function () {
            this._is_animating = false;
            deferred.resolve();
        }.bind(this), this.FADE_IN_TIME * 1000);

        return deferred.promise;
    }

;

    /**
     * Hides the dialog.
     *
     * See this.show()
     *
     * @returns promise
     */
    close() {

        var deferred = new Deferred();

        if (this._is_animating) {
            deferred.reject();
            return deferred.promise;
        }

        this.dlg.classList.remove("body_dialog_open");
        this.dlg.classList.add("body_dialog_closed");

        this._is_animating = true;

        window.setTimeout(function () {

            this._is_animating = false;
            this.dlg.close();
            deferred.resolve();

        }.bind(this), this.FADE_OUT_TIME * 1000);

        return deferred.promise;
    }

;

    /**
     * Generates the content of this dialog based on the information in the corresponding body object
     */
    generate_content() {

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
        content.className = "text_content";
        content.innerHTML = document.getElementById(this.body.info.content).innerHTML;
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

    }

}

module.exports = Dialog;
