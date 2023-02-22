import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

//from createEntity API
const usersAdapter = createEntityAdapter({});

//initial state using normalized state
const initialState = usersAdapter.getInitialState()


export const extendedAPiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //get all users
        getUsers: builder.query({
            query: () => "/users",
            transformResponse: responseData => {
                return usersAdapter.setAll(initialState, responseData)
            },
           
            providesTags: (result, error, arg) => [
                { type: 'User', id: "LIST" },
                ...result.ids.map(id => ({ type: 'User', id }))
            ]
        }),

        //get User by Id
        getUserById: builder.query({
            query: id => `/users/?userId=${id}`,

            transformResponse: responseData => {
                return usersAdapter.setAll(initialState, responseData)
            },
            //tag to invalidate a specific user cache
            providesTags: (result, error, arg) => [
                ...result.ids.map(id => ({ type: 'User', id }))
            ]

        })
    })
});

export const { useGetUsersQuery, useGetUserById } = extendedAPiSlice;


