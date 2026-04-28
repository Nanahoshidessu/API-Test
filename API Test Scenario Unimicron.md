# Flow meter Visualization API — Test Scenario

| | |
|---|---|
| **Document Version** | 1.0 |
| **Date** | 26 April 2026 |
| **Project** | PJ250104 |
| **Document Author** | Tomas Tech Co., Ltd. |
| **Project Owner** | Unimicron (Thailand) Co., Ltd. |

*UMTH Sensor & Energy API · Test Plan v2.0 · April 2026 · Confidential*

---

## Table of Contents

1. [Introduction](#1-introduction) — 4
2. [Test Plan](#2-test-plan) — 5
   - 2.1 [Test Cases (1/6) — WebSocket Happy Path](#21-websocket-happy-path-ws-f) — 6
   - 2.2 [Test Cases (2/6) — POST Multimeter / MeterDetail](#22-post-getdatamultimeter-happy-path-mm-f) — 7
   - 2.3 [Test Cases (3/6) — Response Structure & WebSocket Load](#23-response-structure--field-integrity-rf) — 8
   - 2.4 [Test Cases (4/6) — REST Load & Integration](#24-rest-api-load-http-l) — 9
   - 2.5 [Test Cases (5/6) — Cross-Endpoint & Validation Required](#25-integration--cross-endpoint-consistency-ce-i) — 10
   - 2.6 [Test Cases (6/6) — Validation Wrong Type / Range / Format](#26-validation--wrong-data-type-vt) — 11
3. [Testing Deliverables](#3-testing-deliverables) — 12
4. [Environmental Requirements](#4-environmental-requirements) — 13
5. [Staffing](#5-staffing) — 14
6. [Schedule](#6-schedule) — 15
7. [Risks and Contingencies](#7-risks-and-contingencies) — 16
8. [Approvals](#8-approvals) — 17

---

## 1. Introduction

### Purpose

This document serves as the test plan for the UMTH Flow meter Visualization API. It specifies the black-box test cases used to verify all software artifacts and report test results.

### System Under Test

The system consists of two sub-systems:

1. **WebSocket Sensor Server** — real-time sensor data via `ws://{host}:9001/ws/` using JSON text frames (RFC 6455)
2. **HTTP REST API** — energy meter data via `http://{host}:5000` with three POST endpoints: `/GetDataMeterSum`, `/GetDataMultimeter`, `/GetDataMeterDetail`

### Test Approach

Testing is organized into four categories covering the full quality scope of the system:

| Category | Cases | Purpose |
|----------|-------|---------|
| **Functional Testing** | 30 | Correct request/response behavior per specification |
| **Load Testing** | 10 | Stability and response time under concurrent and sustained load |
| **Integration Testing** | 12 | Data integrity across API, SQL Server, and sensor/PLC hardware |
| **Validation Testing** | 18 | Proper rejection of malformed, missing, and out-of-range inputs |
| **Total** | **70** | 16 test groups — executed over a 2-day schedule |

---

## 2. Test Plan

The table below specifies the black-box test cases for all 70 requirements. Each requirement has at least one test case derived from equivalence class partitioning, boundary value analysis, and error-condition coverage.

| Column | Description |
|--------|-------------|
| **Test ID** | Unique identifier relating to the requirement group and sub-test. Format: `GROUP-NN` (e.g. `WS-F-01`, `MS-F-03`). |
| **Description** | Step-by-step actions to execute the test case — specific enough that any team member can run the test without the author present. |
| **Expected Results** | Statement of what should happen when the test case is executed correctly against a conforming implementation. |
| **Actual Results** | Filled in during execution. Record `Pass` or `Fail` and describe actual behavior when the test fails. |

---

### 2.1 WebSocket Happy Path (WS-F)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **WS-F-01** | Send `{"cmd":"PING"}` to `ws://{host}:9001/ws/` | `Command="PING"`, `Status="OK"`, `Response="PONG"`, valid ISO 8601 `Timestamp` | |
| **WS-F-02** | Send `{"Cmd":"ping"}` — mixed-case field name and value | Same as WS-F-01; server is case-insensitive for both field name and command value | |
| **WS-F-03** | Send `{"command":"PING"}` — alternative field name | Same as WS-F-01; server accepts `cmd`, `Cmd`, `command`, `Command` | |
| **WS-F-04** | Send `{"cmd":"INFO"}` — verify root-level fields | `Command="INFO"`, `Status="OK"`, valid `Timestamp`; `Total`, `Online`, `Alarm`, `Offline`, `Disabled` all ≥ 0 | |
| **WS-F-05** | Send `{"cmd":"INFO"}` — inspect `Sensors` array | Every object in `Sensors` has `Status="Online"` (StatusCode=1) only; no Disabled, Alarm, or Offline entries | |
| **WS-F-06** | Send `{"cmd":"INFO"}` — count arithmetic | `Total = Online + Alarm + Offline + Disabled` balances exactly | |
| **WS-F-07** | Send `{"cmd":"INFO"}` — inspect Sensor object fields | Each object has: `SensorId` (int), `SensorName` (string), `FlowId` (int), `Value` (int), `Accumulate` (uint), `Status` (string), `LastUpdated` (ISO 8601) | |

---

### 2.2 POST /GetDataMeterSum Happy Path (MS-F)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **MS-F-01** | `Type="Day"`, `Meter=1`, `DataSelect=["10","11","12"]`, `Interval=15`, `Month="06"` | Keys in `ArrDataTarget`/`ArrDataActual` are `"10"`,`"11"`,`"12"`; `ArrCategories` in 15-min `HH:mm` labels; `ShortMonth="Jun"`, `Year="2025"` | |
| **MS-F-02** | `Type="Week"`, `Meter="ALL"`, `DataSelect=["2025-06-02\|\|2025-06-08","2025-06-09\|\|2025-06-15"]`, `Interval=7` | Keys match both `DataSelect` strings; `ArrCategories` lists day labels for each week range | |
| **MS-F-03** | `Type="Month"`, `Meter=1`, `DataSelect=["04","05","06"]`, `Interval=0` | Keys are `"04"`,`"05"`,`"06"`; `ArrCategories` lists day-of-month labels | |
| **MS-F-04** | `Type="Year"`, `Meter=1`, `DataSelect=["2023","2024","2025"]`, `Interval=0` | Keys are `"2023"`,`"2024"`,`"2025"`; `ArrCategories` lists 12 month abbreviations | |
| **MS-F-05** | `Type="Max10Year"`, `Meter="ALL"`, `DataSelect=["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"]`, `Interval=0` | Keys match all 10 year strings; `ArrCategories` lists year labels 2016–2025 | |

---

### POST /GetDataMultimeter Happy Path (MM-F)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **MM-F-01** | `Type="Day"`, `Meter=[1,2,3]`, `DataSelect="15"`, `Interval=15`, `Month="06"` | Keys in `ArrDataTarget`/`ArrDataActual` are meter IDs; `ArrCategories` in 15-min intervals; `ShortMonth` and `Year` present | |
| **MM-F-02** | `Type="Week"`, `Meter=[1,2]`, `DataSelect="2025-06-09\|\|2025-06-15"`, `Interval=7` | Keys are `"1"`,`"2"`; `ArrCategories` lists day labels for the specified week | |
| **MM-F-03** | `Type="Month"`, `Meter=[1,2]`, `DataSelect="06"`, `Interval=0` | Keys are meter IDs; `ArrCategories` lists day-of-month labels for June | |
| **MM-F-04** | `type="Year"`, `Meter=[1,2]`, `DataSelect="2025"`, `interval=0` | Keys are meter IDs; `ArrCategories` lists 12 month abbreviations | |
| **MM-F-05** | `Type="Max10Year"`, `Meter=[1,2]`, `DataSelect="2025\|2016"`, `Interval=0` | Keys are meter IDs; `ArrCategories` lists year labels from 2016 to 2025 | |

---

### POST /GetDataMeterDetail Happy Path (MD-F)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **MD-F-01** | `type="Day"`, `Meter=[1,2]`, `DataSelect="15"`, `interval=15`, `month="06"` | Response has `MaxData`, `ArrDataChart` (ChartSeries array), `ArrStrokeChart`, `ArrCategories`, `MeterLabelMap`; each series has `name`, `type="bar"`, `color` (HEX), `data` (doubles) | |
| **MD-F-02** | `type="Week"`, `Meter=[1]`, `DataSelect="2025-06-09\|\|2025-06-15"`, `interval=7` | Same structure as MD-F-01; `ArrCategories` contains day labels for the specified week | |
| **MD-F-03** | `type="Month"`, `Meter=[1]`, `DataSelect="06"`, `interval=0` | Same structure as MD-F-01; `ArrCategories` contains day-of-month labels | |
| **MD-F-04** | `type="Year"`, `Meter=[1,2]`, `DataSelect="2025"`, `interval=0` | Same structure as MD-F-01; `ArrCategories` contains 12 month abbreviation labels | |
| **MD-F-05** | `type="Max10Year"`, `Meter=[1]`, `DataSelect="2025\|2016"`, `interval=0` | Same structure as MD-F-01; `ArrCategories` contains year labels from 2016 to 2025 | |

---

### 2.3 Response Structure & Field Integrity (RF)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **RF-01** | MeterSum: verify response key type for `Type="Day"` | Keys in `ArrDataTarget`/`ArrDataActual` are **time strings** (e.g. `"10"`, `"11"`) — not meter IDs | |
| **RF-02** | Multimeter: verify response key type for `Type="Day"` | Keys in `ArrDataTarget`/`ArrDataActual` are **meter ID strings** (e.g. `"1"`) — not time strings | |
| **RF-03** | MeterSum: verify `MaxValueTarget`/`MaxValueActual` for `Type="Month"` | `MaxValueTarget` ≥ every value across all `ArrDataTarget` arrays; `MaxValueActual` ≥ every value across all `ArrDataActual` arrays | |
| **RF-04** | Multimeter: verify max value integrity for `Type="Month"` | Same max-value rule applied to Multimeter response | |
| **RF-05** | MeterDetail: verify ChartSeries object structure (`Type="Day"`, two meters) | Each object in `ArrDataChart` has: `Name` (string), `Type="bar"`, `Color` (valid HEX e.g. `"#FF6384"`), `Data` (doubles array; length = `ArrCategories`) | |
| **RF-06** | MeterDetail: verify `MeterLabelMap` for `Meter=[1,2]` | `MeterLabelMap` has exactly 2 entries; each has `id` and `label`; `id` values match `1` and `2` | |
| **RF-07** | MeterDetail: verify `ArrStrokeChart` length consistency | `ArrStrokeChart` length = number of objects in `ArrDataChart`; every value is int ≥ 0 | |
| **RF-08** | MeterSum Day: verify `ArrCategories` length by `Interval` | `Interval=5` → 288 entries; `Interval=15` → 96; `Interval=60` → 24; Data array length matches `ArrCategories` length | |

---

### WebSocket Load (WS-L)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **WS-L-01** | Open 10 simultaneous WS connections; each sends `PING` at the same moment | All 10 clients receive correct PONG within 1 second; no connections dropped | |
| **WS-L-02** | Open 50 simultaneous WS connections; each sends `PING` at the same moment | All 50 clients receive correct PONG within 2 seconds; no connections dropped | |
| **WS-L-03** | Open 100 simultaneous WS connections; each sends `PING` at the same moment | All 100 clients receive correct PONG within 5 seconds; server does not crash | |
| **WS-L-04** | Single client sends `PING` 100 times consecutively without pause | All 100 responses correct; no missing or malformed responses | |
| **WS-L-05** | Single client sends `INFO` 50 times consecutively without pause | All 50 responses correct and contain valid sensor data; no timeouts | |

---

### 2.4 REST API Load (HTTP-L)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **HTTP-L-01** | Send 20 concurrent `POST /GetDataMeterSum` (`Type="Month"`) | All 20 responses correct and identical; response time ≤ 3 s each | |
| **HTTP-L-02** | Send 20 concurrent `POST /GetDataMultimeter` (`Type="Month"`) | All 20 responses correct and identical; response time ≤ 3 s each | |
| **HTTP-L-03** | Send 20 concurrent `POST /GetDataMeterDetail` (`Type="Month"`) | All 20 responses correct and identical; response time ≤ 3 s each | |
| **HTTP-L-04** | Mixed: 10 requests each to all 3 endpoints simultaneously (30 total) | No request fails; no HTTP 500; all responses correct | |
| **HTTP-L-05** | Send 1 `POST /GetDataMeterSum` per second for 5 minutes (300 total) | Response time does not increase progressively; no errors after sustained 5-minute run | |

---

### Integration — WebSocket ↔ Sensor/PLC (WS-I)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **WS-I-01** | Send `INFO`; compare `Value` of an Online sensor against PLC reading directly | `Value` in response matches PLC reading within defined tolerance | |
| **WS-I-02** | Send `INFO`; check `LastUpdated` timestamp of Online sensors | `LastUpdated` for every Online sensor is no older than 5 minutes from request time | |
| **WS-I-03** | Count Online sensors from PLC directly; compare against `Online` field in INFO response | `Online` field in response equals PLC Online sensor count | |

---

### Integration — HTTP API ↔ SQL Server (DB-I)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **DB-I-01** | Call `/GetDataMeterSum` (`Type="Month"`, `Meter=1`, `DataSelect=["06"]`); query same data from `unimicron_db` | `ArrDataActual["06"]` values match Actual records in database exactly | |
| **DB-I-02** | Same request as DB-I-01; query Target data from `unimicron_db` | `ArrDataTarget["06"]` values match Target records in database exactly | |
| **DB-I-03** | Call `/GetDataMeterDetail` (`Type="Month"`, `Meter=[1,2]`); query meter names from `unimicron_db` | Each `label` in `MeterLabelMap` matches the meter name stored in `unimicron_db` | |

---

### 2.5 Integration — Cross-Endpoint Consistency (CE-I)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **CE-I-01** | Call MeterSum (`Meter=1`, `Type="Month"`, `DataSelect=["06"]`) and Multimeter (`Meter=[1]`, `DataSelect="06"`) | Actual data for Meter=1 in June is identical across both responses | |
| **CE-I-02** | Call Multimeter and MeterDetail for same meters and same month | Sum of all Sub-Meter `Data` values per category in MeterDetail is consistent with Actual values in Multimeter | |
| **CE-I-03** | Call MeterSum twice with `Past=0` and `Past=1`; all other parameters identical | Two responses return different data — confirms `Past` parameter correctly shifts year context | |

---

### Integration — System Failure Handling (ERR-I)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **ERR-I-01** | Stop SQL Server; call `POST /GetDataMeterSum` | API returns meaningful error response (not raw HTTP 500); server does not crash | |
| **ERR-I-02** | Stop WebSocket server; attempt client connection | Client receives clear connection-refused error; no indefinite hang | |
| **ERR-I-03** | Simulate high DB load (long-running query); call `POST /GetDataMeterDetail` | API responds (possibly slower) but does not return incorrect data and does not crash | |

---

### Validation — Required Field Missing (VR)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VR-01** | `POST /GetDataMeterSum` — omit `Type` field entirely | Error response (HTTP 4xx or `Status:"ERROR"`); no HTTP 500 | |
| **VR-02** | `POST /GetDataMeterSum` — omit `Meter` field entirely | Error response; no HTTP 500 | |
| **VR-03** | `POST /GetDataMeterSum` — omit `DataSelect` field entirely | Error response; no HTTP 500 | |
| **VR-04** | `POST /GetDataMultimeter` — omit `Interval` field entirely | Error response; no HTTP 500 | |
| **VR-05** | `POST /GetDataMeterDetail` — omit `Past` field entirely | Error response; no HTTP 500 | |

---

### 2.6 Validation — Wrong Data Type (VT)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VT-01** | `POST /GetDataMeterSum` — send `"Interval": "fifteen"` (string instead of int) | Error response; no HTTP 500 | |
| **VT-02** | `POST /GetDataMultimeter` — send `"Meter": 1` (int instead of int array) | Error response; no HTTP 500 | |
| **VT-03** | `POST /GetDataMeterSum` — send `"DataSelect": "10"` (string instead of string array) | Error response; no HTTP 500 | |
| **VT-04** | `POST /GetDataMeterDetail` — send `"Past": "zero"` (string instead of int) | Error response; no HTTP 500 | |

---

### Validation — Out-of-Range Values (VO)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VO-01** | `POST /GetDataMeterSum` — send `"Past": -1` (negative value) | Error response or graceful fallback; no HTTP 500 | |
| **VO-02** | `POST /GetDataMeterSum` — send `Type="Day"` with `Interval=3` (not 5, 15, or 60) | Error response or empty data arrays; no HTTP 500 | |
| **VO-03** | `POST /GetDataMeterSum` — send `"Month": "13"` (month 13 does not exist) | Error response; no HTTP 500 | |
| **VO-04** | `POST /GetDataMeterDetail` — send `"Past": 999` (unreasonably large) | Error response or empty data; no HTTP 500 | |

---

### Validation — Invalid Format (VF)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VF-01** | `POST /GetDataMeterSum` — Week `DataSelect` sent as `"20250609-20250615"` (dash instead of `\|\|`) | Error response; no HTTP 500 | |
| **VF-02** | `POST /GetDataMultimeter` — Max10Year `DataSelect` sent as `"2025-2016"` (dash instead of `\|`) | Error response; no HTTP 500 | |
| **VF-03** | `POST /GetDataMeterDetail` — send `"Month": "6"` (missing leading zero; spec requires `"06"`) | Server handles zero-padding gracefully or returns descriptive error; no HTTP 500 | |

---

### Validation — Invalid Meter ID (VM)

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VM-01** | `POST /GetDataMeterSum` — send `"Meter": 9999` (meter ID does not exist) | Error response or empty data arrays; no HTTP 500 | |
| **VM-02** | `POST /GetDataMultimeter` — send `"Meter": [1, 9999]` (one valid, one invalid) | Server returns data for valid meters only, or errors on whole request; no HTTP 500; behavior documented | |

---

### Test Case Summary

| Category | Group | Count |
|----------|-------|-------|
| Functional | WebSocket Happy Path (WS-F) | 7 |
| Functional | GetDataMeterSum Happy Path (MS-F) | 5 |
| Functional | GetDataMultimeter Happy Path (MM-F) | 5 |
| Functional | GetDataMeterDetail Happy Path (MD-F) | 5 |
| Functional | Response Structure & Integrity (RF) | 8 |
| **Functional Subtotal** | | **30** |
| Load | WebSocket Load (WS-L) | 5 |
| Load | REST API Load (HTTP-L) | 5 |
| **Load Subtotal** | | **10** |
| Integration | WebSocket ↔ Sensor/PLC (WS-I) | 3 |
| Integration | HTTP API ↔ SQL Server (DB-I) | 3 |
| Integration | Cross-Endpoint Consistency (CE-I) | 3 |
| Integration | System Failure Handling (ERR-I) | 3 |
| **Integration Subtotal** | | **12** |
| Validation | Required Field Missing (VR) | 5 |
| Validation | Wrong Data Type (VT) | 4 |
| Validation | Out-of-Range Values (VO) | 4 |
| Validation | Invalid Format (VF) | 3 |
| Validation | Invalid Meter ID (VM) | 2 |
| **Validation Subtotal** | | **18** |
| **TOTAL** | | **70** |

---

## 3. Testing Deliverables

| # | Deliverable | Description |
|---|------------|-------------|
| 1 | **Test Case Specification** | This document (Sections I–IX) including all 70 test cases with Test ID, Description, Expected Results, and Actual Results columns |
| 2 | **Test Log** | Execution record for each test case: timestamp, tester name, build version, and actual result (Pass/Fail with notes) |
| 3 | **Test Incident Report** | Filed for every failing test case; documents actual vs. expected behavior, reproduction steps, severity, and assigned developer |
| 4 | **Test Summary Report** | Pass/fail statistics per category (Functional / Load / Integration / Validation) and overall after each test cycle |
| 5 | **Test Input and Output Data** | Saved raw JSON request bodies and response payloads for each test case execution |
| 6 | **Load Test Results** | Response time measurements and server resource metrics (CPU, memory) for all Load Testing cases (WS-L, HTTP-L) |
| 7 | **Test Design Specification** | Coverage rationale: equivalence classes, boundary values, and error conditions considered when deriving each test case |

---

## 4. Environmental Requirements

### Hardware & System Software

| Component | Requirement |
|-----------|------------|
| **Application Server** | UMTH application running and accessible |
| **Database** | SQL Server with `unimicron_db` accessible |
| **HTTP Port** | 5000 (HTTP) / 5001 (HTTPS) — ListenAnyIP |
| **WebSocket Port** | 9001 |
| **Network** | Tester machine must reach host on TCP ports 5000, 5001, 9001 |

### Testing Tools

| Tool | Requirement |
|------|------------|
| **REST Client** | Postman or curl — for HTTP endpoint testing |
| **WebSocket Client** | `wscat` or Postman WebSocket — for WS endpoint testing |
| **Load Tool** | k6, JMeter, or equivalent — for Load Testing cases |
| **DB Access** | Read access to `unimicron_db` — required for Integration Testing |
| **API Explorer** | Swagger UI available at `/swagger` on all environments |

### Security

| Setting | Value |
|---------|-------|
| **Scope** | Internal network only; no external exposure required during testing |
| **CORS Policy** | AllowAnyOrigin, AllowAnyMethod, AllowAnyHeader (test environment) |

---

## 5. Staffing

| Role | Responsibility |
|------|---------------|
| **Test Lead** | Oversees test execution across all four categories. Reviews all incident reports. Signs off on the final Test Summary Report. Escalates blockers to Project Sponsor. |
| **Functional Tester** | Executes Functional Testing (WS-F, MS-F, MM-F, MD-F, RF) and Validation Testing (VR, VT, VO, VF, VM) cases. Records actual results in the Test Log. |
| **Integration Tester** | Executes Integration Testing (WS-I, DB-I, CE-I, ERR-I) cases. Requires read access to `unimicron_db` and network visibility to PLC/sensor hardware. |
| **Performance Tester** | Configures and runs Load Testing (WS-L, HTTP-L) cases using k6 or JMeter. Records response times and server resource metrics (CPU, memory). |
| **Developer / API Owner** | Available during test execution to clarify API specification, resolve defects, and provide build versions. Does not execute tests directly. |

---

## 6. Schedule

| Phase | Day | Activity | Cases | Owner |
|-------|-----|----------|-------|-------|
| 1 | Day 1 | Environment setup and connectivity verification | — | Tester / Developer |
| 2 | Day 2 | Functional Testing — WebSocket cases (WS-F-01 to WS-F-07) | 7 | Tester |
| 3 | Day 2 | Functional Testing — HTTP happy path (MS-F, MM-F, MD-F, RF) | 23 | Tester |
| 4 | Day 2 | Validation Testing — all groups (VR, VT, VO, VF, VM) | 18 | Tester |
| 5 | Day 2 | Integration Testing — all groups (WS-I, DB-I, CE-I, ERR-I) | 12 | Tester |
| 6 | Day 2 | Load Testing — all groups (WS-L, HTTP-L) | 10 | Tester |
| 7 | Day 2 | Create Test Report Document | — | Tester |

---

## 7. Risks and Contingencies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| SQL Server unavailable during testing | Medium | High | Confirm DB connectivity before start; coordinate dedicated test window with DBA |
| Sensor devices offline (affects WS-I data cases) | Medium | Medium | Use staging environment with simulated sensor data for WS-I cases |
| Load tests disrupt other users or services | Medium | High | Run all load tests in isolated test environment — never against production |
| `Past = -1` causes unhandled server exception | Low | High | Execute VO-01 first to detect server instability before running the full suite |
| DB read credentials unavailable for Integration | Low | Medium | Arrange read access to `unimicron_db` in advance of the test cycle |

---

## 8. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Tester | | | |
| Developer / IoT Engineer | | | |
| Project Owner | | | |

---

## Document Revision History

| Version | Author | Date | Description |
|---------|--------|------|-------------|
| 1.0 | Tomas Tech Co., Ltd. | 26 April 2026 | Initial document — 70 test cases across 4 categories |