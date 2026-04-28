# Unimicron API Scenario Automation

This project maps `API Test Scenario Unimicron` to Postman/Newman automation.

## Files

| File | Purpose |
|---|---|
| `scripts/apply-scenario-automation.js` | Regenerates scenario variables, traceability files, and the `Automated Scenario Tests` Postman folder. |
| `scenario-traceability.md` | Human-readable mapping from each Test ID to automation status and Postman item. |
| `scenario-traceability.json` | Machine-readable traceability matrix used by the runner dry-run summary. |
| `unimicron-api.postman_collection.json` | Original collection plus generated scenario test requests and assertions. |
| `postman-environment.json` | Local environment plus scenario test data variables. |
| `newman-run.js` | Newman runner with suite selection, reports, env overrides, dry-run, and concurrency support. |

## Regenerate Automation Artifacts

```bash
npm run scenario:build
```

Run this after changing scenario test data or generator logic.

## Dry Run Only

This prints what would run without sending API requests.

```bash
npm run test:plan
```

## Scenario Suites

```bash
npm test
npm run test:functional
npm run test:validation
npm run test:cross
```

## Single Test ID

```bash
node newman-run.js --scenario MS-F-01
node newman-run.js --scenario VR-01
node newman-run.js --scenario CE-I-01
```

## Environment Overrides

```bash
node newman-run.js --suite scenario --env-var iot_url=http://localhost:5000 --env-var test_meter_1=PM001
```

## Load Profiles

The load suite is separated from the default scenario suite so it is not run accidentally.

```bash
npm run test:http-load
npm run test:http-load:concurrent
```

Adjust `--iteration-count`, `--delay-request`, and `--concurrency` for the exact load profile before execution.

## Reports

Reports are written to `test-results`:

| Report | Pattern |
|---|---|
| HTML | `report-*.html` |
| JUnit | `junit-*.xml` |
| JSON | `summary-*.json` |

## Current Coverage Notes

Automated in Postman/Newman:

- MeterSum, Multimeter, and MeterDetail happy paths
- Response structure and field integrity
- Cross-endpoint consistency checks
- Required field, wrong type, range, format, and invalid meter validation checks
- REST load profile request definitions and runner support

Helper/manual work still required:

- WebSocket functional and WebSocket load cases
- PLC comparison cases
- SQL Server query comparison cases
- Failure handling cases that require stopping SQL Server or WebSocket services
