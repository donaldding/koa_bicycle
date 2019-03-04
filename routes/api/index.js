const apiRouter = require('koa-router')()
const user = require('./users')
const bicycle = require('./bicycle')

apiRouter.prefix('/api')

const routers = [user, bicycle]
for (var router of routers) {
  apiRouter.use(router.routes(), router.allowedMethods())
}

module.exports = apiRouter
