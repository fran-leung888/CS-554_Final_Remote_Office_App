import { createSlice } from "@reduxjs/toolkit";

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    // 0 - chats, 1 - friends
    content: 0
  },
  reducers: {
    setContentStatus: (state, action) => {
        state.content = action.payload
    },
  },
});

export const { setContentStatus } = statusSlice.actions;
export default statusSlice.reducer;
