'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/service/apiHttpClient.test.js', () => {
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

    it('should gql login api', async() => {
        const uid = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjE2NzI1MTM1LCJpc3MiOiJPbmxpbmUgWUF1dGggQnVpbGRlciIsImV4cCI6MTYxNjczMjYzNX0.CBohKZ2vwycmdgaiufBLhbyg7lOXVkqhB7wcarB0kMYVFE1nsBILRGc4KcmH5jhBzk7qf1Uyv1ZcprTpI_LSHE6wRa3wT_1rcSoLRNwXRk-1o5YH4u2o9OaIn2kXcAU1jFFM1jprRK-12UBBiEceK9TOnCUsd83JtSOm-Vqo0wJLzbSj6ukfpRsacsXeamwjO4y5g7-Ozxk62K2R3QR4z1GXSjU4PYmsk2btKJAtoxb-sRjGemhlaLlZSoXzPzk33hGeoFeefq4Z0Zhsu6i3Vdd9crw7i3glg1aExRtsng1NRdxJ0YiZ-iMk9kBfempR107lkBc6sfZ47paEIvrjSw',
            orgId = 1000;
        app.mockSession({
            orgId,
            uid,
        });
        const ctx = app.mockContext();
        let result = await ctx.service.apiHttpClient.gqlApi('http://192.168.0.13:30218/gql/usercenter_gql', `
          query {
            viewer{
              id,nickname
            }
          }
        `, {}, true, {
            A: 2
        })

        console.log(result)
    });


});