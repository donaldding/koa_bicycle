const jwt = require('jsonwebtoken')
const secret = require('../../config/secret')
const renderJson = require('../../util/renderJson')
const User = require('../models/user')

module.exports = function () {
  return async (ctx, next) => {
    const token = ctx.header.authorization
    if (token) {
      let userId
      await jwt.verify(token, secret.sign, (err, decoded) => {
        if (err) {
          ctx.response.status = 401
          ctx.body = renderJson.ERROR_401('未授权')
          return
        }
        userId = decoded.id
      })
      ctx.current_user = await User.findUserById(userId)
      if (ctx.current_user) {
        return next()
      }
    }
    ctx.response.status = 401
    ctx.body = renderJson.ERROR_401('未授权')
  }
}
