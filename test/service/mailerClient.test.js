'use strict';

const mock = require('egg-mock');

describe('test/service/mailerClient.test.js', () => {
    let app;
    before(() => {
        app = mock.app({
            baseDir: 'example',
            framework: true,
        });
        return app.ready();
    });

    after(() => app.close());

    afterEach(mock.restore);

    it('should send email', async() => {
        const ctx = app.mockContext();
        // const result = await ctx.service.mailerClient.send('512106269@qq.com', '标题', '文本');
        console.log(123);
    });


});