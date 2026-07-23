# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests

```bash
cd tests
npm test
```

Or with verbose output:

```bash
cd tests
npm run test:verbose
```

### 2. Review Test Results

- **Expected**: 60 tests pass, 0 failures
- **Test Categories**:
  - Bird physics (16 tests: 8 PBT + 8 example)
  - Pipes logic (17 tests: 9 PBT + 8 example)
  - Collision detection (19 tests: 7 PBT + 12 example)
  - Score calculation (8 tests: 4 PBT + 4 example)
- **Test Report**: Printed to console (vitest reporter)

### 3. PBT Seed Reproducibility (PBT-08)

If a property-based test fails, the output will include:
- The **seed value** for reproduction
- The **shrunk minimal failing input**

To reproduce a failure with a specific seed:

```bash
cd tests
FAST_CHECK_SEED=<seed-value> npx vitest run
```

### 4. Test File Locations

| File | Module Tested | PBT Properties | Examples |
|---|---|---|---|
| `tests/bird.test.js` | Bird physics | 8 | 8 |
| `tests/pipes.test.js` | Pipe generation/movement | 9 | 8 |
| `tests/collision.test.js` | Collision detection | 7 | 12 |
| `tests/score.test.js` | Score calculation | 4 | 4 |
| `tests/generators.js` | Shared PBT generators | — | — |

### 5. Fix Failing Tests

If tests fail:
1. Review the test output for the failing assertion
2. For PBT failures: note the shrunk counterexample and seed
3. Check the corresponding source module in `src/`
4. Fix the code issue
5. Rerun: `npm test`
6. For PBT regression: add the shrunk case as a permanent example test (PBT-10)
