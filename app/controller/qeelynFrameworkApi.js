'use strict';

const Controller = require('egg').Controller;
const jsonLoggerUtile = require('../../lib/jsonLogger/util');

class QeelynFrameworkApiController extends Controller {


    /**
     * user gql ucenterApi
     */
    async ucenterApi() {
        const { ctx, config } = this;
        ctx.body = await ctx.service.apiHttpClient.gqlApi(config.api.deoGateway + '/gql/usercenter_gql',
            ctx.request.body.query,
            ctx.request.body.variables
        );
    }

    /**
     * spm创建
     */
    async spm() {
        const { ctx } = this;
        const body = await this.service.qeelynSpmClient.createSpm({
            uid: ctx.session.uid,
            userId: ctx.session.userId,
            refreshToken: ctx.session.refreshToken,
            orgId: ctx.session.orgId,
            loginOrgId: ctx.session.loginOrgId,
        }, ctx.request.body.host);
        ctx.body = { 'data': body };
    }

    /**
     * 更新token
     */
    async refreshToken() {
        const { ctx, config } = this;
        ctx.body = await this.service.qeelynAuthClient.refreshToken(ctx.session.refreshToken, config.loginFrom);
    }

    /**
     * 更新orgId
     */
    async seOid() {
        const { ctx, } = this;
        if (ctx.request.body.oid && ctx.request.body.login_oid) {
            ctx.session.orgId = ctx.request.body.oid;
            ctx.session.loginOrgId = ctx.request.body.login_oid;
            ctx.body = { data: true };
        }
    }

    /**
     * 注销
     */
    async logout() {
        const { ctx, config } = this;
        await this.service.qeelynAuthClient.logout(config.loginFrom);
        ctx.session.uid = null;
        ctx.session.refreshToken = null;
        ctx.redirect('/');
    }

    /**
     * 前端使用的日志，用来记录路由或者某些特别需要记录到后端的日志
     */
    async log() {
        const { ctx } = this;
        ctx.response.status = 200
        ctx.logger.info(jsonLoggerUtile.commonJson(ctx, 'feLog'));
        ctx.body = { data: true };
    }

}

module.exports = QeelynFrameworkApiController;