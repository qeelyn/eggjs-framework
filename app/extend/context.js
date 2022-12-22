'use strict';

module.exports = {
    get logger() {
        return this.jsonLogger;
    },
    get coreLogger() {
        return this.jsonLogger;
    },
    get jsonLogger() {
        const logger = {};
        ['info', 'debug', 'warn', 'error'].forEach(level => {
            logger[level] = (...args) => {
                this.app.logger[level](...args)
            }
        });
        return logger;
    },
    //获取真实IP
    get xip() {
        if (this.header && this.header['x-forwarded-for']) {
            return this.header['x-forwarded-for'];
        } else {
            return this.ip;
        }
    },
    //统一生成reqId
    get reqId() {
        // 由于nginx 生成的req_id 是32位  超过java long类型导致无法根据这个操作进行传递
        // if (this.header && this.header['x-request-id']) {
        //     return this.header['x-request-id'];
        // } else {
        // }
        // 由于js Number 最大长度问题 只能处理16位数字因此调整了算法保证不会重复
        const value = Number(Date.now() * 1000 + Math.floor(Math.random() * 1000)).toString(16);
        return `0${Array(16 - value.length).join('0')}${value}`;
    }
};