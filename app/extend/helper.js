'use strict';

// 规范输出和处理的一些简单工具
// 输出可以和前端统一配合
module.exports = {
    /**
     * 统一格式结果输出
     * @param {Object} data 随便一些数据
     * @param {Array} error 数组数据
     * @return  {Object} 结果输出
     */
    jsonResult(data, error) {
        return {
            data,
            errors: error,
        };
    },
    /**
     * 基础异常输出
     * @param {String|Array} errors 数组或者字符串
     * @return  {Object} error 结果输出
     */
    errorOut(errors) {
        const ers = [];
        if (Array.isArray(errors)) {
            errors.forEach(item => {
                ers.push({ code: '', message: item });
            });
        } else {
            ers.push({ code: '', message: errors });
        }
        return this.jsonResult(null, ers);
    },
    /**
     * 获取请求格式参数为 url 和 body 组合请求的对应的值
     * @param {*} query 请求的数据
     * @param {*} method 请求的方式
     * @return  {Object} 获取url body组合的结果
     */
    getQueryData(query, method) {
        let url = '',
            data = {};
        if (method === 'POST') {
            if (query.url.indexOf('/') !== 0) {
                url += '/';
            }
            url += query.url;
            data = query.body;
        } else {
            for (const key in query) {
                const item = query[key];
                if (key === 'url') {
                    if (item.indexOf('/') !== 0) {
                        url += '/';
                    }
                    url += item;
                } else if (key.indexOf('body') > -1) {
                    data[key.replace('body[', '').replace(']', '')] = item;
                }
            }
        }
        return {
            url,
            data,
        };
    },
    /**
     * 处理json 合并并去除  null 和 undefined的键值对
     * @param  {object} json 对象数组
     * @return  {Object} json处理
     */
    jsonTrimFormat(json) {
        for (let key in json) {
            if (json[key] === undefined || json[key] === null) {
                delete json[key];
            }
        }
        return json;
    },
};