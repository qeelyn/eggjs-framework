'use strict';
const crypto = require('crypto');
const jsonLoggerUtile = require('../../lib/jsonLogger/util');

/**
 * web api 请求 防重 防串改签名验证
 * @param {*} ctx 
 */
module.exports = () => {

    return async function qeelynValidSign(ctx, next) {
        let isTrue = true,
            config = ctx.app.config.validSign,
            signAry = [
                `appkey=${config ? config.appkey : ''}`
            ],
            expiredTime = config ? config.expiredTime : 60;

        if (config && config.isEnable) {
            if (ctx.headers["authorization"]) {
                signAry.push(`authorization=${ctx.headers["authorization"]}`);
            }
            if (ctx.headers["qeelyn-org-id"]) {
                signAry.push(`qeelyn-org-id=${ctx.headers["qeelyn-org-id"]}`);
            }
            if (ctx.headers["nonce"]) {
                signAry.push(`nonce=${ctx.headers["nonce"]}`);
            }
            if (ctx.headers["timestamp"]) {
                signAry.push(`timestamp=${ctx.headers["timestamp"]}`);
            }

            if (ctx.request.url.indexOf('?') != -1) {
                signAry = [].concat(signAry, ctx.request.url.split('?')[1].split('&'))
            }
            signAry = signAry.sort();
            let serviceSign = crypto.createHash('md5').update(signAry.join('')).digest('hex').toLowerCase();

            if ((Date.now() - ctx.headers["timestamp"]) / 1000 > expiredTime) {
                ctx.logger.error(jsonLoggerUtile.commonJson(ctx, "error", { errorMsg: '签名已超过超时', ctxHeader: ctx.headers }));
                isTrue = false;
            } else if (await ctx.app.cache.get(`${ctx.app.config.appCode}:${serviceSign}`)) {
                ctx.logger.error(jsonLoggerUtile.commonJson(ctx, "error", { errorMsg: '重复请求', ctxHeader: ctx.headers }));
                isTrue = false;
            } else if (ctx.headers["sign"] != serviceSign) {
                ctx.logger.error(jsonLoggerUtile.commonJson(ctx, "error", { errorMsg: '签名验证失败', ctxHeader: ctx.headers }));
                isTrue = false;
            } else {
                await ctx.app.cache.set(`${ctx.app.config.appCode}:${serviceSign}`, serviceSign, expiredTime);
            }

            if (isTrue) {
                await next();
            } else {
                ctx.response.status = 403;
            }

        } else {
            await next();
        }
    }
};