const renderResponse = require('../../util/renderJson')
const { Bicycle } = require('../../db/schema')

class BicycleController {
  /**
   * 创建单车
   * @param {*} ctx
   */
  static async create (ctx) {
    let { num, lat, lng, price } = ctx.request.body

    const dbBicycle = await Bicycle.create({
      num,
      lat,
      lng,
      price,
      state: 'ready'
    })

    ctx.response.status = 200
    ctx.body = renderResponse.SUCCESS_200('创建成功', dbBicycle)
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
}

module.exports = BicycleController
