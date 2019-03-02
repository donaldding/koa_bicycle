const server = require('./server')
const request = require('supertest')
const db = require('../db/schema')
const truncate = require('./truncate')
const User = db['User']
const login = require('./login')

// close the server after each test
afterAll(() => {
  server.close()
})

describe('POST /api/session/sign_up', () => {
  beforeEach(async () => {
    // db.sequelize.sync({ force: true });
    // await spawn("./node_modules/.bin/sequelize", ["db:migrate"], spawnOptions);
    await truncate()
    console.log('clean db')
  })
  test('should respond as expected', async () => {
    const users = await User.findAll()
    expect(users.length).toBe(0)
    const response = await request(server)
      .post('/api/session/sign_up')
      .send({
        cellphone: '12345678',
        password: '123456',
        name: 'test',
        gender: 'f'
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    User.findAll().then(datas => {
      expect(datas.length).toBe(1)
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
        // gender: 'g',
      })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.data.name).toEqual('test1')
  })
})