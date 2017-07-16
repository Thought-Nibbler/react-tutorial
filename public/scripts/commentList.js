var Comment = React.createClass({
    render: function() {
        return(
            <div className="comment">
              <h2 className="commentAuthor">
                {this.props.author}
              </h2>
              {this.props.text}
            </div>
        );
    }
});

export default class CommentList extends React.Component {
    render() {
        var comments = this.props.data.map(function(data) {
            return(
                <Comment author={data.author} text={data.text} key={data.id} />
            );
        }).reverse();
        return (
            <div className="commentList">
              {comments}
            </div>
        );
    }
};
