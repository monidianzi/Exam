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
    'addPaper'
], function(
    _view,
    treeview,
    vue,
    addQuestion,
    questionManage,
    addPaper
) {
    var self;
    var app = new vue({
        el: '#component',
        template:_view,
        /**
         * 属性说明
         * @property
         * {String} activeApp 当前激活组件
         * {String} questionID 试题ID（试题管理组件-试题编辑事件获取ID）
         */
        data:{
            activeApp:'main',
            questionInfo: {}
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
                //侧边导航激活添加试题组件、父组件传递属性试题ID清空
                this.questionInfo = {};
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
                        component:'main',
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
                                component:'papermanage',
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
                                component:'main',
                                deep:2,
                                href:''
                            },
                            {
                                text:'考试管理',
                                icon: "glyphicon glyphicon-th-list",
                                component:'main',
                                deep:2,
                                href:''
                            }
                        ]
                    },
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
                    levels: 2
                });
                //左侧导航点击事件响应
                $('#treeview').on('nodeSelected', function(event,node) {
                    var nodeid = $(node)[0].nodeId;
                    var tree = $('#treeview');
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
                        self.changeComponent($(node)[0].component);
                    }
                });
            },
            /**
             * 监听试题管理组件下试题编辑事件、获取需编辑的试题ID、切换激活组件
             * @method
             * @param {Object} question 试题信息
             * @return
             */
            QuestionModify: function (question) {
                this.questionInfo = question;
                this.activeApp = addQuestion;
            }

        },
        components:{
            addQuestion: addQuestion,
            questionManage:questionManage,
            addPaper: addPaper
        },
        mounted:function () {
            //self指向当前vue对象
            self = this;
            self.loadTree();
        }
    });
});