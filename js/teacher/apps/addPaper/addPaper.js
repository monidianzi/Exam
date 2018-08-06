/**
 * @author Guo Yuchun
 * @date   2018/3/17
 * @Description: 添加试卷组件
 */
'use strict';

require(['less!addPaperStyle']);

define([
    'text!addPaperView',
    'bootstrap',
    'questionManage',
    'paperPreview',
    'vue'
], function (
    _view,
    bootstrap,
    questionManage,
    paperPreview,
    vue
) {
    var self ;
    return {
        template: _view,
        /**
         * 属性说明
         * @property {String} paperName 试卷名称
         * @property {String} paperClassify 试卷分类（考试、练西）
         * @property {Number} score 总分
         * @property {Number} share 是否共享
         * @property {String} subject 科目
         * @property {Number} year 重复率限制年份
         * @property {Number} under 重复率限制百分比
         * @property {Array} question 试卷题目结构（大题题目、总分、包含小题内容及得分）
         * @property {Number} index 记录点击选择试题的大题下标
         * @property {Array} order 大题标号
         *
         * @property {Boolean} isQuesOperation 试题管理组件是否显示操作栏
         * @property {Boolean} isRate 是否显示重复率控制盒子
         * @property {Object} paperdetail 向试卷预览组件传递数据
         */
        data: function () {
            self= this
            return{

                paperName: '',
                paperClassify: '',
                // score: '',
                share: '',
                subject: '',
                year: '',
                under: '',
                question: [],
                index:'',
                order: ['一', '二','三','四','五','六','七','八','九'],
                isQuesOperation: false,
                isRate: false,
                paperdetail: {}
            }
        },
        /**
         * 父组件获取属性说明
         * @property
         * {Object} paperInfo 试卷信息
         */
        props: {
            paperInfo: {
                type: Object,
                default: {}
            }
        },
        methods:{
            /**
             * 重复率显示与隐藏
             * @method
             * @param {object} event 事件
             * @return
             */
            rateShow: function (event) {
                self.isRate = event.target.checked ? true:false ;
            },
            /**
             * 添加试题描述（大题）
             * @method
             * @param
             * @return
             */
            addQuesDescribe: function () {
                self.question.push({
                    titleDescribe:'',
                    score:'',
                    questionGroup:[]
                });
            },
            /**
             * 将试题管理组件回传的选择试题列表添加至question中
             * @method
             * @param {Array} questionList 选择的试题列表
             * @return
             */
            selectQuestion: function (questionList) {
                questionList.forEach(function (t) {
                    self.question[self.index].questionGroup.push(t);
                });
            },
            /**
             * 记录选择试题模态框所对应大题下标、打开模态框
             * @method
             * @param {Number} index 当前选择试题所对应大题下标
             * @return
             */
            openSelectQues: function (index) {
                self.index = index;
                $('.bs-example-modal-lg').modal('show');
            },
            /**
             * 必填信息校验
             * @method
             * @param
             * @return {Boolean} flag 是否成功
             */
            neceCheck: function () {
                var flag = true;
                //试卷名称
                if(!this.paperName.trim()) {
                    $('.paperName').addClass('alarm');
                    alert('请填写试卷名称！');
                    return false;
                }
                //试卷分类
                if(this.paperClassify !== '0' && this.paperClassify !== '1') {
                    $('.paperClassify').addClass('alarm');
                    alert('请选择试卷类型！');
                    return false;
                }
                //科目
                if(!this.subject.trim()) {
                    $('.subject').addClass('alarm');
                    alert('请填写科目！');
                    return false;
                }
                //试题描述
                if(this.question.length == 0){
                    alert('未添加试题描述！');
                    return false;
                } else {
                    this.question.forEach(function (t,index) {
                        if(!t.titleDescribe.trim()) {
                            alert('请填写第'+self.order[index]+'道大题试题名称！');
                            flag = false;
                            //此处return用于遍历中断
                            return false;
                        }
                        if(t.questionGroup.length == 0){
                            alert('第'+self.order[index]+'道大题未添加试题！');
                            flag = false;
                            return false;
                        }
                    });
                    $('.quesScore').each(function () {
                        if(!$(this).val()) {
                            alert('请填写试题分数！');
                            flag = false;
                            return false;
                        }
                        if(!(/(^[1-9]\d*$)/.test($(this).val()))) {
                            alert('请输入正整数！');
                            flag = false;
                            return false;
                        }
                    })
                    return flag;
                }
                //总分及题分总和
                return flag;
            },
            /**
             * 提交试卷数据
             * @method
             * @param
             * @return
             */
            savePaper: function () {
                if(this.neceCheck()) {
                    var datapara = JSON.parse(JSON.stringify(self.$data));
                    datapara.share = datapara.share === true ? 1 : 0;
                    datapara.score = self.score;
                    var toJSON = JSON.stringify(datapara);
                    alert(toJSON);
                    $.ajax({
                        type: 'post',
                        url: '/paper/addPaper',
                        data: toJSON,
                        contentType: "application/json;charset=utf-8",
                        dataType: 'json',
                        success: function (msg) {
                            if (msg.code === 0) {
                                alert('添加成功！');
                            } else {
                                alert('添加失败!');
                            }
                        }
                    });
                } else {
                    //2秒后去除警告
                    setTimeout(function(){$('.alarm').removeClass('alarm');},2000);
                }
            },
            /**
             * 输入为负数和小数，不予显示
             * @method
             * @param
             * @return
             */
            negativeBan: function (event) {
                if(event.keyCode == 45 || event.keyCode == 46){
                    event.preventDefault();
                }
            },
            /**
             * 关闭模态框、调用子组件方法清空子组件回传选择试题列表
             * @method
             * @param
             * @return
             */
            modalClose: function () {
                self.$refs.quesClean.cleanQues();
                $('.bs-example-modal-lg').modal('hide');
            },
            /**
             * 试卷编辑、填充当前页面
             * @method
             * @param {Object} paper 试题内容
             * @return
             */
            fill: function (paper) {
                self.paperName = paper.paperName;
                self.paperClassify = paper.paperClassify;
                self.score = paper.score;
                self.share = paper.share  == 1 ? true:false;
                self.subject = paper.subject;
                self.question = paper.question;
            },
            /**
             * 删除大题结构
             * @method
             * @param {Number} index 大题索引
             * @return
             */
            del: function (index) {
                self.question.splice(index,1);
            },
            /**
             * 删除小题结构
             * @method
             * @param {Number} index 大题索引
             * @param {Number} Qindex 小题索引
             * @return
             */
            Qdel: function (index,Qindex) {
                self.question[index].questionGroup.splice(Qindex,1);
            },
            /**
             * 试卷预览
             * @method
             * @param
             * @return
             */
            preview: function () {
                if(this.neceCheck()) {
                    self.paperdetail = JSON.parse(JSON.stringify(this.$data));
                    self.paperdetail.score = this.score;
                    self.paperdetail.founder = $('.userName').val();
                    $('#paperPre').modal('show');
                } else {
                    //2秒后去除警告
                    setTimeout(function(){$('.alarm').removeClass('alarm');},2000);
                }
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
        computed: {
            score: function () {
                var sum = 0;
                this.question.forEach(function (t) { sum += t.score; });
                return sum;
            }
        },
        watch: {
            question :{
                handler: function(){
                    this.question.forEach(function (t) {
                        var sum = 0;
                        t.questionGroup.forEach(function (e) {
                            sum+= +(e.score? e.score: 0);
                        });
                        t.score = sum;
                    })
                },
                deep: true
            }
        },
        components: {
            chooseQuestion: questionManage,
            paperPreview: paperPreview
        },
		    filters: {
            /**
             * unix时间戳转换为时间
             * @method
             * @param {String} value 获取试题状态
             * @return
             */
            unixToTime: function (value) {
                //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var date = new Date(+value);
                return date.getFullYear() + '-' +(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
            },
        },
        mounted: function () {
            //试题编辑激活本组件
            if( JSON.stringify(this.paperInfo) != '{}') {
                self.fill(self.paperInfo);
            }
        },
        created: function () {

        }
    };

})

