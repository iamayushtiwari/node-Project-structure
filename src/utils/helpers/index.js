const { Op, Sequelize } = require("sequelize")

/**
 * 
 * @param {any} err 
 * @param {import("express").NextFunction} next 
 */
exports._handleSqlErrorWithDB = async (err, next) => {
    let error = err
    let res = { error, status: 400 }
    if (err?.name && err?.name?.includes("Sequelize")) { // Handle Sequilize  Error
        if (err?.name === "SequelizeDatabaseError") {
            res.error = err?.parent?.sqlMessage?.toString()
        } else if (err?.errors?.length > 0) {
            res.error = err?.errors[0]?.message?.toString()
        } else {
            res.error = err?.toString()
        }
    } else {
        res.error = err?.message?.toString()
        res.status = 500
    }

    // const url = ""
    // const payload = {}
    // const username = ""
    // const password = ""
    // await thirdPartyApiController(url, payload, username, password)

    // Error handle by express middleware
    Promise.resolve().then(() => {
        throw new Error(JSON.stringify(res))
    }).catch(err => {
        next(err.message);
    })
}
