const server = require('./server')
const request = require('supertest')
const {
  Order,
  Bicycle,
  User
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
    const bikeState = await Bicycle.findById(bike.id)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const order = response.body.data
    expect(order.bicycleId).toEqual(bike.id)
    expect(order.userId).toEqual(loginUser.body.data.id)
    expect(bikeState.state).toEqual('rented')
    return Order.findAll().then(datas => {
      expect(datas.length).toEqual(1)
    })

  })
})

describe('GET /api/orders/:id/detail', () => {
  test('should return oreder detail', async () => {
    const loginUser = await login()
    const user = await User.findById(loginUser.body.data.id)
    const bike = await Bicycle.create({
      num: '123',
      lat: '11.1',
      lng: '222.3',
      price: '150',
      state: 'ready'
    })
    let order
    await user.createOrder({
      orderNum: '12345678977',
      leaseTime: '2019-03-07 11:55:55',
      price: bike.price,
      bicycleId: bike.id,
    }, {
      include: [Bicycle, User]
    }).then(result => {
      order = result
    })
    const response = await request(server)
      .get(`/api/orders/${order.id}/detail`)
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const orderDetail = response.body.data
    expect(orderDetail.orderNum).toEqual('12345678977')
    expect(orderDetail.id).toEqual(order.id)
    expect(orderDetail.bicycleId).toEqual(bike.id)
    expect(orderDetail.userId).toEqual(loginUser.body.data.id)
  })
})

describe('GET /api/orders/list', () => {
  test('should return user oreder list', async () => {
    const loginUser = await login()
    const user = await User.findById(loginUser.body.data.id)
    const bike = await Bicycle.create({
      num: '123',
      lat: '11.1',
      lng: '222.3',
      price: '150',
      state: 'ready'
    })
    await user.createOrder({
      orderNum: '12345678997',
      leaseTime: '2019-03-07 11:55:55',
      price: bike.price,
      bicycleId: bike.id,
    }, {
      include: [Bicycle, User]
    })
    const response = await request(server)
      .get('/api/orders/list')
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const orderList = response.body.data
    expect(orderList.length).toEqual(1)
    expect(response.body.meta.per_page).toEqual(20)
  })
})

describe('POST /api/orders/:id/return', () => {
  test('return Bicycle', async () => {
    const loginUser = await login()
    const user = await User.findById(loginUser.body.data.id)
    const bike = await Bicycle.create({
      num: '123',
      lat: '11.1',
      lng: '222.3',
      price: '150',
      state: 'ready'
    })
    let order
    await user.createOrder({
      orderNum: '12345678997',
      leaseTime: '2019-03-07 11:55:55',
      price: bike.price,
      bicycleId: bike.id,
    }, {
      include: [Bicycle, User]
    }).then(result => {
      order = result
    })
    const response = await request(server)
      .post(`/api/orders/${order.id}/return`)
      .set('Authorization', loginUser.body.data.token)
      .send({
        bikeId: bike.id
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return await Bicycle.findById(bike.id).then(result => {
      expect(result.state).toEqual('ready')
    })
  })
})

describe('GET /api/orders', () => {
  test('should return system all orders', async () => {
    const loginUser = await login()
    const user = await User.findById(loginUser.body.data.id)
    const bike = await Bicycle.create({
      num: '321',
      lat: '11.11',
      lng: '22.33',
      price: '150',
      state: 'ready'
    })
    let order
    await user.createOrder({
      orderNum: '12345678779',
      leaseTime: '2019-03-07 11:55:55',
      price: bike.price,
    }, {
      include: [User]
    })
    await user.createOrder({
      orderNum: '12345666679',
      leaseTime: '2019-03-07 11:55:55',
      price: '150',
      returnTime: '2019-03-07 11:59:59'
    })
    const response = await request(server)
      .get('/api/orders/')
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const orderList = response.body.data
    expect(orderList.length).toEqual(2)
  })
})