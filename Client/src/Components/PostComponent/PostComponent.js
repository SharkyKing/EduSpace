import React, {useState} from 'react';
import './PostComponent.css';

const PostComponent = ({post}) => {
    const [commentOpen, setCommentOpen] = useState(false)

    return (
        <div className="forum-post">
            <div className="forum-post-header">
                <div className="forum-post-user">
                    <h4>{post.User.FirstName} {post.User.LastName}</h4>
                    <p>{new Date(post.createdAt).toISOString().slice(0, 16).replace('T', ' ')}</p>
                </div>
            </div>
            <div className="forum-post-content">
                <p>{post.ThreadText}</p>
            </div>
            <div className="forum-post-comments">
                <div className={`forum-post-comments-list ${commentOpen ? "" : "forum-post-comments-list-closed"}`}>
                    <p>Comment 1</p>
                    <p>Comment 1</p>
                </div>
                <h4 onClick={() => setCommentOpen(!commentOpen)}>Comments</h4>
            </div>
        </div>
    );
};

export default PostComponent;
