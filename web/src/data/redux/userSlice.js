import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      return { ...state.value, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
