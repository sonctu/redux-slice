import { createReducer, createAction, nanoid } from '@reduxjs/toolkit';
import { initialPostList } from 'constants/blog';
import { Post } from 'types/blog';

interface BlogReducer {
  postList: Post[];
  editingPost: Post | null;
}
const initialState: BlogReducer = {
  postList: initialPostList,
  editingPost: null,
};

export const addPost = createAction('blog/addPost', function (post: Post) {
  return {
    payload: {
      ...post,
      id: nanoid(),
    },
  };
});
export const deletePost = createAction<string>('blog/deletePost');
export const startEdit = createAction<string>('blog/startEdit');
export const cancelEdit = createAction('blog/cancelEdit');
export const updatePost = createAction<Post>('blog/updatePost');

const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      state.postList.push(action.payload);
    })
    .addCase(deletePost, (state, action) => {
      const postId = action.payload;
      const findIndexPost = state.postList.findIndex((post) => post.id === postId);
      if (findIndexPost !== -1) {
        state.postList.splice(findIndexPost, 1);
      }
    })
    .addCase(startEdit, (state, action) => {
      const postId = action.payload;
      const findPost = state.postList.find((post) => post.id === postId) || null;
      if (findPost) state.editingPost = findPost;
    })
    .addCase(cancelEdit, (state) => {
      state.editingPost = null;
    })
    .addCase(updatePost, (state, action) => {
      const postId = action.payload.id;
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload;
          return true;
        }
        return false;
      });
      state.editingPost = null;
    });
});

export default blogReducer;
