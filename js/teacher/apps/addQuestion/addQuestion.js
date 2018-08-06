/**
 * @author Guo Yuchun
 * @date   2018/3/4
 * @Description: 添加试题组件、试题编辑复用、
 **/
'use strict';

require(['less!addQuestionStyle']);

define([
    'text!addQuestionView',
    'vue'
],function (
    _view,
    vue
) {
    var self;
    return {
        template: _view,
        /**
         * 属性说明
         * @property
         * {Boolean} isChoiceActive 是否显示选择题试题内容
         * {Boolean} isQuestionsActive 是否显示简答题试题内容
         * {String} knowledge 知识点
         * {String} difficulty 难度系数
         * {Int} type 题目类型
         * {Boolean} share 是否共享
         * {String} stem 试题描述
         * {Array} option 选项
         * {Array} standardAnswer 标准答案
         * {String} parsing 答案解析
         */
        data: function () {
            self = this;
            return {
                isChoiceActive: true,
                isQuestionsActive: false,
                question: {
                    knowledge: '',
                    difficulty: '',
                    type: '',
                    share: 0,
                    stem: '',
                    option: ['','','',''],
                    standardAnswer: [],
                    parsing: ''
                }
            };
        },
        /**
         * 父组件获取属性说明
         * @property
         * {Object} questionInfo 试题信息
         */
        props: {
            questionInfo: {
                type: Object,
                default: {
                    pic: '111'
                }
            }
        },
        methods: {
            /**
             * 选择题、简答题切换试题答案部分
             * @method
             * @param
             * @return
             */
            changeType: function (event) {
                if($(event.target).val() === '4' || $(event.target).val() === '5' || $(event.target).val() === '6' || $(event.target).val() === '7' || $(event.target).val() === '8') {
                    this.isQuestionsActive = true;
                    this.isChoiceActive = false;
                } else {
                    this.isQuestionsActive = false;
                    this.isChoiceActive = true;
                }
            },
            /**
             * 删除选项
             * @method
             * @param {Int} index 下标
             * @return
             */
            deleteChoice: function (index) {
                this.question.option.splice(+index,1);
            },
            /**
             * 增加选项
             * @method
             * @param
             * @return
             */
            addChoice: function () {
                this.question.option.push('');
            },
            /**
             * 必填信息校验
             * @method
             * @param {Boolean} isChoiceActive 是否激活选择题模式
             * @return {Boolean} flag 是否成功
             */
            neceCheck: function (isChoiceActive) {
                var flag = true;
                for (var key in this.question) {
                    if(this.question[key] === '' || this.question[key].length == 0) {
                        $('.'+key).addClass('alarm');
                        flag = false;
                    }
                    //option数组非空校验
                    if(key === 'option' && isChoiceActive) {
                        var options = $('.option');
                        for (var index in options) {
                            if (options.eq(index).val() === '') {
                                options.eq(index).addClass('alarm');
                                flag = false;
                            }
                        }
                    }
                    //选择题类型、正确答案非空校验
                    if(key === 'standardAnswer'&& this.question[key].length == 0 && isChoiceActive) {
                        alert('请选择正确答案!');
                    }
                }
                //2秒后去除警告
                setTimeout(function(){$('.alarm').removeClass('alarm');},2000);
                return flag;
            },
            /**
             * 提交保存
             * @method
             * @param
             * @return
             */
            save: function () {
                //必须填写校验
                if(this.neceCheck(this.isChoiceActive)) {
                    //将VUE对象转化为普通对象、后期拼接字符串不影响页面显示
                    var  file = $('input[type="file"]');
                    var formData = new FormData();
                    formData.append(file[0].name, file[0].files[0]);
                    var datapara = JSON.parse(JSON.stringify(this.question));
                    datapara.share = datapara.share === true ? 1:0;
                    //选择题拼凑选项字符串{1.选项一%%%2.选项二%%%3.选项三}、正确答案字符串{1%2%3}
                    if(this.isChoiceActive) {
                        var optionString = '';
                        for (var index in this.question.option) {
                            optionString += (+index+1)+'.'+datapara.option[index]+'%%%';
                        }
                        optionString = optionString.substr(0, optionString.lastIndexOf('%%%'));
                        datapara.option = optionString;
                        datapara.standardAnswer= datapara.standardAnswer.join('%');
                    } else {
                        //简答题删除选项属性
                        delete datapara.option;
                    }
                    for(var key in datapara) {
                        formData.append(key, datapara[key]);
                    }
                    $.ajax({
                        type: 'post',
                        url: '/question/addQuestion',
                        data: formData,
                        contentType:"application/json;charset=utf-8",
                        dataType:'json',
                        success: function(msg) {
                            if (msg.code === 0) {
                                //清空页面数据
                                self.isChoiceActive = true;
                                self.isQuestionsActive = false;
                                self.question = {
                                    knowledge: '',
                                    difficulty: '',
                                    type: 0,
                                    share: 0,
                                    stem: '',
                                    option: ['','','',''],
                                    standardAnswer: [],
                                    parsing: ''
                                };
                            } else {
                                alert('添加失败!');
                            }
                        }
                    });
                } else {
                    alert('请填写必填项目!');
                }
            },
            /**
             * 试题编辑、填充当前页面
             * @method
             * @param {Object} question 试题内容
             * @return
             */
            fill: function (question) {
                self.question.knowledge = question.knowledge;
                self.question.difficulty = question.difficulty;
                self.question.type = question.type;
                self.question.share = question.share  == 1 ? true:false;
                self.question.stem = question.stem;
                self.question.parsing = question.parsing;
                if(question.type == 4 || question.type == 5 || question.type == 6 || question.type == 7 || question.type == 8 ){
                    self.isQuestionsActive = true;
                    self.isChoiceActive = false;
                    self.question.standardAnswer = question.standardAnswer;
                } else {
                    //选项、正确答案字符串解码为数组格式
                    self.question.standardAnswer = question.standardAnswer.split('%');
                    self.question.option = [];
                    question.option.split('%%%').forEach(function (element) {
                        //forEach中this不再指向当前Vue对象
                        self.question.option.push(element.substr(+element.indexOf('.')+1));
                    });
                }
            },
            /**
             * 取消操作，跳转至首页
             * @method
             * @param
             * @return
             */
            cancle: function () {
                this.$emit('showHomePage');
            }
        },
        filters: {
            /**
             * 将获取的文件路径中文件名提取出来
             * @method
             * @param
             * @return
             */
            getFileName: function (value) {
                if( JSON.stringify(this.questionInfo) != '{}') {
                    var fileName = ''
                    value.split('_').forEach(function (t, index) {
                        if (index > 1) {
                            fileName += t;
                        }
                    });
                    return fileName.substring(0, fileName.length - 2);
                } else {
                    return;
                }
            },
        },
        mounted: function () {
            //试题编辑激活本组件
            if( JSON.stringify(this.questionInfo) != '{}') {
                self.fill(self.questionInfo);
            }

        }
    }

});

