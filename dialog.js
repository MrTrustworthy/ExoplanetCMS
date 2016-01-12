/**
 * Created by MrTrustworthy on 12.01.2016.
 */

var Dialog = function(){

    this.dlg = document.createElement("dialog");

    this.dlg.innerHTML = "HELLOOOO";




};

Dialog.prototype.show = function(){
    document.body.appendChild(this.dlg);
    this.dlg.show();
};


Dialog.prototype.update_position = function(new_pos){
    console.log("update dlg pos", new_pos);

    var new_top = parseInt(new_pos.y);

    this.dlg.style.top = new_top + "px";
    this.dlg.style.left = new_pos.x + "px";


};


Dialog.prototype.close = function(){
    document.body.removeChild(this.dlg);
    this.dlg.close();
};

