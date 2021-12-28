'use strict';
const assert = require('assert');
const Promise = require('bluebird');

const Memcached = require('memcached');
const Redis = require('ioredis');

/**
 * config
 * config.cache = {
 *   men: {
 *     type: 'MemCache',
 *     host: 'localhost:32770',
 *     options: {},
 *   },
 *   redis:{
 *     type: 'Redis',
 *     port: 6379,
 *     host: '127.0.0.1',
 *     password: 'auth',
 *     db: 0
 *   }
 * }
 *
 * 默认 get set方法为第一个cache
 * 使用方式：
 *    get => this.ctx.cache.get(name)
 *    set => this.ctx.cache.set(name, value, lifetime)
 *
 * 针对cahce调用 *按上面的配置方式
 * 使用方式：
 *
 *    （ type: 'MemCache'）
 *    await this.ctx.cache.men.setAsync('foo', 'bar', lifetime);  设置
 *    let value = await this.ctx.cache.men.getAsync('foo');  获取
 *
 *    （ type: 'Redis'）
 *    await this.ctx.cache.redis.set(name, value, 'EX', lifetime);  设置
 *    let value = await this.ctx.cache.redis.get('foo');  获取
 *
 * memcached api https://github.com/3rd-Eden/memcached
 * @param {Object} app egg app对象
 */
module.exports = app => {
    const cacheConfig = app.config.cache;
    let defaultName = null,
        defaultType = null;
    app.cache = {};
    for (const key in cacheConfig) {
        const config = cacheConfig[key];
        if (!defaultName) {
            defaultName = key;
            defaultType = config.type;
        }
        if (config.type) {
            if (config.type === 'MemCache') {
                app.cache[key] = createMemCache(config, app);
            } else if (config.type === 'Redis') {
                app.cache[key] = createRedis(config, app);
            }
        } else {
            const err = new Error();
            err.message = `[egg-cache] cache.${key} type undefined`;
            app.coreLogger.error(err);
        }
    }

    // 默认走第一个
    app.cache.get = async name => {
        if (defaultType === 'MemCache') {
            return await app.cache[defaultName].getAsync(name);
        } else if (defaultType === 'Redis') {
            return await app.cache[defaultName].get(name);
        }
    };

    app.cache.set = async(name, value, lifetime) => {
        if (defaultType === 'MemCache') {
            if (value === null || value === undefined) {
                return await app.cache[defaultName].del(name);
            } else {
                if (lifetime) {
                    return await app.cache[defaultName].setAsync(name, value, lifetime);
                }
                return await app.cache[defaultName].setAsync(name, value);
            }

        } else if (defaultType === 'Redis') {
            if (value === null || value === undefined) {
                return await app.cache[defaultName].del(name);
            } else {
                if (lifetime) {
                    return await app.cache[defaultName].set(name, value, 'EX', lifetime);
                }
                return await app.cache[defaultName].set(name, value);
            }

        }
    };

};


/**
 * 创建memcache
 * await cache.setAsync('foo', 'bar', 300);  设置
 * let value = await cache.getAsync('foo');  获取
 * @param {Object} config 配置对象
 * @param {Object} app egg app对象
 * @return {memcache} 构建了一个memcache对象
 */
function createMemCache(config, app) {
    assert(config.host, '[egg-memcache] url is required on config');
    app.coreLogger.info('[egg-memcache] connecting ' + config.host);
    const memcached = new Memcached(config.host, config.options);

    memcached.on('failure', details => {
        const err = new Error();
        err.message = `[egg-memcache] Server ${details.server} went down due to: ${details.message.join('')}`;
        app.coreLogger.error(err);
    });

    memcached.on('reconnecting', details => {
        const err = new Error();
        err.message = `[egg-memcache] Total downtime caused by server ${details.server}: ${details.totalDownTime} ms.`;
        app.coreLogger.error(err);
    });

    memcached.on('issue', details => {
        const err = new Error();
        err.message = `[egg-memcache] Server ${details.server} has problem: ${details.message.join('')}, and trying again.`;
        app.coreLogger.error(err);
    });
    memcached.on('reconnect', details => {
        const info = `[egg-memcache] Server ${details.server} reconnect success.`;
        app.coreLogger.info(info);
    });
    memcached.on('remove', details => {
        const info = `[egg-memcache] Server ${details.server} has been removed`;
        app.coreLogger.info(info);
    });

    return Promise.promisifyAll(memcached);

}


/**
 * 生成创建redis
 * await cache.set(name, value, 'EX', lifetime);  设置
 * let value = await cache.get('foo');  获取
 * @param {Object} config 配置对象
 * @param {Object} app egg app对象
 * @return {Redis} 构建了一个Redis对象
 */
function createRedis(config, app) {
    const redis = new Redis({
        port: config.port,
        host: config.host,
        password: config.password,
        family: config.family ? config.family : 4,
        db: config.db,
    });

    redis.on('connect', function() {
        app.coreLogger.info('[egg-redis] connect success on redis://:%s@%s:%s/%s',
            config.password, config.host, config.port, config.db);
    });
    redis.on('error', function(error) {
        app.coreLogger.error(error);
    });

    return Promise.promisifyAll(redis);
}