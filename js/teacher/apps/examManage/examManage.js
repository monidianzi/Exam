/**
 * @author Guo Yuchun
 * @date   2018/4/29
 * @Description:
 */

'use strict';

require(['less!examManageStyle']);
define([
    'text!examManageView',
    'datetimepicker',
    'bootstrappaginator',
    'bootstrap'
],function (
    _view,
    datetimepicker,
    bootstrappaginator,
    bootstrap
) {
    var self,
        //当前检索条件：未点击检索前，值仍为上次检索条件，点击页面跳页，仍根据上次检索条件获取该页数据，点击检索后更新当前检索条件
        currentSearch = {
            examClassify: '',
            examName: '',
            founder: '',
            startTime: '',
            auditStatus: '',
            lastUpdate: ''
        };
    return {
        template: _view,
        /**
         * 属性说明
         * @property {Object} search 检索条件
         * @property {Array} paperList 考试列表
         * @property {Number} currentPage 当前页
         * @property {Number} totalPages 总页数
         * @property {Number} offset 页偏移
         * @property {Number} index 当前操作考试ID
         */
        data: function () {
            self = this;
            return {
                search: {
                    examClassify: '',
                    examName: '',
                    founder: '',
                    startTime: '',
                    auditStatus: '',
                    lastUpdate: ''
                },
                examList: [],
                currentPage: 1,
                totalPages: 0,
                offset:10,
                index: ''
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
                $('#startTime').datetimepicker(timerole).on('hide', function (ev) {
                    self.search.startTime = $("#startTime").val();
                });
                $('#lastUpdate').datetimepicker(timerole).on('hide', function (ev) {
                    self.search.lastUpdate = $("#lastUpdate").val();
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
             * 检索
             * @method
             * @param
             * @return
             */
            load: function () {
                self.examList = [];
                var dataform = currentSearch;
                dataform.page = self.currentPage;
                dataform.offset = self.offset;
                var toJSON = JSON.stringify(dataform);
                $.ajax({
                    type: 'post',
                    url: '/exam/selectExam',
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
                            msg.result.exam.forEach(function (t) { self.examList.push(t); });
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
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
                    examClassify: '',
                    examName: '',
                    founder: '',
                    startTime: '',
                    auditStatus: '',
                    lastUpdate: ''
                };
                $("#startTime").val('');
                $("#lastUpdate").val('');
            },
            /**
             * 删除
             * @method
             * @param {Object} event 当前点击对象
             * @return
             */
            examDel: function (index) {
                $.ajax({
                    type: 'post',
                    url: '/exam/deleteExam',
                    data: JSON.stringify({examID:self.examList[index].examID}),
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            alert('删除成功!');
                            self.load();
                        } else {
                            alert('删除失败!');
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
            examModify: function (index) {
                this.$emit('examModify',self.examList[index]);
            },
            /**
             * 变更申请模态框弹出、记录当前操作考试ID
             * @method
             * @param {String} index 当前试卷在paperList的索引
             * @return
             */
            examChange: function (index) {
                self.index = self.examList[index].examID;
                $('#change').modal('show');
            },
            /**
             * 变更申请提交
             * @method
             * @param {String} index 当前试卷在paperList的索引
             * @return
             */
            changeSubmit: function (index) {
                $.ajax({
                    type: 'post',
                    url: '/exam/changeApply',
                    data: JSON.stringify({examID:self.index,changeReason: $('#reason').val()}),
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            $('#reason').val('');
                            $('#change').modal('hide');
                            self.load();
                        } else {
                            alert('提交失败!');
                        }
                    }
                });
            },
            /**
             * unix时间戳转换为时间
             * @method
             * @param {String} value 获取试题状态
             * @return
             */
            unixToTime: function (value) {
                //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var date = new Date(value);
                return (date.getHours()+1 < 10 ? '0'+(date.getHours()+1) : date.getHours()+1) + ':' + (date.getMinutes()+1 < 10 ? '0'+(date.getMinutes()+1) : date.getMinutes()+1);
            }
        },
        filters: {
            statusToString: function (value) {
                switch(value)
                {
                    case 0:
                        return '已通过';
                        break;
                    case 1:
                        return '正在审核';
                        break;
                    case 2:
                        return '未通过';
                        break;
                    default:
                        return '';
                }
            },
            classifyToString: function (value) {
                switch(value)
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
            unixToTime: function (value) {
                //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var date = new Date(+value);
                return date.getFullYear() + '-' +(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + (date.getDate()+1 < 10 ? '0'+(date.getDate()+1) : date.getDate()+1) + ' ' + (date.getHours()+1 < 10 ? '0'+(date.getHours()+1) : date.getHours()+1) + ':' + (date.getMinutes()+1 < 10 ? '0'+(date.getMinutes()+1) : date.getMinutes()+1);
            },
            /**
             * unix时间戳转换为考试试卷段
             * @method
             * @param {String} value 获取试题状态
             * @return
             */
            unixToTimeSlot: function (value,startTime,duration) {
                return value+' ~ '+ self.unixToTime(+startTime+parseInt(duration));
            }
        },
        mounted: function () {
            self.timepicker();
            self.load();
        },
        components: {

        }
    }
})