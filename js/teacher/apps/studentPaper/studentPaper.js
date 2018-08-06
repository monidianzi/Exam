var self,
    paper = new Vue({
    el: '.paperDetail',
    data: {
        paperInfo: {},
        paperContent: []

    },
    method: {

    },
    filters : {
        numToChar: function (value,type) {
            var answer = '';
            if(value ==undefined){
                answer = '';
            }
            if(type==0) {
                answer = String.fromCharCode(+value+65);
            } else if(type==1){
                //value.split('%').forEach(function (t) { answer += String.fromCharCode(+t+65);})
            }else {
                answer = value;
            }
            return answer;
        },
        numToUppCase: function (value) {
            var order = ['一', '二','三','四','五','六','七','八','九'];
            return order[value];
        }
    },
    mounted: function () {
        self = this;
        var msg = {
            paperInfo: {
                paperName: '2018软件测试',
                examScore: 100,
                point: 100,
                duration: 120000,
                realName: '郭玉纯',
                teacherName: '胡元娇'
            },
            paperContent: [
                {
                    titleDescribe: '单选题',
                    score: 20,
                    questionGroup: [
                        {
                            type: 0,
                            questionID: "301",
                            sceqID: "310",
                            stem: "301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）301的理想是————，喜欢吃（），喜欢喝（）",
                            standardAnswer: "1",
                            option: "1.对2 %%% 2.错3",
                            studentAnswer: "2",
                            parsing: "没有解析",
                            questionScore: 4,
                            studentScore: 0,
                            pic: " www.jinliang.com",
                            score: 10
                        },
                        {
                            type: 0,
                            questionID: "301",
                            sceqID: "310",
                            stem: "301的理想是————，喜欢吃（），喜欢喝（）",
                            option: "1.对2 %%% 2.错3",
                            standardAnswer: "1",
                            studentAnswer: "2",
                            parsing: "没有解析",
                            questionScore: 4,
                            studentScore: 0,
                            pic: " www.jinliang.com",
                            score: 10
                        },
                        {
                            type: 0,
                            questionID: "301",
                            sceqID: "310",
                            stem: "301的理想是————，喜欢吃（），喜欢喝（）",
                            option: "1.对2 %%% 2.错3",
                            standardAnswer: "1",
                            studentAnswer: "2",
                            parsing: "没有解析",
                            questionScore: 4,
                            studentScore: 0,
                            pic: " www.jinliang.com",
                            score: 10
                        }
                    ]
                },
                {
                    titleDescribe: '简答题',
                    score: 20,
                    questionGroup: [
                        {
                            type: 4,
                            questionID: "301",
                            sceqID: "310",
                            stem: "301的理想是————，喜欢吃（），喜欢喝（）",
                            standardAnswer: "11111111111",
                            studentAnswer: "22222222222",
                            parsing: "没有解析",
                            questionScore: 4,
                            studentScore: 0,
                            option: '',
                            pic: " www.jinliang.com",
                            score: 10
                        },
                        {
                            type: 4,
                            questionID: "301",
                            sceqID: "310",
                            stem: "301的理想是————，喜欢吃（），喜欢喝（）",
                            standardAnswer: "11111111111",
                            studentAnswer: "22222222222",
                            parsing: "没有解析",
                            questionScore: 4,
                            studentScore: 0,
                            option: '',
                            pic: " www.jinliang.com",
                            score: 10
                        },
                        {
                            type: 4,
                            questionID: "301",
                            sceqID: "310",
                            stem: "301的理想是————，喜欢吃（），喜欢喝（）",
                            standardAnswer: "11111111111",
                            studentAnswer: "22222222222",
                            parsing: "没有解析",
                            questionScore: 4,
                            studentScore: 0,
                            option: '',
                            pic: " www.jinliang.com",
                            score: 10
                        }
                    ]
                }
            ]
        }
        this.paperInfo = msg.paperInfo;
        this.paperContent = msg.paperContent;
        $.ajax({
            type: 'post',
            url: '',
            contentType:"application/json;charset=utf-8",
            dataType:'json',
            data: JSON.stringify({examItemID: window.location.search.substring(1).split("=")[1]}),
            success: function(msg) {
                if (msg.code === 0) {
                    self.paperInfo = msg.result.paperInfo;
                    self.paperContent = msg.result.paperContent;
                } else {
                    alert('加载失败');
                }
            }
        });

    }
});
