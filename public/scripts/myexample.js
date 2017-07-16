import CommentList from './commentList.js';

var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url      : this.props.url,
            dataType : 'json',
            cache    : false,
            success  : function(data) {
                this.setState({ data : data });
            }.bind(this),
            error    : function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    onCommentSubmit: function(comment) {
        var comments = this.state.data.slice();
        comments.push(comment);
        this.setState({ data : comments });

        $.ajax({
            url      : this.props.url,
            dataType : 'json',
            type     : 'POST',
            data     : comment,
            success  : function(data) {
                this.setState({ data : data });
            }.bind(this),
            error    : function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return { data : [] };
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
              <h1>Comments</h1>
              <CommentForm onCommentSubmit={this.onCommentSubmit} />
              <hr />
              <CommentList data={this.state.data} />
            </div>
        );
    }
});

var CommentForm = React.createClass({
    onSubmit: function(e) {
        e.preventDefault();

        var author = ReactDOM.findDOMNode(this.refs.author).value.trim();
        var text   = ReactDOM.findDOMNode(this.refs.text).value.trim();

        if ((!author) || (!text)) {
            return;
        }

        var id = new Date().getTime().toString(16);
        var comment = { author : author, text : text, id : id };

        this.props.onCommentSubmit(comment);

        ReactDOM.findDOMNode(this.refs.author).value = '';
        ReactDOM.findDOMNode(this.refs.text).value   = '';

        return;
    },
    render: function() {
        var randomFlag = ((Math.round(Math.random() * 10) % 2) === 0);
        var buttonStyle = {
            color : (randomFlag ? 'red' : 'blue')
        };
        return (
            <div className="commentForm">
              <input type="text" placeholder="Your name" ref="author" />
              <input type="text" placeholder="Say something..." ref="text" />
              <input type="button" value="Post" onClick={this.onSubmit} style={buttonStyle} />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000} />,
    document.getElementById('content')
);

