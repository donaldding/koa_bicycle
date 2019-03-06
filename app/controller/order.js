const renderResponse = require('../../util/renderJson')
const {
  Order
} = require('../../db/schema')
const {
  Bicycle
} = require('../../db/schema')
const dateFormat = require('dateformat')
const pagination = require('../../util/pagination')

class OrderController {
  /**
   * 创建订单
   * @param {*} ctx
   */
  static async create (ctx) {
    const user = ctx.current_user
    const data = ctx.request.body
    let {
      bikeId
    } = data
    const bike = await Bicycle.findById({
      where: {
        id: bikeId
      }
    })
    if (bike.status === 'ready') {
      await Bicycle.update({
        state: 'rented'
      }, {
        where: {
          id: bike.id
        }
      }).catch(() => {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('参数错误')
      })
      await bike.reload()
      let randomNum = parseInt(Math.random() * (9999 - 1000 + 1) + 1000)
      let date = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:SS')
      let num = dateFormat(new Date(), 'yyyymmddHHMM') + randomNum
      const order = await Order.create({
        orderNum: num,
        leaseTime: date,
        price: bike.price,
        bicycleId: bike.id,
        userId: user.id
      }).catch(() => {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('订单生成失败，租借失败')
      })
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('订单生成成功,租借成功', order)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('自行车已被预约')
    }
  }

  /**
   * 订单详情
   * @param {*} ctx
   */
  static async detail (ctx) {
    const user = ctx.current_user
    if (user.is_admin) {
      const order = await Order.findById(ctx.params.id)
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('', order)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }

  /**
   * 用户列表所有订单
   * @param {*} ctx
   */
  static async userAllOrder (ctx) {
    const user = ctx.current_user
    const data = ctx.request.body
    let list
    let meta
    const page = data.page ? data.page : 1
    const perPage = data.per_page ? data.per_page : 20

    await Order.findAndCountAll({
      where: {
        userId: user.id
      },
      offset: 20 * (page - 1),
      limit: perPage
    }).then(result => {
      list = result.rows
      meta = {
        page: pagination(result.count, perPage),
        per_page: perPage,
        current_page: page
      }
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('', list, meta)
    })
  }
}

module.exports = OrderController
