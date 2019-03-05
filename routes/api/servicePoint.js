const router = require('koa-router')()
const ServicePointController = require('../../app/controller/servicePoint')

router.prefix('/servicePoints')

router.post('/', ServicePointController.create)
router.get('/', ServicePointController.all)
router.post('/:id', ServicePointController.update)
router.get('/:id', ServicePointController.detail)
router.post('/:id/add', ServicePointController.add)
router.get('/:id/bicycles', ServicePointController.allBicycle)
module.exports = router
