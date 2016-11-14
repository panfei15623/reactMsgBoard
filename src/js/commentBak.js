/**
 * Created by panfei on 2016/9/9.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import $ from '../src/lib/jquery-2.1.4.min.js';
import '../css/comment.css';

var perPageNum = 3;   //每页留言条数
//function getMsg(pageNum) {
//    $.ajax({
//        url:'http://localhost:3000/getPerMsg',
//        type: 'get',
//        dataType: 'jsonp',
//        jsonpCallback: 'getPerMsg',
//        data: {
//            perPageNum: perPageNum,
//            pageNum: pageNum
//        },
//        success: function(data) {
//            console.log(data);
//        }
//    });
//}

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

var CommentBox = React.createClass({
    getInitialState: function() {
        return {
            showForm: 'none',
            msgList: [],        //每页留言列表
            pageNums: '',       //总页数
            msgNums: 0,        //留言数量
            currentPage: 1     //当前页
        }
    },

    /**
     * 展示留言表单
     */
    handleForm: function() {
        this.setState({showForm: 'block'});
    },

    /**
     * 保存留言
     * @param data
     */
    handleSaveMsg: function(param) {
        this.handleCancle();

        $.ajax({
            url:'http://localhost:3000/saveMsg',
            type: 'get',
            dataType: 'jsonp',
            jsonpCallback: 'saveMsg',
            data: param,
            success: function(data) {
                if(data.code == 0) {
                    this.setState({msgList: data.rows.reverse(), msgNums: data.length, pageNums: Math.ceil(data.length / perPageNum)});
                    console.log("留言成功");
                } else {
                    alert("留言失败");
                }
            }.bind(this)
        });
    },

    /**
     * 隐藏留言表单
     */
    handleCancle: function() {
        this.setState({showForm: 'none'});
    },

    /**
     * 删除留言
     * @param id
     */
    handleDeleteMsg: function(id) {

        $.ajax({
            url:'http://localhost:3000/deleteMsg',
            type: 'get',
            dataType: 'jsonp',
            jsonpCallback: 'deleteMsg',
            data: {
                id: id
            },
            success: function(data) {
                if(data.code == 0) {
                    console.log("删除成功" + JSON.stringify(data));
                    this.setState({msgList: data.rows.reverse(), msgNums: data.length, pageNums: Math.ceil(data.length / perPageNum)});
                } else {
                    alert("删除失败");
                }
            }.bind(this)
        });
    },

    componentDidMount: function() {
        $.ajax({
            url:'http://localhost:3000/getPerMsg',
            type: 'get',
            dataType: 'jsonp',
            //jsonpCallback: 'getPerMsg',
            data: {
                perPageNum: perPageNum,
                pageNum: 1
            },
            success: function(data) {
                if(data.code == 0) {
                    console.log(data);
                    this.setState({msgList: data.rows.reverse(), msgNums: data.length, pageNums: Math.ceil(data.length / perPageNum)});
                }
            }.bind(this)
        });
    },

    handleJump: function(pageNum) {
        if(this.state.currentPage == pageNum) {
            return;
        }
        $.ajax({
            url:'http://localhost:3000/getPerMsg',
            type: 'get',
            dataType: 'jsonp',
            //jsonpCallback: 'getPerMsg',
            data: {
                perPageNum: perPageNum,
                pageNum: pageNum
            },
            success: function(data) {
                if(data.code == 0) {
                    this.setState({msgList: data.rows.reverse(), currentPage: pageNum});
                }
            }.bind(this)
        });
    },

    render: function() {
        var commentNodes = this.state.msgList.map(function(msg){
            return <Comment key={msg.id} id={msg.id} msg={msg} onDeleMsg={this.handleDeleteMsg}></Comment>;
        }.bind(this));

        return <div>
            <div id="msg">
                <strong>留言（<span>{this.state.msgNums}</span>）</strong>
                <a className="link" href="#" onClick={this.handleForm}>我要留言</a>
                <CommentForm display={this.state.showForm} onCommentSubmit={this.handleSaveMsg} onCancleSubmit={this.handleCancle}></CommentForm>
                <div>
                    {commentNodes}
                </div>
            </div>
            <div className="pageNums">
                <Paging pageNums={this.state.pageNums} currentPage={this.state.currentPage} onHandleJump={this.handleJump}></Paging>
            </div>
        </div>
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            content: ''
        }
    },

    handleNameChange: function(event) {
        this.setState({name: event.target.value});
    },

    handleContentChange: function(event) {
        this.setState({content: event.target.value});
    },

    handleSubmit: function(event) {
        event.preventDefault();
        var name = this.state.name;
        var content = this.state.content;
        console.log(name);
        var data = {
            name: name,
            content: content,
            time: formatDate(new Date())
        };

        if(!name || !content) {
            alert('姓名或内容不能为空');
            return;
        }
        this.props.onCommentSubmit(data);
        this.setState({name: '', content: ''});
    },
    handleCancle: function() {
       this.props.onCancleSubmit();
    },
    render: function() {
       return <div>
           <form className="form" onSubmit={this.handleSubmit} style={{display: this.props.display}}>
               <p><strong>发表您的留言</strong></p>
               <input type="text" placeholder="请输入姓名" value={this.state.name} onChange={this.handleNameChange}/>
               <textarea placeholder="请输入留言"  value={this.state.content} onChange={this.handleContentChange}></textarea>
               <button type="submit">发表</button>
               <button type="button" onClick={this.handleCancle}>取消</button>
           </form>
       </div>
    }
});

var Comment = React.createClass({
    handleDele: function() {
        this.props.onDeleMsg(this.props.id);
    },
    render: function() {
        var msg = this.props.msg;
        return <div id="comment">
            <img src="images/icon.png" alt=""/>
            <div className="select">
                <div className="triangle"></div>
                <div id="selectBorder">
                    <div id="option" onClick={this.handleDele}>删除</div>
                </div>
            </div>
            <div id="msg">
                <div className="msgTitle"><span  className="name">{msg.name}</span><span>第{this.props.id}楼</span></div>
                <p>{msg.content}</p>
                <div className="time" >{msg.time}</div>
            </div>
        </div>
    }
});

var Paging = React.createClass({

    handleJump: function(pageNum) {
        event.preventDefault();
        this.props.onHandleJump(pageNum);
    },

    handlePrev: function(event) {
        event.preventDefault();
        this.props.currentPage - 1 > 0 ? this.handleJump(this.props.currentPage - 1) : '';
    },

    handleNext: function(event) {
        event.preventDefault();
        (this.props.currentPage + 1 <= this.props.pageNums) ? this.handleJump(this.props.currentPage + 1) : '';
    },

    render: function() {
        var pageNum = [];

        for(var i = 1; i <= this.props.pageNums; i++) {
            pageNum.push(
                <a href="#" key={i} className={this.props.currentPage == i ? 'pageNum noCanClick': 'pageNum canClick'} onClick={function(i){this.handleJump(i);}.bind(this, i)}>{i}</a>);
        }

        return <div>
                <a href="#" className={(this.props.currentPage - 1) <= 0 ? 'pageNum prev noCanClick': 'pageNum prev canClick'} onClick={this.handlePrev}>上一页</a>
            { pageNum }
                <a href="#" className={(this.props.currentPage + 1) > this.props.pageNums ? 'pageNum next noCanClick': 'pageNum next canClick'}  onClick={this.handleNext}>下一页</a>
        </div>;
    }
});

ReactDOM.render(<div>
        <p style={{color: "#EC5CA4"}}>留言板</p>
        <p className="underline"><strong>主人寄语</strong> <a href="#" className="link">编辑您的寄语</a></p>
        <CommentBox></CommentBox>
    </div>, document.getElementById("contain"));