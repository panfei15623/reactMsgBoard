/**
 * Created by panfei on 2016/9/9.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mysql = require('mysql');  //调用Mysql模块

//创建一个connection
var connection = mysql.createConnection({
    host: 'jiaxuelei.com',  //主机
    user: 'panf',           //mysql认证用户名
    password: 'panf',       //mysql认证密码
    port: '3306',            //端口号
    database: "panf"
    //host: 'localhost',  //主机
    //user: 'root',           //mysql认证用户名
    //password: 'root',       //mysql认证密码
    //port: '3306',            //端口号
    //database: "panf"
});

//创建一个connection
connection.connect(function() {
    console.log('connect mysql success');
    setInterval(function() {
       connection.query("select 1", function(err, rows) {
           if(err) {
               console.log('[query]-:' + err);
               return;
           }
           console.log('[heartbeaat] mysql connection alive');
       });
    }, 60000);
});


var perPageNum,    //每页的留言数
    pageNums,      //总页数
    currentPage,   //当前页码
    m,            //查询数据库开始的索引
    data = {};    //返回的数据

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status();
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

var formatDate = function(date, format) {
    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }

    var o = {
        "M+" : date.getMonth() + 1,
        "d+" : date.getDate(),
        "h+" : date.getHours(),
        "m+" : date.getMinutes(),
        "s+" : date.getSeconds(),
        "q+" : Math.floor((date.getMonth() + 3) / 3),
        "S" : date.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

function timeTransfer(rows) {
    for(var i = 0; i < rows.length; i++) {
        rows[i].time = formatDate(rows[i].time);
    }
    return rows;
}

/**
 * 保存
 */
app.get('/saveMsg', function(req, res) {
    var name = req.query.name;
    var content = req.query.content;
    var time = req.query.time;

    connection.query("insert into leave_word(name, content, time) values(?, ?, ?)", [name, content, time], function(err, rows) {
        if(err) {
            res.jsonp({
                code: -1,
                msg: err.toString()
            });

            console.log("saveInsert-" + err.toString());
            return;
        } else {
            connection.query("select count(*) from leave_word", function(err, rows) {
                if(err) {
                    res.jsonp({
                        code: -1,
                        msg: err.toString()
                    });
                    console.log("saveCount-" + err.toString());
                    return;
                } else {
                    data.length = rows[0]['count(*)'];
                    pageNums = Math.ceil(data.length / perPageNum);
                    m = (pageNums - 1) * perPageNum;

                    connection.query("select * from leave_word limit ?, ?", [m, perPageNum], function(err, rows) {
                        if(err) {
                            res.jsonp({
                                code: -1,
                                msg: err.toString()
                            });
                            console.log("saveLimit-" + err.toString());
                            return;
                        } else {
                            data.code = 0;
                            data.rows = timeTransfer(rows);
                            res.jsonp(data);
                        }
                    });
                }
            });
        }
    });
});

/**
 * 删除
 */
app.get('/deleteMsg', function(req, res) {
    var id = req.query.id;

    connection.query("delete from leave_word where id = ?", [id], function(err, rows) {
        if(err) {
            res.jsonp({
                code: -1,
                msg: err.toString()
            });
            console.log("delete-" + err.toString());
            return;
        } else {
            connection.query("select count(*) from leave_word", function(err, rows) {
                if(err) {
                    res.jsonp({
                        code: -1,
                        msg: err.toString()
                    });
                    console.log("deleteCount-" + err.toString());
                    return;
                } else {
                    data.length = rows[0]['count(*)'];
                    pageNums = Math.ceil(data.length / perPageNum);
                    m = (pageNums - currentPage) > 0 ? (pageNums - currentPage) * perPageNum : 0;

                    console.log("delete-pageNums:" + Math.ceil(data.length / perPageNum) + ",m:" + m + ",currentPage:" + currentPage);
                    if(data.length) {
                        connection.query("select * from leave_word limit ?, ?", [m, perPageNum], function (err, rows) {
                            if(err) {
                                res.jsonp({
                                    code: -1,
                                    msg : err.toString()
                                });
                                console.log("deleteLimit-" + err.toString());
                                return;
                            } else {
                                data.code = 0;
                                data.rows = timeTransfer(rows);
                                res.jsonp(data);
                            }
                        });
                    } else {
                        data.code = 0;
                        data.rows = [];
                        res.jsonp(data);
                    }
                }
            });
        }
    });
});

/**
 * 查询
 */
app.get('/getPerMsg', function(req, res) {
    perPageNum = Number(req.query.perPageNum);
    currentPage = req.query.pageNum;

    connection.query("select count(*) from leave_word", function(err, rows) {
        if(err) {
            res.jsonp({
                code: -1,
                msg: err.toString()
            });
            console.log("get-" + err.toString());
            return;
        } else {
            data.length = rows[0]['count(*)'];
            pageNums = Math.ceil(data.length / perPageNum);
            m = (pageNums - req.query.pageNum) * perPageNum;

            connection.query("select * from leave_word limit ?, ?", [m, perPageNum], function(err, rows) {
                if(err) {
                    res.jsonp({
                        code: -1,
                        msg: err.toString()
                    });
                    console.log("getLimit-" + err.toString());
                    return;
                } else {
                    data.code = 0;
                    data.rows = timeTransfer(rows);

                    res.jsonp(data);
                }
            });
        }
    });
});

app.listen(3000, function() {
   console.log("server started");
});