const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const ServicePoint = db['ServicePoints']
const login = require('./login')
const createPoint = require('./createServicePoints.js')

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

describe('GET /api/servicePoints', () => {
  test('should return points', async () => {
    const loginUser = await login()
    await createPoint()
    const response = await request(server)
      .get('/api/servicePoints')
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.length).toEqual(1)
  })
  test('should return points(when many points)', async () => {
    const loginUser = await login()
    for (let i = 1; i <= 22; i++) {
      await createPoint(i)
    }
    const response = await request(server)
      .get('/api/servicePoints')
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.page).toEqual(2)
    expect(response.body.meta.per_page).toEqual(20)
  })
  test('should return points(when send page)', async () => {
    const loginUser = await login()
    for (let i = 1; i <= 22; i++) {
      await createPoint(i)
    }
    const response = await request(server)
      .get('/api/servicePoints')
      .set('Authorization', loginUser.body.data.token)
      .send({
        page: 2
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.current_page).toEqual(2)
    expect(response.body.data.length).toEqual(2)
  })
  test('should return points(when send per_page)', async () => {
    const loginUser = await login()
    for (let i = 1; i <= 22; i++) {
      await createPoint(i)
    }
    const response = await request(server)
      .get('/api/servicePoints')
      .set('Authorization', loginUser.body.data.token)
      .send({
        per_page: 22,
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.page).toEqual(1)
    expect(response.body.meta.per_page).toEqual(22)
    expect(response.body.data.length).toEqual(22)
  })
})

describe('POST /api/servicePoints/:id', () => {
  test('should update the points', async () => {
    const loginUser = await login()
    point = await ServicePoint.create({
      name: '网点1',
      lat: '122.55',
      lng: '123.55'
    })

    const response = await request(server)
      .post(`/api/servicePoints/${point.id}`)
      .set('Authorization', loginUser.body.data.token)
      .send({
        name: '季华路网点',
        lat: '123.55',
        lng: '145.55'
      })
    const resp_point = response.body.data
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(resp_point.name).toEqual('季华路网点')
    expect(resp_point.lat).toEqual(123.55)
    expect(resp_point.lng).toEqual(145.55)
  })
})