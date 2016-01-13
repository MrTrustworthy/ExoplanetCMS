/**
 * Created by MrTrustworthy on 12.01.2016.
 */
/**
 *
 * @param content
 * @constructor
 */
var Dialog = function (body) {

    this.dlg = document.createElement("dialog");

    this.body = body;
    this.generate_content();

    this.dlg.oncontextmenu = function () {
        window.controller.cancel_selection();
        return false;
    };

};


Dialog.prototype.generate_content = function () {


    var header = document.createElement("h1");
    header.innerHTML = this.body.info.title;
    this.dlg.appendChild(header);

    var content = document.createElement("div");
    content.innerHTML = this.body.info.content;
    this.dlg.appendChild(content);


    if (this.body.parent) {
        var button = document.createElement("button");
        button.innerHTML = "Back to " + this.body.info.title;
        button.onclick = window.controller.select_object.bind(window.controller, this.body.parent);
        this.dlg.appendChild(button);
    }

    this.body.info.children.forEach(function (child) {
        button = document.createElement("button");
        button.innerHTML = "Go to " + child.title;
        button.onclick = window.controller.select_object.bind(window.controller, child.backref);
        this.dlg.appendChild(button);
    }.bind(this));


};


/**
 *
 */
Dialog.prototype.show = function () {
    document.body.appendChild(this.dlg);
    this.dlg.show();
    window.setTimeout(this.fade_to.bind(this, 0.85), 1000);
};

/**
 *
 * @param new_pos
 */
Dialog.prototype.update_position = function (new_pos) {
    console.log("update dlg pos", new_pos);

    this.dlg.style.top = new_pos.y + "px";
    this.dlg.style.left = new_pos.x + "px";
};

/**
 *
 */
Dialog.prototype.close = function () {
    document.body.removeChild(this.dlg);
    this.dlg.close();
    window.setTimeout(this.fade_to.bind(this, 0), 1000);
};

/**
 *
 * @param to
 */
Dialog.prototype.fade_to = function (to) {
    this.dlg.style.opacity = to;
};

