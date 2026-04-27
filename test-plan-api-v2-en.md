# UMTH Sensor & Energy API — Test Plan

**Document Version:** 2.0
**Date:** 2026-04-26

| | Name | Role |
|---|---|---|
| **Project Team** | — | — |
| **Document Author** | — | — |
| **Project Sponsor** | — | — |

---

# I. Introduction

This document serves as the test plan for the UMTH Sensor & Energy Monitoring API system, which consists of two independent sub-systems:

1. **WebSocket Sensor Server** — Real-time sensor data access via `ws://{host}:9001/ws/` using JSON text frames (RFC 6455)
2. **HTTP REST API** — Energy meter data via `http://{host}:5000` (3 POST endpoints: `/GetDataMeterSum`, `/GetDataMultimeter`, `/GetDataMeterDetail`)

Testing is organized into four categories:

| Category | Purpose |
|----------|---------|
| **Functional Testing** | Verify each API endpoint behaves correctly per specification |
| **Load Testing** | Verify system stability and response time under concurrent and sustained load |
| **Integration Testing** | Verify correct data flow between API, database, and sensor/PLC hardware |
| **Validation Testing** | Verify the API properly rejects malformed, missing, and out-of-range inputs |

---

# II. Test Plan

---

## Category 1 — Functional Testing

### WS-F: WebSocket Happy Path

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **WS-F-01** | Connect to `ws://{host}:9001/ws/` and send `{"cmd": "PING"}`. | Response: `Command="PING"`, `Status="OK"`, `Response="PONG"`, `Timestamp` in valid ISO 8601 format. | |
| **WS-F-02** | Send `{"Cmd": "ping"}` (mixed-case field name and lowercase value). | Same response as WS-F-01. Server must be case-insensitive for both field name and command value. | |
| **WS-F-03** | Send `{"command": "PING"}` (alternative field name). | Same response as WS-F-01. Server accepts: `cmd`, `Cmd`, `command`, `Command`. | |
| **WS-F-04** | Send `{"cmd": "INFO"}` and verify root-level fields. | Response contains `Command="INFO"`, `Status="OK"`, valid `Timestamp`, and integer fields `Total`, `Online`, `Alarm`, `Offline`, `Disabled` all ≥ 0. | |
| **WS-F-05** | Send `{"cmd": "INFO"}` and inspect the `Sensors` array. | Every object in `Sensors` has `Status="Online"` (StatusCode=1) only. No Disabled, Alarm, or Offline sensors appear. | |
| **WS-F-06** | Send `{"cmd": "INFO"}` and verify sensor count arithmetic. | `Total = Online + Alarm + Offline + Disabled` balances exactly. | |
| **WS-F-07** | Send `{"cmd": "INFO"}` and inspect at least one object in `Sensors` for required fields. | Each object has: `SensorId` (int), `SensorName` (string), `FlowId` (int), `Value` (int), `Accumulate` (uint), `Status` (string), `LastUpdated` (ISO 8601). | |

---

### MS-F: POST /GetDataMeterSum — Happy Path

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **MS-F-01** | Send `{"Type":"Day","Meter":"PM001","DataSelect":["10","11","12"],"Interval":15,"Past":0,"Month":"06"}`. | Keys in `ArrDataTarget`/`ArrDataActual` are `"10"`, `"11"`, `"12"`. `ArrCategories` contains 15-minute interval labels in `"HH:mm"` format. `ShortMonth="Jun"`, `Year="2025"`. | |
| **MS-F-02** | Send `{"Type":"Week","Meter":"ALL","DataSelect":["2025-06-02\|\|2025-06-08","2025-06-09\|\|2025-06-15"],"Interval":7,"Past":0,"Month":"06"}`. | Keys match the two DataSelect strings. `ArrCategories` lists day labels for the week ranges. | |
| **MS-F-03** | Send `{"Type":"Month","Meter":"G001","DataSelect":["04","05","06"],"Interval":0,"Past":0}`. | Keys are `"04"`, `"05"`, `"06"`. `ArrCategories` lists day-of-month labels. | |
| **MS-F-04** | Send `{"Type":"Year","Meter":"PM001","DataSelect":["2023","2024","2025"],"Interval":0,"Past":0}`. | Keys are `"2023"`, `"2024"`, `"2025"`. `ArrCategories` lists 12 month abbreviations. | |
| **MS-F-05** | Send `{"Type":"Max10Year","Meter":"ALL","DataSelect":["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"],"Interval":0,"Past":0}`. | Keys match all 10 year strings. `ArrCategories` lists year labels. | |

---

### MM-F: POST /GetDataMultimeter — Happy Path

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **MM-F-01** | Send `{"Type":"Day","Meter":["PM001","PM002","PM003"],"DataSelect":"15","Interval":15,"Past":0,"Month":"06"}`. | Keys in `ArrDataTarget`/`ArrDataActual` are meter IDs. `ArrCategories` in 15-minute intervals. `ShortMonth` and `Year` present. | |
| **MM-F-02** | Send `{"Type":"Week","Meter":["PM001","PM002"],"DataSelect":"2025-06-09\|\|2025-06-15","Interval":7,"Past":0,"Month":"06"}`. | Keys are `"PM001"`, `"PM002"`. `ArrCategories` lists day labels for the specified week. | |
| **MM-F-03** | Send `{"Type":"Month","Meter":["PM001","PM002"],"DataSelect":"06","Interval":0,"Past":0}`. | Keys are meter IDs. `ArrCategories` lists day-of-month labels for June. | |
| **MM-F-04** | Send `{"Type":"Year","Meter":["PM001","PM002"],"DataSelect":"2025","Interval":0,"Past":0}`. | Keys are meter IDs. `ArrCategories` lists 12 month abbreviations. | |
| **MM-F-05** | Send `{"Type":"Max10Year","Meter":["PM001","PM002"],"DataSelect":"2025\|2016","Interval":0,"Past":0}`. | Keys are meter IDs. `ArrCategories` lists year labels from 2016 to 2025. | |

---

### MD-F: POST /GetDataMeterDetail — Happy Path

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **MD-F-01** | Send `{"Type":"Day","Meter":["PM001","PM002"],"DataSelect":"15","Interval":15,"Past":0,"Month":"06"}`. | Response contains `MaxData`, `ArrDataChart` (array of ChartSeries), `ArrStrokeChart`, `ArrCategories`, `MeterLabelMap`. Each series has `Name`, `Type="bar"`, `Color` (HEX), `Data` (array of doubles). | |
| **MD-F-02** | Send `{"Type":"Week","Meter":["PM001"],"DataSelect":"2025-06-09\|\|2025-06-15","Interval":7,"Past":0,"Month":"06"}`. | Same structure as MD-F-01. `ArrCategories` contains day labels for the specified week. | |
| **MD-F-03** | Send `{"Type":"Month","Meter":["PM001"],"DataSelect":"06","Interval":0,"Past":0}`. | Same structure as MD-F-01. `ArrCategories` contains day-of-month labels. | |
| **MD-F-04** | Send `{"Type":"Year","Meter":["PM001","PM002"],"DataSelect":"2025","Interval":0,"Past":0}`. | Same structure as MD-F-01. `ArrCategories` contains 12 month abbreviation labels. | |
| **MD-F-05** | Send `{"Type":"Max10Year","Meter":["PM001"],"DataSelect":"2025\|2016","Interval":0,"Past":0}`. | Same structure as MD-F-01. `ArrCategories` contains year labels from 2016 to 2025. | |

---

### RF: Response Structure & Field Integrity

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **RF-01** | MeterSum — verify response key type for Type="Day". | Keys in `ArrDataTarget`/`ArrDataActual` are **time strings** (e.g., `"10"`, `"11"`), not meter IDs. Contrasts with Multimeter which uses meter IDs as keys. | |
| **RF-02** | Multimeter — verify response key type for Type="Day". | Keys in `ArrDataTarget`/`ArrDataActual` are **meter ID strings** (e.g., `"PM001"`), not time strings. | |
| **RF-03** | MeterSum — verify max value integrity for Type="Month". | `MaxValueTarget` ≥ every value across all `ArrDataTarget` arrays. `MaxValueActual` ≥ every value across all `ArrDataActual` arrays. | |
| **RF-04** | Multimeter — verify max value integrity for Type="Month". | Same condition as RF-03 applied to Multimeter response. | |
| **RF-05** | MeterDetail — verify ChartSeries object structure for Type="Day" with two meters. | Each object in `ArrDataChart` contains: `Name` (string), `Type="bar"`, `Color` (valid HEX e.g. `"#FF6384"`), `Data` (doubles array with length equal to `ArrCategories`). | |
| **RF-06** | MeterDetail — verify MeterLabelMap completeness for Meter=["PM001","PM002"]. | `MeterLabelMap` has exactly 2 entries. Each entry has `id` and `label` fields. `id` values match `"PM001"` and `"PM002"`. | |
| **RF-07** | MeterDetail — verify ArrStrokeChart length consistency. | `ArrStrokeChart` length equals number of objects in `ArrDataChart`. Every value is int ≥ 0. | |
| **RF-08** | MeterSum Day — verify ArrCategories length by Interval. | Interval=5 → 288 entries. Interval=15 → 96 entries. Interval=60 → 24 entries. Length of each Data array matches `ArrCategories` length. | |

---

## Category 2 — Load Testing

### WS-L: WebSocket Load

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **WS-L-01** | Open 10 simultaneous WebSocket connections, each sending `{"cmd":"PING"}` at the same moment. | All 10 clients receive a correct PONG response within 1 second. No connections are dropped. | |
| **WS-L-02** | Open 50 simultaneous WebSocket connections, each sending `{"cmd":"PING"}` at the same moment. | All 50 clients receive a correct PONG response within 2 seconds. No connections are dropped. | |
| **WS-L-03** | Open 100 simultaneous WebSocket connections, each sending `{"cmd":"PING"}` at the same moment. | All 100 clients receive a correct PONG response within 5 seconds. Server does not crash or restart. | |
| **WS-L-04** | Single client sends `{"cmd":"PING"}` 100 times consecutively without pause. | All 100 responses are correct. No missing or malformed responses. | |
| **WS-L-05** | Single client sends `{"cmd":"INFO"}` 50 times consecutively without pause. | All 50 responses are correct and contain valid sensor data. No timeouts or dropped messages. | |

---

### HTTP-L: REST API Load

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **HTTP-L-01** | Send 20 concurrent POST requests to `/GetDataMeterSum` (same request body, Type="Month"). | All 20 responses are correct and identical. Response time ≤ 3 seconds per request. | |
| **HTTP-L-02** | Send 20 concurrent POST requests to `/GetDataMultimeter` (same request body, Type="Month"). | All 20 responses are correct and identical. Response time ≤ 3 seconds per request. | |
| **HTTP-L-03** | Send 20 concurrent POST requests to `/GetDataMeterDetail` (same request body, Type="Month"). | All 20 responses are correct and identical. Response time ≤ 3 seconds per request. | |
| **HTTP-L-04** | Send mixed load: 10 requests each to all 3 endpoints simultaneously (30 total concurrent requests). | No request fails. No HTTP 500 errors. All responses correct. | |
| **HTTP-L-05** | Send 1 POST request to `/GetDataMeterSum` every second for 5 minutes (300 total requests). | Response time does not increase progressively over time (no memory leak). No errors after sustained 5-minute run. | |

---

## Category 3 — Integration Testing

### WS-I: WebSocket ↔ Sensor / PLC

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **WS-I-01** | Send `{"cmd":"INFO"}` and compare `Value` of an Online sensor against the reading directly from the PLC. | `Value` in the response matches the PLC reading within the defined tolerance. | |
| **WS-I-02** | Send `{"cmd":"INFO"}` and verify the `LastUpdated` timestamp of Online sensors. | `LastUpdated` for every Online sensor is no older than 5 minutes from the time of the request. | |
| **WS-I-03** | Count Online sensors directly from PLC and compare against the `Online` field in the INFO response. | `Online` in the response equals the PLC Online sensor count. | |

---

### DB-I: HTTP API ↔ SQL Server

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **DB-I-01** | Call `/GetDataMeterSum` (Type="Month", Meter="PM001", DataSelect=["06"]). Query the same data directly from `unimicron_db`. | `ArrDataActual["06"]` values match the Actual records in the database exactly. | |
| **DB-I-02** | Same request as DB-I-01. Query Target data from `unimicron_db`. | `ArrDataTarget["06"]` values match the Target records in the database exactly. | |
| **DB-I-03** | Call `/GetDataMeterDetail` (Type="Month", Meter=["PM001","PM002"]). Query meter names from `unimicron_db`. | Each `label` in `MeterLabelMap` matches the meter name stored in the database. | |

---

### CE-I: Cross-Endpoint Consistency

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **CE-I-01** | Call MeterSum (Meter="PM001", Type="Month", DataSelect=["06"]) and Multimeter (Meter=["PM001"], Type="Month", DataSelect="06"). | Actual data for PM001 in June is identical across both responses. | |
| **CE-I-02** | Call Multimeter and MeterDetail for the same meters and the same month. | The sum of all Sub-Meter `Data` values per category in MeterDetail is consistent with the Actual values in Multimeter. | |
| **CE-I-03** | Call MeterSum twice with Past=0 and Past=1, all other parameters identical. | The two responses return different data. Confirms `Past` parameter correctly shifts the year context. | |

---

### ERR-I: System Failure Handling

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **ERR-I-01** | Stop SQL Server, then call POST `/GetDataMeterSum`. | API returns a meaningful error response (not a raw HTTP 500). Server does not crash or restart. | |
| **ERR-I-02** | Stop the WebSocket server, then attempt to connect a client. | Client receives a clear connection-refused error. No indefinite hang. | |
| **ERR-I-03** | Simulate high DB load (e.g., long-running query), then call POST `/GetDataMeterDetail`. | API responds (possibly slower) but does not return incorrect data and does not crash. | |

---

## Category 4 — Validation Testing

### VR: Required Field Missing

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VR-01** | POST `/GetDataMeterSum` — omit the `Type` field entirely. | Error response (HTTP 4xx or `Status:"ERROR"`). No HTTP 500. | |
| **VR-02** | POST `/GetDataMeterSum` — omit the `Meter` field entirely. | Error response. No HTTP 500. | |
| **VR-03** | POST `/GetDataMeterSum` — omit the `DataSelect` field entirely. | Error response. No HTTP 500. | |
| **VR-04** | POST `/GetDataMultimeter` — omit the `Interval` field entirely. | Error response. No HTTP 500. | |
| **VR-05** | POST `/GetDataMeterDetail` — omit the `Past` field entirely. | Error response. No HTTP 500. | |

---

### VT: Wrong Data Type

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VT-01** | POST `/GetDataMeterSum` — send `"Interval": "fifteen"` (string instead of int). | Error response. No HTTP 500. | |
| **VT-02** | POST `/GetDataMultimeter` — send `"Meter": "PM001"` (string instead of string array). | Error response. No HTTP 500. | |
| **VT-03** | POST `/GetDataMeterSum` — send `"DataSelect": "10"` (string instead of string array). | Error response. No HTTP 500. | |
| **VT-04** | POST `/GetDataMeterDetail` — send `"Past": "zero"` (string instead of int). | Error response. No HTTP 500. | |

---

### VO: Out-of-Range Values

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VO-01** | POST `/GetDataMeterSum` — send `"Past": -1` (negative value). | Error response or graceful fallback. No HTTP 500. | |
| **VO-02** | POST `/GetDataMeterSum` — send `"Type":"Day"` with `"Interval": 3` (not 5, 15, or 60). | Error response or empty data arrays. No HTTP 500. | |
| **VO-03** | POST `/GetDataMeterSum` — send `"Month": "13"` (month 13 does not exist). | Error response. No HTTP 500. | |
| **VO-04** | POST `/GetDataMeterDetail` — send `"Past": 999` (unreasonably large). | Error response or empty data. No HTTP 500. | |

---

### VF: Invalid Format

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VF-01** | POST `/GetDataMeterSum` — send Week DataSelect as `"20250609-20250615"` (dash instead of `\|\|`). | Error response. No HTTP 500. | |
| **VF-02** | POST `/GetDataMultimeter` — send Max10Year DataSelect as `"2025-2016"` (dash instead of `\|`). | Error response. No HTTP 500. | |
| **VF-03** | POST `/GetDataMeterDetail` — send `"Month": "6"` (no leading zero; spec requires `"06"`). | Server handles the missing zero-padding gracefully or returns a descriptive error. No HTTP 500. | |

---

### VM: Invalid Meter ID

| Test ID | Description | Expected Results | Actual Results |
|---------|-------------|-----------------|----------------|
| **VM-01** | POST `/GetDataMeterSum` — send `"Meter": "XXXX"` (meter ID that does not exist). | Error response or empty data arrays. No HTTP 500. | |
| **VM-02** | POST `/GetDataMultimeter` — send `"Meter": ["PM001", "XXXX"]` (one valid, one invalid). | Server returns data for valid meters only, or returns an error for the whole request. No HTTP 500. Behavior is documented. | |

---

## Test Case Summary

| Category | Group | Count |
|----------|-------|-------|
| Functional | WS Happy Path (WS-F) | 7 |
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

# III. Testing Deliverables

- **Test Case Specification** — this document (Section II tables)
- **Test Log** — record of each execution with timestamp, tester name, and actual result
- **Test Incident Report** — filed for every failing test case; describes actual vs. expected behavior and reproduction steps
- **Test Summary Report** — pass/fail statistics per category after each test cycle
- **Test Input and Output Data** — saved raw JSON request bodies and response payloads for each test case
- **Load Test Results** — response time measurements and server resource metrics (CPU, memory) for all Load Testing cases

---

# IV. Environmental Requirements

| Category | Requirement |
|----------|------------|
| **Server** | UMTH application running; SQL Server (`unimicron_db`) accessible |
| **HTTP Port** | 5000 (HTTP) / 5001 (HTTPS) — ListenAnyIP |
| **WebSocket Port** | 9001 |
| **CORS** | AllowAnyOrigin, AllowAnyMethod, AllowAnyHeader |
| **Swagger** | Available at `/swagger` on all environments |
| **Network** | Tester machine must have TCP access to host on ports 5000, 5001, and 9001 |
| **REST Client** | Postman or curl for HTTP endpoint testing |
| **WebSocket Client** | `wscat` or Postman WebSocket for WS endpoint testing |
| **Load Testing Tool** | k6, JMeter, or equivalent for Load Testing cases |
| **DB Access** | Read access to `unimicron_db` for Integration Testing verification |
| **Security** | Internal network only; no external exposure required during testing |

---

# V. Staffing

| Role | Responsibility |
|------|---------------|
| **Test Lead** | Oversees execution, reviews incident reports, signs off on summary report |
| **Functional Tester** | Executes Functional and Validation test cases; records actual results |
| **Integration Tester** | Executes Integration test cases; requires DB read access and PLC visibility |
| **Performance Tester** | Sets up and executes Load Testing cases; records timing and resource metrics |
| **Developer** | Available during testing to clarify API behavior and resolve defects |

---

# VI. Schedule

| Phase | Activity | Target |
|-------|----------|--------|
| 1 | Environment setup and connectivity verification | Day 1 |
| 2 | Functional Testing — WS cases (WS-F) | Day 1 |
| 3 | Functional Testing — HTTP happy path (MS-F, MM-F, MD-F, RF) | Day 2 |
| 4 | Validation Testing — all groups (VR, VT, VO, VF, VM) | Day 3 |
| 5 | Integration Testing — all groups (WS-I, DB-I, CE-I, ERR-I) | Day 4 |
| 6 | Load Testing — all groups (WS-L, HTTP-L) | Day 5 |
| 7 | Defect re-testing and regression | Day 6 |
| 8 | Test Summary Report and sign-off | Day 7 |

---

# VII. Risks and Contingencies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| SQL Server unavailable during testing | Medium | High | Confirm DB connectivity before starting; coordinate dedicated test window with DBA |
| Sensor devices offline (affects WS-I real-data cases) | Medium | Medium | Use a staging environment with simulated sensor data |
| Load testing causes service disruption to other users | Medium | High | Run load tests in an isolated test environment, not production |
| `Month` field edge-case behavior undocumented | Low | Medium | Clarify expected behavior with developer before executing VF-03 |
| `Past` with negative value causes unhandled exception | Low | High | Prioritize VO-01 early to detect server instability before full suite |
| DB read access unavailable for Integration Testing | Low | Medium | Arrange DB read credentials in advance of test cycle start |

---

# VIII. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Developer / API Owner | | | |
| Project Sponsor | | | |

---

# IX. Document Revision History

| Version | Name(s) | Date | Change Description |
|---------|---------|------|--------------------|
| 1.0 | — | 2026-04-26 | Initial test plan — 42 cases (Functional + basic error handling) |
| 2.0 | — | 2026-04-26 | Restructured into 4 categories: Functional, Load, Integration, Validation — 70 cases total |
