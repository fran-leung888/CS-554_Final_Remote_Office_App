import { createSlice } from "@reduxjs/toolkit";

export const searchUserSlice = createSlice({
  name: "searchUser",
  initialState: {},
  reducers: {
    setSearchUser: (state, action) => {
      console.log(state);
      console.log(action);
      return { ...state.value, ...action.payload };
    },
    reset: (state, action ) => {
      return {}
    }
  },
});

export const { setSearchUser, reset} = searchUserSlice.actions;
export default searchUserSlice.reducer;
