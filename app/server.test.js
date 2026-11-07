const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { server } = require('./server');

describe('Server', () => {
  let baseUrl;

  before((_, done) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  it('responds with 200 on root path', (_, done) => {
    http.get(baseUrl, (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    });
  });

  it('responds with health check JSON', (_, done) => {
    http.get(`${baseUrl}/health`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const body = JSON.parse(data);
        assert.strictEqual(body.status, 'ok');
        done();
      });
    });
  });
});
