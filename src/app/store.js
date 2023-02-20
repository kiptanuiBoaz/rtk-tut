import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import usersReducer from "../features/users/usersSlice"

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,//dynamically resolved reducerpath name
    users: usersReducer
  },
  //middleware for itergrating rtkQuery with store
  //adds middleware from api slice to default middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),//manages cache lifetimes
  devTools: true
})