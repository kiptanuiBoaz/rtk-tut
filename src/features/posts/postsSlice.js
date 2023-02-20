import { nanoid, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";
import axios from "axios";


//from createEntity API
const postsAdapter = createEntityAdapter({
    //sort to reverse order
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

//initial state using normalized state
const initialState = postsAdapter.getInitialState()

export const extendedAPiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: () => '/posts',
            //transform the response to add date and reactions
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                // normalize the state
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                { type: 'Post', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
    })
})

//creating the selector in the slice for consistency
// export const selectAllPosts = (state) => state.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)


//memoized selector
export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId], //dependencies
    (posts, userId) => posts.filter(post => post.userId === userId) //rereun the selector only when the posts or user Id changes
)

export const { postAdded, reactionAdded, increaseCount } = postsSlice.actions;//to components
export default postsSlice.reducer;//to the store

//thunk - is a piece of code that does some delayed work