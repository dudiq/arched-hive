exports.isProd = function () {
  return process.env.NODE_ENV === 'production'
}
