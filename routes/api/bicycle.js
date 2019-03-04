const router = require('koa-router')()
const BicycleController = require('../../app/controller/bicycle')

router.prefix('/bicycles')

router.post('/', BicycleController.create)
router.get('/', BicycleController.all)

module.exports = router
