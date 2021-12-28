# eggjs qeelyn framework

    基于eggjs整理了一套服务端框架

## 具体引用
```
npm i egg-qeelyn-framework --S
```
再package.json中增加
```
{
    ...
    "egg": {
        "framework": "egg-qeelyn-framework"
    },
    ...
}
```

## 已启动的功能

1. 默认配置了json日志输出
2. redis (目前redis，外部项目需要自己配置)
3. 加载框架的controller （给vue框架公共区域调用的api、spm创建的api、注销用户api、前端日志记录）
4. 中间件的引入 （api用户验证、spm跨系统服务）
5. service  （统一的http请求格式封装、邮件发送、登陆验证中心接口、spm的创建使用）
6. 工具类 （可以统一的json格式输出）

## controllser

#### 介绍
框架controllser是和vue-qeelyn-components的前端vue模块配合调用的api接口层，主要用处理公共头部的接口、spm的创建接口、用户注销的logout接口

#### 使用方式
路由配置即可使用。   （copy过去就可以了）
```
    // 前端公共部分ui的api
    router.post('/qeelyn-framework/usercenter-api', controller.qeelynFrameworkApi.ucenterApi);
    // 注销api
    router.get('/qeelyn-framework/logout', controller.qeelynFrameworkApi.logout);
    // 前端日志记录使用
    router.get('/qeelyn-framework/log', controller.qeelynFrameworkApi.log);
    // spm生产api   spm的使用需要配置redis
    router.post('/qeelyn-framework/spm', controller.qeelynFrameworkApi.spm);
```

## extend

#### 介绍
规范 输出和某种特定请求的获取

#### 使用方式 helper.js
具体内容说明在对应文件中可以查看
```
    //规范输出
    ctx.helper.jsonResult(data, error)
    ctx.helper.errorOut(errors)
    //特殊格式获取
    ctx.helper.getQueryData(query, method)
```

#### 使用方式 context.js
```
    //日志的json输出  (目前废弃)
    ctx.logger
    //真实ip获取 会获取代理中的x-forwarded-for
    ctx.xip
    //处理生成reqId
    ctx.reqId
```


## middleware

#### 介绍
middleware是和路由配合，在子系统的路由中调用。主要处理api的jwt验证、spm的用户服务、记录request log、防重、防串改签名验证

jwt验证需要一个 rsa_pub.pem 的解密文件 放在子系统的app目录下

#### 使用方式
在路由中使用  具体内容说明在对应文件中可以查看
```
    // 用于api处理
    const qeelynApiAuth = app.middleware.qeelynApiAuth(),
        qeelynValidSign = app.middleware.qeelynValidSign(),
        qeelynLog = app.middleware.qeelynLog();
    router.post('/api/xxx',qeelynValidSign, qeelynLog, qeelynApiAuth, controller.api.api);

    // 用于页面路由处理
    const qeelynSpmAuth = app.middleware.qeelynSpmAuth(),
        qeelynPageAuth = app.middleware.qeelynPageAuth();
    router.get('/*',qeelynSpmAuth, qeelynPageAuth, controller.home.index);
```

## service

#### 介绍
框架service提供一些可以给系统调用的service 主要有 统一的qeelyn服务端模拟http请求、邮件发送、用户登陆和信息查询服务、spm服务

#### 使用方式
具体内容说明在对应文件中可以查看
```
    //举了个例子
    const body = await this.service.qeelynSpmClient.createSpm();
```

## config

配置文件 config.default.js 具体已再文件内备注好
```
    //针对自己的系统定义一个appCode（必须配置）
    config.appCode = '';

    //发送邮件需要配置
    config.mailer={};

```

## 单元测试

可参考eggjs的单元测试
本项目的单元测试目录在test下，运行如下代码可以进行单元测试：
```
    npm run test-local  xxxx（代表test对应目录文件）
    npm run test-local test/service/qeelynSpmClient.test.js
```

运行时需要再test\fixtures\example\config增加 config.unittest.js 
```
'use strict';
const path = require('path');

module.exports = {
    //公钥的位置
    publicKeyPath: path.join(__dirname, 'rsa_pub.pem'),
    api: {
        deoGateway: 'xxx',
        ucenterAuth: 'xxx',
    },
    keys: 'xxx',
    mailer: {
        host: 'smtp.exmail.qq.com',
        user: 'xxx',
        pass: '',
        port: '465',
    },
    cache: {
        redis: {
            type: 'Redis',
            port: xxx,
            host: 'xxx',
            db: 0,
        },
    },
    appCodeLogin: {
        'deo.backend': 'http://xxx'
    },
    pageConfig: {
        loginUrl: 'http://xxx'
    },
};
```