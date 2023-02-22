import { useState, useEffect } from 'react'
import { useGetPostsQuery } from './postsSlice'
import { useParams, useNavigate } from 'react-router-dom'
import { useUpdatePostMutation, useDeletePostMutation } from './postsSlice'


const EditPostForm = () => {
    // get id from url
    const { postId } = useParams();
    const navigate = useNavigate();

    //fns from rtk hooks
    const [updatePost, { isLoading }] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    const { post, isLoading: isLoadingPosts, isSuccess } = useGetPostsQuery('getPosts', {
        //nested method
        selectFromResult: ({ data, isLoading, isSuccess }) => ({
            post: data?.entities[postId], //lookup the entities object in the normalized data
            isLoading,
            isSuccess
        }),
    })

    const { data: users, isSuccess: isSuccessUsers } = useGetPostsQuery('getUsers')
    console.log(post);

    const [title, setTitle] = useState(post?.title)
    const [content, setContent] = useState(post?.body)
    const [userId, setUserId] = useState(post?.userId)


    useEffect(() => {
        if (isSuccess) {
            setTitle(post.title)
            setContent(post.body)
            setUserId(post.userId)
        }
    }, [isSuccess, post?.title, post?.body, post?.userId])

    if (isLoadingPosts) return <p>Loading...</p>

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    //form input handlers
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(Number(e.target.value))

    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                //unwrap is used to extract resolved values in Promises
                //unwrap throws an error if it occers hence passes the control to the catch block
                await updatePost({ id: post.id, title, body: content, userId }).unwrap()

                setTitle('');
                setContent('');
                setUserId('');
                //go back to individual post page ofter successfully enditing the post
                navigate(`/post/${postId}`);
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    let usersOptions
    if (isSuccessUsers) {
        usersOptions = users.ids.map(id => (
            <option key={id} value={id}>{users.entities[id].name}</option>
        ))
    }

    const onDeletePostClicked = async () => {
        try {
            await deletePost({ id: post.id }).unwrap()

            setTitle('')
            setContent('')
            setUserId('')
            navigate('/')
        } catch (err) {
            console.error('Failed to delete the post', err)
        } finally {
            setRequestStatus('idle')
        }
    }

    return (
        <section>
            <h2>Edit Post</h2>
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
                >
                    Save Post
                </button>
                <button className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    )
}

export default EditPostForm;