import React from 'react';
import { useSelector } from "react-redux";
import {selectAllPosts} from "./postsSlice";


const PostsList = () => {
    const posts = useSelector(selectAllPosts);//selcetor imported from the slice

    const renderedPosts = posts.map(post => (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            {/* <p className="postCredit">
                <PostAuthor userId={post.userId} /> 
                <TimeAgo timestamp={post.date} />
            </p>
            <ReacstionButtons post={post} /> */}
        </article>
    ))

    return (
        <section>
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )
}

export default PostsList