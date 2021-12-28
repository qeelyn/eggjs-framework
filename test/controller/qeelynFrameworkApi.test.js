'use strict';

const mock = require('egg-mock');
const uuidv4 = require('uuid/v4');

describe('test/controller/qeelynFrameworkApi.test.js', () => {
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
    const uid = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTk3MzA2NTIzLCJpc3MiOiJPbmxpbmUgWUF1dGggQnVpbGRlciIsImV4cCI6MTU5NzMxNDAyM30.W5rUj5WxAtYyPCBSiROXlxLMZ5N7HBK1az8mSN3I_FvMz2kcVQ8Xsr2ebQgXeufVMrfUJjLAO_fpRsgSR7dinoIngGliBY_ZSlz0cBqFMLgakUZ0lQWJGpfI8l1RdAgwyG-dg2P-8xh9qVnJ8UZh-NVKTCqHiU9mnISYY43Rl51ViUOvCc_tvbMOG34fqxI26opDEKQ4lUE4u2VzvQyA4sdhWHWre63ueve41GIf_hMq89MwkgCthTB8K8abSYSoMuyDJLMVwVROcBl2fkro6v7dk7JOOoRfOQh7-YiR47Jlf5ulTggNER_-XzeAZQdD-ogxyKf08MW6F69ArzicPQ',
        orgId = 1000;


    it('should get page', async() => {
        app.mockSession({
            orgId,
            uid,
        });
        app.mockCsrf();
        const result = await app.httpRequest()
            .get('/?from_app_code=deo.backend1')
            // .get('/?spm=ZGVvLmJhY2tlbmQtYTYwNzFjOTljNTI0ZWI2OTM3OTJkMzQxZTJlNWY4ZDgtMTYxNDY3MjM1NTE2OA%3D%3D')
            .set('Accept', 'application/json, text/plain, */*')
            .set('Content-Type', 'application/json;charset=UTF-8')
            .send({
                host: 'http://192.168.0.20:12345',
            })
            .expect(302);
        console.log(result.text);
    });

    // it('should post usercenterApi', async() => {
    //     // console.log('uuidv4', uuidv4());
    //     app.mockSession({
    //         orgId,
    //         uid,
    //     });
    //     app.mockCsrf();
    //     const result = await app.httpRequest()
    //         .post('/qeelyn-framework/usercenter-api')
    //         .set('Accept', 'application/json, text/plain, */*')
    //         .set('Content-Type', 'application/json;charset=UTF-8')
    //         .set('authorization', `Bearer ${uid}`)
    //         .set('X-Request-ID', `request-id`)
    //         .set('qeelyn-org-id', orgId)
    //         .send({
    //             query: `query{
    //                         viewer{
    //                             id,nickname
    //                         }
    //                     }`,
    //             variables: null,
    //         })
    //         .expect(200);
    //     console.log('result:', result.body);
    // });

    // it('should post spm', async() => {
    //     app.mockSession({
    //         orgId,
    //         uid,
    //     });
    //     app.mockCsrf();
    //     const result = await app.httpRequest()
    //         .post('/qeelyn-framework/spm')
    //         .set('Accept', 'application/json, text/plain, */*')
    //         .set('Content-Type', 'application/json;charset=UTF-8')
    //         .send({
    //             host: 'http://192.168.0.20:12345',
    //         })
    //         .expect(200);
    //     console.log(result.text);

    // });

    // it('should get logout', async() => {
    //     app.mockSession({
    //         orgId,
    //         uid,
    //     });
    //     return await app.httpRequest()
    //         .get('/qeelyn-framework/logout')
    //         .expect(302);

    // });

    // it('should get router', async() => {
    //     app.mockSession({
    //         orgId,
    //         uid,
    //     });
    //     app.mockCsrf();
    //     const result = await app.httpRequest()
    //         .post('/qeelyn-framework/log')
    //         .send({
    //             route: '/test/1'
    //         })
    //         .expect(200);
    // });
});