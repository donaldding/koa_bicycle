const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const ServicePoint = db['ServicePoints']
const {
  Bicycle
} = require('../db/schema')
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
    expect(response.body.data[0].bicycleCount).toEqual(0)
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
      .get(`/api/servicePoints/?page=2`)
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.current_page).toEqual('2')
    expect(response.body.data.length).toEqual(2)
  })
  test('should return points(when send per_page)', async () => {
    const loginUser = await login()
    for (let i = 1; i <= 22; i++) {
      await createPoint(i)
    }
    const response = await request(server)
      .get('/api/servicePoints/?per_page=22')
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.page).toEqual(1)
    expect(response.body.meta.per_page).toEqual('22')
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

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const resp_point = response.body.data
    expect(resp_point.name).toEqual('季华路网点')
    expect(resp_point.lat).toEqual(123.55)
    expect(resp_point.lng).toEqual(145.55)
  })
})

describe('GET /api/servicePoints/:id', () => {
  test('should return the point detail', async () => {
    const loginUser = await login()
    point = await ServicePoint.create({
      name: '网点1',
      lat: '122.55',
      lng: '123.55'
    })

    const response = await request(server)
      .get(`/api/servicePoints/${point.id}`)
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const resp_point = response.body.data
    expect(resp_point.name).toEqual('网点1')
  })
})

describe('POST /api/servicePoints/:id/add', () => {
  test('add bicyles to servicePoints', async () => {
    const loginUser = await login()
    point = await ServicePoint.create({
      name: '网点1',
      lat: '122.55',
      lng: '123.55'
    })
    bike = await Bicycle.create({
      num: '1234',
      lat: '12.34',
      lng: '123.4',
      state: 'ready',
      price: 150
    })
    const response = await request(server)
      .post(`/api/servicePoints/${point.id}/add`)
      .set('Authorization', loginUser.body.data.token)
      .send({
        ids: [bike.id]
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return Bicycle.findOne({
      where: {
        id: bike.id
      }
    }).then(result => {
      expect(result.servicePointId).toEqual(point.id)
    })
  })
})

describe('GET /api/servicePoints/:id/bicycles', () => {
  test('should return this servicePoint all bicycles', async () => {
    const loginUser = await login()
    point = await ServicePoint.create({
      name: '网点1',
      lat: '122.55',
      lng: '123.55'
    })
    bike = await Bicycle.create({
      num: '1234',
      lat: '12.34',
      lng: '123.4',
      state: 'ready',
      price: 150
    })
    bike2 = await Bicycle.create({
      num: '1235',
      lat: '12.34',
      lng: '123.4',
      state: 'ready',
      price: 150
    })
    await request(server)
      .post(`/api/servicePoints/${point.id}/add`)
      .set('Authorization', loginUser.body.data.token)
      .send({
        ids: [bike.id, bike2.id]
      })

    const response = await request(server)
      .get(`/api/servicePoints/${point.id}/bicycles`)
      .set('Authorization', loginUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const resp_point = response.body.data
    expect(resp_point.Bicycles.length).toEqual(2)
    return await ServicePoint.findById(point.id).then(result => {
      expect(result.bicycleCount).toEqual(2)
    })
  })
})