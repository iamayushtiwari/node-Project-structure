function serviceResponse({ status, data, message, errors, errorCode }) {
    this.status = status || 200;
    this.data = data ? data : {};
    this.message = message || "";
    this.errorCode = errorCode || "";
    this.errors = errors ? errors : [];
    this.version = '1.0';
};

module.exports = { serviceResponse };
