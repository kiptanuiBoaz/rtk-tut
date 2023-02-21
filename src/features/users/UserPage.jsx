import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'
import { useGetPostsByUserIdQuery } from '../posts/postsSlice';
import { Link, useParams } from 'react-router-dom'

const UserPage = () => {
    //from url
    const { userId } = useParams()

    //pass callback to useSelector for optimisation
    //find the current user from array of users
    const user = useSelector(state => selectUserById(state, Number(userId)))

    const {
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId);

    console.log(postsForUser)

    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        //access the normalized data from state
        const { ids, entities } = postsForUser
        content = ids.map(id => (
            <li key={id}>
                {/* use the Id as the object lookup */}
                <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
        ))
    } else if (isError) {
        content = <p>{error}</p>;
    }

    return (
        <section>
            <h2>{user?.name}</h2>

            <ol>{content}</ol>
        </section>
    )
}

export default UserPage