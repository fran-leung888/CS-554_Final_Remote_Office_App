import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      return { ...state.value, ...action.payload };
    },
    reset: (state, action) => {
      return {}
    },
    setAvatar: (state, action) => {
      return {
        ...state,
        avatar: action.payload
      }
    }
  },
});

// Action creators are generated for each case reducer function

export const { setUser, reset, setAvatar } = userSlice.actions;

export default userSlice.reducer;
