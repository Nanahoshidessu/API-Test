# Functional Test Feedback — Unimicron API
## สรุปจาก Test Report วันที่ 28 เมษายน 2026

---

## สำหรับทีม API (Port 5000) — แก้ 4 bugs

### BUG-1: ArrCategories จำนวน time slot ไม่ครบ (DEF-001)
**กระทบ 8 cases:** MS-F-01, MM-F-01, MD-F-01, RF-01, RF-02, RF-05, RF-08a, RF-08b

| Interval | คาดหวัง | ได้จริง | ขาด |
|----------|---------|--------|-----|
| 5 min | 288 (24h × 12) | 277 | 11 |
| 15 min | 96 (24h × 4) | 93 | 3 |
| 60 min | 24 (24h × 1) | 24 ✅ | — |

**ปัญหา:** API สร้าง time slot เฉพาะที่มีข้อมูล แทนที่จะสร้างครบทั้งวัน (00:00 ถึง 23:45/23:00)

**สิ่งที่ต้องแก้:** ให้สร้าง ArrCategories เป็น full-day grid เสมอ ไม่ว่าจะมีข้อมูลหรือไม่ เช่น Interval=15 ต้องได้ 00:00, 00:15, 00:30 ... 23:45 = 96 ช่อง

---

### BUG-2: Dictionary key เป็น index แทนค่า DataSelect (DEF-002)
**กระทบ 5 cases:** MS-F-02, MS-F-03, MS-F-04, MS-F-05, RF-03

**ปัญหา:** `ArrDataTarget` และ `ArrDataActual` ใช้ key เป็น `"0"`, `"1"`, `"2"` แทนที่จะเป็นค่าที่ส่งมาใน DataSelect

| Type | คาดหวัง | ได้จริง |
|------|---------|--------|
| Week | `"2025-06-02\|\|2025-06-08"` | `"0"` |
| Month | `"04"`, `"05"`, `"06"` | `"0"`, `"1"`, `"2"` |
| Year | `"2023"`, `"2024"`, `"2025"` | `"0"`, `"1"`, `"2"` |
| Max10Year | `"2016"`...`"2025"` | `"0"`...`"9"` |

**สิ่งที่ต้องแก้:** key ของ dictionary ต้องใช้ค่า DataSelect ที่ client ส่งมา ไม่ใช่ array index (น่าจะเป็นปัญหา serialization — array ถูก re-index ก่อน encode JSON)

---

### BUG-3: HTTP 500 ตอนเรียก GetDataMeterDetail แบบ Max10Year (DEF-004)
**กระทบ 1 case:** MD-F-05

**Root Cause:** `DataMeterDetailController.cs:line 288` ทำ `Int32.Parse(DataSelect)` โดยไม่เช็ค Type ก่อน — เมื่อ DataSelect เป็น `"2026|2017"` จึง throw `System.FormatException`

**ผลทดสอบจากฝั่ง Frontend (29 เมษายน 2026):**

| # | DataSelect | HTTP | หมายเหตุ |
|---|-----------|------|----------|
| 1 | `"2026\|2017"` (ตาม spec) | **500** | FormatException — parse `\|` ไม่ได้ |
| 2 | `"2026"` (ปีเดียว) | **200** | ✅ ได้ data 10 ปี (2017-2026) |
| 3 | `"2026\|2022"` (ช่วงสั้น) | **500** | มี `\|` = พัง |
| 4 | `""` (empty string) | **500** | empty parse ไม่ได้ |
| 5 | `"2026\|2017"` + Meter=[1,2] | **500** | เหมือน #1 |
| 6 | `"2026\|2017"` + Past=1 | **500** | เหมือน #1 |
| 7 | `"2026-2017"` (dash separator) | **500** | `-` ก็ parse ไม่ได้ |
| 8 | *(ไม่ส่ง field DataSelect)* | **200** | ✅ ได้ data 10 ปี (2017-2026) |
| 9 | `null` | **200** | ✅ ได้ data 10 ปี (2017-2026) |
| 10 | `"2017\|2026"` (กลับด้าน) | **500** | มี `\|` = พัง |

**ข้อสังเกต:** API ไม่ได้ใช้ค่า DataSelect สำหรับ Max10Year เลย — ส่ง `"2026"`, `null`, หรือไม่ส่ง ก็ได้ผลเหมือนกัน (return 2017-2026 ทุกครั้ง) ปัญหาอยู่ที่ `Int32.Parse` ทำงานก่อนเข้า logic แยก Type

**Workaround ฝั่ง Frontend:** เราแก้ PHP proxy ให้ส่ง DataSelect เป็นปีเดียว (เช่น `"2026"`) แทน format `"year|year"` → bypass bug ได้แล้ว

**สิ่งที่ API ควรแก้:** เพิ่ม condition เช็ค Type ก่อน `Int32.Parse(DataSelect)` — ถ้าเป็น Max10Year ให้ skip หรือ split `"|"` ก่อน parse

---

### BUG-4: MeterLabelMap format ไม่ตรง spec (DEF-003) — ย้ายจาก Tester มา API
**กระทบ 7 cases:** MD-F-01, MD-F-02, MD-F-03, MD-F-04, RF-05, RF-06, RF-07

**ปัญหา:** API spec กำหนดว่า MeterLabelMap ต้องเป็น:
```json
[{"id": "PM001", "label": "Power Meter 001"}]
```

**แต่ API return จริงเป็น:**
```json
[{"1": "1"}, {"2": "2"}]
```

ไม่มี field `id` และ `label` ตาม spec — key เป็น meter ID, value ก็เป็น meter ID ซ้ำกัน ไม่มี label ที่อ่านรู้เรื่อง

**ผลทดสอบจากฝั่ง Frontend (29 เมษายน 2026):**
```
POST /GetDataMeterDetail
Body: { "Type": "Day", "Meter": ["1","2"], "DataSelect": "29", "Interval": 60, "Past": 0, "Month": "04" }

Response → meterLabelMap: [{"1": "1"}, {"2": "2"}]
```

**สิ่งที่ต้องแก้:** return MeterLabelMap ตาม spec ที่กำหนดไว้ใน API Document — ใช้ field `id` + `label` พร้อมชื่อที่อ่านได้

---

## สำหรับทีม Tester

**ไม่มี bug ฝั่ง test script** — DEF-003 ที่เคยคิดว่าเป็น test script issue นั้น จากการทดสอบยืนยันแล้วว่าเป็น API bug (MeterLabelMap format ไม่ตรง spec)

---

## สรุปภาพรวม

| ทีม | จำนวน bugs | Cases ที่จะ fix ได้ |
|-----|-----------|-------------------|
| **API** | 4 | 21 cases |
| **Tester** | 0 | — |
| **Frontend (workaround)** | 1 | BUG-3 bypass แล้วโดยส่ง DataSelect เป็นปีเดียว |
| **รวม** | 4 | API แก้ครบ → 25/25 PASS |

> **หมายเหตุ:** DEF-003 (MeterLabelMap) เดิมจัดเป็น Tester bug แต่จากการทดสอบยืนยันแล้วว่าเป็น API bug — API ไม่ได้ return field `id`/`label` ตาม spec

---

*สรุปโดย ARIA · 29 เมษายน 2026 (updated: ผลทดสอบ Max10Year 10 cases + ย้าย DEF-003 ไป API)*
