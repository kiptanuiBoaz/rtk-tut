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
        //get all posts
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


        //fetch posts of specific user
        getPostsByUserId: builder.query({
            query: id => `/posts/?userId=${id}`,
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
            //tag to invalidate a specifit post cache
            providesTags: (result, error, arg) => [
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),

        //adding a new post
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId), //ensure userId is a number
                    date: new Date().toISOString(), //setting date format
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            // invalidate the postList cache
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),

        //edit a single post
        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            //invalidate the specific post cache
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),

        //delete post
        deletePost: builder.mutation({
            query: ({ id }) => ({ //destructure id from initial post
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),

        //alter the reactios of posts (optimistic update)
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `posts/${postId}`,
                method: 'PATCH',
                // In a real app, we'd probably need to base this on user ID somehow
                // so that a user can't do the same reaction more than once
                body: { reactions }
            }),
            //query started handler
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {//queryfulfilled is a promise
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const patchResult = dispatch( //performs cache update before network requests 
                    extendedAPiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const post = draft.entities[postId]
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
                //no invalidate Tags because we are updating the chache directly before updating the api
            }
        })
    })
});

//export generated hooks to components
export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedAPiSlice




// returns the query result object
export const selectPostsResult = extendedAPiSlice.endpoints.getPosts.select()

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