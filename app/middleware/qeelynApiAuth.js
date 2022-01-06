'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');

/**
 * qeelyn 的jwt 验证处理
 *  @return {void}  验证结果对resopnse.status进行设置
 */
module.exports = () => {
    return async function qeelynApiAuth(ctx, next) {
        if (ctx.headers.authorization) {
            let authAry = ctx.headers.authorization.split(' ');
            if (authAry[0] === 'Bearer') {
                ctx.session.uid = authAry[1];
            }
        }
        const uid = ctx.session.uid;
        ctx.session.orgId = ctx.headers['org-id'];
        ctx.session.loginOrgId = ctx.headers['login-org-id'];

        try {
            // JWT验证
            const pemPath = ctx.app.config.publicKeyPath;
            const decoded = jwt.verify(uid, fs.readFileSync(pemPath));
            ctx.session.userId = decoded.sub;
            await next();
            //更新csrf
            if (ctx.request.body.query && ctx.request.body.query.indexOf('mutation') > -1) {
                // 调用 rotateCsrfSecret 刷新用户的 CSRF token
                ctx.rotateCsrfSecret();
            }
        } catch (err) {
            ctx.session.uid = null;
            ctx.logger.warn(err);
            ctx.response.status = 401;
        }
    };
};