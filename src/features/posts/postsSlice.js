import { createSlice, nanoid } from "@reduxjs/toolkit";
import {sub} from "date-fns"



const initialState = [
    {
        id: '1',
        title: 'Learning Redux Toolkit',
        content: "I've heard good things.",
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    },
    {
        id: '2',
        title: 'Slices...',
        content: "The more I say slice, the more I want pizza.",
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    }
]

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        //Adding a posts reducer
        postAdded: {
            reducer: (state, action) => {
                //state mutation is possible because redux uses immer.js under the hood
                state.push(action.payload);
            },
            //executed beforre actual action dispatched (prepare callback)
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }

                    }
                }
            }
        },
        //reducer to increment reactions (dispatched from ReactionButtons Compnent)
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            //find if the reacted post exists
            const existingPost = state.find(post => post.id === postId);
            // increment it's reaction state
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
})

//creating the selector in the slice for consistency
export const selectAllPosts = (state) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;//to components
export default postsSlice.reducer;//to the store

//thunk - is a piece of code that does some delayed work