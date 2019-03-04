const renderResponse = require('../../util/renderJson')
const { sequelize, Bicycle } = require('../../db/schema')
class BicycleController {
  /**
   * 创建单车
   * @param {*} ctx
   */
  static async create (ctx) {
    let { num, lat, lng, price } = ctx.request.body

    const bike = await Bicycle.build({
      num,
      lat,
      lng,
      price,
      state: 'ready'
    }).save()
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('创建成功', bike)
  }

  /**
   * 查询所有单车
   * @param {*} ctx
   */
  static async all (ctx) {
    const datas = await Bicycle.findAll()
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  /**
   * 查询附近3km内的单车
   * @param {*} ctx
   */
  static async nearby (ctx) {
    const { lat, lng } = ctx.query
    if (!lat || !lng) {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('参数错误')
      return
    }
    const location = sequelize.literal(
      `ST_GeomFromText('POINT(${lng} ${lat})')`
      // `ST_GeomFromText('POINT(-71.064544 42.28787)')`
    )
    var distance = sequelize.fn(
      'ST_Distance_Sphere',
      sequelize.literal('location'),
      location
    )

    const datas = await Bicycle.findAll({
      attributes: {
        include: [[distance, 'distance']]
      },
      where: sequelize.where(distance, { $lte: 3000 }),
      order: sequelize.literal('distance ASC')
    })
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('', datas)
  }

  /**
   * 更新
   * @param {*} ctx
   */
  static async update (ctx) {
    const bike = await Bicycle.findById(ctx.params.id)

    let { num, lat, lng, price } = ctx.request.body

    await bike
      .update({
        num,
        lat,
        lng,
        price
      })
      .catch(() => {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('参数错误')
      })
    await bike.reload()
    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('修改成功', bike)
  }

  /**
   * 预约
   * @param {*} ctx
   */
  static async book (ctx) {
    const bike = await Bicycle.findById(ctx.params.id)
    if (bike.state == 'ready') {
      await Bicycle.update(
        {
          state: 'booked',
          userId: ctx.current_user.id
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
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('修改成功', bike)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('自行车已经被预约')
    }
  }
}

module.exports = BicycleController
