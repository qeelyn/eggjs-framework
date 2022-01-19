'use strict';
const Service = require('egg').Service;
const REQID = Symbol.for('logReqId');
const jsonLoggerUtile = require('../../lib/jsonLogger/util');

/**
 * 用户授权的一些接口
 */
class QeelynAuthClientService extends Service {


    /**
      * 登陆
      * @param {String} account  用户名
      * @param {String} password 加密密码
      * @param {String} app_code  登录的应用code
      * @param {String} from     发送方web或者api
      * @param {String} wechatCode   微信登录的code
      * @return {Object} api结果
      */
    async login(account = '', password = '', app_code, wechatCode, from = 'web') {
        const { app, ctx } = this;
        // access_token  token
        // refresh_token  refresh_token
        // expires_in   过期时间
        return await this.curCurl(app.config.api.ucenterAuth + '/login', {
            login_name: account,
            password,
            from,
            app_code,
            wechatCode
        }, 'POST');
    }

    /**
     * 绑定微信
     * @param {String} account  用户名
     * @param {String} password 加密密码
     * @param {String} app_code  登录的应用code
     * @param {String} from     发送方web或者api
     * @param {String} rdwc_code   未绑定的时候给的code
     * @return {Object} api结果
     */
    async bindWX(account = '', password = '', app_code, rdwc_code, from = 'web') {
        const { app, ctx } = this;
        // access_token  token
        // refresh_token  refresh_token
        // expires_in   过期时间
        return await this.curCurl(app.config.api.ucenterAuth + '/bind_and_login', {
            login_name: account,
            password,
            app_code,
            from,
            rdwc_code
        }, 'POST');
    }

    /**
     * 登录用户的组织列表
     * @return {Object} api结果
     */
    async orgList(from = 'web') {
        const { app, ctx } = this;
        return await this.curCurl(app.config.api.ucenterAuth + '/can/login/orgs', {
            from
        }, 'POST');
    }

    /**
     * 退出登陆
     * @param {String} from     发送方web或者api
     * @return {Object} api结果
     */
    async logout(from = 'web') {
        const { app, ctx } = this;
        return await this.curCurl(app.config.api.ucenterAuth + '/logout', {
            from,
        }, 'POST');
    }

    /**
     * 更新token
     * @param {String} from     发送方web或者api
     * @return {Object} api结果
     */
    async refreshToken(refresh_token = '', from = 'web') {
        const { app, ctx } = this;
        return await this.curCurl(app.config.api.ucenterAuth + '/refresh_token', {
            refresh_token,
            from,
        }, 'POST');
    }

    /** 
     * 验证url路由授权
     * @param {String} url url地址
     * @return {Promise.<*|null>} 结果
     */
    async canAccessUrl(router = '') {
        const { app, ctx } = this;
        return await ctx.service.apiHttpClient.httpApi(app.config.api.ucenterAuth + '/access/can', {
            permission: router,
            orgId: ctx.session.orgId,
            loginOrgId: ctx.session.loginOrgId,
            appCode: ctx.app.config.appCode
        }, 'POST');
    }

    /**
     * 用在当前service请求
     * @param {Sting} url     请求地址
     * @param {Object} data   数据
     * @param {Sting} method  请求类型
     * @param {Object} headers  头部对象
     * @return {Promise.<Object[]|string|CanvasPixelArray|data|{login_name, password, from}|{grant_type, client_id, client_secret}|*>} 用在当前service请求
     */
    async curCurl(url, data = {}, method = 'POST', headers = {}) {
        const { app, ctx } = this;
        ctx[REQID] = ctx[REQID] || ctx.reqId;

        headers = {
            'Authorization': ctx.session.uid ? `Bearer ${ctx.session.uid}` : undefined,
            'Qeelyn-Tracing-Id': ctx[REQID],
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': ctx.header.referer,
            'User-Agent': ctx.header['user-agent'],
            "X-Forwarded-For": ctx.xip,
            'Client-IP': ctx.xip,
            ...headers
        }

        try {
            const result = await app.curl(url, {
                method,
                contentType: 'json',
                data,
                headers,
                dataType: 'json',
            });

            if (result.status === 200) {
                ctx.response.set('Cache-Control', 'no-cache');
            } else {
                ctx.response.status = result.status;
                ctx.logger.error(jsonLoggerUtile.commonJson(ctx, "error", { errorMsg: result.data, ctxHeader: ctx.header }));
            }
            return result.data;
        } catch (e) {
            ctx.response.status = 500;
            ctx.logger.error(jsonLoggerUtile.commonJson(ctx, "error", { errorMsg: e, ctxHeader: ctx.header }));
            return ctx.helper.errorOut('接口访问异常！');
        }
    }


    /**  未启用
     * 通过oauth 获取票据
     * @param {Sting} client_id       id
     * @param {Sting} client_secret   value
     * @param {Sting} grant_type       类型
     * @return {Promise.<*|null>}  结果
     */
    async getTicket(client_id = '', client_secret = '', grant_type = 'client_credentials') {
        const { app } = this;
        return await this.curCurl(app.config.api.ucenterAuth + '/oauth2/v1/token', {
            grant_type,
            client_id,
            client_secret,
        });
    }

}

module.exports = QeelynAuthClientService;