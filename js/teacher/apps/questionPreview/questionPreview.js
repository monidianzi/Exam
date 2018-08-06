/**
 * @author Guo Yuchun
 * @date   2018/4/22
 * @Description: 试题预览组件
 */

'use strict';
require(['less!questionPreviewStyle']);

define([
    'text!questionPreviewView',
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
                type: 0,
                stem: '',
                option: [],
                standardAnswer: [],
                parsing: ''
            }
        },
        /**
         * 父组件获取属性说明
         * @property
         * {Object} question 试题信息
         */
        props: ['questiondetail'],
        methods: {
            /**
             *
             * @method
             * @param
             * @return
             */
        },
        filters : {
            numToChar: function (value) {
                var answer = '';
                if(self.type==0) {
                    answer = String.fromCharCode(+value+64);
                } else if(self.type==1){
                    value.split('%').forEach(function (t) { answer += String.fromCharCode(+t+65); })
                }else {
                    answer = value;
                }
                return answer;
            }
        },
        components: {

        },
        watch: {
            questiondetail: function () {
                self.type = self.questiondetail.type;
                self.stem = self.questiondetail.stem;
                self.parsing = self.questiondetail.parsing;
                self.option = [];
                //选项、正确答案字符串解码为数组格式
                if(self.questiondetail.type == 0 || self.questiondetail.type == 1){
                    self.standardAnswer = self.questiondetail.standardAnswer;
                    self.questiondetail.option.split('%%%').forEach(function (element) {
                        self.option.push(element.substr(+element.indexOf('.')+1));
                    });
                }else {
                    self.standardAnswer = self.questiondetail.standardAnswer;
                }
            }
        },
        mounted: function () {

        }
    }
});



