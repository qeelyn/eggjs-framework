'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/framework.test.js', () => {
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

  it('should success', async () => {
    const str = '启动成功！';
    assert(typeof str === 'string');
    console.log(str);
  });
});
