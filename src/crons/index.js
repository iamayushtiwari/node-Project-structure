const config = require("@config/index");
const { _envMode } = require("@src/utils/constants/models");

(exports.cron_jobs = async function () {
    if (config.NODE_ENV === _envMode.staging) {
    }
})()