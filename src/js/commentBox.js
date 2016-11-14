/**
 * Created by panfei on 2016/10/31.
 */

import React from 'react';
import Comment from './comment';
import CommentForm from './commentForm';
import Paging from './paging';

let perPageNum = 3;   //每页留言条数

let CommentBox = React.createClass({
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

export default CommentBox;