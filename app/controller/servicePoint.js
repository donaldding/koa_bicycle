const {
  ServicePoints
} = require('../../db/schema')
const renderResponse = require('../../util/renderJson')

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
}

module.exports = ServicepointController
