import { useAddReactionMutation } from "./postsSlice"

//emojis object lookup
const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
}

const ReactionButtons = ({ post }) => {
    const [addReaction] = useAddReactionMutation();
    // break down object into array of arrays
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
                key={name}
                type="button"
                className="reactionButton"
                //dispatch the id of the current post and the name of  the reaction added 
                onClick={() => {
                    const newValue = post.reactions[name] + 1;
                    //overwrite the current reaction with the new value
                    addReaction({ postId: post.id, reactions: { ...post.reactions, [name]: newValue } })
                }}
            >
                {emoji} {post.reactions[name]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}
export default ReactionButtons;
