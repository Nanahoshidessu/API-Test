# Handoff — UMTH-API Test Continuation

> เอกสารนี้ส่งต่อให้ chat ถัดไปทำงาน Manual scope ต่อจาก session 2026-05-05
> Source of truth สำหรับ project: `C:\Users\TMT\Desktop\MyClaude\CLAUDE.md`

---

## Context — งานที่เพิ่งจบ (2026-05-05)

แก้ **4 defects** จาก Functional Test Report v1.1 + แก้เพิ่ม **DEF-005 Input Validation** (17 cases) + run extended suites + update PPTX report

### ✅ DONE
- API repo (`C:\Users\TMT\Desktop\Project\UMTH-API`) — **4 commits** push main → Rugcom auto-deploy
  - `5622f74` fix DEF-001..004
  - `f991137` fix Week + Max10Year MeterLabelMap missing
  - `05822db` fix Max10Year value array length + Multimeter crash
  - `1aec751` **feat input validation guards (DEF-005)** — 17 validation cases
- Pegasus repo (`C:\Users\TMT\Desktop\Project\unimicron-pegasus`) — `0894927` push develop, SFTP upload test server
- Test framework (`C:\Users\TMT\Desktop\Project\API-Test`) — เปลี่ยน default URL → Rugcom
- PPTX report regenerate (v1.2) — DEF-001..005 ทุก defect mark RESOLVED + extended suites status updated

### Test Results สุดท้าย (รันบน local API หลัง DEF-005 fix)
| Suite | Req | Assert | Failed | สถานะ |
|-------|-----|--------|--------|------|
| Functional | 25 | 209 | 0 | ✅ PASS |
| **Validation** | 18 | 54 | **0** | ✅ **PASS (จาก 17 fail)** |
| Cross-Endpoint | 6 | 51 | 1 | ⚠️ environmental — past-year data ไม่มีใน DB |
| HTTP Load | 140 | 1120 | 0 | ✅ PASS |
| **รวม** | **189** | **1434** | **1 env** | **99.93% pass** |

---

## 🎯 งานที่เหลือ (Scope สำหรับ chat ถัดไป)

### ~~Priority 1 — DEF-005 Input Validation~~ ✅ DONE 2026-05-05

แก้ครบ 17 validation cases ผ่าน commit `1aec751`. ดู:
- `Controllers/DataMeterSumController.cs` — guards block at top of method
- `Controllers/DataMultimeterController.cs` — same pattern
- `Controllers/DataMeterDetailController.cs` — uses raw JsonElement to detect missing fields
- `Services/MeterLogQueryHelper.cs` — ใหม่ `MeterExists()` helper

### Priority 1 (NEW) — DB Integration (DB-I) — Manual

3 test cases — ต้องเข้า DB SQL Server (`202.151.188.68:1433/unimicron_db`, sa account):
- DB-I-01..03 — เทียบ raw `PowerMeterLog` กับ aggregated response
- ดู spec ใน Postman collection folder `DB Integration` หรือ scenario test ID `DB-I-*`

### Priority 2 (NEW) — System Failure (ERR-I) — Manual

2 test cases — ต้อง coordinate กับ ops:
- ERR-I-01: หยุด SQL Server → ดู API response (ควร 503 หรือ graceful error, ไม่ใช่ 500)
- ERR-I-02: Kill DB connection กลาง query

### ❌ Out of Scope — WebSocket (15 cases)
ต้องต่อ PLC จริง — โรงงานเท่านั้น ไม่สามารถทำจาก dev environment ได้
- หัวหน้ายืนยัน 2026-05-05 ว่าทำไม่ได้
- ใน report ให้ระบุ "Out of Scope — Requires PLC connection on-site"

### Cross-Endpoint Single Failure (CE-I-03b)
- **ไม่ใช่ bug** — เป็น environmental: data ปีก่อน (past=1) ไม่มีใน DB → result = current ทุกช่อง 0
- ถ้าหัวหน้าต้องการ verify → seed historical data ลง DB หรือ accept ว่าผ่าน

---

## 📁 Files & Paths สำคัญ

### Project Locations
| Repo | Path | Branch | Purpose |
|------|------|--------|---------|
| **API** | `C:\Users\TMT\Desktop\Project\UMTH-API` | `main` | .NET 10 backend, Rugcom deploy via webhook |
| **Pegasus** | `C:\Users\TMT\Desktop\Project\unimicron-pegasus` | `develop` | PHP frontend, SFTP manual deploy |
| **Test Framework** | `C:\Users\TMT\Desktop\Project\API-Test` | (no git) | Newman + PPTX generator |

### Critical Files (API)
| File | Purpose |
|------|---------|
| `Controllers/DataMeterSumController.cs` | `/GetDataMeterSum` — แก้ใหม่ DEF-002 |
| `Controllers/DataMultimeterController.cs` | `/GetDataMultimeter` — แก้ใหม่ DEF-001 + Max10Year normalize |
| `Controllers/DataMeterDetailController.cs` | `/GetDataMeterDetail` — แก้ใหม่ DEF-001/003/004 |
| `Models/MeterDetailResponse.cs` | มี `MeterLabel { Id, Label }` class |
| `Models/MeterSumRequest.cs` | Request DTO — เพิ่ม validation attributes ที่นี่ |
| `Models/MultimeterRequest.cs` | Same |
| `Models/MeterDetailRequest.cs` | Same |
| `appsettings.json` | DB connection string (production password — ไม่อัพ git) |

### Test Framework Files
| File | Purpose |
|------|---------|
| `unimicron-api.postman_collection.json` | Newman collection (ทุก test case) |
| `postman-environment.json` | Env vars — `iot_url` default = Rugcom URL |
| `newman-run.js` | Runner with suite/folder/scenario flags |
| `scripts/apply-scenario-automation.js` | Generator ที่สร้าง scenario tests ใน collection |
| `scripts/generate-pptx-report.js` | PPTX report generator (hardcoded data) |
| `scenario-traceability.{md,json}` | Test ID → automation status mapping |
| `test-results/functional-test-report.pptx` | Latest report v1.2 (5 พ.ค.) |
| `test-results/summary-2026-05-05T04-24-27.json` | Latest Newman summary (functional only) |

### Server Info (Rugcom Test)
- **API URL:** `https://tom-demo-01.proen.app.ruk-com.cloud/unimicron-api`
- **Pegasus URL:** SFTP `gate.manage.ruk-com.cloud:3022` → `/var/www/webroot/ROOT/unimicron/test/`
- **SFTP Key:** `C:\Users\TMT\Desktop\key\key02_cpf\key02.private-key`
- **API webhook:** auto-pull on push main → docker-compose up → ~6 min
- **Telegram bot:** `@tomastc_deploy_bot` แจ้ง deploy success/fail ใน group `DeployNotification`

ดู memory เพิ่มเติม: `reference_unimicron_pegasus_sftp.md`, `project_umth_api_rewrite.md`, `reference_rugcom_server.md`

---

## 🔧 Commands

### Run Tests
```powershell
# Default = ยิงไป Rugcom
cd C:\Users\TMT\Desktop\Project\API-Test
npm run test:functional      # 25 req — ผ่านครบ (baseline)
npm run test:validation      # 18 req — 17 fail (Priority 1 ที่ต้องแก้)
npm run test:cross           # 6 req — 1 environmental
npm run test:http-load       # 140 req — ผ่านครบ

# Run single test ID
node newman-run.js --scenario VR-01

# Override URL (back to local API)
node newman-run.js --suite scenario:validation --env-var iot_url=http://localhost:5000
```

### Run Local API
```powershell
cd C:\Users\TMT\Desktop\Project\UMTH-API
dotnet run --project "UMTH - API.csproj" --launch-profile http
# จะรันที่ port 5000 (override จาก appsettings)
```

### Regenerate PPTX Report
```powershell
cd C:\Users\TMT\Desktop\Project\API-Test
node scripts/generate-pptx-report.js
# Output: test-results/functional-test-report.pptx
```

### Deploy
- **API:** `git push origin main` → webhook auto-deploy ~6 min → ดู Telegram notify
- **Pegasus:** Right-click ไฟล์ใน VS Code → SFTP: Upload File (uploadOnSave=false)

---

## ⚠️ กฎสำคัญ (จาก CLAUDE.md)

1. **Confirm Before Acting** — อธิบายแผนก่อนแก้ code ทุกครั้ง รอ confirm ก่อนลงมือ
2. **Role Delegation** — งานเขียน/แก้ code → KAI, งานวางแผน → PETRA, ทดสอบ → ISMAEL
3. **Skill Journal** — อ่าน journal ของ role ก่อน + บันทึกความรู้ใหม่หลังทำงาน
4. **Auto-Save** — ถ้าเจอ bug แก้สำเร็จ บันทึกลง memory ทันที (ไม่ต้องรอสั่ง)
5. **PowerShell 5.1 quirks** — ห้ามใช้ `&&` ใน PowerShell (ใช้ `; if ($?) { ... }`), Bash tool ใช้ `&&` ได้ตามปกติ

---

## 📋 Suggested Workflow สำหรับ Chat ถัดไป

1. **อ่าน memory + CLAUDE.md** ก่อน เพื่อเข้าใจ context
2. **เลือก scope** — Priority 1 (Validation) เป็น automated ทำได้ก่อน
3. **Plan** — list test ที่จะแก้, ดู controller method, ออกแบบ validation strategy
4. **Confirm กับหัวหน้า** ก่อนลงมือ
5. **แก้ทีละ controller** + run `npm run test:validation` หลังแก้
6. **Commit + push** → wait webhook → re-run บน Rugcom verify
7. **Update PPTX report** — `scripts/generate-pptx-report.js` (ปัจจุบันแสดง v1.2 functional pass — ถ้าจะรวม validation/extended ต้อง add slide ใหม่)
8. **Save journal** ของ KAI/ISMAEL/PETRA หลังเสร็จ

---

## 🔗 References
- Test report v1.1 ของ tester (เก่า): `C:\Users\TMT\Downloads\functional-test-report-EN.md`
- Test report ปัจจุบัน v1.2 (เรา): `test-results/functional-test-report.pptx`
- Original Postman collection (ก่อน automation): `C:\Users\TMT\Downloads\unimicron-api.postman_collection.json`
- API spec CSVs: `Commands.csv`, `GetDataMeterDetail.csv`, `Getmetersum.csv`, `GetDataMultimeter.csv`, `Common Parameter.csv`, `Overview.csv`
- WebSocket spec (out of scope): `Commands.csv` + `Overview.csv` (PING/INFO commands)
