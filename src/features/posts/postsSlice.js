import { createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

//from createEntity API
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

//initial state using normalized state
const initialState = postsAdapter.getInitialState({
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})

//fetch posts thunk
//accepts the prefix for generated action type (slice/fn) and a payload creator callbacka as arguments
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data

})

//add posts thunk
//recieves initial post whick will be the body of axios request
export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

//edit post thunk
export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; // only for testing Redux!
    }
})

//delete post thunk
//first paramte = reducername/extrareducername
export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        //return deleted post Id from api here
        if (response?.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        // return err.message;
        return initialPost //onlu for testing this sspecific scenario
    }
})

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        //Adding a posts reducer
        postAdded: {
            reducer: (state, action) => {
                //state mutation is possible because redux uses immer.js under the hood
                state.posts.push(action.payload);
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
            const existingPost = state.entities[postId] //lookup the specific post in the entities object
            // increment it's reaction state
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1
        }
    },
    //define the behavior of the reducer in response to other actions apart from dispatched ones
    extraReducers(builder) {
        //builder is an object that let's us define additional case reducers that run in response to actions defined outside  the slice

        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })

            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'

                // Adding date and reactions
                let min = 1;
                //add properties not provided byApI
                const loadedPosts = action.payload.map(post => {
                    //add date as string in ISO format
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                    return post;
                });

                // Add any fetched posts to the array
                postsAdapter.upsertMany(state, loadedPosts)
            })

            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })

            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs

                // const sortedPosts = state.posts.sort((a, b) => {
                //     if (a.id > b.id) return 1
                //     if (a.id < b.id) return -1
                //     return 0
                // })
                action.payload.id = state.ids[state.ids.length - 1] + 1
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)//api provided Id as string
                //added date and reactios data because it's not provided by the Api
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                //mutating-state-like behaviour handled by  immer.js
                postsAdapter.addOne(state, action.payload)
            })

            .addCase(updatePost.fulfilled, (state, action) => {
                //handle internal server errror
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                // const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                // const posts = state.posts.filter(post => post.id !== id);
                postsAdapter.upsertOne(state, action.payload)
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                postsAdapter.removeOne(state, id)

            })

    }
})

//creating the selector in the slice for consistency
// export const selectAllPosts = (state) => state.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

// export const selectPostById = (state, postId) => state.posts.posts.find(
//     post => post.id === postId
// );

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