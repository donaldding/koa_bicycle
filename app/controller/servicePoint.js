const {
  ServicePoints
} = require('../../db/schema')
const renderResponse = require('../../util/renderJson')
const pagination = require('../../util/pagination')

class ServicepointController {
  /**
   * 创建网点（仅限管理员）
   * @param ctx
   * @returns {Promise<void>}
   */
  static async create (ctx) {
    const point = ctx.request.body
    const user = ctx.current_user
    if (user.is_admin) {
      let {
        name,
        lat,
        lng
      } = point
      await ServicePoints.create({
        name,
        lat,
        lng
      }).then(data => {
        ctx.response.status = 200
        ctx.body = renderResponse.SUCCESS_200('创建成功', data)
      })
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }

  /**
   * 获取网点列表
   * @param {*} ctx
   */
  static async all (ctx) {
    const user = ctx.current_user
    const data = ctx.request.body
    if (user.is_admin) {
      let list
      let meta
      const page = data.page ? data.page : 1
      const perPage = data.per_page ? data.per_page : 20
      await ServicePoints.findAndCountAll({
        offset: 20 * (page - 1),
        limit: perPage
      }).then(result => {
        list = result.rows
        meta = {
          page: pagination(result.count, perPage),
          per_page: perPage,
          current_page: page
        }
      })
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('', list, meta)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }
}

module.exports = ServicepointController
