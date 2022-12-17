const mongoCollections = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const { getGroup } = require("./groups");

module.exports = {
  async checkId(id) {
    if (!id) throw "id can not be empty.";
    if (typeof id !== "string") throw "Id must be a string";
    id = id.trim();
    if (id.length === 0) throw "Id cannot be an empty string or just spaces";
    if (!ObjectId.isValid(id)) throw "invalid object ID";
  },

  async hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
  },

  async comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  },

  async addUser(name, username, password) {
    name = name.trim();
    username = username.trim();

    const usersCollection = await users();
    const userExist = await usersCollection.findOne({ username });
    if (userExist != null) throw "User exists.";

    let hash = await this.hashPassword(password);
    let friends = [];
    let groups = [];
    let offlineInvite = [];
    let offlineGroupInvite = [];
    // let hash = password
    let user = {
      name,
      username,
      password: hash,
      friends: friends,
      groups: groups,
      offlineInvite: offlineInvite,
      offlineGroupInvite: offlineGroupInvite,
    };

    const userInfo = await usersCollection.insertOne(user);
    if (!userInfo.acknowledged || !userInfo.insertedId)
      throw "Could not add user.";

    const userId = userInfo.insertedId.toString();

    return await this.getUser(userId);
  },

  async updateFriend(curId, friendId) {
    try {
      if (!curId || !friendId) {
        throw "you must input the people id you want to add";
      }
      const usersCollection = await users();
      // console.log(typeof curId);
      // console.log(typeof friendId);
      const curUser = await this.getUser(curId);
      const otherUser = await this.getUser(friendId);
      console.log(`curUser:${curUser}`);
      console.log(`otherUser: ${otherUser}`);

      // console.log(`curUser.friends.length:${curUser.friends.length}`);
      // if (curUser.friends.length) {
      //   for (let i = 0; i < curUser.friends.length; i++) {
      //     console.log(
      //       `curUser.friends[i]: ${JSON.stringify(curUser.friends[i])}`
      //     );
      //     if (
      //       curUser.friends[i] &&
      //       curUser.friends[i]._id.toString() === friendId
      //     ) {
      //       return curUser;
      //     }
      //   }
      // }

      const updatedInfo = await usersCollection.update(
        { _id: ObjectId(curId) },
        {
          $push: {
            friends: {
              _id: friendId,
              name: otherUser.name,
              username: otherUser.username,
            },
          },
        }
      );
      console.log(`updatedInfo:${updatedInfo}`);
      const newUser = await this.getUser(curId);
      console.log(`newUser.friends:${newUser.friends}`);

      await usersCollection.update(
        { _id: ObjectId(friendId) },
        {
          $push: {
            friends: {
              _id: curId,
              name: curUser.name,
              username: curUser.username,
            },
          },
        }
      );
      console.log(`otherUser update:`);
      console.log(await this.getUser(friendId));
      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },

  async updateOfflineInvite(userId, inviteUserId) {
    try {
      console.log(userId, inviteUserId);
      if (!userId || !inviteUserId) {
        throw "you must input the people who got invite when he off-online";
      }
      const usersCollection = await users();
      let userData = await this.getUser(userId);
      console.log("pass userData");
      let inviteUserData = await this.getUser(inviteUserId);

      console.log("store the offonline user:");
      console.log(userData);
      console.log("inviteUser");
      console.log(inviteUserData);

      const updatedInfo = await usersCollection.update(
        { _id: ObjectId(userId) },
        {
          $push: {
            offlineInvite: {
              inviteUserId: inviteUserId,
              inviteUsername: inviteUserData.username,
            },
          },
        }
      );

      console.log("add the invite info to user:");
      const newUser = await this.getUser(userId);
      console.log(newUser);

      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },

  async updateOfflineGroupInvite(userId, inviteUserId, attendGroupId) {
    try {
      if (!userId || !inviteUserId || !attendGroupId) {
        throw "please input the people you invite, who invite, and which group the people want he friend in";
      }

      const usersCollection = await users();
      // const userData = await this.getUser(userId);
      // const inviteUserData = await this.getUser(inviteUserId);
      const groupData = await getGroup(attendGroupId);

      const updatedInfo = await usersCollection.update(
        { _id: ObjectId(userId) },
        {
          $push: {
            offlineGroupInvite: {
              inviteUserId: inviteUserId,
              inviteUsername: groupData.grouperUsername,
              attendGroupId: attendGroupId,
              attendGroupName: groupData.groupName,
            },
          },
        }
      );

      console.log("already store the inviteGroupData in this one data:");

      const newUser = await this.getUser(userId);
      console.log(newUser);

      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },

  async deleteInviteInfo(userId, inviteUserId) {
    try {
      console.log("in deleteInviteInfo");
      console.log(userId, inviteUserId);
      if (!userId || !inviteUserId)
        throw "you must input the people who already see the invite";

      const usersCollection = await users();
      await usersCollection.update(
        { _id: ObjectId(userId) },
        {
          $pull: {
            offlineInvite: { inviteUserId: inviteUserId },
          },
        },
        { multi: true }
      );

      const newUser = await this.getUser(userId);
      console.log("already delete this invite");
      console.log(newUser);

      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },

  async deleteOfflineGroupInvite(userId, inviteUserId) {
    try {
      console.log("in deleteInviteInfo");
      console.log(userId, inviteUserId);
      if (!userId || !inviteUserId)
        throw "you must input the people who already see the invite";

      const usersCollection = await users();
      await usersCollection.update(
        { _id: ObjectId(userId) },
        { $pull: { offlineGroupInvite: { inviteUserId: inviteUserId } } },
        { multi: true }
      );

      const newUser = await this.getUser(userId);
      console.log("already delete this group invite");
      console.log(newUser);

      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },

  async deleteFriend(curId, friendId) {
    try {
      const usersCollection = await users();
      // const curUser = await this.getUser(curId);
      // const otherUser = await this.getUser(friendId);
      console.log("delete before, the friendId:");
      console.log(friendId);
      await usersCollection.update(
        { _id: ObjectId(curId) },
        { $pull: { friends: { _id: friendId } } },
        { multi: true }
      );

      const newUser = await this.getUser(curId);
      console.log("after delete, the curUser data is:");
      console.log(newUser);

      //  In the same time, also delete the cur user from the friend database
      await usersCollection.update(
        { _id: ObjectId(friendId) },
        { $pull: { friends: { _id: curId } } },
        { multi: true }
      );
      console.log("after delete the cur user from friend database");
      console.log(await this.getUser(friendId));
      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },

  async getUser(id) {
    await this.checkId(id);
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: ObjectId(id) });
    if (user === null) throw "No user with that id";

    return user;
  },

  async getUsers(ids) {
    if (ids && ids.length !== 0) {
      const usersCollection = await users();
      let objectIds = [];
      ids.split(",").forEach((each) => {
        objectIds.push(ObjectId(each));
      });
      const cursor = await usersCollection.find({ _id: { $in: objectIds } });
      if ((await cursor.count()) === 0) throw "Can not find user.";
      else {
        let result = [];
        await cursor.forEach((each) => {
          result.push(each);
        });
        return result;
      }
    } else {
      return [];
    }
  },

  async getUserByname(name) {
    const usersCollection = await users();
    var str = ".*" + name + ".*$";
    var reg = new RegExp(str);
    const user = await usersCollection.find({ name: reg });
    if ((await user.count()) === 0) throw "No user with that name";
    let userList = [];
    await user.forEach((each) => {
      userList.push(each);
    });
    return userList;
  },

  async login(username, password) {
    const usersCollection = await users();
    const user = await usersCollection.findOne({ username: username });
    if (user == null) throw "User does not exist.";
    if (await this.comparePassword(password, user.password)) {
      return user;
    } else {
      throw "Please check username and password.";
    }
  },

  async userUpdateGroup(curId, groupId, groupName, ifGrouper) {
    console.log("in userUpdateGroup");
    try {
      if (!curId || !groupId || !groupName) {
        throw "Please input curId or grouperId or grouperUsername";
      }
      const usersCollection = await users();
      const updatedInfo = await usersCollection.update(
        { _id: ObjectId(curId) },
        {
          $push: {
            groups: {
              groupId: groupId,
              groupName: groupName,
              ifGrouper: ifGrouper,
            },
          },
        }
      );

      console.log(
        `after create a group, the group information will update in user database`
      );
      console.log(JSON.stringify(updatedInfo));

      const newUser = await this.getUser(curId);
      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },

  async userDeleteGroup(curUser, group) {
    try {
      if (!curUser || !group) {
        throw Error("Please input the delete information: curUser and group");
      }
      let curId = curUser._id ? curUser._id : ObjectId(curUser.memberId);
      console.log("userDeleteGroup: cueUser: ");
      console.log(curId);

      const usersCollection = await users();
      const updatedInfo = await usersCollection.update(
        { _id: curId },
        {
          $pull: {
            groups: {
              groupId: group._id.toString(),
            },
          },
        },
        { multi: true }
      );

      console.log(
        "success delete the group in user database, the newUser info is "
      );
      const newUser = await this.getUser(curId.toString());
      console.log(newUser);
      return newUser;
    } catch (e) {
      throw Error(e.message);
    }
  },
};
