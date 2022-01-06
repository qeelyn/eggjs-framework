'use strict';
const REQID = Symbol.for('logReqId');
const moment = require('moment')
/**
 * 
 */
module.exports = {

    // 日志格式化输出
    formatter(data) {
        let traceId = undefined,
            requestId = undefined,
            logType = undefined;
        if (data.message && typeof data.message === 'string') {
            try {
                const jsonMessage = JSON.parse(data.message);
                if (jsonMessage.traceId) {
                    traceId = jsonMessage.traceId;
                    // delete jsonMessage['traceId'];
                }
                if (jsonMessage.requestId) {
                    requestId = jsonMessage.requestId;
                    // delete jsonMessage['requestId'];
                }
                if (jsonMessage.logType) {
                    logType = jsonMessage.logType;
                    // delete jsonMessage['logType'];
                }
            } catch (e) {
                //这里出现异常是正常的 无法解析json我们就不处理依旧执行下去
            }
        }
        if (traceId) {
            data.traceId = traceId;
        } else {
            data.traceId = Math.floor(Date.now() + '' + Math.floor(Math.random() * 1000000)).toString(16);
        }
        if (logType) {
            data.logType = logType;
        }
        if (requestId) {
            data.requestId = requestId;
        }
        data.date = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
        return JSON.stringify(data);
    },
    // 日志公共部分输出
    commonJson(ctx, type = "request", options = {}) {
        ctx[REQID] = ctx[REQID] || ctx.reqId;
        let logJson = {
            traceId: ctx[REQID],
            origin: ctx.origin,
            clientIp: ctx.xip,
            module: ctx.app.config.appCode,
            method: ctx.method,
            userId: ctx.session.userId,
            orgId: ctx.session.orgId,
            loginOrgId: ctx.session.loginOrgId,
            path: ctx.path,
            logType: type
        };
        if (ctx.headers) {
            logJson.userAgent = ctx.headers['user-agent'] ? ctx.headers['user-agent'] : undefined
            logJson.referer = ctx.headers['referer'] ? ctx.headers['referer'] : undefined
            if (ctx.headers['x-request-id']) {
                logJson.requestId = ctx.headers['x-request-id']
            }
            if (ctx.headers['x-ip-city']) {
                logJson.city = ctx.headers['x-ip-city']
            }
            if (ctx.headers['route']) {
                logJson.route = ctx.headers['route']
            } else {
                if (ctx.headers.referer && ctx.headers.origin) {
                    logJson.route = ctx.headers.referer.replace(ctx.headers.origin, '').replace(/(\?|\#)(\S)*/g, '');
                }
            }
        }
        if (ctx.request) {
            logJson.body = ctx.request.body
        }
        if (ctx.response) {
            logJson.status = ctx.response.status
        }

        return JSON.stringify(Object.assign(logJson, options));
    },
};