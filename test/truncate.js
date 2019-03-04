const db = require('../db/schema')
const Bicycle = db.Bicycle

async function truncate() {
  return Promise.all(
    Object.keys(db).map(key => {
      if (['sequelize', 'Sequelize'].includes(key)) return
      return db[key].destroy({ where: {}, force: true })
    })
  )
}

module.exports = truncate
