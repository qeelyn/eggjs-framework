'use strict';
/**
 * qeelyn 的spm 验证  专门给页面使用
 * @param {Boolean} isGoLoginPage Boolean  判断是否需要强制前往登陆页面！
 * @return {void}  处理spm
 */
module.exports = isGoLoginPage => {
    return async function qeelynSpmAuth(ctx, next) {
        const spm = ctx.query.spm || '';
        let isTrueLogin = false,
            loginUrl;

        if (spm) {
            // 存放fromAppCode的地方
            ctx.session.fromAppCode = Buffer.from(spm, 'base64').toString().split('-')[0];
            // 如果 spm 存在
            const data = await ctx.service.qeelynSpmClient.getSpm(spm, ctx.request.href);
            if (data) {
                ctx.session.uid = data.uid;
                ctx.session.userId = data.userId;
                ctx.session.orgId = data.orgId;
                ctx.session.refreshToken = data.refreshToken;
                isTrueLogin = true;
            }
        } else if (ctx.query['from_app_code']) {
            ctx.session.fromAppCode = ctx.query['from_app_code'];
        }

        if (ctx.session.uid && ctx.session.orgId) {
            // 如果 uid 和orgId 存在
            isTrueLogin = true;
        }
        // 处理登录地址选哪里问题
        if (ctx.session.fromAppCode && ctx.app.config.appCodeLogin) {
            loginUrl = ctx.app.config.appCodeLogin[ctx.session.fromAppCode]
        }
        if (!loginUrl) {
            loginUrl = ctx.app.config.pageConfig.loginUrl
        }

        if (isGoLoginPage && !isTrueLogin) {
            ctx.unsafeRedirect(`${loginUrl}?callback=${ctx.request.href}`);
        } else {
            if (ctx.query.token_oid) {
                ctx.session.orgId = ctx.query.token_oid;
            }
            await next();
        }

    };
};