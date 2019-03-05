const router = require('koa-router')()
const ServicePointController = require('../../app/controller/servicePoint')

router.prefix('/servicePoints')

router.post('/', ServicePointController.create)

module.exports = router
