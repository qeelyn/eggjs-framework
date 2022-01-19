'use strict';

const mock = require('egg-mock');

describe('test/service/qeelynAuthClient.test.js', () => {
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

    it('should login', async () => {
        const ctx = app.mockContext({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
                Referer: 'http://www.1ping.com:30080'
            },
        });

        const result = await ctx.service.qeelynAuthClient.login('', '');
        console.log(result);
    });


    // it('should orgList', async () => {
    //     const ctx = app.mockContext();
    //     ctx.session.uid = '';
    //     const result = await ctx.service.qeelynAuthClient.orgList();
    //     console.log(result);
    // });

    // it('should getTicket', async () => {
    //   const ctx = app.mockContext();
    //   const result = await ctx.service.qeelynAuthClient.getTicket('qeelyn123456!', '123456');
    //   console.log(result);
    // });

    // it('should refreshToken', async() => {
    //     const ctx = app.mockContext();
    //     let rToken = '';
    //     ctx.session.uid = '';

    //     const result = await ctx.service.qeelynAuthClient.refreshToken(rToken);
    //     console.log(result);
    // });


});