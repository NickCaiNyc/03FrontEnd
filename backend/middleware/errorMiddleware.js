const errorHandler = (err, req, res, next) => { //server.js
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === ' production' ? null : err.stack,
    })
}
        //deals with output error handling, not to sure what is happening
module.exports = {
    errorHandler
}