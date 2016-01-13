/**
 * Created by MrTrustworthy on 12.01.2016.
 */

var Dialog = function (content) {

    this.dlg = document.createElement("dialog");

    this.dlg.innerHTML = content;

    this.dlg.oncontextmenu = function () {
        return false;
    };


};

Dialog.prototype.show = function () {
    document.body.appendChild(this.dlg);
    this.dlg.show();
    window.setTimeout(this.fade_to.bind(this, 0.85), 1000);
};


Dialog.prototype.update_position = function (new_pos) {
    console.log("update dlg pos", new_pos);

    this.dlg.style.top = new_pos.y + "px";
    this.dlg.style.left = new_pos.x + "px";
};


Dialog.prototype.close = function () {
    document.body.removeChild(this.dlg);
    this.dlg.close();
    window.setTimeout(this.fade_to.bind(this, 0), 1000);
};


Dialog.prototype.fade_to = function (to) {
    this.dlg.style.opacity = to;
};

