const apiRouter = require('koa-router')()
const user = require('./users')
const bicycle = require('./bicycle')
const servicePoint = require('./servicePoint')
const order = require('./order')

apiRouter.prefix('/api')

const routers = [user, bicycle, servicePoint, order]
for (var router of routers) {
  apiRouter.use(router.routes(), router.allowedMethods())
}

module.exports = apiRouter
