// User slice removed - user profile state is now managed by React Query
// This file is kept for backward compatibility but is no longer used
// All user data fetching is handled by useUserProfile and useCurrentUser hooks

import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export default userSlice.reducer;
