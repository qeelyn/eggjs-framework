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
        let forIp = this.header ? this.header['x-forwarded-for'] : null;
        return forIp ? forIp : this.ip;
    },
    //统一生成reqId  后续有变化在去调整
    get reqId() {
        return Math.floor(Date.now() + '' + Math.floor(Math.random() * 1000000)).toString(16);
    }
};