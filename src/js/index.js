/**
 * Created by panfei on 2016/11/2.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './commentBox';

import '../css/comment';


ReactDOM.render(<div>
    <p style={{color: "#EC5CA4"}}>留言板</p>
    <p className="underline"><strong>主人寄语</strong> <a href="#" className="link">编辑您的寄语</a></p>
    <CommentBox></CommentBox>
</div>, document.getElementById("contain"));