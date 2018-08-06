'use strict';
require.config({
    baseUrl: '../../',
    paths: {
        //Teacher
        'Teacherapp': 'js/teacher/apps/main',
        'TeacherappView': 'html/teacher/apps/main.html',
        'TeacherappStyle': 'css/teacher/apps/main',

        'homePage': 'js/teacher/apps/homePage/homePage',
        'homePageView': 'html/teacher/apps/homePage/homePage.html',
        'homePageStyle': 'css/teacher/apps/homePage/homePage',

        'addQuestion': 'js/teacher/apps/addQuestion/addQuestion',
        'addQuestionView': 'html/teacher/apps/addQuestion/addQuestion.html',
        'addQuestionStyle': 'css/teacher/apps/addQuestion/addQuestion',

        'questionManage': 'js/teacher/apps/questionManage/questionManage',
        'questionManageView': 'html/teacher/apps/questionManage/questionManage.html',
        'questionManageStyle': 'css/teacher/apps/questionManage/questionManage',

        'addPaper': 'js/teacher/apps/addPaper/addPaper',
        'addPaperView': 'html/teacher/apps/addPaper/addPaper.html',
        'addPaperStyle': 'css/teacher/apps/addPaper/addPaper',

        'paperManage': 'js/teacher/apps/paperManage/paperManage',
        'paperManageView': 'html/teacher/apps/paperManage/paperManage.html',
        'paperManageStyle': 'css/teacher/apps/paperManage/paperManage',

        'addExam': 'js/teacher/apps/addExam/addExam',
        'addExamView': 'html/teacher/apps/addExam/addExam.html',
        'addExamStyle': 'css/teacher/apps/addExam/addExam',

        'examManage': 'js/teacher/apps/examManage/examManage',
        'examManageView': 'html/teacher/apps/examManage/examManage.html',
        'examManageStyle': 'css/teacher/apps/examManage/examManage',

        'groupManage': 'js/teacher/apps/groupManage/groupManage',
        'groupManageView': 'html/teacher/apps/groupManage/groupManage.html',
        'groupManageStyle': 'css/teacher/apps/groupManage/groupManage',

        'questionPreview': 'js/teacher/apps/questionPreview/questionPreview',
        'questionPreviewView': 'html/teacher/apps/questionPreview/questionPreview.html',
        'questionPreviewStyle': 'css/teacher/apps/questionPreview/questionPreview',

        'paperPreview': 'js/teacher/apps/paperPreview/paperPreview',
        'paperPreviewView': 'html/teacher/apps/paperPreview/paperPreview.html',
        'paperPreviewStyle': 'css/teacher/apps/paperPreview/paperPreview',

        'examinePaper': 'js/teacher/apps/examinePaper/examinePaper',
        'examinePaperView': 'html/teacher/apps/examinePaper/examinePaper.html',
        'examinePaperStyle': 'css/teacher/apps/examinePaper/examinePaper',

        'examScore': 'js/teacher/apps/examScore/examScore',
        'examScoreView': 'html/teacher/apps/examScore/examScore.html',
        'examScoreStyle': 'css/teacher/apps/examScore/examScore',


        'datetimepickerCss': 'public/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
        'treeviewCss': 'public/bootstrap-treeview/bootstrap-treeview.min',
        'treeview': 'public/bootstrap-treeview/bootstrap-treeview.min',
        'bootstrappaginator': 'public/bootstrap-paginator/bootstrap-paginator',
        'bootstrap': 'public/bootstrap-3.3.7-dist/js/bootstrap.min'
    },
    packages: [{
        name: 'jquery',
        location: 'public/jquery',
        main: 'jquery-3.1.1.min'
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
        },
        bootstrap: {
            deps:['jquery']
        }
    },
    urlArgs: "r=" + (new Date()).getTime()
});
require(['Teacherapp']);



