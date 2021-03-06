"use strict";

var THREE = require("js/lib/three");
var Deferred = require("js/lib/mt-promise");


/**
 * The loader is a utility class wrapping functionality of the THREE.TextureLoader for our purposes.
 * it takes all image names mapped in the config and loads the corresponding images and bumpmaps
 */
class Loader {


    /**
     * Creates new loader
     */
    constructor() {

        this.base_url = "graphics/textures/";
        this._loader = new THREE.TextureLoader();
        this.textures = {};

    }

    /**
     *
     * @param url_dict dict with all keys/values for images from the configuration
     * @returns Promise - resolves once all images have been loaded
     */
    load_textures(url_dict) {

        var deferred = new Deferred();

        var keys = Object.keys(url_dict);
        var i = keys.length * 2; // balance-counter - times 2 'cause both textures and bumpmaps are needed
        var loader = this._loader;
        var textures = this.textures;
        var base_url = this.base_url;

        // start loading all images
        keys.forEach(function (key) {

            // load normal textures first
            var url = base_url + url_dict[key];
            if (!url.includes(".")) url += ".jpg";

            loader.load(
                url,
                function (texture) {
                    textures[key] = texture;
                    i--;
                    deferred.update();
                    if (i === 0) deferred.resolve();
                },
                function () {
                },
                function (err) {
                    console.error("#Loader: couldn't load texture", url);
                    textures[key] = err;
                    i--;
                    deferred.update();
                    if (i === 0) deferred.resolve();
                }
            );

            // then bumpmaps

            var key_bump = key + "_bump";
            var url_bump = base_url + url_dict[key] + "_bump";
            if (!url_bump.includes(".")) url_bump += ".jpg";

            loader.load(
                url_bump,
                function (texture) {
                    textures[key_bump] = texture;
                    i--;
                    deferred.update();
                    if (i === 0) deferred.resolve();
                },
                function () {
                },
                function (err) {
                    console.error("#Loader: couldn't load bump texture", url_bump);
                    textures[key_bump] = err;
                    i--;
                    deferred.update();
                    if (i === 0) deferred.resolve();
                }
            );

        });

        return deferred.promise;
    }

}

module.exports = new Loader();