const router = require('koa-router')()
const OrderController = require('../../app/controller/order')

router.prefix('/orders')

router.get('/:id/detail', OrderController.detail)
module.exports = router
