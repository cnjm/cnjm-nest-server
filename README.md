## 项目

[nest_template](https://github.com/cnjm-cli-template/nest_server.git)

[文章链接](https://blog.csdn.net/weixin_42998707/category_11219947.html)

## 安装依赖

```bash
$ yarn install
```

## 启动

启动前需要先配置好相应的 .env相关文件  .template.env 是示例模板

```bash
# 开发模式
$ yarn run start

# 开发模式，并能监听文件的变化重启
$ yarn run start:dev

# 生产构建
$ yarn run build
```

## 说明

1. 项目是一些管道验证、过滤器、日志、jwt、Redis使用、中间件等的示例代码，并且是从项目中剔除其他内容产生的，删了多余文件之后并没有逐一校验过，只是一些代码思路，功能示例。

2. 角色权限管理就只是简单的key的字符串来做的，用空再改造RBAC模式的，但个人觉得还是看具体想要什么样的效果吧，目前随意来的。

3. 因为有微信小程序登录的示例，可以去掉，或者自己完成小程序端的代码。

5. Redis的应用有jwt的单点登录、缓存的，还有订单超时的队列的。



## 常用异常

```
BadRequestException — 400 - 错误请求
UnauthorizedException — 401 - 未经授权
ForbiddenException — 403 - 禁止访问
NotFoundException — 404 - 资源未找到
NotAcceptableException — 406  不可接受
RequestTimeoutException — 408 - 请求超时
ConflictException — 409 - 冲突
GoneException — 410 - 消失
PayloadTooLargeException — 413 - 载具
UnsupportedMediaTypeException — 415 - 未支持的媒体类型
UnprocessableEntityException — 422 - 不可处理的实体
InternalServerErrorException — 500 - 内部服务器错误
NotImplementedException — 501 - 没被实现
BadGatewayException — 502 - 网关出问题
ServiceUnavailableException — 503 - 服务不可用
GatewayTimeoutException — 504 - 网关超时

```




