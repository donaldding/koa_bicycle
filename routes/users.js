const router = require("koa-router")();
const UserController = require("../app/controller/user");

router.prefix("/api/users");

router.post("/", UserController.create);

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "get /api/users"
  });
});

module.exports = router;
