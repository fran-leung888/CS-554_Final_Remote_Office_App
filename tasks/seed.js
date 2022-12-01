//init database
const users = require("../data/users");

const dbConnection = require("../config/mongoConnection");
async function test() {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();
  
    console.log("------------Init Users------------");
    const user1 = await users.createUser(
        "Yutong",
        "Wei",
        "ywei42@stevens.edu",
        "passwordyutongwei"
    )
    console.log("------------create users successfully------------");
}