// init database 
const users = require("../data/users");
const redisStore = require("../data/redisStore");
const chats = require("../data/chats");
const constant = require("../data/constant");
const groups = require("../data/groups");

const dbConnection = require("../config/mongoConnection");

async function test(){
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    console.log("--------Init Users--------");
    const user1 = await users.addUser(
        "Jennie", 
        "Jennie11", 
        "123456", 
        "false"
    );
    const user2 = await users.addUser(
        "Jane", 
        "Jane12", 
        "123456", 
        "false"
    );
    const user3 = await users.addUser(
        "Lily", 
        "Lily13", 
        "123456", 
        "false"
    );
    const user4 = await users.addUser(
        "Lisa", 
        "Lisa14", 
        "123456", 
        "false"
    );
    const user5 = await users.addUser(
        "Selina", 
        "Selina15", 
        "123456", 
        "false"
    )
    const user6 = await users.addUser(
        "Ducy", 
        "Ducy16", 
        "123456", 
        "false"
    )
    const user7 = await users.addUser(
        "Jack", 
        "Jack17", 
        "123456", 
        "false"
    )
    const user8 = await users.addUser(
        "Josh", 
        "Josh18", 
        "123456", 
        "false"
    )
    await users.updateFriend(user1._id, user2._id);//user1 add user2 as friend.
    await users.updateFriend(user2._id, user3._id);//user2 add user3 as friend.
    await users.updateFriend(user3._id, user4._id);//user3 add user4 as friend.
    await users.updateFriend(user4._id, user1._id);//user4 add user1 as friend.
    await users.updateOfflineInvite(user1._id, user5._id)
    await users.updateOfflineInvite(user2._id, user5._id)
    await users.updateOfflineInvite(user3._id, user5._id)
    await users.updateOfflineInvite(user4._id, user5._id)
    await users.updateOfflineInvite(user1._id, user6._id)
    await users.updateOfflineInvite(user2._id, user6._id)
    await users.updateOfflineInvite(user3._id, user6._id)
    await users.updateOfflineInvite(user4._id, user6._id)
    
    
    console.log("-------- Create Users Successfully --------");

    console.log("-------- Init Group --------");
    const group1 = await groups.addGroup(
        "Group1",
        user1._id, 
        "Jennie11"
    )
    const group2 = await groups.addGroup(
        "Group2",
        user5._id, 
        "Selina15"
    )
    await groups.addMember(user2,group1);
    await groups.addMember(user3,group2);
    await groups.addMember(user4,group2);

    await users.userUpdateGroup(user4._id,group1._id,"Group1","false")
    //await users.updateOfflineGroupInvite(user1._id,user6._id)

    console.log("-------- Create Groups Successfully --------");
    
    console.log("-------- Init Chats --------");
    const meaasge1 = await chats.addMessage(
        user1._id,
        user2._id,
        "Hello, my name is Jennie",
        0
    )
    const meaasge2 = await chats.addMessage(
        user1._id,
        user2._id,
        "I am from tax department",
        1
    )
    const meaasge3 = await chats.addMessage(
        user1._id,
        user2._id,
        "I need the tax-table income of 2022",
        1
    )
    const meaasge4 = await chats.addMessage(
        user2._id,
        user1._id,
        "Okay, let's meet at 9th floor",
        1
    )
    const meaasge5 = await chats.addMessage(
        user2._id,
        user1._id,
        "I will print it now",
        1
    )
    const meaasge6 = await chats.addMessage(
        user3._id,
        user4._id,
        "Hi, I am Lily, I am new here",
        0
    )
    const meaasge7 = await chats.addMessage(
        user3._id,
        user4._id,
        "I joined a project team",
        1
    )
    const meaasge8 = await chats.addMessage(
        user3._id,
        user4._id,
        "The boss said you were in charge of the project.",
        1
    )
    const meaasge9 = await chats.addMessage(
        user3._id,
        user4._id,
        "So, I am here to learn about the project",
        1
    )
    const meaasge10 = await chats.addMessage(
        user4._id,
        user3._id,
        "Oh! Welcome Lily!",
        1
    )
    const meaasge11 = await chats.addMessage(
        user4._id,
        user3._id,
        "I'll send all information about the project to you later.",
        1
    )


    await dbConnection.closeConnection();
}

test();