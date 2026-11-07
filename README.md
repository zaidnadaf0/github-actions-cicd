# GitHub Actions — CI/CD Sample ⚡

A reusable **GitHub Actions** workflow demonstrating continuous integration and delivery for a Node.js application. The pipeline runs tests, builds the app, and creates a Docker image on every push to `main`.

## 🔄 Pipeline Flow

```
Push / PR → Test → Build → Docker Image (main only)
```

| Stage | What it does |
|-------|-------------|
| **Test** | `npm ci` + `npm test` |
| **Build** | `npm ci` + `npm run build` |
| **Docker** | Builds a container image tagged with the commit SHA (main branch only) |

## 📋 What's Included

- `.github/workflows/ci.yml` — The GitHub Actions workflow
- `app/server.js` — Minimal Node.js HTTP server
- `app/server.test.js` — Tests using Node.js built-in test runner
- `app/package.json` — Project config with scripts
- `app/Dockerfile` — Production-ready container image

## 🚀 Getting Started

### Run Locally

```bash
cd app
npm install
npm test
npm start
```

### On GitHub

1. Push this repo to GitHub
2. Go to the **Actions** tab
3. The workflow triggers automatically on push/PR to `main`
4. Watch each job pass ✅

## 📁 Project Structure

```
github-actions-cicd/
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline definition
├── app/
│   ├── server.js            # Node.js HTTP server
│   ├── server.test.js       # Unit tests
│   ├── package.json         # Dependencies & scripts
│   ├── package-lock.json    # Lockfile for reproducible installs
│   └── Dockerfile           # Container image
└── README.md
```

## 🎯 Learning Objectives

- Writing GitHub Actions workflows from scratch
- Multi-stage pipelines with job dependencies (`needs`)
- Conditional execution (`if:` expressions)
- Caching npm dependencies for faster builds
- Building Docker images in CI
- Using Node.js built-in test runner

## 📄 License

[Apache License 2.0](LICENSE)

## 🙋 Author

**Mohammed Zaid Nadaf** — CS Engineering Student · Aspiring Cloud Engineer
