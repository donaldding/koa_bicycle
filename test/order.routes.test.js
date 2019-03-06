const server = require('./server')
const request = require('supertest')
const Order = require('../db/schema')
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