'use strict';
const path = require('path');
const { formatter } = require('../lib/jsonLogger/util');

module.exports = appInfo => {
    const config = {};

    config.keys = appInfo.name + '_v1.0.0';

    // 登录退出刷新token使用[web|api]
    config.loginFrom = 'web';

    //公钥的位置
    config.publicKeyPath = path.join(appInfo.baseDir, 'app/rsa_pub.pem');

    // 请求地址配置
    config.api = {
        // 用户资料相关api
        deoGateway: '',
        // 登录、相关api
        ucenterAuth: '',
    };

    //页面要用的配置，登陆地址和用户中心地址
    config.pageConfig = {
        // 登录的地址
        loginUrl: '',
        // 用户中心host
        ucenterHost: ''
    };

    // 每个项目有自己独立的appCode不可以重复
    config.appCode = '';

    // 防重 防串改中间件配置
    config.validSign = {
        isEnable: true,
        appkey: 'qeelynAppTestKey',
        expiredTime: 60
    };

    // 不配置默认redis 但是启动spm需要redis
    // config.cache = {
    //     redis: {
    //         type: 'Redis',
    //         port: 6379,
    //         host: '192.168.0.20',
    //         db: 0,
    //     },
    // };

    // log处理配置
    config.logger = {
        dir: path.join(appInfo.baseDir, 'logs'),
        appLogName: 'web.log',
        formatter
    };


    // 日志一存在天数
    config.logrotator = {
        maxDays: 20,
    };

    // 邮件发送
    config.mailer = {
        host: 'smtp.exmail.qq.com',
        user: '',
        pass: '',
        port: '465',
    };

    return config;
};