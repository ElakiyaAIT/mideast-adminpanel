import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LoaderState {
  isLoading: boolean;
  loadingMessage: string | null;
}

const initialState: LoaderState = {
  isLoading: false,
  loadingMessage: null,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.loadingMessage = action.payload || null;
    },
    hideLoader: (state) => {
      state.isLoading = false;
      state.loadingMessage = null;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
