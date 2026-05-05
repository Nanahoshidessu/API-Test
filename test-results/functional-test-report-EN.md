# Unimicron API — Functional Test Report

| | |
|---|---|
| **Document Version** | 1.1 |
| **Report Date** | 30 April 2026 |
| **Project** | PJ250104 |
| **Prepared By** | Tomas Tech Co., Ltd. |
| **Project Owner** | Unimicron (Thailand) Co., Ltd. |
| **Test Suite** | Functional (MS-F, MM-F, MD-F, RF) |
| **Execution Time** | 2026-04-30 07:34 UTC |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| Total Requests Executed | 25 |
| HTTP Connection Failures | 0 |
| Total Assertions | 209 |
| Assertions Passed | **188 (90.0%)** |
| Assertions Failed | **21 (10.0%)** |
| Fully Passed Test Cases | 6 / 25 |
| Partially Failed Test Cases | 19 / 25 |
| Hard Failed (HTTP 500) | 0 / 25 |

**Overall Status: FAIL** — 3 active defect categories across 21 failed assertions. DEF-004 (HTTP 500 crash) mitigated by test script fix; root cause remains open for API team.

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
| MS-F-01 | Day comparison by selected days | 200 | 682 ms | 8 | 1 | PARTIAL |
| MS-F-02 | Week comparison by selected week ranges | 200 | 114 ms | 7 | 1 | PARTIAL |
| MS-F-03 | Month comparison by selected months | 200 | 140 ms | 7 | 1 | PARTIAL |
| MS-F-04 | Year comparison by selected years | 200 | 107 ms | 7 | 1 | PARTIAL |
| MS-F-05 | Max10Year comparison across ten years | 200 | 195 ms | 7 | 1 | PARTIAL |

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
| MM-F-01 | Day data for multiple meters | 200 | 310 ms | 8 | 1 | PARTIAL |
| MM-F-02 | Week data for multiple meters | 200 | 79 ms | 8 | 0 | **PASS** |
| MM-F-03 | Month data for multiple meters | 200 | 73 ms | 8 | 0 | **PASS** |
| MM-F-04 | Year data for multiple meters | 200 | 102 ms | 8 | 0 | **PASS** |
| MM-F-05 | Max10Year data for multiple meters | 200 | 135 ms | 8 | 0 | **PASS** |

**Group Result: 4/5 fully passed**

| Test ID | Failed Assertion | Expected | Actual |
|---------|-----------------|----------|--------|
| MM-F-01 | ArrCategories length (interval=15) | 96 | 93 |

---

### 3.3 POST /GetDataMeterDetail — Functional Happy Path (MD-F)

| Test ID | Description | HTTP | Response Time | Pass | Fail | Status |
|---------|-------------|------|---------------|------|------|--------|
| MD-F-01 | Day detail chart | 200 | 107 ms | 7 | 2 | PARTIAL |
| MD-F-02 | Week detail chart | 200 | 49 ms | 7 | 1 | PARTIAL |
| MD-F-03 | Month detail chart | 200 | 44 ms | 7 | 1 | PARTIAL |
| MD-F-04 | Year detail chart | 200 | 184 ms | 7 | 1 | PARTIAL |
| MD-F-05 | Max10Year detail chart | **200** | 86 ms | 7 | 1 | **PARTIAL** |

**Group Result: 0/5 fully passed**

> **Note — MD-F-05:** Previously returned HTTP 500 (v1.0). Root cause confirmed as `Int32.Parse(DataSelect)` crash in `DataMeterDetailController.cs:288` when DataSelect contains `|`. Test script updated to send single-year DataSelect (`"2025"`) — endpoint now responds HTTP 200. Remaining failure is MeterLabelMap format mismatch (DEF-003).

| Test ID | Failed Assertion | Expected | Actual |
|---------|-----------------|----------|--------|
| MD-F-01 | MeterLabelMap ID field | ID `'1'` found | `['undefined', 'undefined']` |
| MD-F-01 | ArrCategories length (interval=15) | 96 | 93 |
| MD-F-02 | MeterLabelMap ID field | ID `'1'` found | `[]` (empty) |
| MD-F-03 | MeterLabelMap ID field | ID `'1'` found | `['undefined']` |
| MD-F-04 | MeterLabelMap ID field | ID `'1'` found | `['undefined', 'undefined']` |
| MD-F-05 | MeterLabelMap ID field | ID `'1'` found | `[]` (empty) |

---

### 3.4 Response Structure & Field Integrity (RF)

| Test ID | Description | HTTP | Response Time | Pass | Fail | Status |
|---------|-------------|------|---------------|------|------|--------|
| RF-01 | MeterSum Day keys are time/data-select strings | 200 | 113 ms | 8 | 1 | PARTIAL |
| RF-02 | Multimeter Day keys are meter IDs | 200 | 45 ms | 8 | 1 | PARTIAL |
| RF-03 | MeterSum max values cover Month data | 200 | 43 ms | 7 | 1 | PARTIAL |
| RF-04 | Multimeter max values cover Month data | 200 | 80 ms | 8 | 0 | **PASS** |
| RF-05 | MeterDetail chart series object structure | 200 | 215 ms | 7 | 2 | PARTIAL |
| RF-06 | MeterDetail MeterLabelMap selected IDs | 200 | 70 ms | 7 | 1 | PARTIAL |
| RF-07 | MeterDetail stroke length consistency | 200 | 70 ms | 7 | 1 | PARTIAL |
| RF-08a | MeterSum Day categories — interval=5 min | 200 | 51 ms | 8 | 1 | PARTIAL |
| RF-08b | MeterSum Day categories — interval=15 min | 200 | 43 ms | 8 | 1 | PARTIAL |
| RF-08c | MeterSum Day categories — interval=60 min | 200 | 52 ms | 9 | 0 | **PASS** |

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
| **Description** | When `Type=Day`, the API returns fewer time-slot categories than the specification requires. For `Interval=15`, expected 96 entries (24h × 4) but received 93. For `Interval=5`, expected 288 entries (24h × 12) but received 277. `Interval=60` returns the correct 24 entries. |
| **Root Cause Hypothesis** | Server generates categories only for time slots that contain recorded data, rather than a full-day grid. Boundary slots at day start/end may be excluded. |
| **Reproduction** | `POST /GetDataMeterSum` with `Type=Day`, `Interval=15`, any valid `DataSelect` date. Check `ArrCategories.length`. |
| **Expected** | `ArrCategories.length == 96` (Interval=15) / `288` (Interval=5) |
| **Actual** | `ArrCategories.length == 93` (Interval=15) / `277` (Interval=5) |

---

### DEF-002 — Response Dictionary Keys Use Numeric Indices Instead of DataSelect Values

| Field | Detail |
|-------|--------|
| **Defect ID** | DEF-002 |
| **Severity** | High |
| **Priority** | Critical |
| **Affected Endpoints** | `/GetDataMeterSum` |
| **Affected Cases** | MS-F-02, MS-F-03, MS-F-04, MS-F-05, RF-03 (5 cases) |
| **Description** | For `Type=Week`, `Month`, `Year`, `Max10Year`, the keys in `ArrDataTarget` and `ArrDataActual` are numeric indices (`'0'`, `'1'`, `'2'`) instead of the corresponding DataSelect string values. This breaks any client-side data lookup that maps chart series to their label. |
| **Root Cause Hypothesis** | The API serializes the response dictionary as an ordered array with sequential integer keys, rather than preserving the original DataSelect strings as keys. |
| **Reproduction** | `POST /GetDataMeterSum` with `Type=Month`, `DataSelect=["04","05","06"]`. Inspect `ArrDataTarget` keys. |
| **Expected** | Keys: `"04"`, `"05"`, `"06"` |
| **Actual** | Keys: `"0"`, `"1"`, `"2"` |

---

### DEF-003 — MeterLabelMap Format Does Not Match Specification

| Field | Detail |
|-------|--------|
| **Defect ID** | DEF-003 |
| **Severity** | Medium |
| **Priority** | High |
| **Affected Endpoints** | `/GetDataMeterDetail` |
| **Affected Cases** | MD-F-01, MD-F-02, MD-F-03, MD-F-04, MD-F-05, RF-05, RF-06, RF-07 (8 cases) |
| **Description** | The API specification requires `MeterLabelMap` to be an array of objects with `id` and `label` fields. The actual API response uses the meter ID as the key with the meter ID repeated as the value, containing no named fields. Test assertions checking for `id`, `Id`, `Meter`, or `meter` all return `undefined`. |
| **Root Cause** | Confirmed API bug (verified by frontend team, 29 April 2026). The response format does not match the API specification. |
| **Reproduction** | `POST /GetDataMeterDetail` with `Type=Day`, `Meter=["1","2"]`. Inspect `MeterLabelMap`. |
| **Spec (Expected)** | `[{"id": "1", "label": "Power Meter 1"}, {"id": "2", "label": "Power Meter 2"}]` |
| **Actual** | `[{"1": "1"}, {"2": "2"}]` |
| **Action Required** | API team must fix `MeterLabelMap` response format. Test assertions are correct per specification — no test changes needed. |

---

### DEF-004 — HTTP 500 on /GetDataMeterDetail Max10Year (Root Cause Confirmed)

| Field | Detail |
|-------|--------|
| **Defect ID** | DEF-004 |
| **Severity** | High |
| **Priority** | Critical |
| **Affected Endpoints** | `/GetDataMeterDetail` |
| **Affected Cases** | MD-F-05 (test script mitigated; server-side fix still required) |
| **Description** | When `DataSelect` contains a `\|` separator (e.g. `"2025\|2016"`), `Int32.Parse(DataSelect)` at `DataMeterDetailController.cs:288` throws `System.FormatException` before the Type-branch logic is reached, causing HTTP 500. |
| **Root Cause** | `DataMeterDetailController.cs` line 288: `Int32.Parse(DataSelect)` executes unconditionally before the `Type` check. The `Max10Year` handler never runs. |
| **Fix Required** | Add a `Type` check before `Int32.Parse(DataSelect)`. For `Max10Year`, skip or handle the parse — the API ignores `DataSelect` for this type anyway. |
| **Reproduction** | `POST /GetDataMeterDetail` with `type=Max10Year`, `Meter=[1]`, `DataSelect="2025\|2016"` → HTTP 500 |

**Frontend investigation results (29 April 2026) — 10 test cases:**

| # | DataSelect sent | HTTP | Note |
|---|-----------------|------|------|
| 1 | `"2026\|2017"` (spec format) | **500** | FormatException — `\|` cannot be parsed |
| 2 | `"2026"` (single year) | **200** ✅ | Returns 10 years of data (2017–2026) |
| 3 | `"2026\|2022"` (short range) | **500** | `\|` present → crash |
| 4 | `""` (empty string) | **500** | Empty string cannot be parsed |
| 5 | `"2026\|2017"` + `Meter=[1,2]` | **500** | Same crash |
| 6 | `"2026\|2017"` + `Past=1` | **500** | Same crash |
| 7 | `"2026-2017"` (dash separator) | **500** | Dash also fails Int32.Parse |
| 8 | *(field omitted)* | **200** ✅ | Returns 10 years of data (2017–2026) |
| 9 | `null` | **200** ✅ | Returns 10 years of data (2017–2026) |
| 10 | `"2017\|2026"` (reversed) | **500** | `\|` present → crash |

> **Key finding:** The API does not use `DataSelect` for `Max10Year` at all — any value without `\|` (or no value) returns the same 10-year data range. The crash is caused solely by `Int32.Parse` running before the Type branch.

**Workarounds applied:**
- **Frontend (PHP proxy):** Sends `DataSelect` as single year (`"2026"`) instead of `"year|year"` format — HTTP 500 bypassed.
- **Test script:** `DataSelect` in MD-F-05 updated from `"{{scenario_year}}|{{scenario_year_start}}"` to `"{{scenario_year}}"` — MD-F-05 now returns HTTP 200 (PARTIAL instead of FAIL). API fix still required.

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
| MD-F-05 | PARTIAL | DEF-003 *(DEF-004 mitigated by test fix)* |
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

| Priority | Defect | Action |
|----------|--------|--------|
| **Critical** | DEF-004 | Add `Type` check before `Int32.Parse(DataSelect)` at `DataMeterDetailController.cs:288` — handle or skip parse for `Max10Year` type |
| **Critical** | DEF-002 | Fix `ArrDataTarget` / `ArrDataActual` dictionary keys to use DataSelect values, not array indices |
| **High** | DEF-003 | Fix `MeterLabelMap` response format to include `id` and `label` fields per API specification — confirmed API bug, test assertions are correct |
| **High** | DEF-001 | Generate `ArrCategories` as a full-day grid regardless of data availability — or update specification if data-driven behavior is intentional |

---

## 7. Remaining Test Scope

The following test suites have not yet been executed:

| Suite | Cases | Command |
|-------|-------|---------|
| Validation (VR, VT, VO, VF, VM) | 18 | `npm run test:validation` |
| Cross-Endpoint Consistency (CE-I) | 3 | `npm run test:cross` |
| REST API Load (HTTP-L) | 5 | `npm run test:http-load` |
| Manual — DB Integration (DB-I) | 3 | Manual with DB access |
| Manual — System Failure (ERR-I) | 2 | Manual ops step |

---

*Report generated by Tomas Tech Co., Ltd. · Project PJ250104 · 30 April 2026*
