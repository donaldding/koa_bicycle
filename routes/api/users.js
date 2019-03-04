const router = require('koa-router')()
const UserController = require('../../app/controller/user')

router.prefix('/users')

router.get('/info', UserController.getUserMsg)
router.get('/all', UserController.all)
router.post('/update', UserController.update)

module.exports = router
