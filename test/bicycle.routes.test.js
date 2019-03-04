const server = require('./server')
const request = require('supertest')
const { Bicycle } = require('../db/schema')
const truncate = require('./truncate')
const login = require('./login')

// close the server after each test
afterAll(() => {
  server.close()
})
beforeEach(async () => {
  await truncate()
})
afterEach(async () => {
  await truncate()
})

describe('POST /api/bicycles', () => {
  test('create bicyle', async () => {
    const bicycles = await Bicycle.findAll()
    expect(bicycles.length).toEqual(0)
    const createUser = await login()
    const response = await request(server)
      .post('/api/bicycles')
      .set('Authorization', createUser.body.data.token)
      .send({
        num: '123',
        lat: '11.1',
        lng: '222.3',
        price: '150'
      })

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return Bicycle.findAll().then(datas => {
      expect(datas.length).toEqual(1)
      expect(datas[0].num).toEqual('123')
      expect(datas[0].state).toEqual('ready')
      expect(datas[0].lat).toEqual(11.1)
      expect(datas[0].lng).toEqual(222.3)
      expect(datas[0].price).toEqual(150)
    })
  })
})

describe('GET /api/bicycles', () => {
  test('should return bicycles', async () => {
    const createUser = await login()
    await Bicycle.create({
      num: '1234',
      lat: '12.34',
      lng: '123.4',
      state: 'ready',
      price: 150
    })
    const response = await request(server)
      .get('/api/bicycles')
      .set('Authorization', createUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.length).toEqual(1)
    const resp_bike = response.body.data[0]
    expect(resp_bike.num).toEqual('1234')
    expect(resp_bike.lat).toEqual(12.34)
    expect(resp_bike.lng).toEqual(123.4)
    expect(resp_bike.state).toEqual('ready')
    expect(resp_bike.price).toEqual(150)
  })
})
