import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectPostIds } from "./postsSlice";
import PostsExcerpt from './PostsExcerpt';
import { useGetPostsQuery } from './postsSlice';



const PostsList = () => {
    const { isLaoding, isSuccess, isError, error } = useGetPostsQuery()
    const dispatch = useDispatch();

    const orderedPostIds = useSelector(selectPostIds)
    
    // content to be given diff values based on the post status
    let content;
    if (isLaoding) {
        //spinner
        content = <p>Loading...</p>
    } else if (isSuccess) {
        // create copy and sort by date
        content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)

    } else if (isError) {
        content = <p>{error}</p>;
    }

    return (
        <section>
            {content}
        </section>
    )
}

export default PostsList