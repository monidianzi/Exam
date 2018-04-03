'use strict';
require.config({
    baseUrl: '../../',
    paths: {
        //Teacher
        'Teacherapp': 'js/teacher/apps/main',
        'TeacherappView': 'html/teacher/apps/main.html',
        'TeacherappStyle': 'css/teacher/apps/main',

        'addQuestion': 'js/teacher/apps/addQuestion/addQuestion',
        'addQuestionView': 'html/teacher/apps/addQuestion/addQuestion.html',
        'addQuestionStyle': 'css/teacher/apps/addQuestion/addQuestion',

        'questionManage': 'js/teacher/apps/questionManage/questionManage',
        'questionManageView': 'html/teacher/apps/questionManage/questionManage.html',
        'questionManageStyle': 'css/teacher/apps/questionManage/questionManage',

        'addPaper': 'js/teacher/apps/addPaper/addPaper',
        'addPaperView': 'html/teacher/apps/addPaper/addPaper.html',
        'addPaperStyle': 'css/teacher/apps/addPaper/addPaper',


        'datetimepickerCss': 'public/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
        'treeviewCss': 'public/bootstrap-treeview/bootstrap-treeview.min',
        'treeview': 'public/bootstrap-treeview/bootstrap-treeview.min',
        'bootstrappaginator': 'public/bootstrap-paginator/bootstrap-paginator'
    },
    packages: [{
        name: 'jquery',
        location: 'public/jquery',
        main: 'jquery-3.1.1.min'
    }, {
        name: 'bootstrap',
        location: 'public/bootstrap-3.3.7-dist/js',
        main: 'bootstrap.min'
    }, {
        name: 'vue',
        location: 'public/vue',
        main: 'vue'
    }, {
        name: 'text',
        location: 'public/text',
        main: 'text'
    }, {
        name: 'datetimepicker',
        location: 'public/bootstrap-datetimepicker',
        main: 'bootstrap-datetimepicker.min'
    }, {
        name: 'less',
        location: 'public/require-less',
        main: 'less'
    }, {
        name: 'css',
        location: 'public/require-css-master',
        main: 'css'
    }],

    shim: {
        jquery: {
            exports: '$'
        },
        lodash: {
            exports: '_'
        },
        datetimepicker: {
            deps:['jquery'],
            exports: 'jQuery.fn.datetimepicker'
        },
        treeview: {
            deps:['jquery'],
            exports: 'jQuery.fn.treeview'
        },
        bootstrappaginator: {
            deps:['jquery'],
            exports: 'jQuery.fn.bootstrapPaginator'
        }
    },
    urlArgs: "r=" + (new Date()).getTime()
});
require(['Teacherapp']);



