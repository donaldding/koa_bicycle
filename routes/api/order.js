const router = require('koa-router')()
const OrderController = require('../../app/controller/order')

router.prefix('/orders')

router.post('/renting', OrderController.create)
router.get('/list', OrderController.userAllOrder)
router.get('/:id/detail', OrderController.detail)
router.post('/:id/return', OrderController.finishOrder)
router.get('/', OrderController.userAllOrder)
module.exports = router
