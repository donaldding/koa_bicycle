const {
  ServicePoints
} = require('../db/schema')

async function createPoint(i = 1) {
  await ServicePoints.create({
    name: '网点' + i,
    lng: '123.44',
    lat: '134.44',
  })
}

module.exports = createPoint