# 用 Koa 实现类似摩拜单车的项目

### 模块

#### 1.User 用户

##### 属性&copy;

- name 名称
- cellphone 手机号（唯一）
- password 密码
- account 账户余额 (需要添加)
- 头像 （需要添加）
- 性别 （需要添加）

##### 接口

- [x] 注册
- [x] 登陆
- [ ] 获取个人信息&copy;
- [ ] 修改个人信息&copy;
- [ ] 列表(admin)&copy;

#### 2. 服务网点 ServicePoint &copy;

##### 属性

- name 名称
- 经度
- 纬度

##### 接口

- [ ] 创建(admin)
- [ ] 列表(admin)
- [ ] 详情(admin)
- [ ] 修改(admin)
- [ ] 查询这个网点的所有单车 (admin)

#### 3. 骑行订单 order &copy;

##### 属性

- 订单号 唯一
- 租赁时间
- belongs_to bike
- belongs_to user
- 单价
- 租赁时间
- 总价

##### 接口

- [ ] 创建订单 (相当于扫码开始租单车)
- [ ] 结束订单 (相当于归还单车)
- [ ] 用户的所有订单列表
- [ ] 系统里所有订单列表(admin)
- [ ] 详情

#### 4. 共享单车 bike

##### 属性

- 编号 唯一
- 经度
- 纬度
- 状态
- 单价
- has_many order
- belongs_to 服务网点

##### 接口

- [x] 创建单车 (admin)
- [x] 修改 (admin)
- [x] 所有单车列表(admin)
- [x] 用户附近的单车列表
- [x] 预约（预约不是租赁，单车处于预约状态时，其他人无法租赁或预约。预约人需要 5 分钟内创建订单，否则预约失效）
