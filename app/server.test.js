const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { server } = require('./server');

describe('HTTP server', () => {
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('serves the landing page at /', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    assert.match(await res.text(), /CI\/CD Sample App/);
  });

  it('returns 200 with {"status":"ok"} at /health', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    assert.deepStrictEqual(await res.json(), { status: 'ok' });
  });
});
