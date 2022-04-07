// ==UserScript==
// @name         Weiyun Subtitle Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Onns Weiyun Subtitle Tool
// @updateURL    https://onns.xyz/js/weiyun-sub.user.js
// @author       Onns
// @match        https://www.weiyun.com/video_preview?*
// @grant        none
// @run-at       document-end
// @require      https://onns.xyz/js/av-min.js
// @require      https://onns.xyz/js/subtitles.parser.min.js
// ==/UserScript==

(function () {
    'use strict';

    AV.init({
        appId: "jIRe5LRqbWDB2dxmu7FH8c1S-gzGzoHsz",
        appKey: "pM10kNYtPMwvqYUCWfbUGBPJ",
        serverURLs: "https://jire5lrq.lc-cn-n1-shared.com"
    });
    var query = new AV.Query('DocSync');
    var sub = '';
    var data = [];
    var tempDiv = document.createElement("div");
    query.equalTo('url', encodeURI(document.getElementsByClassName('video-name')[0].innerText)).addAscending('createdAt');
    query.find().then(function (docsync) {
        if (docsync.length >= 1) {
            tempDiv.innerHTML = docsync[0].attributes.content;
            sub = tempDiv.innerText;
            if (sub != '') {
                data = parser.fromSrt(sub, true);
            }
        }
    });

    function timeToString(videoName, currentTime) {
        if (sub == '') {
            return '';
        }
        currentTime = currentTime * 1000;
        for (var i in data) {
            if (data[i]['startTime'] <= currentTime && data[i]['endTime'] >= currentTime) {
                return data[i]['text'];
            }
        }
        return '';
    }
    var timer = null;
    var videoEle = null;
    document.getElementsByClassName('btn-wrap')[0].innerHTML = '<a class="btn btn-l" href="https://onns.xyz/doc/?' + document.getElementsByClassName('video-name')[0].innerText + '" target="_blank"><span class="btn-txt">添加srt字幕</span></a>' + document.getElementsByClassName('btn-wrap')[0].innerHTML;

    timer = setInterval(function () {
        videoEle = document.getElementById("vjs_video_3_html5_api");
        if (videoEle != null) {
            clearInterval(timer);
            videoEle.ontimeupdate = function () {
                var onnsSubDiv = document.getElementById('onns-sub');
                if (onnsSubDiv == null) {
                    document.getElementsByClassName('vjs-text-track-display')[0].innerHTML += '<div id="onns-sub" style="text-align:center; width:100%; position: absolute; bottom: 0; font-size: 300%;text-shadow: black 0.1em 0.1em 0.2em;"> </div>';
                    onnsSubDiv = document.getElementById('onns-sub');
                }
                onnsSubDiv.innerText = timeToString(document.getElementsByClassName('video-name')[0].innerText, this.currentTime);
                onnsSubDiv.innerHTML += '<br/><br/>';
            };
        }
    }, 100);
})();