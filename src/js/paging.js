/**
 * Created by panfei on 2016/10/31.
 */
import React from 'react';

let Paging = React.createClass({

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

export default Paging;