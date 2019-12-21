// ==UserScript==
// @name         Xlibrary
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @updateURL    https://onns.xyz/js/xlibrary.user.js
// @description  none
// @author       Onns
// @match        *://210.34.4.13:8080/gatemanage/detail_visit.asp*
// @match        *://192.168.1.154/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*
0.0.1   一键入馆，浏览器端插件
*/
(function() {
  "use strict";
  var setting = document.createElement("button");
  setting.innerHTML = "下一个";
  setting.className = "button3";
  // setting.innerHTML = '';
  setting.style.cssText = "margin-left:5px;width:100px;";

  setting.onclick = function() {
    getXmuid();
    return false;
  };
  document.getElementById("stuno").focus();
  document
    .getElementById("stuno")
    .parentElement.insertBefore(
      setting,
      document.getElementById("stuno").nextSibling
    );
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
    options.dataType = options.dataType || "json";
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
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML);
        } else {
          options.fail && options.fail(status);
        }
      }
    };
    if (options.type == "GET") {
      xhr.open("GET", options.url + "?" + params, options.async);
      xhr.send(null);
    } else if (options.type == "POST") {
      /**
       *打开请求
       * */
      xhr.open("POST", options.url, options.async);
      /**
       * POST请求设置请求头
       * */
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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
      arr.push(
        encodeURIComponent(param) + "=" + encodeURIComponent(data[param])
      );
    }
    console.log(arr);
    arr.push(("randomNumber=" + Math.random()).replace("."));
    console.log(arr);
    return arr.join("&");
  }

  function getXmuid() {
    ajax({
      url: "https://wx.onns.xyz/tp/api/common/get-request-record", //请求地址
      type: "GET", //请求方式
      data: {}, //请求参数
      dataType: "json", // 返回值类型的设定
      async: false, //是否异步
      success: function(response, xml) {
        let message = JSON.parse(response);
        console.log(message); //   此处执行请求成功后的代码
        if (message.data == null) {
          alert("申请列表为空");
        } else {
          document.getElementById("stuno").value = message.data.record_value;
          setting.innerHTML =
            "(" +
            (Array(3).join(0) + parseInt(message.data.record_id)).slice(-3) +
            ")下一个";
          document
            .getElementById("stuno")
            .nextSibling.nextSibling.nextSibling.click();
        }
      },
      fail: function(status) {
        alert("状态码为" + status); // 此处为执行成功后的代码
      }
    });
  }
})();
