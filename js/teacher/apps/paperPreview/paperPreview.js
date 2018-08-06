/**
 * @author Guo Yuchun
 * @date   2018/4/22
 * @Description: 试题预览组件
 */

'use strict';
require(['less!paperPreviewStyle']);

define([
    'text!paperPreviewView',
    'bootstrap'
],function (
    _view,
    bootstrap
) {
    var self;
    return {
        template: _view,
        /**
         * 属性说明
         * @property {String} type 试题类型
         * @property {String} stem 题目内容
         * @property {String} option 选项
         * @property {String} standardAnswer 标准答案
         * @property {String} parsing 答案解析
         */
        data: function () {
            self = this;
            return {
                paperName: '',
                score: '',
                founder: '',
                subject: '',
                question: []
            }
        },
        /**
         * 父组件获取属性说明
         * @property
         * {Object} question 试题信息
         */
        props: ['paperdetail'],
        methods: {
            /**
             *
             * @method
             * @param
             * @return
             */
        },
        filters : {
            numToChar: function (value,type) {
                var answer = '';
                if(typeof(value) == undefined){
                    answer = '';
                }
                if(type==0) {
                    answer = String.fromCharCode(+value+64);
                } else if(type==1){
                    value.split('%').forEach(function (t) { answer += String.fromCharCode(+t+64);})
                }else {
                    answer = value;
                }
                return answer;
            },
            numToUppCase: function (value) {
                var order = ['一', '二','三','四','五','六','七','八','九'];
                return order[value];
            }
        },
        components: {

        },
        watch: {
            paperdetail: function () {
                self.paperName = self.paperdetail.paperName;
                self.score = self.paperdetail.score;
                self.founder = self.paperdetail.founder;
                self.subject = self.paperdetail.subject;
                self.question = self.paperdetail.question;
            }
        },
        mounted: function () {

        }
    }
});



