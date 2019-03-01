const router = require('koa-router')()
const UserController = require('../../app/controller/user')

router.prefix('/users')

router.get('/info', UserController.getUserMsg)

module.exports = router
