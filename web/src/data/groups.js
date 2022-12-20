import axios from "../config/axios";

const createGroups = async (groupName, curUserId) => {
  const response = await axios.post("/group/create", { groupName, curUserId});
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
const allGroups = async (curUserId) => {
  const response = await axios.get("/group/getAll?curUserId=" + curUserId, {});
  return response;
};

const deleteGroup = async (groupId, curUserId) => {
  const response = await axios.post("/group/delete", { groupId, curUserId });
  return response;
};

const exit = async (exitUserId, groupId, curUserId) => {
  const response = await axios.post("/group/exit", { exitUserId, groupId,curUserId });
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
