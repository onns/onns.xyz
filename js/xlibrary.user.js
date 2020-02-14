// ==UserScript==
// @name         Xlibrary
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @updateURL    https://onns.xyz/js/ischool.user.js
// @description  none
// @author       Onns
// @match        *://210.34.4.13:8080/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*
0.3.10  可以添加不感兴趣讲座
0.3.9   增加日历支持 1h
0.3.8   增加讲座计数
0.3.7   增加页面跳转
0.3.6   增加错误控制
0.3.5   更新JS源
0.3.4   优化设置后自动刷新
0.3.3   优化修改设置时的体验
0.3.2   针对提前开放讲座问题进行修复
0.3.1   修复无限刷新bug
0.3.0   增加GM_config以及通配符"%"
0.2.3   增加对提前开放讲座的支持
0.2.2   修复时间单位不统一导致的不刷新的bug
*/
(function () {
    'use strict';
    console.log(Date.now());
    function ajax(options) {
        /**
         * 传入方式默认为对象
         * 作者：eternalshallow
         * 链接：https://juejin.im/post/5a3229da5188257a3e4eadcf
         * 来源：掘金
         * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
         * */
        options = options || {};
        /**
         * 默认为GET请求
         * */
        options.type = (options.type || "GET").toUpperCase();
        /**
         * 返回值类型默认为json
         * */
        options.dataType = options.dataType || 'json';
        /**
         * 默认为异步请求
         * */
        options.async = options.async || true;
        /**
         * 对需要传入的参数的处理
         * */
        var params = getParams(options.data);
        var xhr;
        /**
         * 创建一个 ajax请求
         * W3C标准和IE标准
         */
        if (window.XMLHttpRequest) {
            /**
             * W3C标准
             * */
            xhr = new XMLHttpRequest();
        } else {
            /**
             * IE标准
             * @type {ActiveXObject}
             */
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        };
        if (options.type == 'GET') {
            xhr.open("GET", options.url + '?' + params, options.async);
            xhr.send(null)
        } else if (options.type == 'POST') {
            /**
             *打开请求
             * */
            xhr.open('POST', options.url, options.async);
            /**
             * POST请求设置请求头
             * */
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            /**
             * 发送请求参数
             */
            xhr.send(params);
        }
    }

    /**
     * 对象参数的处理
     * @param data
     * @returns {string}
     */
    function getParams(data) {
        var arr = [];
        for (var param in data) {
            arr.push(encodeURIComponent(param) + '=' + encodeURIComponent(data[param]));
        }
        console.log(arr);
        arr.push(('randomNumber=' + Math.random()).replace('.'));
        console.log(arr);
        return arr.join('&');
    }

    function getXmuid() {
        ajax({
            url: "https://wx.onns.xyz/API/account/getCurUserInfo.php?isLogin=false", //请求地址
            type: 'GET',   //请求方式
            data: {}, //请求参数
            dataType: "json",     // 返回值类型的设定
            async: false,   //是否异步
            success: function (response, xml) {
                let message = JSON.parse(response);
                console.log(message);   //   此处执行请求成功后的代码
            },
            fail: function (status) {
                alert('状态码为' + status);   // 此处为执行成功后的代码
            }
        });
    }
    getXmuid();
})();