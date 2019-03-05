const router = require('koa-router')()
const ServicePointController = require('../../app/controller/servicePoint')

router.prefix('/servicePoints')

router.post('/', ServicePointController.create)
router.get('/', ServicePointController.all)
router.post('/:id', ServicePointController.update)
router.get('/:id', ServicePointController.detail)
module.exports = router
