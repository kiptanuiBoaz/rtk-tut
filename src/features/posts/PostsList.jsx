import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectPostIds, fetchPosts } from "./postsSlice";
import PostsExcerpt from './PostsExcerpt';
import { useGetPostsQuery } from './postsSlice';



const PostsList = () => {
    const { isLaoding, isSuccess, isError, error } = useGetPostsQuery()
    const dispatch = useDispatch();

    //selcetors imported from the slice
    const orderedPostIds = useSelector(selectPostIds);

    useEffect(() => {
        //dispath the fetch posts async thunk when the status is idle
        if (postsStatus === "idle") {
            dispatch(fetchPosts());
        }
    }, [postsStatus, dispatch])

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