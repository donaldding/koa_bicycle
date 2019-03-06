const server = require('./server')
const request = require('supertest')
const {
  Order,
  Bicycle
} = require('../db/schema')
const truncate = require('./truncate')
const login = require('./login')

afterAll(() => {
  server.close()
})

beforeEach(async () => {
  await truncate()
})

afterEach(async () => {
  await truncate()
})

describe('POST /api/orders/renting', () => {
  test('create order', async () => {
    const orders = await Order.findAll()
    expect(orders.length).toEqual(0)
    const loginUser = await login()
    const bike = await Bicycle.create({
      num: '123',
      lat: '11.1',
      lng: '222.3',
      price: '150',
      state: 'ready'
    })
    const response = await request(server)
      .post('/api/orders/renting')
      .set('Authorization', loginUser.body.data.token)
      .send({
        bikeId: bike.id
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return Order.findAll().then(datas => {
      expect(response.body.data).toEqual(1)
    })
  })
})