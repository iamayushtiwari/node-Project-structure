const { Sequelize } = require("sequelize");
const oracledb = require('oracledb');
const { DB } = require(".");
const path = require("path")

let config = {
    database: DB.DEFAULT_DB_NAME,
    username: DB.DEFAULT_DB_USER,
    password: DB.DEFAULT_DB_PASS,
    dialect: DB.DEFAULT_DB_DIALECT,
    host: DB.DEFAULT_DB_HOST,
    port: DB.DEFAULT_DB_PORT
}

/**
 * @param {
 * Object{
 *  database: string,
 *  username: string,
 *  password: string,
 *  dialect: string,
 *  host: string,
 *  port: number
 * }} options
 * @param {String} schema
 * @returns {Promise<Sequelize|null>}
 */
async function getDBConnection(options) {
    try {
        // You can change config
        let dbConnection = await setupPool({ ...config, ...options })
        return dbConnection;
    } catch (error) {
        throw new Error(`✘ Unable to connect to the database:> ${error?.message}`)
    }
};

const getDBInstance = async (options = {}) => {
    try {
        // Only for oracle connection version lesser than < 12g
        if (options.dialect === "oracle" && (process.platform === 'win32' || process.platform === 'darwin' && process.arch === 'x64')) {
            oracledb.initOracleClient({ libDir: path.join(__dirname, "../instantclient_11_2") });
        }

        let dbConfigOptions = {
            ...options,
            logging: false,
            ssl: true,
            define: {
                freezeTableName: true,
                charset: 'utf8',
                dialectOptions: {
                    collate: 'utf8_general_ci'
                },
                timestamps: true
            },
            pool: {
                max: 5,
                min: 0,
                idle: 30000,
                acquire: 60000,
            }
        }
        let sequelize = new Sequelize(dbConfigOptions)
        await sequelize.authenticate();
        console.log("New DB Connection Setup for :>", options.database)
        return sequelize;
    } catch (error) {
        throw new Error(error)
    }
}

const setupPool = async (options) => {
    try {
        let max_connection = 7 // Max Connection For Different DB

        if (global?.dbs) {

            if (!global.dbs[options.database]) { // DB connection not found in pool

                if (Object.keys(global?.dbs)?.length !== max_connection) { // Pool not reached at threshold
                    Object.values(global.dbs).sort((db1, db2) => db1.timestamps - db2.timestamps); // sort connections
                    global.dbs[options.database] = {
                        connection: await getDBInstance(options), // Create New DB Instance
                        timestamps: new Date()
                    }
                } else { // Pool at threshold
                    let db_name_to_close = Object.keys(global.dbs)[max_connection - 1]
                    delete global.dbs[db_name_to_close] // Remove old connection
                    global.dbs[options.database] = {
                        connection: await getDBInstance(options), // Create New DB Instance
                        timestamps: new Date()
                    }
                    console.log("Db connection successfully close for :> ", db_name_to_close)
                }
            }
        }
        else {
            global.dbs = {}
            if (options.database) {
                global.dbs[options.database] = {
                    connection: await getDBInstance(options), // Create New DB Instance
                    timestamps: new Date()
                }
            }
        }

        // Return DB Connections
        return global.dbs[options.database]?.connection
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    getDBConnection
}