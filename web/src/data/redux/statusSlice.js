import { createSlice } from "@reduxjs/toolkit";
import constant from "../constant";

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    // 0 - chats, 1 - friends
    content: constant.status.content,
  },
  reducers: {
    setContentStatus: (state, action) => {
      state.content = action.payload;
    },
    reset: (state, action) => {
      return  {
        content: constant.status.content,
      };
    },
  },
});

export const { setContentStatus, reset } = statusSlice.actions;
export default statusSlice.reducer;
