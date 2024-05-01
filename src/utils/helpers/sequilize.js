const { Sequelize, QueryTypes } = require("sequelize")

/**
 * @param {Sequelize} sequelize
 * @param {String} query
 * @returns {Promise<Array|Object|null>}
 */
async function _SelectQuery(sequelize, query) {
    try {
        return await sequelize.query(query, {
            type: QueryTypes.SELECT
        })
    } catch (error) {
        return null
    }
}

/**
 * @param {Sequelize} sequelize
 * @param {String} query
 * @returns {Promise<Array|Object|null>}
 */
async function _UpdateQuery(sequelize, query) {
    try {
        return await sequelize.query(query, {
            type: QueryTypes.UPDATE
        })
    } catch (error) {
        return null
    }
}

// Export Your Functions
module.exports = {
    _SelectQuery,
    _UpdateQuery
}