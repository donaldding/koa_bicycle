const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const ServicePoint = db['ServicePoints']
const login = require('./login')
const createUser = require('./createUser')

afterAll(() => {
  server.close()
})

beforeEach(async () => {
  await truncate()
})

afterEach(async () => {
  await truncate()
})

describe('POST /api/servicePoints', () => {
  test('create servicePoint', async () => {
    const points = await ServicePoint.findAll()
    expect(points.length).toEqual(0)
    const loginUser = await login()
    const response = await request(server)
      .post('/api/servicePoints')
      .set('Authorization', loginUser.body.data.token)
      .send({
        name: '佛山季华路网点',
        lat: '123.11',
        lng: '124.11'
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.name).toEqual('佛山季华路网点')
    expect(response.body.data.lat).toEqual(123.11)
    expect(response.body.data.lng).toEqual(124.11)
  })
})