'use strict';
const jsonLoggerUtile = require('../../lib/jsonLogger/util');
const REQID = Symbol.for('logReqId');

/**
 * 日志记录，放在需要记录的路由的 第一个中间件上
 *  @return {void} 
 */
module.exports = () => async(ctx, next) => {
    ctx[REQID] = ctx[REQID] || ctx.reqId;
    let latency = Date.now();
    await next();
    latency = Date.now() - latency;
    if (ctx.response.status === 200) {
        //记录所有正常请求的日志异常日志由异常地方处理
        ctx.logger.info(jsonLoggerUtile.commonJson(ctx, "request", { latency }));
    }
};