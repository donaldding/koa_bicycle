const renderResponse = require('../../util/renderJson')
const {
  sequelize,
  Bicycle
} = require('../../db/schema')
const pagination = require('../../util/pagination')
class BicycleController {
  /**
   * 创建单车
   * @param {*} ctx
   */
  static async create (ctx) {
    let {
      num,
      lat,
      lng,
      price
    } = ctx.request.body

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
    const {
      lat,
      lng
    } = ctx.query
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
        include: [
          [distance, 'distance']
        ]
      },
      where: sequelize.where(distance, {
        $lte: 3000
      }),
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

    let {
      num,
      lat,
      lng,
      price
    } = ctx.request.body

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
    if (bike.state === 'ready') {
      await Bicycle.update({
        state: 'booked',
        userId: ctx.current_user.id
      }, {
        where: {
          id: bike.id
        }
      }).catch(() => {
        ctx.response.status = 412
        ctx.body = renderResponse.ERROR_412('参数错误')
      })
      await bike.reload()
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('预约成功', bike)
    } else {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('自行车已经被预约')
    }
  }

  /**
   * 获取用户预约的单车列表
   * @param {*} ctx
   */
  static async bookList (ctx) {
    const user = ctx.current_user
    const datas = ctx.request.body
    let meta
    const page = datas.page ? datas.page : 1
    const perPage = datas.per_page ? datas.per_page : 20
    await Bicycle.findAndCountAll({
      where: {
        userId: user.id
      },
      offset: 20 * (page - 1),
      limit: perPage
    }).then(result => {
      meta = {
        page: pagination(result.count, perPage),
        per_page: perPage,
        current_page: page
      }
      ctx.response.status = 200
      ctx.body = renderResponse.SUCCESS_200('', result.rows, meta)
    }).catch(() => {
      ctx.response.status = 412
      ctx.body = renderResponse.ERROR_412('参数错误')
    })
  }
}

module.exports = BicycleController
