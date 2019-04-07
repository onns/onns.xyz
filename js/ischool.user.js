// ==UserScript==
// @name         Lecture Auto Order
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @updateURL    https://onns.xyz/js/ischool.user.js
// @description  none
// @author       Onns
// @match        *://ischoolgu.xmu.edu.cn/*
// @grant        none
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// ==/UserScript==

/*
0.3.4 优化设置后自动刷新
0.3.3 优化修改设置时的体验
0.3.2 针对提前开放讲座问题进行修复
0.3.1 修复无限刷新bug
0.3.0 增加GM_config以及通配符"%"
0.2.3 增加对提前开放讲座的支持
0.2.2 修复时间单位不统一导致的不刷新的bug
*/
(function () {
    'use strict';
    var setting = document.createElement('div');
    var timer = null;
    setting.innerHTML = '设置';
    setting.style.cssText = 'position: absolute;right: 30px; top: 30px; color:#FF0000;';
    setting.onclick = function () {
        clearTimeout(timer);
        GM_config.open();
    }
    document.body.appendChild(setting);
    GM_config.init({
        'id': 'MyConfig',
        'title': '个人信息设置',
        'fields':
        {
            'XMUID': {
                'label': '学号',
                'type': 'text',
                'default': ''
            },
            'XMUPASSWORD': {
                'label': '密码',
                'type': 'text',
                'default': ''
            },
            'COUNTDOWNFORFULL': {
                'label': '刷新时间(1-3600s)',
                'type': 'int',
                'min': 1,
                'max': 3600,
                'default': 5
            },
            'COUNTDOWNFORAHEAD': {
                'label': '提前刷新时间(讲座可能会提前开放)',
                'type': 'int',
                'min': 1,
                'max': 600,
                'default': 600
            },
            'INTERESTED': {
                'label': '想抢的讲座(回车分隔，"%"则全抢)',
                'type': 'textarea',
                'default': '%'
            }
        },
        'events': {
            //         'init': function() { alert('onInit()'); },
            // 'open': function() { alert('onOpen()'); },
            // 'save': function() { alert('onSave()'); },
            // 'close': function() { alert('onClose()'); },
            // 'reset': function() { alert('onReset()'); }
            'close': function () {
                location.reload();
            },
            'save': function () {
                location.reload();
            }
        },
        'css': ''
    });

    // 全局定义
    var XMUID = GM_config.get('XMUID');
    var XMUPASSWORD = GM_config.get('XMUPASSWORD');
    var COUNTDOWNFORFULL = GM_config.get('COUNTDOWNFORFULL');
    var COUNTDOWNFORAHEAD = GM_config.get('COUNTDOWNFORAHEAD');
    var INTERESTED = GM_config.get('INTERESTED').split('\n');

    console.log(INTERESTED);
    // 
    if (XMUID == '' || XMUPASSWORD == '') {
        GM_config.open();
        // alert('请先修改学号、密码、刷新时间！(默认5s)和感兴趣的讲座(只抢感兴趣的讲座)');
    } else {
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
                        if (INTERESTED[j].trim() == lectureName.trim() || INTERESTED[j] == '%') {
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
                            COUNTDOWN = remainTime - 0.950 - COUNTDOWNFORAHEAD;
                        }
                        if (COUNTDOWN < 0) {
                            COUNTDOWN = 0.950;
                        }
                    }
                }

                if (ISFULL) {
                    if (COUNTDOWN > COUNTDOWNFORFULL) {
                        COUNTDOWN = COUNTDOWNFORFULL;
                    }
                }
                console.log(COUNTDOWN);
                timer = setTimeout(function () { location.reload(); }, COUNTDOWN * 1000);
            } else {
                window.location.href = 'http://ischoolgu.xmu.edu.cn/admin_bookChair.aspx';
            }
        }
    }
})();