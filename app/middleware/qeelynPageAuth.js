'use strict';
const jwt = require('jsonwebtoken')
const fs = require('fs')

/**
 * qeelyn 路由权限
 * @return {void}  处理spm
 */
module.exports = () => {
    return async function qeelynPageAuth(ctx, next) {
        //是否前往登陆
        let isLogin = false,
            loginUrl;
        if (ctx.query['from_app_code']) {
            ctx.session.fromAppCode = ctx.query['from_app_code']
        }
        if (ctx.session.uid) {
            try {
                // JWT验证
                const pemPath = ctx.app.config.publicKeyPath;
                const decoded = jwt.verify(ctx.session.uid, fs.readFileSync(pemPath));
                ctx.session.userId = decoded.sub;
            } catch (err) {
                isLogin = true;
                ctx.session.uid = null;
            }
        } else {
            isLogin = true;
        }
        if (ctx.session.fromAppCode && ctx.app.config.appCodeLogin) {
            loginUrl = ctx.app.config.appCodeLogin[ctx.session.fromAppCode]
        }
        if (!loginUrl) {
            loginUrl = ctx.app.config.pageConfig.loginUrl
        }
        if (!isLogin) {
            const result = await ctx.service.qeelynAuthClient.canAccessUrl(ctx.path);
            if (result && result.code === "200") {
                await next();
            } else {
                ctx.redirect('/403.html');
            }
        } else {
            let params = [];
            if (ctx.session.orgId) {
                params.push(`token_oid=${ctx.session.orgId}`)
            }
            if (ctx.session.loginOrgId) {
                params.push(`token_login_oid=${ctx.session.loginOrgId}`)
            }
            params.push(`callback=${encodeURIComponent(ctx.request.href)}`)
            ctx.unsafeRedirect(`${loginUrl}?${params.join('&')}`);
        }
    };
};