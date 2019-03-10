const renderResponse = require('../../util/renderJson')
const { User, Order, Bicycle } = require('../../db/schema')
const dateFormat = require('dateformat')
const pagination = require('../../util/pagination')

class OrderController {
  /**
   * 创建订单
   * @param {*} ctx
   */
  static async create (ctx) {
    const data = ctx.request.body
    const user = ctx.current_user
    let { bikeId } = data
    const bike = await Bicycle.findById(bikeId)
    let randomNum = parseInt(Math.random() * (9999 - 1000 + 1) + 1000)
    let date = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:SS')
    let num = dateFormat(new Date(), 'yyyymmddHHMM') + randomNum
    if (bike.state === 'ready') {
      let orderCreate
      await user
        .createOrder(
          {
            orderNum: num,
            leaseTime: date,
            price: bike.price,
            bicycleId: bike.id,
            state: 'renting'
          },
          {
            include: [Bicycle, User]
          }
        )
        .then(result => {
          ctx.response.status = 200
          ctx.body = renderResponse.SUCCESS_200('订单生成成功,租借成功', result)
          orderCreate = true
        })
        .catch(() => {
          ctx.response.status = 412
          ctx.body = renderResponse.ERROR_412('订单生成失败，租借失败')
          orderCreate = false
        })
      if (orderCreate) {
        await Bicycle.update(
          {
            state: 'rented'
          },
          {
            where: {
              id: bike.id
            }
          }
        ).catch(() => {
          ctx.response.status = 412
          ctx.body = renderResponse.ERROR_412('参数错误')
        })
        await bike.reload()
      }
    } else if (bike.state == 'booked') {
      let bookedBike = await user.getBicycle()
      if (bookedBike.id === bike.id) {
        let order = await user.createOrder({
          orderNum: num,
          leaseTime: date,
          price: bike.price,
          bicycleId: bike.id,
          state: 'renting'
        })
        await bookedBike.update({
          state: 'rented'
        })
        ctx.response.status = 200
        ctx.body = renderResponse.SUCCESS_200('订单生成成功,租借成功', order)
      } else {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('自行车已被预约')
      }
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('自行车已被预约')
    }
  }

  /**
   * 结束订单
   * @param {*} ctx
   */
  static async finishOrder (ctx) {
    const user = ctx.current_user
    const order = await Order.findById(ctx.params.id)
    const bike = await order.getBicycle()
    const startTime = new Date(order.leaseTime)
    const endTime = new Date()
    const time = Math.ceil((endTime - startTime) / 1000 / 60)
    var cost = time * order.price
    if (isNaN(cost)) {
      cost = bike.price
    }

    if (order.userId === user.id && order.state === 'renting') {
      let updatdOrder = await order.update({
        returnTime: dateFormat(endTime, 'yyyy-mm-dd HH:MM:SS'),
        total: cost,
        state: 'finish'
      })
      await bike.update({
        state: 'ready'
      })
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('归还成功', updatdOrder)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('只能结束自己进行中的订单')
      orderEnd = false
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
      limit: perPage,
      include: [Bicycle]
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

  /**
   * 获取系统里的订单
   * @param {*} ctx
   */
  static async getAllOrder (ctx) {
    const user = ctx.current_user
    const data = ctx.request.body
    let list
    let meta
    const page = data.page ? data.page : 1
    const perPage = data.per_page ? data.per_page : 20
    if (user.is_admin) {
      await Order.findAndCountAll({
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
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('权限不足')
    }
  }
}

module.exports = OrderController
