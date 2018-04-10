/**
 * @author Guo Yuchun
 * @date   2018/3/8
 * @Description: 试题管理组件
 */
'use strict';

require(['less!questionManageStyle']);
require(['css!datetimepickerCss']);

define([
    'text!questionManageView',
    'datetimepicker',
    'bootstrappaginator',
    'vue'
],function (
    _view,
    datetimepicker,
    bootstrappaginator,
    vue
) {
    var self,
        //当前检索条件：未点击检索前，值仍为上次检索条件，点击页面跳页，仍根据上次检索条件获取该页数据，点击检索后更新当前检索条件
        currentSearch = {
            knowledge: '',
            difficulty: '',
            type: '',
            stem: '',
            founder: '',
            creationTime: '',
            lastUpdate:''
        };
    return {
        template: _view,
        /**
         * 属性说明
         * @property {Object} search 检索条件
         * @property {Array} questionList 试题列表
         * @property {Int} totalPages 总页数
         * @property {Int} currentPage 当前页数
         * @property {Int} offset 每页显示条数
         * @property {Array} choose 选中试题ID数组
         * @property {Array} selectQuestion 添加试卷选择试题列表
         */
        data: function () {
            self = this;
            return {
                search: {
                    knowledge: '',
                    difficulty: '',
                    type: '',
                    stem: '',
                    founder: '',
                    creationTime: '',
                    lastUpdate:''
                },
                questionList: [],
                totalPages: 0,
                currentPage: 1,
                offset:2,
                choose:[],
                selectQuestion: []


            }
        },
        /**
         * 父组件传递属性
         * @property {Boolean} isQuesOperation
         */
        props: {
            isQuesOperation: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            /**
             * 创建时间设置datetimepicker插件
             * @method
             * @param
             * @return
             */
            timepicker: function () {
                var timerole={
                    language:  'zh-CN',
                    weekStart: 1,
                    todayBtn:  1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    forceParse: 0,
                    showMeridian: 1,
                    minView: 1,
                    linkFormat: "yyyy-mm-dd hh:ii"
                };
                $('.form_datetime').datetimepicker(timerole).on('hide', function (ev) {
                    self.search.creationTime = $("#creationTime").val();
                });;
            },
            /**
             * 分页设置bootstrap_paginator插件
             * @method
             * @param
             * @return
             */
            paginator: function () {
                var element = $('#questionPage');
                var options = {
                    bootstrapMajorVersion:3,
                    currentPage: self.currentPage,
                    numberOfPages: 6,
                    totalPages:self.totalPages,
                    alignment:'right',
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            case "page":
                                return page;
                        }
                    },
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";

                        }
                    },
                    onPageClicked: function(e,originalEvent,type,page){
                        self.currentPage = page;
                        self.load();
                    }
                }
                element.bootstrapPaginator(options);
            },
            /**
             * 加载试题列表内容
             * @method
             * @param
             * @return
             */
            load: function () {
                self.questionList = [];
                var dataform = currentSearch;
                dataform.auditStatus = 0;
                dataform.page = self.currentPage;
                dataform.offset = self.offset;
                var toJSON = JSON.stringify(dataform);
                alert(toJSON);
                var msg = [
                    {
                        questionID: '010101',
                        type: '0',
                        stem: '这是一道考试题111？',
                        founder: '张三',
                        knowledge: '软件工程',
                        auditStatus: '0',
                        difficultNum: '5',
                        lastUpdate: '2018-03-28 15:56',
                        option: '1.选项一你猜是什么%%%2.选项二你猜是什么%%%3.选项三你猜是什么%%%4.选项三你猜是什么',
                        standardAnswer: '1'
                    },
                    {
                        questionID: '010102',
                        type: '0',
                        stem: '这是一道考试题2222？',
                        founder: '张三',
                        knowledge: '软件工程',
                        auditStatus: '0',
                        difficultNum: '5',
                        lastUpdate: '2018-03-28 15:56',
                        option: '1.选项一你猜是什么%%%2.选项二你猜是什么%%%3.选项三你猜是什么%%%4.选项三你猜是什么',
                        standardAnswer: '1'
                    },
                    {
                        questionID: '010103',
                        type: '0',
                        stem: '这是一道考试题333？',
                        founder: '张三',
                        knowledge: '软件工程',
                        auditStatus: '0',
                        difficultNum: '5',
                        lastUpdate: '2018-03-28 15:56',
                        option: '1.选项一你猜是什么%%%2.选项二你猜是什么%%%3.选项三你猜是什么%%%4.选项三你猜是什么',
                        standardAnswer: '1'
                    }
                ];
                self.totalPages = 3;
                msg.forEach(function (t) { self.questionList.push(t); });
                // $.ajax({
                //     type: 'post',
                //     url: '/question/selectQuestion',
                //     contentType:"application/json;charset=utf-8",
                //     dataType:'json',
                //     data: toJSON,
                //     success: function(msg) {
                //         if (msg.code === 0) {
                //             self.totalPages = Math.ceil(msg.result.total/self.offset);
                //             msg.result.question.forEach(function (t) { self.questionList.push(t); });
                //         } else {
                //             alert('加载失败!');
                //         }
                //     }
                // });
            },
            /**
             * 更新检索条件
             * @method
             * @param
             * @return
             */
            goSearch: function () {
                self.currentPage = 1;
                currentSearch = JSON.parse(JSON.stringify(self.search));
                self.load();
            },
            /**
             * 清空检索条件
             * @method
             * @param
             * @return
             */
            empty: function () {
                self.search = {
                    knowledge: '',
                    difficulty: '',
                    type: '',
                    stem: '',
                    founder: '',
                    creationTime: ''
                };
                $("#creationTime").val('');
            },
            /**
             * 全选、反选
             * @method
             * @param {Object} event 当前点击对象
             * @return
             */
            selectAll: function (event) {
                if(event.target.checked) {
                    self.questionList.forEach(function (t) { self.choose.push(t.questionID) });
                }else {
                    self.choose = [];
                }
            },
            /**
             * 批量删除
             * @method
             * @param {Object} event 当前点击对象
             * @return
             */
            questionDel: function () {
                console.log(self.choose);
                if(self.choose.length == 0){
                    alert('请选择需要删除的试题');
                }
                $.ajax({
                    type: 'post',
                    url: '/question/deleteQuestion',
                    data: JSON.stringify(self.choose),
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            self.load();
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            },
            /**
             * 试题编辑事件响应、触发事件、父组件监听
             * @method
             * @param {String} index 当前试题在questionList的索引
             * @return
             */
            QuestionModify: function (index) {
                this.$emit('QuestionModify',self.questionList[index]);
            },
            /**
             * 添加试卷激活本组件、选择试题将试题列表传回父组件
             * @method
             * @param
             * @return
             */
            addQuesToPeper: function () {
                this.$emit('selectQuestion',self.selectQuestion);
            },
            /**
             * 添加试卷激活本组件、将勾选试题对象添加至selectQuestion数组、取消勾选从selectQuestion中删除该元素
             * @method
             * @param {String} index 所选试题索引
             * @param {Object} event 所选试题事件
             * @return
             */
            chooseQuestionTopaper: function (index,event) {
                if(!self.isQuesOperation){
                    if(event.target.checked){
                        self.selectQuestion.push(JSON.parse(JSON.stringify(self.questionList[index])));
                    } else {
                        //无法通过indexOf获取当前对象下标、因对象与对象无法相等比较
                        //即只能遍历selectQuestion比较与当前勾选试题对象questionID相同、删除selectQuestion中该元素
                        self.selectQuestion.forEach(function (element,num) {
                            var questionID = JSON.parse(JSON.stringify(self.questionList[index])).questionID;
                            if(questionID == element.questionID) {
                                self.selectQuestion.splice(num,1);
                            }
                        })
                    }
                }
            },
            /**
             * 添加试卷关闭模态框、调用此方法清空selectQuestion数组、再次打开模态框不影响下次勾选试题
             * @method
             * @param
             * @return
             */
            cleanQues: function () {
                self.choose = [];
                self.selectQuestion = [];
            }
        },
        filters: {
            /**
             * 试题类型由{0、1、2}转换为{单选题、多选题、简答题}
             * @method
             * @param {String} value 获取试题类型
             * @return
             */
            typeToString: function (value) {
                switch(value)
                {
                    case 0:
                        return '单选题';
                        break;
                    case 1:
                        return '多选题';
                        break;
                    case 2:
                        return '简答题';
                        break;
                    default:
                        return '';
                }
            },
            /**
             * 试题状态由{0、1、2、3}转换为{本地、正在审核、已共享、审核未通过}
             * @method
             * @param {String} value 获取试题状态
             * @return
             */
            auditStatusToString: function (value) {
                switch(value)
                {
                    case 0:
                        return '本地';
                        break;
                    case 1:
                        return '正在审核';
                        break;
                    case 2:
                        return '已共享';
                        break;
                    case 3:
                        return '审核未通过';
                        break;
                    default:
                        return '';
                }
            }
        },
        mounted: function () {
            self.load();
            self.timepicker();
        }
    }
})
