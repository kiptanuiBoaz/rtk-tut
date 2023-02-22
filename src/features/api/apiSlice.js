import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api', // optional if named defalult (api)
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    //provide tags for manging cache invalidation
    tagTypes: ["Post","User"],
    endpoints: builder => ({})
})