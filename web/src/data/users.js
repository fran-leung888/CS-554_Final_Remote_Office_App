import axios from "../config/axios";

const addUser = async (name, username, passwd, isFirebaseAuth = false) => {
  let response = await axios.post("/user", {
    name,
    username,
    passwd,
    isFirebaseAuth,
  });
  return response;
};

const login = async (username, passwd) => {
  let response = await axios.post("/login", {
    username,
    passwd,
  });

  return response;
};

const searchUser = async (name) => {
  let response = await axios.get("/user?name=" + name);

  return response;
};

const getUser = async (id) => {
  let response = await axios.get("/user?id=" + id);
  return response;
};

const getUsers = async (ids) => {
  let response = await axios.get("/user/list", {
    params: {
      id: ids + "",
    },
  });
  return response;
};

const setNewName = async (newName) => {
  let response = await axios.post("/changename", {
    newName,
  });

  return response;
};

const setNewPswd = async (newPassword) => {
  let response = await axios.post("/changepswd", { newPassword });
  return response;
};

const setAvatar = async (userId, avatar) => {
  let response = await axios.post("/user/avatar", {userId, avatar });
  return response;
};

const addFriend = async (friendId) => {
  console.log("Add friend");
  let response = await axios.post("/add", {
    // curId,
    friendId,
  });
  console.log(`response:`);
  console.log(response);
  return response;
};

const deleteFriend = async (friendId) => {
  let response = await axios.post("/delete", {
    // curId,
    friendId,
  });
  return response;
};

const addOffFri = async (userId, inviteUserId) => {
  let response = await axios.post("/addofflinefri", {
    userId,
    inviteUserId,
  });
  return response;
};

const addOffGroup = async (userId, inviteUserId, attendGroupId) => {
  let response = await axios.post("/addoffgroup", {
    userId,
    inviteUserId,
    attendGroupId,
  });
  return response;
};

const delFriRecord = async (userId, inviteUserId) => {
  let response = await axios.post("/delofflinefri", {
    userId,
    inviteUserId,
  });
  return response;
};

const delGroupRecord = async (userId, inviteUserId) => {
  let response = await axios.post("/deloffgroup", {
    userId,
    inviteUserId,
  });
  return response;
};

export default {
  addUser,
  login,
  setAvatar,
  searchUser,
  getUser,
  getUsers,
  setNewName,
  setNewPswd,
  addFriend,
  deleteFriend,
  addOffFri,
  addOffGroup,
  delFriRecord,
  delGroupRecord,
};
