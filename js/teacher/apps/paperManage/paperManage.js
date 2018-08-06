/**
 * @author Guo Yuchun
 * @date   2018/4/8
 * @Description: 试卷管理组件
 */
'use strict';

require(['less!paperManageStyle']);
define([
    'text!paperManageView',
    'datetimepicker',
    'bootstrappaginator',
    'paperPreview',
    'vue'
],function (
    _view,
    datetimepicker,
    bootstrappaginator,
    paperPreview,
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
         * @property {Array} selectPaper 所选试卷信息集合
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
                offset:10,
                choose:[],
                selectPaper: [],
                paperdetail: {}
            }
        },
        /**
         * 父组件传递属性
         * @property {Boolean} isQuesOperation
         */
        props: {
            isPaperOperation: {
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
                self.paperList = [];
                var dataform = currentSearch;
                dataform.page = self.currentPage;
                dataform.offset = self.offset;
                var toJSON = JSON.stringify(dataform);
                $.ajax({
                    type: 'post',
                    url: '/paper/selectPaper',
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
                            msg.result.paper.forEach(function (t) { self.paperList.push(t); });
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
                    url: '/paper/deletePaper',
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
            /**
             * 添加考试激活本组件、将勾选试卷对象添加至selectPaper数组、取消勾选从selectPaper中删除该元素
             * @method
             * @param {String} index 所选试卷索引
             * @param {Object} event 所选试卷事件
             * @return
             */
            choosePaperToExam: function (index,event) {
                if(!self.isPaperOperation){
                    if(event.target.checked){
                        self.selectPaper.push(JSON.parse(JSON.stringify(self.paperList[index])));
                    } else {
                        //无法通过indexOf获取当前对象下标、因对象与对象无法相等比较
                        //即只能遍历selectPaper比较与当前勾选试题对象paperID相同、删除selectPaper中该元素
                        self.selectPaper.forEach(function (element,num) {
                            var paperID = JSON.parse(JSON.stringify(self.paperList[index])).paperID;
                            if(paperID == element.paperID) {
                                self.selectPaper.splice(num,1);
                            }
                        })
                    }
                }
            },
            /**
             * 添加考试激活本组件、选择试卷将试卷列表传回父组件
             * @method
             * @param
             * @return
             */
            addToExam: function () {
                this.$emit('selectPaper',self.selectPaper);
            },
            /**
             * 添加考试关闭模态框、调用此方法清空selectPaper数组、再次打开模态框不影响下次勾选试卷
             * @method
             * @param
             * @return
             */
            cleanPaper: function () {
                self.choose = [];
                self.selectPaper = [];
            },
            /**
             * 点击试题、打开试题预览模态框、传递试题信息、激活试题预览组件
             * @method
             * @param
             * @return
             */
            paperPreModal: function (index) {
                //获取试卷信息
                $.ajax({
                    type: 'post',
                    url: '/exam/previewPaper',
                    data: JSON.stringify({paperID:self.paperList[index].paperID}),
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            self.paperdetail = msg.result;
                            $('#paperPre').modal('show');
                        } else {
                            alert(msg.message);
                        }
                    }
                });
            },
            /**
             * 关闭试题预览模态框
             * @method
             * @param
             * @return
             */
            paperPreModalclose: function () {
                $('#paperPre').modal('hide');
            }
        },
        filters: {
            /**
             * 试题状态由{0、1、2、}转换为{已通过、正在审核、未通过}
             * @method
             * @param {String} value 获取试题状态
             * @return
             */
            paperStatusToString: function (value) {
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
            }
        },
        components: {
            paperPreview: paperPreview
        },
        mounted: function () {
            self.timepicker();
            self.load();
        }
    }
});