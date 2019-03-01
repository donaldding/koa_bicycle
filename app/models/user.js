const User = require("../../db/schema")["User"];

User.sync({ force: false });

class UserModel {
  /**
   * 创建用户
   * @param user
   * @returns {Promise<boolean>}
   */
  static async create(user) {
    let { cellphone, password, name, gender } = user;

    await User.create({
      cellphone,
      password,
      name,
      gender
    });
    return true;
  }

  /**
   * 删除用户
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async delete(id) {
    await User.destroy({
      where: {
        id
      }
    });
    return true;
  }

  /**
   * 查询用户列表
   * @returns {Promise<*>}
   */
  static async findAllUserList() {
    return await User.findAll({
      attributes: ["id", "cellphone"]
    });
  }

  /**
   * 查询用户信息
   * @param cellphone  手机号
   * @returns {Promise.<*>}
   */
  static async findUserByCellphone(cellphone) {
    return await User.findOne({
      where: {
        cellphone
      }
    });
  }
 
  /**
   * @param userid 用户id
   * @returns {Promise.<*>}
   */
  static async findUserById(userid) {
    return await User.findOne({
      where: {
        id: userid
      }
    })
  }
}

module.exports = UserModel;
