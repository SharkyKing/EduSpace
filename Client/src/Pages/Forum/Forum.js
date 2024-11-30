import React, {useState} from "react";
import EndPoint from "../../Utils/Endpoint";
import './Forum.css'

function Forum () {
    const [forumPostData, setForumPostData] = useState([])

    return (
        <>
            <EndPoint.Panels.ForumFilter setForumPostDataSource={setForumPostData}/>
            <div className="forum">
                { 
                    forumPostData 
                    && forumPostData.map((item, index) => (
                    <EndPoint.Components.PostComponent post={item}/>
                    ))
                }

            </div>
        </>
    )
}

export default Forum;