# Unimicron API — Functional Test Report

| | |
|---|---|
| **Document Version** | 1.0 |
| **Report Date** | 28 April 2026 |
| **Project** | PJ250104 |
| **Prepared By** | Tomas Tech Co., Ltd. |
| **Project Owner** | Unimicron (Thailand) Co., Ltd. |
| **Test Suite** | Functional (MS-F, MM-F, MD-F, RF) |
| **Execution Time** | 2026-04-28 02:07 UTC |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| Total Requests Executed | 25 |
| HTTP Connection Failures | 0 |
| Total Assertions | 204 |
| Assertions Passed | **182 (89.2%)** |
| Assertions Failed | **22 (10.8%)** |
| Fully Passed Test Cases | 9 / 25 |
| Partially Failed Test Cases | 15 / 25 |
| Hard Failed (HTTP 500) | 1 / 25 |

**Overall Status: FAIL** — 4 distinct defect categories identified across 22 failed assertions.

---

## 2. Test Environment

| Component | Value |
|-----------|-------|
| API Base URL | `http://localhost:5000` |
| WebSocket URL | `ws://localhost:9001/ws/` |
| Test Meter IDs | `1`, `2`, `3` |
| Missing Meter ID | `9999` |
| Scenario Month | `06` (June 2025) |
| Scenario Year | `2025` |
| Automation Tool | Newman 6.2.1 + newman-reporter-htmlextra |
| Collection | `unimicron-api.postman_collection.json` |

---

## 3. Results by Test Group

### 3.1 POST /GetDataMeterSum — Functional Happy Path (MS-F)

| Test ID | Description | HTTP | Response Time | Pass | Fail | Status |
|---------|-------------|------|---------------|------|------|--------|
| MS-F-01 | Day comparison by selected days | 200 | 762 ms | 8 | 1 | PARTIAL |
| MS-F-02 | Week comparison by selected week ranges | 200 | 96 ms | 7 | 1 | PARTIAL |
| MS-F-03 | Month comparison by selected months | 200 | 127 ms | 7 | 1 | PARTIAL |
| MS-F-04 | Year comparison by selected years | 200 | 122 ms | 7 | 1 | PARTIAL |
| MS-F-05 | Max10Year comparison across ten years | 200 | 107 ms | 7 | 1 | PARTIAL |

**Group Result: 0/5 fully passed**

| Test ID | Failed Assertion | Expected | Actual |
|---------|-----------------|----------|--------|
| MS-F-01 | ArrCategories length (interval=15) | 96 | 93 |
| MS-F-02 | Dictionary key format (Week) | `'2025-06-02\|\|2025-06-08'` | `'0'`, `'1'` |
| MS-F-03 | Dictionary key format (Month) | `'04'`, `'05'`, `'06'` | `'0'`, `'1'`, `'2'` |
| MS-F-04 | Dictionary key format (Year) | `'2023'`, `'2024'`, `'2025'` | `'0'`, `'1'`, `'2'` |
| MS-F-05 | Dictionary key format (Max10Year) | `'2016'`...`'2025'` | `'0'`...`'9'` |

---

### 3.2 POST /GetDataMultimeter — Functional Happy Path (MM-F)

| Test ID | Description | HTTP | Response Time | Pass | Fail | Status |
|---------|-------------|------|---------------|------|------|--------|
| MM-F-01 | Day data for multiple meters | 200 | 169 ms | 8 | 1 | PARTIAL |
| MM-F-02 | Week data for multiple meters | 200 | 86 ms | 8 | 0 | **PASS** |
| MM-F-03 | Month data for multiple meters | 200 | 68 ms | 8 | 0 | **PASS** |
| MM-F-04 | Year data for multiple meters | 200 | 95 ms | 8 | 0 | **PASS** |
| MM-F-05 | Max10Year data for multiple meters | 200 | 101 ms | 8 | 0 | **PASS** |

**Group Result: 4/5 fully passed**

| Test ID | Failed Assertion | Expected | Actual |
|---------|-----------------|----------|--------|
| MM-F-01 | ArrCategories length (interval=15) | 96 | 93 |

---

### 3.3 POST /GetDataMeterDetail — Functional Happy Path (MD-F)

| Test ID | Description | HTTP | Response Time | Pass | Fail | Status |
|---------|-------------|------|---------------|------|------|--------|
| MD-F-01 | Day detail chart | 200 | 106 ms | 7 | 2 | PARTIAL |
| MD-F-02 | Week detail chart | 200 | 45 ms | 7 | 1 | PARTIAL |
| MD-F-03 | Month detail chart | 200 | 41 ms | 7 | 1 | PARTIAL |
| MD-F-04 | Year detail chart | 200 | 90 ms | 7 | 1 | PARTIAL |
| MD-F-05 | Max10Year detail chart | **500** | 56 ms | 1 | 2 | **FAIL** |

**Group Result: 0/5 fully passed**

| Test ID | Failed Assertion | Expected | Actual |
|---------|-----------------|----------|--------|
| MD-F-01 | MeterLabelMap ID field | ID `'1'` found | `['undefined', 'undefined']` |
| MD-F-01 | ArrCategories length (interval=15) | 96 | 93 |
| MD-F-02 | MeterLabelMap ID field | ID `'1'` found | `[]` (empty) |
| MD-F-03 | MeterLabelMap ID field | ID `'1'` found | `['undefined']` |
| MD-F-04 | MeterLabelMap ID field | ID `'1'` found | `['undefined', 'undefined']` |
| MD-F-05 | No HTTP 500 error | HTTP 2xx | HTTP 500 |
| MD-F-05 | HTTP status success | 200–299 | 500 |

---

### 3.4 Response Structure & Field Integrity (RF)

| Test ID | Description | HTTP | Response Time | Pass | Fail | Status |
|---------|-------------|------|---------------|------|------|--------|
| RF-01 | MeterSum Day keys are time/data-select strings | 200 | 99 ms | 8 | 1 | PARTIAL |
| RF-02 | Multimeter Day keys are meter IDs | 200 | 39 ms | 8 | 1 | PARTIAL |
| RF-03 | MeterSum max values cover Month data | 200 | 209 ms | 7 | 1 | PARTIAL |
| RF-04 | Multimeter max values cover Month data | 200 | 94 ms | 8 | 0 | **PASS** |
| RF-05 | MeterDetail chart series object structure | 200 | 68 ms | 7 | 2 | PARTIAL |
| RF-06 | MeterDetail MeterLabelMap selected IDs | 200 | 67 ms | 7 | 1 | PARTIAL |
| RF-07 | MeterDetail stroke length consistency | 200 | 65 ms | 7 | 1 | PARTIAL |
| RF-08a | MeterSum Day categories — interval=5 min | 200 | 69 ms | 8 | 1 | PARTIAL |
| RF-08b | MeterSum Day categories — interval=15 min | 200 | 39 ms | 8 | 1 | PARTIAL |
| RF-08c | MeterSum Day categories — interval=60 min | 200 | 44 ms | 9 | 0 | **PASS** |

**Group Result: 2/10 fully passed**

| Test ID | Failed Assertion | Expected | Actual |
|---------|-----------------|----------|--------|
| RF-01 | ArrCategories length (interval=15) | 96 | 93 |
| RF-02 | ArrCategories length (interval=15) | 96 | 93 |
| RF-03 | Dictionary key format (Month) | `'06'` | `'0'` |
| RF-05 | MeterLabelMap ID field | ID `'1'` found | `['undefined', 'undefined']` |
| RF-05 | ArrCategories length (interval=15) | 96 | 93 |
| RF-06 | MeterLabelMap ID field | ID `'1'` found | `['undefined', 'undefined']` |
| RF-07 | MeterLabelMap ID field | ID `'1'` found | `['undefined', 'undefined']` |
| RF-08a | ArrCategories length (interval=5) | 288 | 277 |
| RF-08b | ArrCategories length (interval=15) | 96 | 93 |

---

## 4. Defect Register

### DEF-001 — ArrCategories Count Incorrect for Day Type

| Field | Detail |
|-------|--------|
| **Defect ID** | DEF-001 |
| **Severity** | Medium |
| **Priority** | High |
| **Affected Endpoints** | `/GetDataMeterSum`, `/GetDataMultimeter`, `/GetDataMeterDetail` |
| **Affected Cases** | MS-F-01, MM-F-01, MD-F-01, RF-01, RF-02, RF-05, RF-08a, RF-08b (8 cases) |
| **Description** | When `Type=Day`, the API returns fewer time-slot categories than the specification requires. For `Interval=15`, expected 96 entries (24h × 4) but received 93. For `Interval=5`, expected 288 entries (24h × 12) but received 277. |
| **Root Cause Hypothesis** | Server may generate categories only for time slots that contain recorded data, rather than generating a full-day grid. Alternatively, the boundary time slots may be excluded. |
| **Reproduction** | `POST /GetDataMeterSum` with `Type=Day`, `Interval=15`, any valid `DataSelect` date. Check `ArrCategories.length`. |
| **Expected** | `ArrCategories.length == 96` (for Interval=15) |
| **Actual** | `ArrCategories.length == 93` |

---

### DEF-002 — Response Dictionary Keys Use Numeric Indices Instead of DataSelect Values

| Field | Detail |
|-------|--------|
| **Defect ID** | DEF-002 |
| **Severity** | High |
| **Priority** | Critical |
| **Affected Endpoints** | `/GetDataMeterSum` |
| **Affected Cases** | MS-F-02, MS-F-03, MS-F-04, MS-F-05, RF-03 (5 cases) |
| **Description** | For `Type=Week`, `Month`, `Year`, `Max10Year`, the keys in `ArrDataTarget` and `ArrDataActual` are numeric indices (`'0'`, `'1'`, `'2'`) instead of the corresponding DataSelect string values (`'04'`, `'2023'`, `'2025-06-02\|\|2025-06-08'`). This breaks any client-side data lookup that maps chart series to their label. |
| **Root Cause Hypothesis** | The API may be serializing the response dictionary as an ordered array and assigning sequential integer keys, rather than preserving the original DataSelect strings as keys. |
| **Reproduction** | `POST /GetDataMeterSum` with `Type=Month`, `DataSelect=["04","05","06"]`. Inspect `ArrDataTarget` keys. |
| **Expected** | Keys: `"04"`, `"05"`, `"06"` |
| **Actual** | Keys: `"0"`, `"1"`, `"2"` |

---

### DEF-003 — MeterLabelMap ID Field Not Resolvable

| Field | Detail |
|-------|--------|
| **Defect ID** | DEF-003 |
| **Severity** | Medium |
| **Priority** | High |
| **Affected Endpoints** | `/GetDataMeterDetail` |
| **Affected Cases** | MD-F-01, MD-F-02, MD-F-03, MD-F-04, RF-05, RF-06, RF-07 (7 cases) |
| **Description** | The test script resolves the meter identifier from each `MeterLabelMap` entry by checking for fields named `id`, `Id`, `Meter`, or `meter`. None of these fields were found; all lookups returned `undefined`. The actual field name in the API response is unknown and must be confirmed. |
| **Root Cause Hypothesis** | The API uses a different field name for the meter identifier in `MeterLabelMap` (e.g., `MeterId`, `SensorId`, `meterID`). |
| **Reproduction** | `POST /GetDataMeterDetail` with `Type=Month`, `Meter=[1,2]`. Inspect the `MeterLabelMap` array and log field names. |
| **Expected** | Each item contains an `id` or `Id` field matching requested meter IDs |
| **Actual** | Identifier field name not found — returns `undefined` |

---

### DEF-004 — HTTP 500 Internal Server Error on /GetDataMeterDetail Max10Year

| Field | Detail |
|-------|--------|
| **Defect ID** | DEF-004 |
| **Severity** | High |
| **Priority** | Critical |
| **Affected Endpoints** | `/GetDataMeterDetail` |
| **Affected Cases** | MD-F-05 (1 case) |
| **Description** | When `type=Max10Year` is sent to `/GetDataMeterDetail`, the server returns HTTP 500 Internal Server Error. No response body was parsed. This is a server crash condition for this input combination. |
| **Root Cause Hypothesis** | The `Max10Year` type may not be implemented or may trigger an unhandled exception in the MeterDetail handler. |
| **Reproduction** | `POST /GetDataMeterDetail` with `type=Max10Year`, `Meter=[1]`, `DataSelect="2025\|2016"` |
| **Expected** | HTTP 200 with chart series response |
| **Actual** | HTTP 500 Internal Server Error |

---

## 5. Test Completion Matrix

| Test ID | Status | Defect |
|---------|--------|--------|
| MS-F-01 | PARTIAL | DEF-001 |
| MS-F-02 | PARTIAL | DEF-002 |
| MS-F-03 | PARTIAL | DEF-002 |
| MS-F-04 | PARTIAL | DEF-002 |
| MS-F-05 | PARTIAL | DEF-002 |
| MM-F-01 | PARTIAL | DEF-001 |
| MM-F-02 | **PASS** | — |
| MM-F-03 | **PASS** | — |
| MM-F-04 | **PASS** | — |
| MM-F-05 | **PASS** | — |
| MD-F-01 | PARTIAL | DEF-001, DEF-003 |
| MD-F-02 | PARTIAL | DEF-003 |
| MD-F-03 | PARTIAL | DEF-003 |
| MD-F-04 | PARTIAL | DEF-003 |
| MD-F-05 | **FAIL** | DEF-004 |
| RF-01 | PARTIAL | DEF-001 |
| RF-02 | PARTIAL | DEF-001 |
| RF-03 | PARTIAL | DEF-002 |
| RF-04 | **PASS** | — |
| RF-05 | PARTIAL | DEF-001, DEF-003 |
| RF-06 | PARTIAL | DEF-003 |
| RF-07 | PARTIAL | DEF-003 |
| RF-08a | PARTIAL | DEF-001 |
| RF-08b | PARTIAL | DEF-001 |
| RF-08c | **PASS** | — |

---

## 6. Recommendations

| Priority | Action |
|----------|--------|
| **Critical** | Investigate and fix HTTP 500 on `POST /GetDataMeterDetail` with `type=Max10Year` (DEF-004) |
| **Critical** | Confirm and correct the dictionary key format for `ArrDataTarget` / `ArrDataActual` — keys must reflect DataSelect values, not array indices (DEF-002) |
| **High** | Confirm the correct field name for meter identifier in `MeterLabelMap` and update test assertions accordingly (DEF-003) |
| **High** | Clarify whether `ArrCategories` must be a full-day grid or data-driven — update spec or fix API to match (DEF-001) |

---

## 7. Remaining Test Scope

The following HTTP REST API suites have not yet been executed:

| Suite | Cases | Command |
|-------|-------|---------|
| Validation (VR, VT, VO, VF, VM) | 18 | `npm run test:validation` |
| Cross-Endpoint Consistency (CE-I) | 3 | `npm run test:cross` |
| REST API Load (HTTP-L) | 5 | `npm run test:http-load` |
| Manual — DB Integration (DB-I) | 3 | Manual with DB access |
| Manual — System Failure (ERR-I) | 2 | Manual ops step |

---

*Report generated by Tomas Tech Co., Ltd. · Project PJ250104 · 28 April 2026*
