const apiRouter = require('koa-router')()
const user = require('./users')

apiRouter.prefix('/api')

const routers = [user]
for (var router of routers) {
  apiRouter.use(router.routes(), router.allowedMethods())
}

module.exports = apiRouter
