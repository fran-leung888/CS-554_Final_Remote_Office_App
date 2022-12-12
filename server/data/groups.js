const mongoCollections = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const users = mongoCollections.users;
const groups = mongoCollections.groups;
const { ObjectId } = require("mongodb");

module.exports = {
  async checkId(id) {
    if (!id) throw "id can not be empty.";
    if (typeof id !== "string") throw "Id must be a string";
    id = id.trim();
    if (id.length === 0) throw "Id cannot be an empty string or just spaces";
    if (!ObjectId.isValid(id)) throw "invalid object ID";
  },

  async addGroup(groupName, grouperId, grouperUsername) {
    groupName = groupName.trim();

    const groupsCollection = await groups();
    const groupExist = await groupsCollection.findOne({ groupName });
    if (groupExist != null)
      throw "Already have this group name, please rename.";

    let groupMembers = [];
    let group = {
      groupName: groupName,
      grouperId: grouperId,
      grouperUsername: grouperUsername,
      groupMembers: groupMembers,
    };

    const groupInfo = await groupsCollection.insertOne(group);
    console.log(groupInfo);

    if (!groupInfo.acknowledged || !groupInfo.insertedId)
      throw "Could not add group.";

    const groupId = groupInfo.insertedId.toString();
    console.log(groupId);

    return await this.getGroup(groupId);
  },

  async addMember(member, group) {
    if (!member || !group)
      throw "please input a member who want to add and input a group which someone want to add in";

    const groupsCollection = await groups();
    const updatedInfo = await groupsCollection.update(
      { _id: group._id },
      {
        $push: {
          groupMembers: {
            memberId: member._id.toString(),
            memberName: member.username,
          },
        },
      }
    );

    console.log(
      `after add a member in group, the update information updatedInfo is: `
    );
    console.log(JSON.stringify(updatedInfo));

    const newGroup = await this.getGroup(group._id.toString());
    console.log("after add a member in group, the group will update newGroup:");
    console.log(newGroup);

    return newGroup;
  },

  async getGroup(id) {
    await this.checkId(id);
    const groupsCollection = await groups();
    const group = await groupsCollection.findOne({ _id: ObjectId(id) });
    if (group === null) throw "No group with that id";

    return group;
  },

  async getGroupByname(name) {
    const groupsCollection = await groups();
    const group = await groupsCollection.findOne({ groupName: name });
    console.log("search this group:");
    console.log(group);

    return group;
  },
};
