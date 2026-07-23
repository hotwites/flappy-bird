# Deployment Plan

## Deployment Target
- **Platform**: GitHub Pages
- **URL**: https://hotwites.github.io/flappy-bird/
- **Protocol**: HTTPS (automatic via GitHub Pages)

## Environments
| Environment | Branch | Purpose | Approval Required |
|---|---|---|---|
| Production | `main` | Live game | No (auto-deploy on push) |

## Deployment Path: GitHub Pages (Static)
```
Stage 2: Validate static files serve correctly locally (python/npx serve)
Stage 3: Simulate GitHub Pages locally (serve from root, verify index.html)
Stage 4: Deploy to GitHub Pages (gh-pages branch via GitHub Actions)
Stage 5: GitHub Actions CI/CD — push to main → run tests → deploy
Stage 6: N/A (single environment)
Stage 7: N/A (no SLA/ops requirements)
```

## Infrastructure
- **Tool**: GitHub Pages (no IaC needed)
- **CDN**: GitHub's global CDN (automatic)
- **HTTPS**: Automatic

## Branch → Environment Mapping
| Branch | Environment | Trigger | Pipeline |
|---|---|---|---|
| `main` | Production (GitHub Pages) | Push | GitHub Actions |

## Automation Level
- Production: Automatic on push to `main` (tests must pass first)

## CI/CD Pipeline Steps
1. Push to `main`
2. GitHub Actions: install test deps → run tests (60 tests must pass)
3. GitHub Actions: deploy to `gh-pages` branch → GitHub Pages serves it

## Security
- No server-side secrets required (static site)
- HTTPS enforced by GitHub Pages
- No `0.0.0.0/0` rules (no infrastructure to configure)
