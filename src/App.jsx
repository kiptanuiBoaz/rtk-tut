import { useState } from 'react';
import PostsList from './features/posts/PostsList';
import AddPostForm from './features/posts/AddPostsForm';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
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

    </Route>
  </Routes>
  )
}

export default App
