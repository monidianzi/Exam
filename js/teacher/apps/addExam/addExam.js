/**
 * @author Guo Yuchun
 * @date   2018/4/22
 * @Description:
 */

'use strict';
require(['less!addExamStyle']);

define([
    'text!addExamView',
    'bootstrap',
    'paperManage'
],function (
    _view,
    bootstrap,
    paperManage
) {
    var self;
    return {
        template: _view,
        /**
         * 属性说明
         * @property {String} examName 考试名称
         * @property {String} examClassify 考试类型
         * @property {String} examAttention 考试须知
         * @property {String} answerType 答卷模式 {0: 整卷、 1: 一题}
         * @property {String} scoreType 分数类型
         * @property {String} startTime 开始时间
         * @property {String} duration 考试时长
         * @property {String} clockStyle 即时方式
         * @property {String} disorder 选项乱序
         * @property {String} fullScreen 全屏防作弊
         * @property {String} isScore 是否发布试卷
         * @property {String} isPaper 是否查看试卷
         * @property {String} rightMouseButtonDisable 鼠标右键复制粘贴
         * @property {String} isRank 显示排名
         * @property {Array} examiner 监考
         * @property {Array} auditor 审核
         * @property {String} correctBegin 阅卷开始时间
         * @property {String} correctEnd 阅卷截至时间
         * @property {Array} paper 试卷ID集合
         * @property {Array} selectPaperList 选择试卷信息集合
         * @property {Array} group 组ID集合
         * @property {Array} selectGroupList 选择组信息集合
         * @property {Array} groupList 当前用户所有用户组集合
         * @property {Object} assignCorrectorPaper 指定阅卷人试卷对象
         * @property {Array} questionDistribute 阅卷人试题指定列表
         * @property {String} index 当前指定阅卷人试卷下标
         * @property {Boolean} isPaperOperation 是否选择试卷操作
         */
        data: function () {
            self = this;
            return {
                examID: '',
                examName: '',
                examClassify: '',
                examAttention: '',
                answerType: '',
                scoreType: '',
                duration: '',
                startTime: '',
                clockStyle: '',
                late: '',
                disorder: '',
                fullScreen: '',
                isScore: '',
                isPaper: '',
                rightMouseButtonDisable: '',
                isRank: '',
                examiner: [],
                examinerList: [],
                auditor: [],
                auditorList: [],
                corrector: [],
                correctorList: [],
                correctBegin: '',
                correctEnd: '',
                paper: [],
                selectPaperList: [],
                group: '',
                selectGroupList: [],
                groupList: [],
                assignCorrectorPaper: {},
                questionDistribute: [],
                index: '',
                isPaperOperation: false
            }
        },
        /**
         * 父组件获取属性说明
         * @property
         * {Object} paperInfo 试卷信息
         */
        props: {
            examInfo: {
                type: Object,
                default: {}
            }
        },
        methods: {
            /**
             * 选择试卷、打开选择试卷模态框、激活试卷管理组件
             * @method
             * @param
             * @return
             */
            pickPaper: function () {
                $('#selectPaper').modal('show');
            },
            /**
             * 将试卷管理组件回传的选择试卷列表添加至paperList中、关闭模态框
             * @method
             * @param {Array} paperList 选择的试卷列表
             * @return
             */
            selectPaper: function (paperList) {
                self.paper = [];
                self.selectPaperList = [];
                self.questionDistribute = [];
                paperList.forEach(function (t) {
                    self.paper.push(t.paperID);
                    self.selectPaperList.push(t);
                    self.questionDistribute.push({paperID: t.paperID});
                });
                self.$refs.paperClean.cleanPaper();
                $('#selectPaper').modal('hide');
            },
            /**
             * 关闭模态框、调用子组件方法清空子组件回传选择试题列表
             * @method
             * @param
             * @return
             */
            closePaper: function () {
                self.$refs.paperClean.cleanPaper();
                $('#selectPaper').modal('hide');
            },
            /**
             * 获取当前用户所有用户组信息集合、渲染至模态框、打开模态框
             * @method
             * @param
             * @return
             */
            selectGroup: function () {
                self.groupList = [];
                $.ajax({
                    type: 'post',
                    url: '/exam/addGroupLoad',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: '',
                    success: function(msg) {
                        if (msg.code === 0) {
                            msg.result.forEach(function (t) {
                                self.groupList.push(t);
                            })
                            $('#selectGroup').modal('show');
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            },
            /**
             * 将通过模态框勾选的用户组添加至selectGroupList、渲染至页面
             * @method
             * @param {Number} index 勾选用户组下标
             * @return
             */
            chooseGroup: function (index) {
                self.selectGroupList = [];
                self.group = [];
                self.selectGroupList.push(self.groupList[index]);
                self.group = self.groupList[index].groupID;
                $('#selectGroup').modal('hide');
            },
            /**
             * 打开指定阅卷人模态框、将当前试卷信息传递至模态框并渲染
             * @method
             * @param {Number} index 当前试卷下标
             * @return
             */
            assignCorrector: function (index) {
                self.assignCorrectorPaper = self.selectPaperList[index];
                self.index = index;
                $('#assignCorrector').modal('show');
            },
            /**
             * 将阅卷人以大题分配、组织数据结构
             * @method
             * @param
             * @return
             */
            quesDistribute: function () {
                self.questionDistribute[self.index].corrector =[];
                self.assignCorrectorPaper.question.forEach(function (t,index) {
                    var questionGroup = [];
                    t.questionGroup.forEach(function (t2) {
                        questionGroup.push({questionID:t2.questionID,questionScore:t2.score});
                    });
                    self.questionDistribute[self.index].corrector.push({teacherID: $('.teacherID').eq(index).val(),questionGroup:questionGroup})
                });
                $('#assignCorrector').modal('hide');

            },
            /**
             * 必填信息校验
             * @method
             * @param
             * @return {Boolean} flag 是否成功
             */
            neceCheck: function () {
                var flag = true;
                //考试名称
                if(!this.examName.trim()) {
                    $('.examName').addClass('alarm');
                    alert('请填写考试名称！');
                    return false;
                }
                //考试分类
                if(this.examClassify !=='0' && this.examClassify !=='1') {
                    $('.examClassify').addClass('alarm');
                    alert('请选择考试分类！');
                    return false;
                }

                //考试须知
                if(!this.examAttention.trim()) {
                    $('.examAttention').addClass('alarm');
                    alert('请填写考试须知！');
                    return false;
                }

                //答卷模式
                if(this.answerType !=='0' && this.answerType !=='1') {
                    $('.answerType').addClass('alarm');
                    alert('请选择答卷模式！');
                    return false;
                }

                //分数类型
                if(this.scoreType !=='0' && this.scoreType !=='1') {
                    $('.scoreType').addClass('alarm');
                    alert('请选择分数类型！');
                    return false;
                }

                //考试时长
                if(!this.duration.trim()) {
                    $('.duration').addClass('alarm');
                    alert('请填写考试时长！');
                    return false;
                }

                //开考时间
                if(!this.startTime.trim()) {
                    $('.startTime').addClass('alarm');
                    alert('请选择开考时间！');
                    return false;
                }
                //计时方式
                if(this.clockStyle !=='0' && this.clockStyle !=='1') {
                    $('.clockStyle').addClass('alarm');
                    alert('请选择计时方式！');
                    return false;
                }

                //迟到禁止入场
                if(!this.late.trim()) {
                    $('.late').addClass('alarm');
                    alert('请填写禁止入场时间！');
                    return false;
                }
                //开始阅卷时间
                if(!this.correctBegin.trim()) {
                    $('.correctBegin').addClass('alarm');
                    alert('请选择开始阅卷时间！');
                    return false;
                }
                //结束阅卷时间
                if(!this.correctEnd.trim()) {
                    $('.correctEnd').addClass('alarm');
                    alert('请选择结束阅卷时间！');
                    return false;
                }
                //审核
                if(this.auditor.length == 0) {
                    $('.auditor').addClass('alarm');
                    alert('请选择审核人！');
                    return false;
                }
                //监考
                if(this.examiner.length == 0) {
                    $('.examiner').addClass('alarm');
                    alert('请选择监考人！');
                    return false;
                }
                //组
                if(this.group === '') {
                    alert('请选择用户组！');
                    return false;
                }
                //试卷
                if(this.paper.length == 0) {
                    alert('请选择试卷！');
                    return false;
                } else {
                    //试卷分配
                    this.questionDistribute.forEach(function (t,index) {
                        if(!t.corrector){
                            alert('第'+(+index+1)+'套试卷未指定阅卷人！');
                            flag = false;
                            return false;
                        }
                    });
                }

                return flag;
            },
            /**
             * 提交保存
             * @method
             * @param
             * @return
             */
            save: function () {
                if(this.neceCheck()) {
                    var paramete = JSON.parse(JSON.stringify(self.$data));
                    paramete.disorder = paramete.disorder == '' | paramete.disorder == false ? 0 : 1;
                    paramete.fullScreen = paramete.fullScreen == '' | paramete.fullScreen == false ? 0 : 1;
                    paramete.isScore = paramete.isScore == '' | paramete.isScore == false ? 0 : 1;
                    paramete.isPaper = paramete.isPaper == '' | paramete.isPaper == false ? 0 : 1;
                    paramete.rightMouseButtonDisable = paramete.rightMouseButtonDisable == '' | paramete.rightMouseButtonDisable == false ? 0 : 1;
                    paramete.isRank = paramete.isRank == '' | paramete.isRank == false ? 0 : 1;
                    paramete.auditor = [paramete.auditor];
                    paramete.examiner = [paramete.examiner];
                    paramete.duration = paramete.duration * 60000;
                    paramete.startTime = new Date(paramete.startTime).getTime();
                    paramete.correctBegin = new Date(paramete.correctBegin).getTime();
                    paramete.correctEnd = new Date(paramete.correctEnd).getTime();

                    var url = '/exam/addExam';
                    if (JSON.stringify(this.examInfo) != '{}') {
                        url = '/exam/modifyExam';
                    }
                    $.ajax({
                        type: 'post',
                        url: url,
                        contentType: "application/json;charset=utf-8",
                        dataType: 'json',
                        data: JSON.stringify(paramete),
                        success: function (msg) {
                            if (msg.code === 0) {
                                alert('提交成功!');
                            } else {
                                alert('提交失败');
                            }
                        }
                    });
                } else{
                    setTimeout(function(){$('.alarm').removeClass('alarm');},2000);
                }
            },
            /**
             * 设置时间插件
             * @method
             * @param
             * @return
             */
            time: function () {
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
                $('.startTime').datetimepicker(timerole).on('hide', function (ev) {
                    self.startTime = $(".startTime").val();
                }).on("changeDate", function (ev) {
                    if (ev.date) {
                        $(".correctBegin").datetimepicker('setStartDate', new Date(ev.date.valueOf()));
                        $(".correctEnd").datetimepicker('setStartDate', new Date(ev.date.valueOf()));
                    } else {
                        $(".correctBegin").datetimepicker('setStartDate', null);
                        $(".correctEnd").datetimepicker('setStartDate', null);
                    }
                });
                $('.correctBegin').datetimepicker(timerole).on('hide', function (ev) {
                    self.correctBegin = $(".correctBegin").val();
                }).on("changeDate", function (ev) {
                    if (ev.date) {
                        $(".correctEnd").datetimepicker('setStartDate', new Date(ev.date.valueOf()));
                    } else {
                        $(".correctEnd").datetimepicker('setStartDate', null);
                    }
                });
                $('.correctEnd').datetimepicker(timerole).on('hide', function (ev) {
                    self.correctEnd = $(".correctEnd").val();
                }).on("changeDate", function (ev) {
                    if (ev.date) {
                        $(".correctBegin").datetimepicker('setStartDate', new Date(ev.date.valueOf()));
                    } else {
                        $(".correctBegin").datetimepicker('setStartDate', null);
                    }
                });
            },
            /**
             * 获取监考人、审核人、阅卷人
             * @method
             * @param
             * @return
             */
            load: function () {
                var teacher = [{teacherID: '010101',teacherName:'张三'},{teacherID: '010102',teacherName:'张死'},{teacherID: '010103',teacherName:'张无'}]
                teacher.forEach(function (t) {
                    self.correctorList.push(t);
                });
                teacher.forEach(function (t) {
                    self.examinerList.push(t);
                });
                teacher.forEach(function (t) {
                    self.auditorList.push(t);
                });
                //监考人
                self.examinerList= [];
                $.ajax({
                    type: 'post',
                    url: '/exam/loadMonitor',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: '',
                    success: function(msg) {
                        if (msg.code === 0) {
                            msg.result.forEach(function (t) {
                                self.examinerList.push(t);
                            });
                        } else {
                            alert('加载失败失败');
                        }
                    }
                });
                //审核人
                self.auditorList= [];
                $.ajax({
                    type: 'post',
                    url: '/exam/loadAuditor',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: '',
                    success: function(msg) {
                        if (msg.code === 0) {
                            msg.result.forEach(function (t) {
                                self.auditorList.push(t);
                            });
                        } else {
                            alert('加载失败失败');
                        }
                    }
                });
                //阅卷人
                self.correctorList= [];
                $.ajax({
                    type: 'post',
                    url: '/exam/loadCorrector',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: '',
                    success: function(msg) {
                        if (msg.code === 0) {
                            msg.result.forEach(function (t) {
                                self.correctorList.push(t);
                                self.corrector.push(t.teacherID);
                            });
                        } else {
                            alert('加载失败失败');
                        }
                    }
                });
            },
            /**
             * 考试编辑、填充当前页面
             * @method
             * @param {Object} exam 考试内容
             * @return
             */
            fill: function (exam) {
                self.examID = exam.examID;
                self.examName = exam.examName;
                self.examClassify = ''+exam.examClassify;
                self.examAttention = exam.examAttention;
                self.answerType = ''+exam.answerType;
                self.scoreType = ''+exam.scoreType;
                self.duration = +exam.duration/60000+'';
                self.startTime = self.unixToTime(+exam.startTime);
                self.clockStyle = ''+exam.clockStyle;
                self.late = exam.late;
                self.disorder = exam.disorder;
                self.fullScreen = exam.fullScreen;
                self.isScore = exam.isScore;
                self.isPaper = exam.isPaper;
                self.rightMouseButtonDisable = exam.rightMouseButtonDisable;
                self.isRank = exam.isRank;
                self.examiner = exam.monitor[0].monitorID;
                self.auditor = exam.auditor[0].auditorID;
                exam.corrector.forEach(function (t) { self.corrector.push(t.correctorID); });
                self.correctBegin =self.unixToTime(+exam.correctBegin);
                self.correctEnd = self.unixToTime(+exam.correctEnd);
                exam.paper.forEach(function (t) { self.paper.push(t.paperID); });
                self.selectPaperList = exam.paper;
                self.group = exam.group.groupID;
                self.selectGroupList = [exam.group];
                self.questionDistribute = exam.questionDistribute;
            },
            /**
             * unix时间戳转换为时间
             * @method
             * @param {String} value 获取试题状态
             * @return
             */
            unixToTime: function (time) {
                //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var date = new Date(time);
                return date.getFullYear() + '-' +(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
            },
            dlePaper: function (index) {
                self.paper.splice(index,1);
                self.questionDistribute.splice(index,1);
                self.selectPaperList.splice(index,1);
            }
        },
        filters : {
            numToBoolean: function (value) {
                return value == '1' ? true : false;
            }
        },
        components: {
            selectPaper: paperManage
        },
        mounted: function () {
            self.time();
            self.load();
            //考试编辑激活本组件
            if( JSON.stringify(this.examInfo) != '{}') {
                self.fill(self.examInfo);
            }
        }
    }
});





