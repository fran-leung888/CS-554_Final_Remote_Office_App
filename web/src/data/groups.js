import axios from "../config/axios";

const createGroups = async (groupName) => {
  const response = await axios.post("/group/create", { groupName });
  return response;
};

const addToGroup = async (memberId, groupName) => {
  const response = await axios.post("/group/addToGroup", {
    memberId,
    groupName,
  });
  return response;
};

const getByName = async (groupName) => {
  // console.log(groupName);
  // let response = await axios.get("/user?name=" + name);
  const response = await axios.get("/group/getByName?groupName=" + groupName);
  return response;
};
const allGroups = async () => {
  const response = await axios.get("/group/getAll", {});
  return response;
};

const deleteGroup = async (groupId) => {
  const response = await axios.post("/group/delete", { groupId });
  return response;
};

const exit = async (exitUserId, groupId) => {
  const response = await axios.post("/group/exit", { exitUserId, groupId });
  return response;
};

export default {
  createGroups,
  addToGroup,
  getByName,
  allGroups,
  deleteGroup,
  exit,
};
