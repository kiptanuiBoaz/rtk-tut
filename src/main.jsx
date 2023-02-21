import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from "./app/store"
import { Provider } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';
import { extendedAPiSlice } from './features/posts/postsSlice';
import { BrowserRouter as Router, Routes, Route, RouterProvider } from 'react-router-dom';

//fetch data immediately the app starts
store.dispatch(extendedAPiSlice.endpoints.getPosts.initiate());
store.dispatch(fetchUsers());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store} >
      <Router>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </Router>
    </Provider>

  </React.StrictMode>
)
