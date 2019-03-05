const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const User = db['User']
const login = require('./login')
const createUser = require('./createUser')

// close the server after each test
afterAll(() => {
  server.close()
})
beforeEach(async () => {
  truncate()
})
afterEach(async () => {
  await truncate()
})

describe('POST /api/session/sign_up', () => {
  test('should respond as expected', async () => {
    const users = await User.findAll()
    expect(users.length).toEqual(0)
    const response = await request(server)
      .post('/api/session/sign_up')
      .send({
        cellphone: '12345678',
        password: '123456',
        name: 'test',
        gender: 'f',
        is_admin: true,
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    return User.findAll().then(datas => {
      expect(datas[0].is_admin).toEqual(true)
      expect(datas.length).toEqual(1)
    })
  })
})

describe('GET /api/users/info', () => {
  test('should respond as expected', async () => {
    const createUser = await login()

    const response = await request(server)
      .get('/api/users/info')
      .set('Authorization', createUser.body.data.token)
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.cellphone).toEqual('12345678')
  })
})

describe('POST /api/users/update', () => {
  test('should respond as expected', async () => {
    const createUser = await login()

    const response = await request(server)
      .post('/api/users/update')
      .set('Authorization', createUser.body.data.token)
      .send({
        name: 'test1',
        avatar: 'www.baidu.com',
        gender: 'g',
        balance: 123
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.name).toEqual('test1')
    expect(response.body.data.avatar).toEqual('www.baidu.com')
    expect(response.body.data.gender).toEqual('g')
    expect(response.body.data.balance).toEqual(null)
  })
})

describe('GET /api/users/all', () => {
  test('should return users(When the user is 1)', async () => {
    const loginUser = await login()

    const response = await request(server)
      .get('/api/users/all')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
  })
  test('should return users(When many users)', async () => {
    const loginUser = await login()

    for (let i = 1; i <= 21; i++) {
      await createUser()
    }

    const response = await request(server)
      .get('/api/users/all')
      .set('Authorization', loginUser.body.data.token)

    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.page).toEqual(2)
  })
  test('should return users(When send per_page)', async () => {
    const loginUser = await login()

    for (let i = 1; i <= 21; i++) {
      await createUser()
    }

    const response = await request(server)
      .get('/api/users/all')
      .set('Authorization', loginUser.body.data.token)
      .send({
        per_page: 21
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.per_page).toEqual(21)
    expect(response.body.data.length).toEqual(21)
  })
  test('should return users(When send page)', async () => {
    const loginUser = await login()

    for (let i = 1; i <= 21; i++) {
      await createUser()
    }

    const response = await request(server)
      .get('/api/users/all')
      .set('Authorization', loginUser.body.data.token)
      .send({
        page: 2
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.meta.page).toEqual(2)
  })
})