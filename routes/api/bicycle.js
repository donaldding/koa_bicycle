const router = require('koa-router')()
const BicycleController = require('../../app/controller/bicycle')

router.prefix('/bicycles')

router.post('/', BicycleController.create)
router.get('/', BicycleController.all)
router.post('/:id', BicycleController.update)
router.post('/:id/book', BicycleController.book)
router.get('/nearby', BicycleController.nearby)
router.get('/book', BicycleController.bookList)

module.exports = router
