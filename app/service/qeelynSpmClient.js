'use strict';
const Service = require('egg').Service;
const crypto = require('crypto');

/**
 * 用户授权的一些接口
 */
class QeelynSpmClientService extends Service {

    /**
     * 创建spm
     * @param {Object} data 一般记入必须数据
     * @param {String} host host地址
     * @return {String} spm 的字符串
     */
    async createSpm(data = {}, host = null) {
        const { app, ctx } = this,
        time = 20;
        const spm = Buffer.from(`${app.config.appCode}-${this.encodeHost(host)}-${Date.now()}`).toString('base64');
        await app.cache.set(spm, JSON.stringify(data), time);
        return spm;
    }

    /**
     * 获取spm
     * @param {String} spm spm字符串
     * @param {String} host host地址
     * @return {Object|null} 获取结果
     */
    async getSpm(spm, host = null) {
        const { app } = this;
        if (spm && host) {
            var verifySpm = Buffer.from(spm, 'base64').toString('ascii');
            verifySpm = verifySpm.split('-');
            if (this.encodeHost(host) === verifySpm[1]) {
                const data = await app.cache.get(spm);
                if (data) {
                    await app.cache.set(spm, null);
                    return JSON.parse(data);
                }
            }
        }
        return null;
    }

    /**
     * 编译host
     * @param {String} host host地址
     * @return {String} 获取结果
     */
    encodeHost(host = '') {
        let str = '';
        if (host) {
            const md5 = crypto.createHash('md5');
            const urlMath = host.split('/')[2];
            str = md5.update(urlMath).digest('hex');
        }
        return str;
    }

}

module.exports = QeelynSpmClientService;