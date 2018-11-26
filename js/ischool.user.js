// ==UserScript==
// @name         Lecture Auto Order
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @updateURL    https://onns.xyz/js/ischool.user.js
// @description  none
// @author       Onns
// @match        *://ischoolgu.xmu.edu.cn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*
0.2.3 增加对提前开放讲座的支持
0.2.2 修复时间单位不统一导致的不刷新的bug
*/
(function () {
    'use strict';

    // 全局定义
    var XMUID = '';
    var XMUPASSWORD = '';
    var COUNTDOWNFORFULL = 5;
    var INTERESTED = ['数据科学： 理论与应用（四）'];

    if (XMUID == '' || XMUPASSWORD == '') {
        alert('请先修改学号、密码、刷新时间！(默认5s)和感兴趣的讲座(只抢感兴趣的讲座)');
    }

    var COUNTDOWN = 3600;
    var ISFULL = false;
    var COUNTINPUT = 3;

    // 若未登录则先进行登录
    if (window.location.href.indexOf("Default.aspx") > -1) {
        document.getElementById("userName").value = XMUID;
        document.getElementById("passWord").value = XMUPASSWORD;
        document.getElementById("userType").value = '1';
        document.getElementById("sumbit").click();
    } else {
        // 登录后直接跳转到讲座预约页面
        if (window.location.href.indexOf("admin_bookChair.aspx") > -1) {
            /*
            逻辑顺序：
            1.若该讲座已经预约成功，则忽略
            2.若可进行预约则马上预约
            3.若预约已满仍需要预约，则进入快刷新模式
            4.否则等待下一次讲座预约，进入慢刷新模式
            */
            // <td align="center">预约起始时间</td><td align="center">2018/10/23 19:00:00</td>
            var dataRaw = document.body.innerHTML.split('<td align="center" style="width:100px;">讲座日期</td>');
            dataRaw.shift();
            for (var i = 0; i < dataRaw.length; i++) {
                var lectureName = /<td align="center">讲座名称<\/td><td align="center">([ \S]+)<\/td>/.exec(dataRaw[i])[1];

                var lectureMsg = /<td align="center" colspan="2">([\S]+)<\/td>/.exec(dataRaw[i]);
                if (lectureMsg != null) {
                    lectureMsg = lectureMsg[1];
                } else {
                    lectureMsg = 'none';
                }
                COUNTINPUT += dataRaw[i].match(/input/g).length;

                if (lectureMsg.indexOf('预约成功') > -1) {
                    continue;
                }

                for (var j = 0; j < INTERESTED.length; j++) {
                    if (INTERESTED[j] == lectureName) {
                        if (dataRaw[i].match(/input/g).length != 1) {
                            document.getElementsByTagName('input')[COUNTINPUT - 1].click();
                            continue;
                        }

                        if (lectureMsg.indexOf('人数已满') > -1) {
                            ISFULL = true;
                            continue;
                        }
                    }
                }

                var remainTime = ((new Date(/<td align="center">预约起始时间<\/td><td align="center">([ \S]+)<\/td>/.exec(dataRaw[i])[1]).getTime()) - (new Date().getTime())) / 1000;
                if (remainTime > 0) {
                    if (remainTime < COUNTDOWN) {
                        COUNTDOWN = remainTime - 0.950 - 120;
                    }
                    if (COUNTDOWN < 0) {
                        COUNTDOWN = COUNTDOWNFORFULL - 0.950;
                    }
                }
            }

            if (ISFULL) {
                if (COUNTDOWN > COUNTDOWNFORFULL) {
                    COUNTDOWN = COUNTDOWNFORFULL;
                }
            }
            console.log(COUNTDOWN);
            setTimeout(function () { location.reload(); }, COUNTDOWN * 1000);
        } else {
            window.location.href = 'http://ischoolgu.xmu.edu.cn/admin_bookChair.aspx';
        }
    }
})();