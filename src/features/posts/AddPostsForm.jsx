import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllPosts, useAddNewPostMutation } from "./postsSlice"; //   from slice
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
    const [addNewPost, { isLoading }] = useAddNewPostMutation();
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')


    const users = useSelector(selectAllUsers)//reading from the golbal users state
    const posts = useSelector(selectAllPosts);
    // const [postId, setPostId] = useState(posts.posts.find(post => post.title === title)?.id || '');
    // console.log(userId);

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)


    //checking if title content and userId are true befor the button can be clikable
    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                //unwrap is used to extract resolved values in Promises
                //unwrap throws an error if it occers hence passes the control to the catch block
                //mutation method from postSlice
                await addNewPost({ title, body: content, userId }).unwrap();

                navigate(`/`)
                setTitle('')
                setContent('')
                setUserId('')

            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }



    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
    )
}
export default AddPostForm