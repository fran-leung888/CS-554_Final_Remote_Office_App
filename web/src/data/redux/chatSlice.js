// import { createSlice } from "@reduxjs/toolkit";

// export const chatSlice = createSlice({
//   name: "chat",
//   initialState: {
//     // {
//     //     id,
//     //     messages:[
//     //         user:{
//     //             id,
//     //             avatar,
//     //             name,
//     //         },
//     //         message:
//     // ]
//     // }
//     chats: [],
//   },
//   reducers: {
//     // {
//     //         user:{
//     //             id,
//     //             avatar,
//     //             name,
//     //         },
//     //         message:
//     // }
//     addChat: (state, action) => {
//       return { ...state.value, ...action.payload };
//     },
//     addMessage: (state, action) => {
//       let user = action.payload.id;
//       let message = action.payload.message;
//       if (user) {
//         for (let chat of state.chats) {
//           if (chat.id === user) {
//             chat.message = [...chat.message, message];
//             return;
//           }
//         }
//         addChat(state, action);
//       } else {
//         throw "Please select user before sending message.";
//       }
//     },
//   },
// });

// // Action creators are generated for each case reducer function

// export const { addChat, addMessage } = chatSlice.actions;

// export default chatSlice.reducer;
