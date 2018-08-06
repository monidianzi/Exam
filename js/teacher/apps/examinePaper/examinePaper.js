/**
 * @author Guo Yuchun
 * @date   2018/5/9
 * @Description: 试卷阅览组件
 */

'use strict';
require(['less!examinePaperStyle']);

define([
    'text!examinePaperView'
],function (
    _view
) {
    var self;
    return {
        template: _view,
        data: function () {
            self = this;
            /**
             * 属性说明
             * @property {Object} search 搜索条件
             * @property {Array} examList 考试列表
             * @property {Array} studentGroup 考生列表
             * @property {Array} questionInfo 批阅试题列表
             * @property {Number} index 当前批阅学生索引记录
             */
            return {
                search: {
                    examName: '',
                    group: ''
                },
                examList:[],
                studentGroup: [],
                questionInfo: [],
                index: 0
            }
        },
        methods: {
            /**
             * 加载当前教师需要评阅考试列表
             * @method
             * @param
             * @return
             */
            load: function () {
                self.examList = [];
                var msg = [
                    {
                        examID: '101',
                        examName: '测试用',
                        startTime: 170000000000,
                        correctBegin: 170000000000,
                        correctEnd: 170000000000,
                        groupName: '测试组'
                    }
                ];
                msg.forEach(function (t) { self.examList.push(t); });
                $.ajax({
                    type: 'post',
                    url: '/exam/loadExamGrade',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            msg.result.exam.forEach(function (t) { self.examList.push(t); });
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            },
            /**
             * 当前选择考试、打开模态框、渲染考生列表、第一位考生试题列表
             * @method
             * @param {Number} index 当前选择考试索引、以获取考试ID
             * @return
             */
            examineModal: function (index) {
				        self.studentGroup = [];
                self.questionInfo = [];
                var msg = {
                    studentGroup: [
                        {studentID:'',sceqIDGroup:[]},
                        {studentID:'',sceqIDGroup:[]},
                        {studentID:'',sceqIDGroup:[]},
                        {studentID:'',sceqIDGroup:[]},
                        {studentID:'',sceqIDGroup:[]},
                        {studentID:'',sceqIDGroup:[]},
                        {studentID:'',sceqIDGroup:[]}

                    ],
                    questionInfo: [
                        {"questionID":99,"type":4,"auditStatus":0,"stem":"软件测试","knowledge":"软件测试","difficulty":1,"lastUpdate":"1526724440896","option":" ","standardAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。","parsing":"软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据","share":0,"founder":"abc","studentAnswer":"1",},
                        {"sceqID":153,"stem":"软件测试的目的是（     ）。","type":0,"option":"1.试验性运行软件%%%2.发现软件错误%%%3.证明软件正确%%%4.找出软件中全部错误","standardAnswer":"2","studentAnswer":"2","parsing":"B","score":1},
                        {"sceqID":154,"stem":"软件测试中白盒法是通过分析程序的（     ）来设计测试用例的。","type":0,"option":"1.应用范围%%%2.内部逻辑%%%3.功能%%%4.输入数据","standardAnswer":"2","studentAnswer":"2","parsing":"B","score":1},
                        {"questionID":99,"type":4,"auditStatus":0,"stem":"软件测试","knowledge":"软件测试","difficulty":1,"lastUpdate":"1526724440896","option":" ",
                            "standardAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。",
                            "parsing":"软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据",
                            "share":0,"founder":"abc","studentAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。"},
                        {"questionID":99,"type":4,"auditStatus":0,"stem":"软件测试","knowledge":"软件测试","difficulty":1,"lastUpdate":"1526724440896","option":" ",
                            "parsing":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。",
                            "standardAnswer":"软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据",
                            "share":0,"founder":"abc","studentAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。"}

                    ]
                }
                self.studentGroup = msg.studentGroup;
                self.questionInfo = msg.questionInfo;
                $('.student').removeClass('active');
                $('.student').eq(0).addClass('active');
                self.questionInfo.forEach(function (t) {
                    if(t.type == 1 || t.type == 0) {
                        t.studentScore = t.studentAnswer == t.standardAnswer ? t.score : 0;
                    }
                });
                $('#examineModal').modal('show');
                $('#examineModal').on('shown.bs.modal', function (e) {
                    // $('.quesLeft').each(function (index) {
                    //     if($('.quesRight').eq(index).height()-$(this).height() >= 0) {
                    //         $(this).css('marginBottom',$('.quesRight').eq(index).height()-$(this).height()+20);
                    //     } else {
                    //         $('.quesRight').eq(index).css('marginBottom',Math.abs($('.quesRight').eq(index).height()-$(this).height())+20);
                    //     }
                    // });
                    $('.student').removeClass('active');
                    $('.student').eq(0).addClass('active');
                });
                $.ajax({
                    type: 'post',
                    url: '/exam/correctPaper',
                    contentType:"application/json;charset=utf-8",
                    data: JSON.stringify({examID:self.examList[index].examID}),
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            self.index=0;
                            self.studentGroup = msg.result.studentGroup;
                            self.questionInfo = msg.result.questionInfo;
                            $('#examineModal').modal('show');
                            $('#examineModal').on('shown.bs.modal', function (e) {
                                // //学生答案和标准答案面板高度一致
                                // $('.quesLeft').each(function (index) {
                                //     if($('.quesRight').eq(index).height()-$(this).height() >= 0) {
                                //         $(this).css('marginBottom',$('.quesRight').eq(index).height()-$(this).height()+20);
                                //     } else {
                                //         $('.quesRight').eq(index).css('marginBottom',Math.abs($('.quesRight').eq(index).height()-$(this).height())+20);
                                //     }
                                // });
                                //初次打开、显示第一位学生、标签高亮
                                $('.student').removeClass('active');
                                $('.student').eq(0).addClass('active');
                            });
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            },
            /**
             * 检索
             * @method
             * @param
             * @return
             */
            goSearch: function () {
                self.examList = [];
                $.ajax({
                    type: 'post',
                    url: '',
                    contentType:"application/json;charset=utf-8",
                    dataType:JSON.stringify(self.search),
                    success: function(msg) {
                        if (msg.code === 0) {
                            msg.result.forEach(function (t) { self.examList.push(t); });
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
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
                    group: ''
                };
            },
            /**
             * 关闭模态框
             * @method
             * @param
             * @return
             */
            examineModalclose: function () {
                $('#examineModal').modal('hide');
            },
            /**
             * 保存当前学生得分情况、并获取下位学生试题列表信息
             * @method
             * @param
             * @return
             */
            saveExamine: function () {
                self.questionInfo.forEach(function (t) {
                    if(t.type == 1 || t.type == 0) {
                        t.studentScore = t.studentAnswer == t.standardAnswer ? t.score : 0;
                    }
                });
                //考生最后一位判断、sceqNextList发送为undefined、后端处理返回code
                $.ajax({
                    type: 'post',
                    url: '/exam/savaCorrectRecord',
                    contentType:"application/json;charset=utf-8",
                    data: JSON.stringify({correctRecord:self.questionInfo,sceqNextList:self.studentGroup[+self.index+1].sceqIDGroup}),
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            //self.studentGroup = msg.result.studentGroup;
                            self.questionInfo = [];
                            self.questionInfo = msg.result.questionInfo;
                            // $('#examineModal').on('shown.bs.modal', function (e) {
                            //     $('.quesLeft').each(function (index) {
                            //         if($('.quesRight').eq(index).height()-$(this).height() >= 0) {
                            //             $(this).css('marginBottom',$('.quesRight').eq(index).height()-$(this).height()+20);
                            //         } else {
                            //             $('.quesRight').eq(index).css('marginBottom',Math.abs($('.quesRight').eq(index).height()-$(this).height())+20);
                            //         }
                            //     });
                            // });
                            //记录下一位考生下标索引、点击下一位时获取该学生试题sceqList
                            self.index = +self.index+1;
                            $('.student').eq(self.index).parents('.modal-body').find('.student').removeClass('active');
                            $('.student').eq(self.index).addClass('active');
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            },
            /**
             * 点击学生列表序号，跳转
             * @method
             * @param
             * @return
             */
            getQues: function (index) {
                // alert(index);
                // $('.student').eq(index).parents('.modal-body').find('.student').removeClass('active')
                // $('.student').eq(index).addClass('active');
                // self.index = +index;
                var questionInfo = [
                    {"questionID":99,"type":4,"auditStatus":0,"stem":"软件测试","knowledge":"软件测试","difficulty":1,"lastUpdate":"1526724440896","option":" ","standardAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程。的过程。它的目标现软件中的可能多地发现软件中存在的错误，将测试结果作为纠错的依据","share":0,"founder":"abc","studentAnswer":"1",},
                    {"sceqID":153,"stem":"软件测试的目的是（     ）。","type":0,"option":"1.试验性运行软件%%%2.发现软件错误%%%3.证明软件正确%%%4.找出软件中全部错误","standardAnswer":"2","studentAnswer":"2","parsing":"B","score":1},
                    {"sceqID":154,"stem":"软件测试中白盒法是通过分析程序的（     ）来设计测试用例的。","type":0,"option":"1.应用范围%%%2.内部逻辑%%%3.功能%%%4.输入数据","standardAnswer":"2","studentAnswer":"2","parsing":"B","score":1},
                    {"questionID":99,"type":4,"auditStatus":0,"stem":"软件测试","knowledge":"软件测试","difficulty":1,"lastUpdate":"1526724440896","option":" ",
                        "standardAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。",
                        "parsing":"软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据",
                        "share":0,"founder":"abc","studentAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。"},
                    {"questionID":99,"type":4,"auditStatus":0,"stem":"软件测试","knowledge":"软件测试","difficulty":1,"lastUpdate":"1526724440896","option":" ",
                        "parsing":"。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。",
                        "standardAnswer":"软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据",
                        "share":0,"founder":"abc","studentAnswer":"。软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程软件测试指为了发现软件中的错误而执行软件的过程。它的目标是尽可能多地发现软件中存在的错误，将测试结果作为纠错的依据。"}

                ];
                    self.questionInfo = [];
                self.questionInfo = questionInfo;
                // $('#examineModal').on('shown.bs.modal', function (e) {
                //     $('.quesLeft').each(function (index) {
                //         if($('.quesRight').eq(index).height()-$(this).height() >= 0) {
                //             $(this).css('marginBottom',$('.quesRight').eq(index).height()-$(this).height()+20);
                //         } else {
                //             $('.quesRight').eq(index).css('marginBottom',Math.abs($('.quesRight').eq(index).height()-$(this).height())+20);
                //         }
                //     });
                // });
                self.questionInfo.forEach(function (t) {
                    if(t.type == 1 || t.type == 0) {
                        t.studentScore = t.studentAnswer == t.standardAnswer ? t.score : 0;
                    }
                });
                //高亮当前点击学生标签
                $('.student').eq(index).parents('.modal-body').find('.student').removeClass('active');
                $('.student').eq(index).addClass('active');
                self.index = +index;
                $.ajax({
                    type: 'post',
                    url: '/exam/nextStudent',
                    contentType:"application/json;charset=utf-8",
                    data: JSON.stringify(self.studentGroup[index].sceqIDGroup),
                    dataType:'json',
                    success: function(msg) {
                        if (msg.code === 0) {
                            //self.studentGroup = msg.result.studentGroup;
                            self.questionInfo = [];
                            self.questionInfo = msg.result.questionInfo;
                            // $('#examineModal').on('shown.bs.modal', function (e) {
                            //     $('.quesLeft').each(function (index) {
                            //         if($('.quesRight').eq(index).height()-$(this).height() >= 0) {
                            //             $(this).css('marginBottom',$('.quesRight').eq(index).height()-$(this).height()+20);
                            //         } else {
                            //             $('.quesRight').eq(index).css('marginBottom',Math.abs($('.quesRight').eq(index).height()-$(this).height())+20);
                            //         }
                            //     });
                            // });
                            //高亮当前点击学生标签
                            $('.student').eq(index).parents('.modal-body').find('.student').removeClass('active');
                            $('.student').eq(index).addClass('active');
                            self.index = +index;
                        } else {
                            alert('加载失败!');
                        }
                    }
                });
            }
        },
        filters : {
            numToChar: function (value,type) {
                var answer = '';
                if(typeof(value) == undefined){
                    return answer;
                }else {
                    console.log(value + "  "+type);
                    if(type==0) {
                        answer = String.fromCharCode(+value+64);
                    } else if(type==1){
                        value.split('%').forEach(function (t) { answer += String.fromCharCode(+t+64);})
                    }else {
                        answer = value;
                    }
                    return answer;
                }
            },
            numToUppCase: function (value) {
                var order = ['一', '二','三','四','五','六','七','八','九'];
                return order[value];
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
        },
        mounted: function () {
            self.load();
        }
    }
});