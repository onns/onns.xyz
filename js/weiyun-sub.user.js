// ==UserScript==
// @name         Weiyun Subtitle Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Onns Weiyun Subtitle Tool
// @updateURL    https://onns.xyz/js/weiyun-sub.user.js
// @author       Onns
// @match        https://www.weiyun.com/video_preview?*
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/leancloud-storage@4.2.0/dist/av-min.js
// @require      https://onns.xyz/js/subtitles.parser.min.js
// ==/UserScript==

(function () {
    'use strict';
    // var scroxtBarrage = new window.scroxt.Barrage({
    //     video: "#my-video",
    //     dataTime: [{
    //         data: "第一条弹幕",
    //         time: 2
    //     }, {
    //         data: "第二条弹幕",
    //         time: 4
    //     }, {
    //         data: "第三条弹幕",
    //         time: 7
    //     }]
    // });
    // var i = 0;
    // document.getElementsByClassName('video-title')[0].className = 'video-title show'

    // function show() {
    //     setInterval(function () {
    //         document.getElementsByClassName('video-title')[0].className = 'video-title show';
    //         document.getElementsByClassName('video-title')[0].children[0].innerText = i++;
    //     }, 100);
    // }
    // setTimeout(function () {
    //     show();
    // }, 5000);
    // myVid = document.getElementById("vjs_video_3_html5_api");
    // //当前播放进度
    // myVid.ontimeupdate = function () {
    //     // console.log(this.currentTime);
    //     document.getElementsByClassName('video-title')[0].className = 'video-title show';
    //     document.getElementsByClassName('video-title')[0].children[0].innerText = this.currentTime;
    // };
    // Your code here...

    AV.init({
        appId: "jIRe5LRqbWDB2dxmu7FH8c1S-gzGzoHsz",
        appKey: "pM10kNYtPMwvqYUCWfbUGBPJ",
        serverURLs: "https://lean.onns.xyz"
    });
    var query = new AV.Query('DocSync');
    var sub = '';
    var data = [];
    var tempDiv = document.createElement("div");
    query.equalTo('url', encodeURI(document.getElementsByClassName('video-name')[0].innerText)).addAscending('createdAt');
    query.find().then(function (docsync) {
        // 拉取远端结果
        // console.log(docsync);
        if (docsync.length >= 1) {
            tempDiv.innerHTML = docsync[0].attributes.content;
            sub = tempDiv.innerText;
            if (sub != '') {
                data = parser.fromSrt(sub, true);
            }
        }
    });

    // console.log(srt.length);

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
    var videoEle = null
    timer = setInterval(function () {
        videoEle = document.getElementById("vjs_video_3_html5_api");
        if (videoEle != null) {
            clearInterval(timer);
            videoEle.ontimeupdate = function () {
                // console.log(this.currentTime);
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