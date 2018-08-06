/**
 * @author Guo Yuchun
 * @date   2018/4/29
 * @Description:
 */

'use strict';

require(['less!selectTeacherStyle']);
define([
    'text!selectTeacherView',
    'bootstrap'
],function (
    _view,
    bootstrap
) {
    var self,
        //当前检索条件：未点击检索前，值仍为上次检索条件，点击页面跳页，仍根据上次检索条件获取该页数据，点击检索后更新当前检索条件
        currentSearch = {

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

                },
                teacherList: [],
                currentPage: 1,
                totalPages: 0,
                offset:2,
            }
        },
        methods: {
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
                self.teacherList = [];
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
                                self.totalPages =1;
                                self.currentPage =1;
                                self.paginator();
                            }
                            msg.result.teacher.forEach(function (t) { self.teacherList.push(t); });
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

                };
            },
            /**
             * 变更申请提交
             * @method
             * @param {Array} choose 选择教师
             * @return
             */
            add: function (choose) {
                //传递至父组件
            }
        },
        mounted: function () {
            self.load();
        },
        components: {

        }
    }
})