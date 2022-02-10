'use strict';
const Service = require('egg').Service;
const REQID = Symbol.for('logReqId');
const jsonLoggerUtile = require('../../lib/jsonLogger/util');

/**
 * 常用的qeelyn api请求方式
 */
class ApiHttpClientService extends Service {

    /**
     * 正常使用的http处理
     * @param {String} url    请求url
     * @param {Object} data   请求数据
     * @param {String} method  请求方式
     * @param {Object} headers  请求头
     * @return {Object} 请求结果
     */
    async httpApi(url, data, method, headers = {}) {
        const { ctx, app } = this,
            deviceId = ctx.header['device-id'],
            sign = ctx.header['sign'],
            nonce = ctx.header['nonce'],
            referer = ctx.header['referer'],
            timestamp = ctx.header['timestamp'];
        let ticket = ctx.session.uid ? ctx.session.uid : '';
        ticket = ticket ? ('Bearer ' + ticket) : null;

        try {
            const result = await app.curl(url, {
                rejectUnauthorized: false,
                method,
                contentType: 'json',
                data,
                dataType: 'json',
                headers: ctx.helper.jsonTrimFormat({
                    'Qeelyn-Tracing-Id': ctx[REQID],
                    'Device-Id': deviceId,
                    'Authorization': ticket,
                    'Org-Id': ctx.headers['org-id'] ? ctx.headers['org-id'] : ctx.session.orgId,
                    'Login-Org-Id': ctx.headers['login-org-id'] ? ctx.headers['login-org-id'] : ctx.session.loginOrgId,
                    'Nonce': nonce,
                    'Timestamp': timestamp,
                    'Sign': sign,
                    'Referer': referer,
                    'User-Agent': ctx.header['user-agent'],
                    "X-Forwarded-For": ctx.xip,
                    ...headers,
                }),
            });

            if (result.status === 200) {
                ctx.response.set('Cache-Control', 'no-cache');
            } else {
                ctx.response.status = result.status;
                let errorMsg = '';
                if (typeof result === 'string') {
                    errorMsg = result;
                } else {
                    errorMsg = JSON.stringify(result);
                }
                ctx.logger.error(jsonLoggerUtile.commonJson(ctx, "error", { errorMsg, ctxHeader: ctx.header }));
            }
            return result.data;
        } catch (e) {
            ctx.response.status = 500;
            ctx.logger.error(jsonLoggerUtile.commonJson(ctx, "error", { errorMsg: e, ctxHeader: ctx.header }));
            return ctx.helper.errorOut('接口访问异常！');
        }
    }


    /**
     * gql api
     * @param {String} url 请求地址
     * @param {String} query      gql 的query
     * @param {Object} variables  对应query里面的参数
     * @param {Boolean} isBanKeyword  是否拦截关键字
     * @param {Object} header  请求头
     * @return {Object} api结果
     */
    async gqlApi(url, query, variables, isBanKeyword = true, header = {}) {
        const { ctx, app } = this;
        if (isBanKeyword) {
            if (['__schema'].filter(item => query.indexOf(item) > -1).length) {
                ctx.response.status = 403;
                return ctx.helper.errorOut('没有访问权限！');
            }
        }

        return await this.httpApi(url, {
            query,
            variables,
        }, 'POST', header);
    }

}

module.exports = ApiHttpClientService;