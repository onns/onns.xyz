// ==UserScript==
// @name         TURING AUTO CHECK
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @updateURL    https://onns.xyz/js/turing.user.js
// @description  none
// @author       Onns
// @match        *://turing.xmu.edu.cn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/* 更新日志
0.0.3 取消计时
0.0.2 流程优化
0.0.1 自动显示答案
*/

(function () {
    'use strict';

    function remove_label(data) {
        return data.slice(data.indexOf('.') + 1);
    }

    var dataList = JSON.parse(localStorage.getItem("data")) || [];
    var questionName = '';
    var questionAnswer = '';

    if (dataList.length == 0 && window.location.href.indexOf("learn.php") == -1) {
        window.location.href = 'http://turing.xmu.edu.cn/dtzs/learn.php';
        alert('等待5s加载题库');
    }
    function refresh_data() {
        if (window.location.href.indexOf("learn.php") > -1) {
            dataList = [];
            var questionList = document.querySelectorAll('[data-role="content"]');
            for (let i in questionList) {
                if (i == questionList.length - 1) {
                    break;
                }
                questionName = remove_label(questionList[i].getElementsByTagName('p')[0].innerText).replace(/\s+/g, "").replace(/\n/g, "");
                if (document.getElementById('a' + (parseInt(i) + 1)).value.length != 1) {
                    console.log(parseInt(i) + 1);
                    continue;
                }
                questionAnswer = remove_label(document.getElementById('a' + (parseInt(i) + 1) + document.getElementById('a' + (parseInt(i) + 1)).value + 'Label').innerText);
                dataList.push([questionName, questionAnswer]);
                // console.log(i, questionName, questionAnswer);
            }
            localStorage.removeItem("data");
            localStorage.setItem("data", JSON.stringify(dataList));
            console.log('refresh success!', dataList.length, ' in total');
            // console.log(JSON.stringify(dataList));
        }
    }

    function print_answer() {
        if (window.location.href.indexOf("exam.php") > -1) {
            var questionList = document.querySelectorAll('[data-role="content"]');
            var questionNum = window.location.href.split('#')[1]
            if (questionNum == undefined) {
                questionNum = 1;
            } else {
                questionNum = questionNum.slice(4)
            }
            var i = parseInt(questionNum) - 1;

            questionName = remove_label(questionList[i].getElementsByTagName('div')[2].innerText).replace(/\s+/g, "").replace(/\n/g, "");
            questionAnswer = '没找到';
            for (let j in dataList) {
                if (dataList[j][0] == questionName) {
                    questionAnswer = dataList[j][1];
                    break;
                }
            }
            if (questionAnswer == '没找到') {
                console.log(questionName);
            }
            console.clear();
            console.log("%c" + questionAnswer, "color:red;font-weight:bold;");
            // console.log(questionNum +'. '+ questionName + " %c" + questionAnswer, "color:red;font-weight:bold;");


            // 一次打印所有答案
            // var questionList = document.querySelectorAll('[data-role="content"]');
            // for (let i in questionList) {
            //     if (i == questionList.length - 1) {
            //         break;
            //     }
            //     questionName = remove_label(questionList[i].getElementsByTagName('div')[2].innerText);
            //     questionAnswer = '没找到';
            //     for (let j in dataList) {
            //         if (dataList[j][0] == questionName) {
            //             questionAnswer = dataList[j][1];
            //             break;
            //         }
            //     }
            //     console.log(questionName + "%c" + questionAnswer, "color:red;font-weight:bold;");
            // }
        }
    }
    setTimeout(function () { refresh_data(); }, 1000 * 5);
    setTimeout(function () { print_answer(); }, 1000 * 2);
    document.body.onhashchange = function () {
        print_answer();
        window.clearTimeout(vartt);
    }

})();