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

    var container = document.createElement("div");
    container.className = "dialog_container";
    this.dlg.appendChild(container);


    // create the 3 main containers and fill them
    var dialog_content_container = document.createElement("div");
    dialog_content_container.className = "dialog_content_container";
    container.appendChild(dialog_content_container);

    var dialog_back_container = document.createElement("div");
    dialog_back_container.className = "dialog_back_container";
    container.appendChild(dialog_back_container);

    var dialog_forward_container = document.createElement("div");
    dialog_forward_container.className = "dialog_forward_container";
    container.appendChild(dialog_forward_container);


    // generate center elements
    var header = document.createElement("h1");
    header.innerHTML = this.body.info.title;
    dialog_content_container.appendChild(header);

    var content = document.createElement("div");
    content.innerHTML = this.body.info.content;
    dialog_content_container.appendChild(content);

    //generate back arrows
    if (this.body.parent) {
        dialog_back_container.innerHTML = this.body.parent.info.title;
        dialog_back_container.onclick = window.controller.select_object.bind(window.controller, this.body.parent);
    } else {
        dialog_back_container.innerHTML = "k";
        dialog_back_container.onclick = window.controller.cancel_selection.bind(window.controller);
    }

    //generate forward arrows
    this.body.info.children.forEach(function (child) {
        button = document.createElement("button");
        button.innerHTML = "Go to " + child.title;
        button.onclick = window.controller.select_object.bind(window.controller, child.backref);
        dialog_forward_container.appendChild(button);
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

