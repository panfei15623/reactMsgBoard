/**
 * Created by panfei on 2016/10/31.
 */

import React from 'react';

let Comment = React.createClass({
    handleDele: function() {
        this.props.onDeleMsg(this.props.id);
    },
    render: function() {
        var msg = this.props.msg;
        return <div id="comment">
            <img src="../src/images/icon.png" alt=""/>
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

export default Comment;