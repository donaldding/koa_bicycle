const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const secret = require('../../config/secret')
const renderResponse = require('../../util/renderJson')

class UserController {
  /**
   * 创建用户
   * @param ctx
   * @returns {Promise<void>}
   */
  static async create (ctx) {
    const user = ctx.request.body

    if (user.cellphone && user.password) {
      const existUser = await userModel.findUserByCellphone(user.cellphone)
      if (existUser) {
        // 反馈存在用户名
        ctx.response.status = 403
        ctx.body = renderResponse.ERROR_403('用户已经存在')
      } else {
        // 加密密码
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash

        // 创建用户
        await userModel.create(user).then((dbUser) => {
          // 签发token
          const userToken = {
            cellphone: dbUser.cellphone,
            id: dbUser.id
          }

          // 储存token失效有效期1小时
          const token = jwt.sign(userToken, secret.sign, { expiresIn: '1h' })

          ctx.response.status = 200
          ctx.body = renderResponse.SUCCESS_200('注册成功', token)
        })
      }
    } else {
      ctx.body = renderResponse.ERROR_412('参数错误')
    }
  }

  /**
   * 登录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login (ctx) {
    const data = ctx.request.body
    // 查询用户
    const user = await userModel.findUserByCellphone(data.cellphone)
    // 判断用户是否存在
    if (user) {
      // 判断前端传递的用户密码是否与数据库密码一致
      if (bcrypt.compareSync(data.password, user.password)) {
        // 用户token
        const userToken = {
          username: user.username,
          id: user.id
        }
        // 签发token
        const token = jwt.sign(userToken, secret.sign, { expiresIn: '1h' })

        ctx.response.status = 200
        ctx.body = renderResponse.SUCCESS_200('登录成功', {
          id: user.id,
          username: user.username,
          token
        })
      } else {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('用户名或密码错误')
      }
    } else {
      ctx.response.status = 403
      ctx.body = renderResponse.ERROR_403('用户不存在')
    }
  }
}

module.exports = UserController
