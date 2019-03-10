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

describe('GET /api/bicycles/nearby', () => {
  test('should return nearby bicycles', async () => {
    // correct order
    // 39.9145440225,116.4046888931
    // 39.9136881169,116.4085512741
    // 39.9143974408,116.4182501831
    // 39.9139603945,116.4272874090
    const createUser = await login()
    const bike1 = await Bicycle.build({
      num: '1234',
      lng: '116.4085512741',
      lat: '39.9136881169',
      state: 'ready',
      price: 150
    }).save()

    const bike2 = await Bicycle.build({
      num: '1235',
      lng: '116.4272874090',
      lat: '39.9139603945',
      state: 'ready',
      price: 150
    }).save()

    const bike3 = await Bicycle.build({
      num: '12356',
      lng: '116.4182501831',
      lat: '39.9143974408',
      state: 'ready',
      price: 150
    }).save()

    const response = await request(server)
      .get('/api/bicycles/nearby')
      .set('Authorization', createUser.body.data.token)
      .query({
        lat: 39.9145440225,
        lng: 116.4046888931
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.length).toEqual(3)

    expect(response.body.data[0].num).toEqual(bike1.num)
    expect(response.body.data[1].num).toEqual(bike3.num)
    expect(response.body.data[2].num).toEqual(bike2.num)
  })
})

describe('POST /api/bicycles/:id', () => {
  test('should update the bicycle', async () => {
    const createUser = await login()
    bicyle = await Bicycle.create({
      num: '1234',
      lat: '12.34',
      lng: '123.4',
      state: 'ready',
      price: 150
    })
    const response = await request(server)
      .post(`/api/bicycles/${bicyle.id}`)
      .set('Authorization', createUser.body.data.token)
      .send({
        num: '312',
        price: '120'
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const resp_bike = response.body.data
    expect(resp_bike.num).toEqual('312')
    expect(resp_bike.lat).toEqual(12.34)
    expect(resp_bike.lng).toEqual(123.4)
    expect(resp_bike.state).toEqual('ready')
    expect(resp_bike.price).toEqual(120)
    expect(resp_bike.location.coordinates).toEqual([123.4, 12.34])
  })
})

describe('POST /api/bicycles/:id/book', () => {
  beforeEach(async () => {
    await truncate()
  })
  test('should book the bicycle if ready', async () => {
    const createUser = await login()
    bicyle = await Bicycle.create({
      num: '1234',
      lat: '12.34',
      lng: '123.4',
      state: 'ready',
      price: 150
    })
    const response = await request(server)
      .post(`/api/bicycles/${bicyle.id}/book`)
      .set('Authorization', createUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    const resp_bike = response.body.data
    expect(resp_bike.num).toEqual('1234')
    expect(resp_bike.lat).toEqual(12.34)
    expect(resp_bike.lng).toEqual(123.4)
    expect(resp_bike.state).toEqual('booked')
    expect(resp_bike.price).toEqual(150)
  })

  test('should return error if not ready', async () => {
    const createUser = await login()
    bicyle = await Bicycle.create({
      num: '1234',
      lat: '12.34',
      lng: '123.4',
      state: 'booked',
      price: 150
    })
    const response = await request(server)
      .post(`/api/bicycles/${bicyle.id}/book`)
      .set('Authorization', createUser.body.data.token)

    expect(response.status).toEqual(412)
    expect(response.type).toEqual('application/json')
  })
})

describe('GET /api/bicycles/book', () => {
  test('should return user book list', async () => {
    const createUser = await login()
    bicyle = await Bicycle.create({
      num: '1234',
      lat: '12.34',
      lng: '123.4',
      state: 'ready',
      price: 150
    })
    await request(server)
      .post(`/api/bicycles/${bicyle.id}/book`)
      .set('Authorization', createUser.body.data.token)

    const response = await request(server)
      .get('/api/bicycles/book')
      .set('Authorization', createUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.length).toEqual(1)
  })
})
