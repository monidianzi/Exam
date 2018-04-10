/**
 * @author Guo Yuchun
 * @date   2018/4/8
 * @Description: 试卷管理组件
 */
'use strict';

require(['less!paperManageStyle']);
define([
    'text!paperManageView',
    'vue'
],function (
    _view,
    vue
) {
    var self,
        //当前检索条件：未点击检索前，值仍为上次检索条件，点击页面跳页，仍根据上次检索条件获取该页数据，点击检索后更新当前检索条件
        currentSearch = {
            paperClassify: '',
            paperName: '',
            founder: '',
            subject: '',
            auditStatus: '',
            score: '',
            lastUpdate: ''
        };
    return {
        template: _view,
        /**
         * 属性说明
         * @property {Object} search 检索条件
         * @property {Array} paperList 试卷列表
         * @property {Number} currentPage 当前页
         * @property {Number} totalPages 总页数
         * @property {Number} offset 页偏移
         * @property {Array} choose 所选试卷ID
         */
        data : function () {
            self = this;
            return {
                search: {
                    paperClassify: '',
                    paperName: '',
                    founder: '',
                    subject: '',
                    auditStatus: '',
                    score: '',
                    lastUpdate: ''
                },
                paperList: [],
                currentPage: 1,
                totalPages: 0,
                offset:2,
                choose:[]
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
                    self.search.lastUpdate = $(".form_datetime").val();
                });
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
                        //self.load();
                    }
                }
                element.bootstrapPaginator(options);
            },
            /**
             * 检索
             * @method
             * @param
             * @return
             */
            load: function () {
                self.paperList = [];
                var dataform = currentSearch;
                dataform.page = self.currentPage;
                dataform.offset = self.offset;
                var toJSON = JSON.stringify(dataform);
                alert(toJSON);
                var msg = [{
                    paperID: '010101',
                    paperName: '2018软工期末考试1',
                    Subject: '计算机',
                    paperClassify: '考试',
                    score: '100',
                    questionNumber: '20',
                    isUsed: '1',
                    share: '0',
                    auditStatus: '已通过',
                    founder: '张三',
                    creationTime: '2018.01.10 18:10',
                    lastUpdate: '2018.01.10 18:10',
                    question: [{
                        titleDescribe: '选择题',
                        questionGroup: [{
                            questionID: '0101010101',
                            stem: '我测试以下子蛤111',
                            lastUpdate: '2018.04.10. 21:53'
                        },{
                            questionID: '0101010102',
                            stem: '我测试以下子蛤222',
                            lastUpdate: '2018.04.10. 21:53'
                        },{
                            questionID: '0101010103',
                            stem: '我测试以下子蛤333',
                            lastUpdate: '2018.04.10. 21:53'
                        },{
                            questionID: '0101010104',
                            stem: '我测试以下子蛤444',
                            lastUpdate: '2018.04.10. 21:53'
                        }],
                        score: '100'},{
                        titleDescribe: '选择题',
                        questionGroup: [{
                            questionID: '0101010201',
                            stem: '我测试以下子蛤222111',
                            lastUpdate: '2018.04.10. 21:53'
                        },{
                            questionID: '0101010202',
                            stem: '我测试以下子蛤222222',
                            lastUpdate: '2018.04.10. 21:53'
                        },{
                            questionID: '0101010203',
                            stem: '我测试以下子蛤222333',
                            lastUpdate: '2018.04.10. 21:53'
                        },{
                            questionID: '0101010204',
                            stem: '我测试以下子蛤222444',
                            lastUpdate: '2018.04.10. 21:53'
                        }],
                        score: '200'}
                    ]
            },{
                    paperID: '010102',
                    paperName: '2018软工期末考试2',
                    Subject: '计算机',
                    paperClassify: '考试',
                    score: '100',
                    questionNumber: '20',
                    isUsed: '1',
                    share: '0',
                    auditStatus: '已通过',
                    founder: '张三',
                    creationTime: '2018.01.10 18:10',
                    lastUpdate: '2018.01.10 18:10'
                },{
                    paperID: '010103',
                    paperName: '2018软工期末考试3',
                    Subject: '计算机',
                    paperClassify: '考试',
                    score: '100',
                    questionNumber: '20',
                    isUsed: '1',
                    share: '0',
                    auditStatus: '已通过',
                    founder: '张三',
                    creationTime: '2018.01.10 18:10',
                    lastUpdate: '2018.01.10 18:10'
                }];
                self.totalPages = 3;
                msg.forEach(function (t) { self.paperList.push(t); });
                // $.ajax({
                //     type: 'post',
                //     url: '',
                //     contentType:"application/json;charset=utf-8",
                //     dataType:'json',
                //     data: toJSON,
                //     success: function(msg) {
                //         if (msg.code === 0) {
                //             self.totalPages = Math.ceil(msg.result.total/self.offset);
                //             self.paginator();
                //             msg.forEach(function (t) { self.paperList.push(t); });
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
                    paperClassify: '',
                    paperName: '',
                    founder: '',
                    subject: '',
                    auditStatus: '',
                    score: '',
                    lastUpdate: ''
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
                    self.paperList.forEach(function (t) { self.choose.push(t.paperID) });
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
                    alert('请选择需要删除的试卷');
                }
                $.ajax({
                    type: 'post',
                    url: '',
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
             * 试卷编辑事件响应、触发事件、父组件监听
             * @method
             * @param {String} index 当前试卷在paperList的索引
             * @return
             */
            paperModify: function (index) {
                this.$emit('paperModify',self.paperList[index]);
            },

        },
        mounted: function () {
            self.timepicker();
            self.load();
        }
    }
});