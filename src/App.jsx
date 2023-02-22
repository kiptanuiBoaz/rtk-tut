import { useState } from 'react';
import PostsList from './features/posts/PostsList';
import AddPostForm from './features/posts/AddPostsForm';
import UsersList from './features/users/UsersList';
import UserPage from './features/users/UserPage';
import Layout from './components/Layout';
import { Route, Routes, Navigate } from 'react-router-dom';
import SinglePostPage from './features/posts/SinglePostsPage';
import EditPostForm from './features/posts/EditPostForm';

function App() {

  return (
    <Routes>
      {/* parent element emitting children */}
      <Route path="/" element={<Layout />}>
        {/* index means it the homepage */}
        <Route index element={<PostsList />} />

        <Route path="post">
          {/* root of /posts */}
          <Route index element={<AddPostForm />} />
          {/* /postId paramater */}
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>


        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>


        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  )
}

export default App
