const server = require('./server')
const request = require('supertest')

async function login() {
  return await request(server)
    .post('/api/session/sign_in')
    .send({
      cellphone: '12345678',
      password: '123456'
    })
}

module.exports = login