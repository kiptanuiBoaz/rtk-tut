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
            //refetch the lists if any Ids is invalidated
            providesTags: (result, error, arg) => [
                { type: 'Post', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
    })
});

//export generated hooks to components
export const {
    useGetPostsQuery
} = extendedAPiSlice;



// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

// Creates memoized selector
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)




//thunk - is a piece of code that does some delayed work
// nullish coalescing operator (??) - returns its right-hand side operand when its left-hand side operand is nullish,
//  (null or undefined), and otherwise returns its left-hand side operand