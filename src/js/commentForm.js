/**
 * Created by panfei on 2016/10/31.
 */

import React from 'react';
import formatDate from '../lib/formatDate';

let CommentForm = React.createClass({
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

export default CommentForm;