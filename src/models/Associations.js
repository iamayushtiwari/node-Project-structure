const { getDBConnection } = require("@config/db");
const { _auth_module } = require("@src/utils/constants/messages");

async function getAssoicatedModel(req) {
    if (!req.db_name) {
        throw new Error(_auth_module.unAuth)
    }
    let options = { database: req.db_name }
    const sequelize = await getDBConnection(options)

    // Require Models (Example :: let { model } = Model(sequelize))



    // Define Your Relations (Example :: modelOne.hasOne(secondModel, { foreignKey: "key1", sourceKey: "key2" }))


    // Return Model Instance
    return {
        sequelize,
    }
}

module.exports = {
    getAssoicatedModel
}
