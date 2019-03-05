const {
  User
} = require('../db/schema')
const bcrypt = require('bcryptjs')

async function createUser() {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync('123456', salt)
  for (i = 1; i <= 21; i++) {
    if (i == 1) {
      await User.create({
        cellphone: '12345678',
        password: hash,
        is_admin: true
      })
    } else {
      await User.create({
        cellphone: '12345' + getRandom(100, 999),
        password: hash,
      })
    }

  }

}

function getRandom(x, y) {
  return parseInt(Math.random() * (y - x + 1) + x)
}

module.exports = createUser