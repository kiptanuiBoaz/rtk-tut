import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectPostIds, getPostsStatus, getPostsError, fetchPosts } from "./postsSlice";
import PostsExcerpt from './PostsExcerpt';



const PostsList = () => {
    const dispatch = useDispatch();

    //selcetors imported from the slice
    const orderedPostIds = useSelector(selectPostIds);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);


    useEffect(() => {
        //dispath the fetch posts async thunk when the status is idle
        if (postsStatus === "idle") {
            dispatch(fetchPosts());
        }
    }, [postsStatus, dispatch])

    // content to be given diff values based on the post status
    let content;
    if (postsStatus === 'loading') {
        //spinner
        content = <p>Loading...</p>
    } else if (postsStatus === 'succeeded') {
        // create copy and sort by date
        content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)

    } else if (postsStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <section>
            {content}
        </section>
    )
}

export default PostsList