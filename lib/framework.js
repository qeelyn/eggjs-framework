'use strict';

const path = require('path');
const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#loader');
const jsonLogger = require('./jsonLogger');
const cache = require('./cache');

class FrameAppWorkerLoader extends egg.AppWorkerLoader {
    load() {
        super.load();
        // 基础加载完成后
        const { app, config } = this;
        jsonLogger(app);
        if (config.cache) {
            cache(app);
        }
    }
    loadController() {
        super.loadController({
            directory: [
                path.join(__dirname, '../app/controller'),
                path.join(this.appInfo.baseDir, '/app/controller'),
            ],
        });
    }
}

class Application extends egg.Application {
    get[EGG_PATH]() {
        return path.dirname(__dirname);
    }

    get[EGG_LOADER]() {
        return FrameAppWorkerLoader;
    }
}

class Agent extends egg.Agent {
    get[EGG_PATH]() {
        return path.dirname(__dirname);
    }
}

module.exports = Object.assign(egg, {
    Application,
    Agent,
    AppWorkerLoader: FrameAppWorkerLoader,
});