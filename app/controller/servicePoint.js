const {
  ServicePoints
} = require('../../db/schema')
const {
  Bicycle
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

  /**
   * 更新网点
   * @param {*} ctx
   */
  static async update (ctx) {
    const user = ctx.current_user
    if (user.is_admin) {
      const point = await ServicePoints.findById(ctx.params.id)

      let {
        name,
        lat,
        lng
      } = ctx.request.body

      await point.update({
        name,
        lat,
        lng
      }).catch(() => {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('参数错误')
      })
      await point.reload()
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('修改成功', point)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }

  /**
   * 获取网点详情
   * @param {*} ctx
   */
  static async detail (ctx) {
    const user = ctx.current_user
    if (user.is_admin) {
      const point = await ServicePoints.findById(ctx.params.id)
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('', point)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }

  /**
   * 绑定单车到网点
   * @param {*} ctx
   */
  static async add (ctx) {
    const user = ctx.current_user
    let {
      ids
    } = ctx.request.body
    if (user.is_admin) {
      const pointId = ctx.params.id
      let updateList = []
      for (let i = 0; i < ids.length; i++) {
        const bike = await Bicycle.findById(ids[i])
        await Bicycle.update({
          servicePointId: pointId
        }, {
          where: {
            id: ids[i]
          }
        }).catch(() => {
          ctx.response.status = 412
          ctx.body = renderResponse.ERROR_412('参数错误')
        })
        updateList.push(bike.id)
      }
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('以下单车绑定成功', updateList)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }

  /**
   * 查询这个网点的所有单车
   * @param {*} ctx
   */
  static async allBicycle (ctx) {
    const user = ctx.current_user
    const pointId = ctx.params.id
    const data = ctx.request.body
    if (user.is_admin) {
      let list
      let meta
      const page = data.page ? data.page : 1
      const perPage = data.per_page ? data.per_page : 20
      await ServicePoints.findAndCountAll({
        include: [{
          model: Bicycle,
          where: {
            servicePointId: pointId
          },
          offset: 20 * (page - 1),
          limit: perPage
        }]
      }).then(result => {
        list = result.rows[0]
        meta = {
          page: pagination(result.count, perPage),
          per_page: perPage,
          current_page: page
        }
        ctx.response.status = 200
        ctx.body = renderResponse.SUCCESS_200('', list, meta)
      })
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }
}

module.exports = ServicepointController
