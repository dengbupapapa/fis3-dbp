module.exports = {
    versions: (process.env.NODE_ENV == 'production') ? '?' + new Date().getTime() : '',
}