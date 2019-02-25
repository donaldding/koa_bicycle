const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const bcrypt = require("bcryptjs");
const renderResponse = require("../../util/renderJson");

class UserController {
  static async create(ctx) {
    console.log("haha");
    const user = ctx.request.body;

    if (user.cellphone && user.password) {
      const existUser = await userModel.findUserByCellphone(user.cellphone);
      if (existUser) {
        // 反馈存在用户名
        ctx.response.status = 403;
        ctx.body = renderResponse.ERROR_403("用户已经存在");
      } else {
        // 加密密码
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;

        // 创建用户
        await userModel.create(user).then(db_user => {
          // 签发token
          const userToken = {
            cellphone: db_user.cellphone,
            id: db_user.id
          };

          // 储存token失效有效期1小时
          const token = jwt.sign(userToken, secret.sign, { expiresIn: "1h" });

          ctx.response.status = 200;
          ctx.body = renderResponse.SUCCESS_200("注册成功", token);
        });
      }
    } else {
      ctx.body = renderResponse.ERROR_412("参数错误");
    }
  }
}

module.exports = UserController;
