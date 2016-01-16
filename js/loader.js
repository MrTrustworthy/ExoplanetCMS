/**
 * Created by MrTrustworthy on 15.01.2016.
 */

var THREE = require("js/lib/three");
var Deferred = require("js/lib/mt-promise");

var Loader = function(){

    this.base_url = "graphics/textures/";
    this._loader = new THREE.TextureLoader();
    this.textures = {};

};

Loader.prototype.load_textures = function(url_dict){

    var deferred = new Deferred();

    var keys = Object.keys(url_dict);
    var i = keys.length * 2; // both textures and bumpmaps needed
    var loader = this._loader;
    var textures = this.textures;
    var base_url = this.base_url;

    keys.forEach(function(key){

        // load normal textures first
        var url = base_url + url_dict[key];
        if(!url.includes(".")) url += ".jpg";

        loader.load(
            url,
            function(texture){
                textures[key] = texture;
                i--;
                if(i === 0) deferred.resolve();
            },
            function(){},
            function(err){
                console.error("#Loader: couldn't load texture", url);
                textures[key] = err;
                i--;
                if(i === 0) deferred.resolve();
            }
        );

        // then bumpmaps

        var key_bump = key + "_bump";
        var url_bump = base_url + url_dict[key] + "_bump";
        if(!url_bump.includes(".")) url_bump += ".jpg";


        loader.load(
            url_bump,
            function(texture){
                textures[key_bump] = texture;
                i--;
                if(i === 0) deferred.resolve();
            },
            function(){},
            function(err){
                console.error("#Loader: couldn't load texture", url_bump);
                textures[key_bump] = err;
                i--;
                if(i === 0) deferred.resolve();
            }
        );

    });

    return deferred.promise;
};

module.exports = new Loader();