'use strict';

const Controller = require('egg').Controller;
const jsonLoggerUtile = require('../../../../../lib/jsonLogger/util');

class HomeController extends Controller {
    async index() {
        const { ctx } = this;
        //记录所有请求日志
        // ctx.logger.info(jsonLoggerUtile.commonJson(ctx));
        // ctx.logger.error('测试错误了');

        ctx.body = '123456';
    }
}

module.exports = HomeController;