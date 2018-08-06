/**
 * @author Guo Yuchun
 * @date   2018/3/4
 * @Description: 教师端主页面、左侧导航切换组件
 **/
'use strict';

require(['less!TeacherappStyle']);
require(['css!treeviewCss']);

define([
    'text!TeacherappView',
    'treeview',
    'vue',
    'addQuestion',
    'questionManage',
    'addPaper',
    'paperManage',
    'groupManage',
    'addExam',
    'examManage',
    'examinePaper',
    'examScore',
    'homePage'
], function(
    _view,
    treeview,
    vue,
    addQuestion,
    questionManage,
    addPaper,
    paperManage,
    groupManage,
    addExam,
    examManage,
    examinePaper,
    examScore,
    homePage
) {
    var self =this;
    var app = new vue({
        el: '#component',
        template:_view,
        /**
         * 属性说明
         * @property
         * {String} activeApp 当前激活组件
         * {Object} questionInfo 试题信息
         * {Object} paperInfo 试卷信息
         * {Object} examInfo 考试信息
         */
        data:{
            activeApp:'homePage',
            questionInfo: {},
            paperInfo: {},
            examInfo: {}
        },
        methods:{
            /**
             * 切换组件
             * @method
             * @param {String} component 组件名称
             * @return
             */
            changeComponent: function (component) {
                this.activeApp = component;
                //侧边导航激活添加试题组件、父组件传递属性清空
                this.questionInfo = {};
                this.paperInfo = {};
                this.examInfo = {};
            },
            /**
             * 加载左侧导航栏--treeview
             * @method
             * @param
             * @return
             */
            loadTree: function () {
                /**
                 * treeview节点自定义属性
                 * @property {String} component 对应组件
                 * @property {Number} deep 深度
                 */
                var tree = [
                    {
                        text:'首页',
                        icon: "glyphicon glyphicon-home",
                        component:'homePage',
                        deep:1,
                        href: ''
                    },
                    {
                        text: '试题',
                        icon: "glyphicon glyphicon-question-sign",
                        deep:1,
                        href: '',
                        nodes:[
                            {
                                text:'添加试题',
                                icon: "glyphicon glyphicon-open",
                                component:'addQuestion',
                                deep:2,
                                href:''
                            },
                            {
                                text:'试题管理',
                                icon: "glyphicon glyphicon-th-list",
                                component:'questionManage',
                                deep:2,
                                href:''
                            }
                        ]
                    },
                    {
                        text: '试卷',
                        icon: "glyphicon glyphicon-list-alt",
                        deep:1,
                        href: '',
                        nodes:[
                            {
                                text:'添加试卷',
                                icon: "glyphicon glyphicon-open",
                                component:'addPaper',
                                deep:2,
                                href:''
                            },
                            {
                                text:'试卷管理',
                                icon: "glyphicon glyphicon-th-list",
                                component:'paperManage',
                                deep:2,
                                href:''
                            }
                        ]
                    },
                    {
                        text: '考试',
                        icon: "glyphicon glyphicon-pencil",
                        href: '',
                        deep:1,
                        nodes:[
                            {
                                text:'添加考试',
                                icon: "glyphicon glyphicon-open",
                                component:'addExam',
                                deep:2,
                                href:''
                            },
                            {
                                text:'考试管理',
                                icon: "glyphicon glyphicon-th-list",
                                component:'examManage',
                                deep:2,
                                href:''
                            },
                            {
                                text:'考试成绩',
                                icon: "glyphicon glyphicon-th-list",
                                component:'examScore',
                                deep:2,
                                href:''
                            }
                        ]
                    },
                    {
                        text: '评卷',
                        icon: "glyphicon glyphicon-user",
                        href: '',
                        deep:1,
                        nodes:[
                            {
                                text:'人工评阅',
                                icon: "glyphicon glyphicon-th-list",
                                component:'examinePaper',
                                deep:2,
                                href:''
                            }
                        ]
                    },
                    {
                        text: '用户/组',
                        icon: "glyphicon glyphicon-user",
                        href: '',
                        deep:1,
                        nodes:[
                            {
                                text:'组管理',
                                icon: "glyphicon glyphicon-th-list",
                                component:'groupManage',
                                deep:2,
                                href:''
                            }
                        ]
                    },
                    {
                        text: '管理',
                        icon: "glyphicon glyphicon-user",
                        href: '',
                        deep:1,
                        nodes:[
                            {
                                text:'平台管理',
                                icon: "glyphicon glyphicon-th-list",
                                component:'manage',
                                deep:2,
                                href:''
                            }
                        ]
                    }
                ];
                //样式设置
                $('#treeview').treeview({
                    color: "#fff",
                    backColor: "#516272",
                    expandIcon:null,
                    collapseIcon:null,
                    emptyIcon:null,
                    onhoverColor: "#20A8D8",
                    borderColor: "#263238",
                    showBorder: false,
                    showTags: false,
                    highlightSelected: true,
                    selectedColor: "#fff",
                    selectedBackColor: "#20A8D8",
                    enableLinks:false,
                    data: tree,
                    levels: 1
                });
                //左侧导航点击事件响应
                $('#treeview').on('nodeSelected', function(event,node) {
                    var nodeid = $(node)[0].nodeId;
                    var tree = $('#treeview');
                    if($(node)[0].component === 'homePage'){
                        self.changeComponent('homePage');
                    }
                    //点击第一层节点，展开或折叠子树
                    if($(node)[0].deep === 1){
                        if(node.state.expanded){
                            //处于展开状态则折叠
                            tree.treeview('collapseNode', nodeid);
                        } else {
                            //处于折叠状态则展开
                            tree.treeview('expandNode', nodeid);
                        }
                        tree.treeview('unselectNode', nodeid);
                    }
                    //点击第二层节点，切换组件
                    else if($(node)[0].deep === 2){
                        //管理端跳转
                        if($(node)[0].component === 'manage'){
                            window.location.href= '/auditor/toAuditMainPage';
                        }
                        self.changeComponent($(node)[0].component);
                    }
                });
            },
            /**
             * 监听试题管理组件下试题编辑事件、获取需编辑的试题信息、切换添加试题组件
             * @method
             * @param {Object} question 试题信息
             * @return
             */
            QuestionModify: function (question) {
                this.questionInfo = question;
                this.activeApp = addQuestion;
            },
            /**
             * 监听试卷管理组件下试卷编辑事件、获取需编辑的试卷信息、切换添加试卷组件
             * @method
             * @param {Object} paper 试卷信息
             * @return
             */
            papermodify: function (paper) {
                this.paperInfo = paper;
                this.activeApp = addPaper;
            },
            /**
             * 监听子组件中激活主页组件事件
             * @method
             * @param
             * @return
             */
            showHomePage: function () {
                self.changeComponent('homePage');
                var nodeId = $('#treeview').treeview('getSelected')[0];
                $('#treeview').treeview('toggleNodeSelected', [ nodeId, { silent: true } ]);
            },
            /**
             * 监听考试管理组件考试编辑事件、获取需编辑的考试信息、切换添加考试组件
             * @method
             * @param {Number} index 试卷ID
             * @return
             */
            examModify: function (exam) {
                //获取考试信息
                $.ajax({
                    type: 'post',
                    url: '/exam/loadModifyExam',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: JSON.stringify({examID:exam.examID }),
                    success: function(msg) {
                        if (msg.code === 0) {
                            self.examInfo = msg.result;
                            self.activeApp = addExam;
                        } else {
                            alert('加载失败');
                        }
                    }
                });
            },
            /**
             * 退出
             * @method
             * @param {Number} index 试卷ID
             * @return
             */
            back: function () {
                $.ajax({
                    type: "post",
                    url: "/login/exitLogin",
                    contentType: "application/json;charset=utf-8",
                    dataType: 'json',
                    success: function (backData) {
                        if(backData.code > 0) {
                            alert(backData.message)
                        } else {
                            window.location.href = "/login/enterLoginPage";
                        }
                    }
                });
            },
            load: function () {
                $.ajax({
                    type:"post",
                    url: '/login/getRealName',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    success:function (backData) {
                        if (backData.code > 0) {
                            alert(backData.message);
                        }
                        else {
                            $('.navbar p').append('<span class="userName">' + backData.result.realName + '</span>');
                        }
                    }
                })
            }
        },
        components:{
            homePage:homePage,
            addQuestion: addQuestion,
            questionManage: questionManage,
            addPaper: addPaper,
            paperManage: paperManage,
            groupManage: groupManage,
            addExam: addExam,
            examManage: examManage,
            examinePaper: examinePaper,
            examScore: examScore
        },
        mounted:function () {
            //self指向当前vue对象
            self = this;
            self.loadTree();
            //self.changeComponent('homePage');
            self.load();
        }
    });
});