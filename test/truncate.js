const db = require("../db/schema");

async function truncate() {
  return await Promise.all(
    Object.keys(db).map(key => {
      if (["sequelize", "Sequelize"].includes(key)) return;
      return db[key].destroy({ where: {}, force: true });
    })
  );
}

module.exports = truncate;
