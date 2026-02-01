# Testing Guide

## Overview

This document describes the testing strategy for the Rapid Launch Agent (Easy Yes System).

## Test Scripts

### Frontend Build Tests

```bash
# Type-check TypeScript without emitting files
npm run type-check

# Build frontend for production
npm run build

# Run both type-check and build
npm test
```

### API Integration Tests

```bash
# Start the backend server (in one terminal)
npm run server

# Run API tests (in another terminal)
npm run test:api
```

The API test suite (`test-api.js`) validates:

1. **Health Check** - Server is running and responding
2. **Offer Analysis** - EYO scoring system works correctly
3. **Avatar Analysis** - 6 Beliefs and swarm analysis work correctly
4. **Error Handling** - 404s and validation errors are handled properly

## Test Coverage

### Frontend Tests

- **Type Safety**: TypeScript compilation with strict mode
- **Build Process**: Vite production build
- **Component Structure**: All React components compile without errors

### Backend Tests

- **Health Endpoint**: `/api/health` returns status and version
- **Offer Analysis**: `/api/analyze/offer` returns EYO scores and recommendations
- **Avatar Analysis**: `/api/analyze/avatar` returns 6 Beliefs analysis
- **Error Handling**: Proper HTTP status codes and error messages

## Development Mode Testing

For local development without authentication:

1. Ensure `.env` has `NODE_ENV=development`
2. Start the backend: `npm run server`
3. Start the frontend: `npm run dev`
4. Access the app at: `http://localhost:5173`

The development mode bypasses Clerk authentication for easier testing.

## End-to-End User Flow

### Complete Flow Test

1. **Create Project** → Dashboard
2. **Offer Builder** → Enter offer details → Analyze Offer → See EYO scores
3. **Avatar Builder** → Enter avatar details → Analyze Avatar → See 6 Beliefs
4. **Competitor Intelligence** → Add competitors → Analyze
5. **Manifold Workflow** → Run 14-node workflow → View results
6. **Launch Document** → Generate 38-section document → Export

### Expected Timings

- Offer Analysis: ~30-60 seconds (single AI call)
- Avatar Analysis: ~60-120 seconds (swarm with 4-7 parallel nodes)
- Competitor Analysis: ~45-90 seconds (web scraping + analysis)
- Manifold Workflow: ~2-4 minutes (14 sequential AI nodes)
- Launch Document: ~20-30 minutes (38 sections, saved incrementally)

## Error Testing

### Common Scenarios

1. **Missing Environment Variables**
   - Missing `ANTHROPIC_API_KEY` → Graceful error message

2. **Network Errors**
   - Server not running → Connection refused error
   - API timeout → Timeout error with retry suggestion

3. **Validation Errors**
   - Empty required fields → 400 Bad Request
   - Invalid data types → Validation error

4. **Rate Limiting**
   - Too many requests → 429 Too Many Requests
   - Proper retry-after headers

## Performance Benchmarks

### API Response Times (Development)

- Health check: < 50ms
- Offer analysis: 30-60 seconds
- Avatar analysis: 60-120 seconds
- Competitor analysis: 45-90 seconds
- Manifold workflow: 2-4 minutes
- Launch document: 20-30 minutes

### Frontend Metrics

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: ~940 KB (before gzip), ~240 KB (gzipped)

## Continuous Integration

### Pre-commit Checks

```bash
# Run before committing
npm run validate
```

This runs:
1. Syntax validation for server code
2. TypeScript type checking
3. Production build test

### Pre-deployment Checks

```bash
# Full test suite
npm test && npm run test:api
```

## Known Issues

1. **Chunk Size Warning**: Frontend bundle is large (~940 KB) due to React, Anthropic SDK, and dependencies. Consider code-splitting for production optimization.

2. **API Test Timing**: Avatar analysis tests may timeout if Anthropic API is slow. Adjust timeout in `test-api.js` if needed.

3. **Development Auth Bypass**: Remember to disable `bypassSubscription` middleware in production.

## Future Testing Improvements

- [ ] Add unit tests for individual components
- [ ] Add integration tests for complex user flows
- [ ] Add visual regression testing
- [ ] Add performance monitoring
- [ ] Add automated E2E tests with Playwright
- [ ] Add load testing for concurrent users
- [ ] Add database migration testing
- [ ] Add Anthropic API mocking for faster tests
