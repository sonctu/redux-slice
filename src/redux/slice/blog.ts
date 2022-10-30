import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { initialPostList } from 'constants/blog';
import { Post } from 'types/blog';

interface BlogSlice {
  postList: Post[];
  editingPost: Post | null;
}
const initialState: BlogSlice = {
  postList: initialPostList,
  editingPost: null,
};
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.postList.push(action.payload);
      },
      prepare: (post: Omit<Post, 'id'>) => ({
        payload: {
          ...post,
          id: nanoid(),
        },
      }),
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const findPostIndex = state.postList.findIndex((post) => post.id === postId);
      if (findPostIndex !== -1) {
        state.postList.splice(findPostIndex, 1);
      }
    },
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const findPost = state.postList.find((post) => post.id === postId);
      if (findPost) state.editingPost = findPost;
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      state.postList.some((post, index) => {
        if (post.id === action.payload.id) {
          state.postList[index] = action.payload;
          return true;
        }
        return false;
      });
      state.editingPost = null;
    },
    cancelPost: (state) => {
      state.editingPost = null;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state) => {
          console.log('matcher');
        },
      )
      .addDefaultCase((state) => console.log('default'));
  },
});

export const { addPost, deletePost, startEditingPost, updatePost, cancelPost } = blogSlice.actions;
export default blogSlice.reducer;
