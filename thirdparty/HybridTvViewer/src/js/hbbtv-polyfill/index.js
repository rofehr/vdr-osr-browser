import { keyEventInit } from "./keyevent-init.js";
import { hbbtvFn } from "./hbbtv.js";
import { VideoHandler } from "./hbb-video-handler.js";

function init() {
    window._HBBTV_DEBUG_ && console.log("hbbtv-polyfill: load");

    // convenience method: Javascript to VDR wrapper method, one-way
    window.signalCef = function(command) {
        window.cefQuery({
            request: command,
            persistent: false,
            onSuccess: function(response) {},
            onFailure: function(error_code, error_message) {}
        });
    };

    window.signalVdr = function(command) {
        signalCef('VDR:' + command);
    };

    window.cefChangeUrl = function(uri) {
        signalCef('CHANGE_URL: ' + uri);
    }

    window.cefVideoSize = function() {
        var video = document.getElementById("video");
        var videocontainer = document.getElementById("videocontainer");
        var videoplayer = document.getElementById("hbbtv-polyfill-video-player");
        var playerobject = document.getElementById("playerObject");

        var target;
        var position;
        var maxwidth = 0, maxheight = 0;

        if (typeof video !== 'undefined' && video !== null) {
            position = video.getBoundingClientRect();
            if (position.width > 0 && position.height > 0) {
                target = video;
                maxwidth = position.width;
                maxheight = position.height;
            }

            console.log("===> VIDEO: "+ position.width + "," + position.height + "," + position.x + "," + position.y);
        }

        if (typeof videocontainer !== 'undefined' && videocontainer !== null) {
            position = videocontainer.getBoundingClientRect();

            if (position.width > 0 && position.height > 0 && position.width >= maxwidth && position.height >= maxheight) {
                target = videocontainer;
                maxwidth = position.width;
                maxheight = position.height;
            }

            console.log("===> VIDEOCONTAINER: "+ position.width + "," + position.height + "," + position.x + "," + position.y);
        }

        if (typeof videoplayer !== 'undefined' && videoplayer !== null) {
            position = videoplayer.getBoundingClientRect();

            if (position.width > 0 && position.height > 0 && position.width >= maxwidth && position.height >= maxheight) {
                target = videoplayer;
                maxwidth = position.width;
                maxheight = position.height;
            }

            console.log("===> VIDEOPLAYER: "+ position.width + "," + position.height + "," + position.x + "," + position.y);
        }

        if (typeof playerobject !== 'undefined' && playerobject !== null) {
            position = playerobject.getBoundingClientRect();

            if (position.width > 0 && position.height > 0 && position.width >= maxwidth && position.height >= maxheight) {
                target = playerobject;
            }

            console.log("===> PLAYEROBJECT: "+ position.width + "," + position.height + "," + position.x + "," + position.y);
        }

        if (target) {
            var position = target.getBoundingClientRect();
            var x = parseInt(position.x, 10);
            var y = parseInt(position.y, 10);
            var width = parseInt(position.width, 10);
            var height = parseInt(position.height, 10);

            signalCef("VIDEO_SIZE: " + width + "," + height + "," + x + "," + y);
        }
    }

    // intercept XMLHttpRequest
    let cefOldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        // do something with the method, url and etc.
        window._HBBTV_DEBUG_ && console.log("XMLHttpRequest.method: " + method);
        window._HBBTV_DEBUG_ && console.log("XMLHttpRequest.async: "  + async);
        window._HBBTV_DEBUG_ && console.log("XMLHttpRequest.url: "    + url);

        url = window.cefXmlHttpRequestQuirk(url);

        window._HBBTV_DEBUG_ && console.log("XMLHttpRequest.newurl: " + url);

        this.addEventListener('load', function() {
            // do something with the response text

            // disabled: Too much information
            // window._HBBTV_DEBUG_ && console.log('XMLHttpRequest: url ' + url + ', load: ' + this.responseText);
        });

        /* try to modify the response. But it's not really working as desired
        this.addEventListener('readystatechange', function(event) {
            if (this.readyState === 4) {
                var res = event.target.responseText;
                Object.defineProperty(this, 'response',     {writable: true});
                Object.defineProperty(this, 'responseText', {writable: true});

                this.response = this.responseText = res.split("&#034;").join("\\\"");

                console.log("Res = " + this.responseText);
            }
        });
        */

        return cefOldXHROpen.call(this, method, url, async, user, password);
    }

    // global helper namespace to simplify testing
    window.HBBTV_POLYFILL_NS = window.HBBTV_POLYFILL_NS || {
    };
    window.HBBTV_POLYFILL_NS = {
        ...window.HBBTV_POLYFILL_NS, ...{
            keysetSetValueCount: 0,
            streamEventListeners: [],
        }
    };
    window.HBBTV_POLYFILL_NS.currentChannel = window.HBBTV_POLYFILL_NS.currentChannel || {
        'TYPE_TV': 12,
        'channelType': 12,
        'sid': 1,
        'onid': 1,
        'tsid': 1,
        'name': 'test',
        'ccid': 'ccid:dvbt.0',
        'dsd': ''
    };

    keyEventInit();
    hbbtvFn();

    window.HBBTV_VIDEOHANDLER = new VideoHandler();
    window.HBBTV_VIDEOHANDLER.initialize();

    window._HBBTV_DEBUG_ && console.log("hbbtv-polyfill: loaded");
}

if (!document.body) {
    window._HBBTV_DEBUG_ && console.log("hbbtv-polyfill: add as event listener, DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", init);
} else {
    window._HBBTV_DEBUG_ && console.log("hbbtv-polyfill: call init");
    init();
}
