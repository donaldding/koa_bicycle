const server = require('./server')
const request = require('supertest')
const createUser = require('./createUser')

async function login() {
  await createUser()

  return await request(server)
    .post('/api/session/sign_in')
    .send({
      cellphone: '12345678',
      password: '123456'
    })
}

module.exports = login