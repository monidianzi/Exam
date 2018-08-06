/**
 * @author Guo Yuchun
 * @date   2018/4/17
 * @Description: 组管理组件
 */
'use strict';

require(['less!groupManageStyle']);

define([
    'text!groupManageView',
    'vue',
],function (
    _view,
    vue
) {
    var self;
    return {
        template: _view,
        /**
         * 属性说明
         * @property {Array} myGroup 我的组集合
         * @property {Array} groupStudentList 组内学生集合
         * @property {Array} group 组内StudentID集合
         * @property {Array} groupName 组名称
         * @property {Array} groupID 当前组ID
         */
        data: function () {
            self= this;
            return {
                myGroup: [],
                groupStudentList: [],
                group:[],
                groupName: '',
                groupID: '',
                isCreat: false
            }
        },
        methods: {
            /**
             * 获取当前节点所有子节点
             * @method
             * @param {Object} node 当前节点
             * @return {Array} 子节点(包含儿子节点、孙子节点等等)集合
             */
            getChildNodeIdArr: function(node){
                var ts = [];
                //如果当前节点包含子节点、则添加当前节点至ts、并递归调用本函数、继续遍历子节点
                if (node.nodes) {
                    for (var x in node.nodes) {
                        //将子节点添加进ts
                        ts.push(node.nodes[x].nodeId);
                        if (node.nodes[x].nodes) {
                            var getNodeIterator = self.getChildNodeIdArr(node.nodes[x]);
                            for (var j in getNodeIterator) {
                                ts.push(getNodeIterator[j]);
                            }
                        }
                    }
                } else {
                    ts.push(node.nodeId);
                }
                return ts;
            },
            /**
             * 设置机构专业班级学生树
             * @method
             * @param {Object} tree 树节点数据
             * @return
             */
            setInstitueTree: function(tree){
                $('#institueTree').treeview({
                    data: tree,
                    showIcon: false,
                    showCheckbox: true,
                    levels: 1,
                    showBorder: false,
                    onhoverColor: "#fff",
                    selectedColor: "#fff",
                    highlightSelected: false,
                    //节点被勾选，则其子节点也全部被勾选
                    onNodeChecked: function(event, node) {
                        //获取所有子节点集合
                        var selectNodes = self.getChildNodeIdArr(node);
                        if (selectNodes) {
                            //设置为勾选状态
                            $('#institueTree').treeview('checkNode', [selectNodes, { silent: true }]);
                        }
                    },
                    //节点被反选、则其所有子节点也被反选
                    onNodeUnchecked: function(event, node) {
                        var selectNodes = self.getChildNodeIdArr(node);
                        if (selectNodes) {
                            //设置所有子节点为反选状态
                            $('#institueTree').treeview('uncheckNode', [selectNodes, { silent: true }]);
                        }
                    },
                    //点击节点、展开下级节点、若已展开、则折叠
                    onNodeSelected: function (event,node) {
                        var nodeid = $(node)[0].nodeId;
                        var tree = $('#institueTree');
                        if(node.state.expanded){
                            //处于展开状态则折叠
                            tree.treeview('collapseNode', nodeid);
                        } else {
                            //处于折叠状态则展开
                            tree.treeview('expandNode', nodeid);
                        }
                        tree.treeview('unselectNode', nodeid);
                    }

                });
            },
            /**
             * 将机构专业班级学生树中勾选学生添加至右侧组内成员表
             * @method
             * @param
             * @return
             */
            addUserToGroup: function () {
                //获取所有被选中的节点遍历
                $("#institueTree").treeview("getChecked").forEach(function (t) {
                    for(var key in t) {
                        //当前节点若是学生节点，则添加至groupStudentList、并将studentID添加至group
                        if(key.substr(0, key.length - 2) == 'student'){
                            self.groupStudentList.push(t);
                            self.group.push(t.studentID);
                        }
                    }
                });
            },
            /**
             * 初始页面加载、获取当前用户组信息、以及当前用户所属学校下属学院专业班级学生信息以构建学生树
             * @method
             * @param
             * @return
             */
            load: function () {
                self.myGroup=[];
                self.groupStudentList=[];
                self.groupID='';
                $.ajax({
                    type: 'post',
                    url: '/groupManage/myGroupRequest',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: '',
                    success: function(msg) {
                        if (msg.code === 0) {
                            //初始化我的组
                            msg.result.myGroup.forEach(function (t) {
                                self.myGroup.push(t);
                            })
                            //将获取数据转换为bootstrap-treeview所需数据格式
                            for(var i=0;i<msg.result.institute.length;i++)
                            {
                                self.jsonTotree(msg.result.institute[i]);
                            }
                            //初始化机构学生列表
                            self.setInstitueTree(msg.result.institute);
                        } else {
                            alert('加载失败!');
                        }
                    }
                });

            },
            /**
             * 将当前对象转换为bootstrap-treeview所需数据格式
             * @method
             * @param {Object} obj 对象（后端获取当前用户所属学校下属学院专业班级学生信息）
             * @return
             */
            jsonTotree: function (obj) {
                //以键值对遍历对象
                for (var key in obj){
                    //若键名后四位为'Name'、即(insititueName、majorName、calssName、studentName)、则将Name属性转换为text(treeview界面显示)
                    if(key.substr(key.length - 4, 4) == 'Name') {
                        obj.text= obj[key];
                        delete obj[key];
                    }
                    //若当前值为数组对象、则将数组属性转换为Nodes（treeview子节点集合）、数组中每个元素重新递归调用、遍历此对象
                    if(obj[key] instanceof Array) {
                        obj.nodes = obj[key];
                        for (var i=0;i<obj[key].length;i++){
                            self.jsonTotree(obj[key][i]);
                        }
                        delete obj[key];
                    }
                }
            },
            /**
             * 保存当前组内成员修改、以及新增组
             * @method
             * @param
             * @return
             */
            save: function () {
                var url = self.groupID == '' ? '/groupManage/createGroup':'/groupManage/editGroup';
                $.ajax({
                    type: 'post',
                    url: url,
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: JSON.stringify(JSON.parse(JSON.stringify(self.$data))),
                    success: function(msg) {
                        if (msg.code === 0) {
                            alert('提交成功!');
                            self.load();
                        } else {
                            alert('提交失败!');
                        }
                    }
                });
            },
            /**
             * 通过groupID获取该组内所有学生信息集合
             * @method
             * @param {Number} index 当前组在myGroup集合下标
             * @return
             */
            modify: function (index,groupID) {
                self.isCreat = true;
                self.groupID = groupID;
                $.ajax({
                    type: 'post',
                    url: '/groupManage/userGroupInfoRequest',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: JSON.stringify({"groupID":self.myGroup[index].groupID}),
                    success: function(msg) {
                        if (msg.code === 0) {
                            //清空组内成员集合
                            self.groupStudentList = [];
                            msg.result.studentInfo.forEach(function (t) {
                                self.groupStudentList.push(t);
                                self.group.push(t.studentID);
                            });
                            self.groupName = msg.result.groupName;
                            self.isCreat = true;
                        } else {
                            alert('提交失败!');
                        }
                    }
                });
            },
            /**
             * 通过groupID删除当前组
             * @method
             * @param {Number} index 当前组在myGroup集合下标
             * @return
             */
            deleteGroup: function (index) {
                $.ajax({
                    type: 'post',
                    url: '/groupManage/deleteGroup',
                    contentType:"application/json;charset=utf-8",
                    dataType:'json',
                    data: JSON.stringify({"groupID":self.myGroup[index].groupID}),
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
             * 删除当前已选中学生
             * @method
             * @param {Number} index 当前组在myGroup集合下标
             * @return
             */
            delStu: function (index) {
                self.group.splice(self.group.indexOf(self.groupStudentList[index].studentID),1);
                self.groupStudentList.splice(index,1);
            },
            creatNew: function () {
                self.isCreat = true;
                self.groupStudentList = [];
                self.group = [];
                self.groupName ='';
                self.groupID = '';
            }
        },
        mounted: function () {
            //页面加载
            self.load();
        }
    }
})



