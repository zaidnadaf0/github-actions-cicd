const http = require('http');

const PORT = process.env.PORT || 3000;

function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>CI/CD Sample App</h1><p>Deployed via GitHub Actions</p>');
  });
}

const server = createServer();

// Bind a port only when this file is executed directly.
// Importing it (as the test suite does) must not open a socket: a listening
// server is an open handle, which keeps the node:test process alive forever
// and makes the CI job hang instead of finishing.
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { server, createServer, PORT };
