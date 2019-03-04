const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const {
  User
} = require('../../db/schema')
const pagination = require('../../util/pagination')

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
        const dbUser = await User.create(user)
        // 签发token
        const userToken = {
          cellphone: dbUser.cellphone,
          id: dbUser.id
        }
        // 储存token失效有效期1小时
        const token = jwt.sign(userToken, secret.sign, {
          expiresIn: '1h'
        })

        ctx.response.status = 200
        ctx.body = renderResponse.SUCCESS_200('注册成功', token)
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
          username: user.name,
          id: user.id
        }
        // 签发token
        const token = jwt.sign(userToken, secret.sign, {
          expiresIn: '1h'
        })

        ctx.response.status = 200
        ctx.body = renderResponse.SUCCESS_200('登录成功', {
          id: user.id,
          username: user.name,
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

  /**
   * 获取用户信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserMsg (ctx) {
    const user = ctx.current_user
    if (user) {
      const info = {
        id: user.id,
        username: user.name,
        cellphone: user.cellphone,
        avatar: user.avatar,
        balance: user.balance,
        gender: user.gender
      }
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('获取成功', info)
    } else {
      ctx.response.status = 403
      ctx.body = renderResponse.ERROR_403('用户不存在')
    }
  }

  /**
   * 更新用户信息
   * @param ctx
   * @returns {Promise<void>}
   */
  static async update (ctx) {
    let {
      name,
      avatar,
      gender
    } = ctx.request.body
    const user = ctx.current_user
    if (user) {
      await User.update({
        name,
        avatar,
        gender
      }, {
        where: {
          id: user.id
        }
      }).catch((err) => {
        console.log(err)
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('参数错误')
      })
      const updateUser = await userModel.findUserById(user.id)
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('修改成功', updateUser)
    }
  }

  /**
   * 查询用户列表（仅限管理员）
   * @param {*} ctx
   */
  static async all (ctx) {
    const user = ctx.current_user
    const data = ctx.request.body
    if (user.is_admin) {
      let list
      let meta
      if (data.page) {
        await User.findAndCountAll({
          offset: 20 * (data.page - 1),
          limit: 20
        }).then(result => {
          list = result.rows
          meta = {
            page: pagination(result.count),
            per_page: 20
          }
        })
      } else if (data.per_page) {
        await User.findAndCountAll({
          limit: data.per_page
        }).then(result => {
          list = result.rows
          meta = {
            page: pagination(result.count, data.per_page),
            per_page: data.per_page
          }
        })
      } else {
        await User.findAndCountAll({
          limit: 20
        }).then(result => {
          list = result.rows
          meta = {
            page: pagination(result.count),
            per_page: 20
          }
        })
      }

      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('', list, meta)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足', user)
    }
  }
}

module.exports = UserController
