import axios from "../config/axios";

const createGroups = async (groupName) => {
  const response = await axios.post("/group/create", { groupName });
  return response;
};

const getByName = async (groupName) => {
  const response = await axios.get("/group/getByName", { groupName });
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

const exit = async (groupId) => {
  const response = await axios.post("/group/exit", { groupId });
  return response;
};

export default {
  createGroups,
  getByName,
  allGroups,
  deleteGroup,
  exit,
};
