/**
 * @author Guo Yuchun
 * @date   2018/6/11
 * @Description:
 */

'use strict';

require(['less!examScoreStyle']);

define([
    'text!examScoreView',
    'datetimepicker',
    'bootstrappaginator',
],function (
    _view,
    datetimepicker,
    bootstrappaginator
) {
    var self,
        currentSearch = {
            examName: '',
            examClassify: '',
            group: '',
            begin: '',
            end: ''
        };
    return {
        template: _view,
        /**
         * 属性说明
         * @property {属性类型} 属性名
         */
        data: function () {
            self = this;
            return {
                search: {
                    examName: '',
                    examClassify: '',
                    group: '',
                    begin: '',
                    end: ''
                },
                examList: [],
                studentList: [],
                totalPages: 0,
                currentPage: 1,
                stuTotalPage: 0,
                stuCurrentPage: 1,
                offset:10,

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
                $('#begin').datetimepicker(timerole).on('hide', function (ev) {
                    self.search.begin = $("#begin").val();
                });
                $('#end').datetimepicker(timerole).on('hide', function (ev) {
                    self.search.end = $("#end").val();
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
                        self.load();
                    }
                }
                element.bootstrapPaginator(options);
            },
            /**
             * 学生列表分页设置bootstrap_paginator插件
             * @method
             * @param
             * @return
             */
            stuPaginator: function () {
                var element = $('#studentPage');
                var options = {
                    bootstrapMajorVersion:3,
                    currentPage: self.stucurrentPage,
                    numberOfPages: 6,
                    totalPages:self.stuTotalPage,
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
                        self.stucurrentPage = page;
                        self.studentScore();
                    }
                }
                element.bootstrapPaginator(options);
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
                    examName: '',
                    examClassify: '',
                    group: '',
                    begin: '',
                    end: ''
                };
                $("#start").val('');
                $("#end").val('');
            },
            /**
             * 加载考试列表内容
             * @method
             * @param
             * @return
             */
            load: function () {
                self.examList = [];
                var msg = [
                    {
                        examID: '0101',
                        examName: '测试数据1',
                        group: '测试一组',
                        examClassify: '0',
                        startTime: '1526999700000',
                        duration: '12000000'
                    },
                    {
                        examID: '0101',
                        examName: '测试数据1',
                        group: '测试一组',
                        examClassify: '0',
                        startTime: '1526999700000',
                        duration: '12000000'
                    },
                    {
                        examID: '0101',
                        examName: '测试数据1',
                        group: '测试一组',
                        examClassify: '0',
                        startTime: '1526999700000',
                        duration: '12000000'
                    }
                ];
                msg.forEach(function (t) { self.examList.push(t); });
                self.totalPages = Math.ceil(20/self.offset);
                self.paginator();
                var dataform = currentSearch;
                dataform.page = self.currentPage;
                dataform.offset = self.offset;
                var toJSON = JSON.stringify(dataform);
                $.ajax({
                    type: 'post',
                    url: '',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: toJSON,
                    success: function(msg) {
                        if (msg.code === 0) {
                            if(msg.result.total!=0){
                                self.totalPages = Math.ceil(msg.result.total/self.offset);
                                self.paginator();
                            }else{
                                self.totalPages ='';
                                self.paginator();
                            }
                            msg.result.examInfo.forEach(function (t) { self.examList.push(t); });
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            },
            /**
             * 考生信息模态框打开、获取列表信息、设置分页
             * @method
             * @param
             * @return
             */
            modalShow: function (index) {
                self.studentScore(index);
                $('#stuScore').modal('show');
            },
            /**
             * 考生信息模态框关闭
             * @method
             * @param
             * @return
             */
            modalClose: function (index) {
                $('#stuScore').modal('hide');
            },
            /**
             * 加载该场考试下考生列表内容
             * @method
             * @param
             * @return
             */
            studentScore: function (index) {
                self.studentList = [];
                var msg =[
                    {
                        studentID: '0101',
                        realName: '郭玉纯',
                        number: '1603210049',
                        className: '计研16',
                        score: '100',
                        examItemID:'0000'
                    },
                    {
                        studentID: '0101',
                        realName: '郭玉纯',
                        number: '1603210049',
                        className: '计研16',
                        score: '100',
                        examItemID:'0000'
                    },
                    {
                        studentID: '0101',
                        realName: '郭玉纯',
                        number: '1603210049',
                        className: '计研16',
                        score: '100',
                        examItemID:'0000'
                    }
                ];
                msg.forEach(function (t) { self.studentList.push(t); });
                self.stuTotalPage = Math.ceil(30/self.offset);
                self.stuPaginator();
                $.ajax({
                    type: 'post',
                    url: '',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: JSON.stringify({
                        examID:self.examList[index].examID,
                        page: self.stuCurrentPage,
                        offset: self.offset
                    }),
                    success: function(msg) {
                        if (msg.code === 0) {
                            if(msg.result.total!=0){
                                self.stuTotalPage = Math.ceil(msg.result.total/self.offset);
                                self.stuPaginator(index);
                            }else{
                                self.stuTotalPage ='';
                                self.stuPaginator(index);
                            }
                            msg.result.list.forEach(function (t) { self.studentList.push(t); });
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            },
            /**
             * 查看改名考生的试卷
             * @method
             * @param
             * @return
             */
            seeStuPaper: function (index) {
                window.open('apps/studentpaper/studentpaper.html?examItem='+self.studentList[index].examItemID);
            }
        },
        filters: {
            /**
             * 试题类型由{0、1、4}转换为{单选题、多选题、简答题}
             * @method
             * @param {String} value 获取试题类型
             * @return
             */
            typeToString: function (value) {
                switch(+value)
                {
                    case 0:
                        return '个人';
                        break;
                    case 1:
                        return '学校';
                        break;
                    default:
                        return '';
                }
            },
            /**
             * unix时间戳转换为时间
             * @method
             * @param {String} value 获取试题状态
             * @return
             */
            unixToTime: function (value,duration) {
                //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var start = new Date(+value);
                var end = new Date(+value + (+duration));
                return start.getFullYear() + '-' +(start.getMonth()+1 < 10 ? '0'+(start.getMonth()+1) : start.getMonth()+1) + '-' + (start.getDate()+1 < 10 ? '0'+(start.getDate()+1) : start.getDate()+1) + ' ' + (start.getHours()+1 < 10 ? '0'+(start.getHours()+1) : start.getHours()+1) + ':' + (start.getMinutes()+1 < 10 ? '0'+(start.getMinutes()+1) : start.getMinutes()+1)+"~"+(end.getHours()+1 < 10 ? '0'+(end.getHours()+1) : end.getHours()+1) + ':' + (end.getMinutes()+1 < 10 ? '0'+(end.getMinutes()+1) : end.getMinutes()+1);
            }
        },
        mounted: function () {
            self.load();
            self.timepicker();
        }
    }
})