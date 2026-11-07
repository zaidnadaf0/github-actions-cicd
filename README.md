# GitHub Actions CI/CD Sample ⚡

A small Node.js service with a real GitHub Actions pipeline: matrix tests, a build job, and a Docker job that builds the image and asserts the running container answers `/health`.

[![CI Pipeline](https://github.com/zaidnadaf0/github-actions-cicd/actions/workflows/ci.yml/badge.svg)](https://github.com/zaidnadaf0/github-actions-cicd/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## Pipeline

```
push / PR ──► test (Node 20, 22) ──► build ──► docker build + container smoke test   (main only)
```

| Job | Runs on | What it actually verifies |
|---|---|---|
| **test** | every push and PR | `npm ci` from the lockfile, then `node --test` against a real server bound to an ephemeral port |
| **build** | after tests pass | `npm run build` (a syntax check of `server.js`) |
| **docker** | pushes to `main` only | builds the image, runs the container, polls `/health` until it answers, dumps logs, and fails if the health check never succeeds |

Every job has `timeout-minutes`, so a regression fails the run instead of hanging it. Workflows use `permissions: contents: read` and do not need any secrets.

## Why the tests control the server lifecycle

`app/server.js` only binds a port when it is executed directly:

```js
const server = createServer();

if (require.main === module) {
  server.listen(PORT, ...);
}

module.exports = { server, createServer, PORT };
```

An earlier revision called `server.listen()` at import time. The test suite imports the module, so the listening server kept an open handle alive after the tests finished and the Node test runner never exited — the CI job sat in `in_progress` for hours instead of completing. The guard above, plus tests that open and close their own ephemeral port, is the fix, and `timeout-minutes` makes any future hang fail loudly.

## Run locally

```bash
cd app
npm ci
npm test          # node --test server.test.js
npm start         # http://localhost:3000  (/health for JSON)
```

Expected output of the suite:

```
▶ HTTP server
  ✔ serves the landing page at /
  ✔ returns 200 with {"status":"ok"} at /health
✔ HTTP server
ℹ pass 2
ℹ fail 0
```

## Docker

```bash
docker build -t cicd-sample:local ./app
docker run --rm -p 3000:3000 cicd-sample:local
curl http://localhost:3000/health   # {"status":"ok"}
```

The image is `node:22-alpine`, installs from the committed lockfile with `npm ci --omit=dev`, copies files owned by the non-root `node` user, and runs as `USER node`.

## Project structure

```
github-actions-cicd/
├── .github/workflows/ci.yml   # test matrix → build → docker + smoke test
├── app/
│   ├── server.js              # http server, exported for tests
│   ├── server.test.js         # node:test suite
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
├── LICENSE
└── README.md
```

## License

[Apache License 2.0](LICENSE)

## Author

**Mohammed Zaid Nadaf** — [GitHub](https://github.com/zaidnadaf0) · [LinkedIn](https://www.linkedin.com/in/mohammed-zaid-nadaf-1333b0368/)
