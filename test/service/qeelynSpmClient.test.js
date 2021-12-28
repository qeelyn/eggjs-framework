'use strict';

const mock = require('egg-mock');

describe('test/service/qeelynSpmClient.test.js', () => {
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

  it('should spm', async () => {
    const ctx = app.mockContext();
    const host = 'http://192.168.0.12:123/home/index';
    const result = await ctx.service.qeelynSpmClient.createSpm({ a: 1 }, host);
    console.log('生成spm：' + result);
    const resultData = await ctx.service.qeelynSpmClient.getSpm(result, host);
    console.log('通过spm拿到结果：' + JSON.stringify(resultData));
  });

});
