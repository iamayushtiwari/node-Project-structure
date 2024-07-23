
const { _auth_module } = require("@src/v1/utils/constants/messages");
const { getDatabaseConnection } = require("../middlewares/db_pool");
const { UserModel } = require("./app/User");

async function getAssoicatedModel(dbName) {
    const tenantDB = getDatabaseConnection(dbName)
    const User = UserModel(tenantDB)


    // Return Collection Instance
    return {
        tenantDB,
        User
    }
}

module.exports = {
    getAssoicatedModel
}
