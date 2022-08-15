'use strict';

module.exports = app => {
    const { router, controller } = app;

    // api中间件
    const log = app.middleware.qeelynLog(),
        auth = app.middleware.qeelynApiAuth(),
        pageAuth = app.middleware.qeelynPageAuth();

    // 页面spm中间件
    // app.middleware.qeelynSpmAuth(true);

    // pageAuth,
    router.get('/*', pageAuth, controller.home.index);
    // 根据前端公共部分ui的获取写死统一的配合方式
    // log, auth, 
    router.post('/qeelyn-framework/usercenter-api', controller.qeelynFrameworkApi.ucenterApi);
    // 注销
    router.get('/qeelyn-framework/logout', controller.qeelynFrameworkApi.logout);
    // 当前子系统的spm生产
    router.post('/qeelyn-framework/spm', controller.qeelynFrameworkApi.spm);
    // log
    router.post('/qeelyn-framework/log', controller.qeelynFrameworkApi.log);
};