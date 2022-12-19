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
    }
  },
});

// Action creators are generated for each case reducer function

export const { setUser, reset } = userSlice.actions;

export default userSlice.reducer;
