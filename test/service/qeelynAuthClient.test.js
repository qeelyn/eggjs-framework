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

    it('should login', async() => {
        const ctx = app.mockContext({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
            },
        });
        const result = await ctx.service.qeelynAuthClient.login('deo_admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');
        console.log(result);
    });


    // it('should getTicket', async () => {
    //   const ctx = app.mockContext();
    //   const result = await ctx.service.qeelynAuthClient.getTicket('qeelyn123456!', '123456');
    //   console.log(result);
    // });

    // it('should refreshToken', async() => {
    //     const ctx = app.mockContext();
    //     let rToken = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTUzOTE3NTAyLCJpc3MiOiJPbmxpbmUgWUF1dGggQnVpbGRlciIsImV4cCI6MTU1NDUyMjMwMn0.NfARtLYO71PWATIKaIvZKRmbHnBbHV8Ha8kKpxpiIygbzYgzFf-BdUyehugeWW9AdFRPh5-gQVFP7OlP7W79_Zv6weIdgfxJ9yOu3Hr68qAMZw5keG3xHXboUe8Yz5fnHOUxsATJT1sAjE17F7kQYB2L6uDTHyOZCrBD48kOhe_vQndZgjmrtZVb00sm2-hAq5WHOr7qx3o15O-TwwnaM2B7-CmOIXonV_YgQzDlub-fMuqluCCI3GC7pZPTyZNDk8N4OSYDuUoR4bTEMh0Wegw6zvYyZQwY1Rb6ORDstMcTIfvCW8xMMzHyrqsWusEZ6EFspon1bORTlw6v8BFDMQ';
    //     ctx.session.uid = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTUzOTE3NTAyLCJpc3MiOiJPbmxpbmUgWUF1dGggQnVpbGRlciIsImV4cCI6MTU1MzkyNDcwMn0.TqVlYped-jHViz0CL-GdAC9oJxbJPgUeCN2p7WOmshHXTdrWgk5IETbi26Qc_HWBrBLTVONAzTZD1izyxZLb6JH9Y1MwzobKL4WdTJDEgZdL1i6YjxTNso3iikR-9Zm04TH6adDipz4JlRiYNzl2CJhrYpkg1ietTdLxFAit5acFiQQlz7ieFvg5LCMg34XixdU76FWTPXwbE-wSEHi_gcXZERS9thXjTv-AMd-gnkpoN9ktrKTj1LKVmbGAv5yJ4gu77JThUez9z-Zm4mvF4w-2ko33NmsRrIWvL1ZFe6PK_e5_5xdFjxUC0NzBKWd0xPc4EyGqD3Bbb661hPZNrw';

    //     const result = await ctx.service.qeelynAuthClient.refreshToken(rToken);
    //     console.log(result);
    // });


});