# UMTH Sensor & Energy API — แผนการทดสอบ

**เวอร์ชันเอกสาร:** 2.0
**วันที่:** 26 เมษายน 2569

| | ชื่อ | บทบาท |
|---|---|---|
| **ทีมโครงการ** | — | — |
| **ผู้จัดทำเอกสาร** | — | — |
| **ผู้สนับสนุนโครงการ** | — | — |

---

# I. บทนำ

เอกสารนี้เป็นแผนการทดสอบสำหรับระบบ UMTH Sensor & Energy Monitoring API ซึ่งประกอบด้วยระบบย่อย 2 ส่วน ได้แก่

1. **WebSocket Sensor Server** — เข้าถึงข้อมูล sensor แบบ real-time ผ่าน `ws://{host}:9001/ws/` โดยใช้ JSON text frames ตามมาตรฐาน RFC 6455
2. **HTTP REST API** — ดึงข้อมูลมิเตอร์พลังงานผ่าน `http://{host}:5000` (3 endpoint แบบ POST: `/GetDataMeterSum`, `/GetDataMultimeter`, `/GetDataMeterDetail`)

การทดสอบแบ่งออกเป็น 4 หมวด ดังนี้

| หมวด | วัตถุประสงค์ |
|------|------------|
| **Functional Testing** | ตรวจสอบว่า API แต่ละ endpoint ทำงานถูกต้องตาม specification |
| **Load Testing** | ตรวจสอบความเสถียรและ response time ภายใต้การใช้งานพร้อมกันและต่อเนื่อง |
| **Integration Testing** | ตรวจสอบการไหลของข้อมูลที่ถูกต้องระหว่าง API, ฐานข้อมูล และ sensor/PLC |
| **Validation Testing** | ตรวจสอบว่า API ปฏิเสธ input ที่ผิดรูปแบบ, ขาดหาย และเกินขอบเขตที่กำหนดได้อย่างถูกต้อง |

---

# II. แผนการทดสอบ

---

## หมวดที่ 1 — Functional Testing (การทดสอบการทำงาน)

### WS-F: WebSocket Happy Path

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **WS-F-01** | เชื่อมต่อไปยัง `ws://{host}:9001/ws/` แล้วส่ง `{"cmd": "PING"}` | Response: `Command="PING"`, `Status="OK"`, `Response="PONG"`, `Timestamp` ในรูปแบบ ISO 8601 ที่ถูกต้อง | |
| **WS-F-02** | ส่ง `{"Cmd": "ping"}` (field name แบบ mixed-case และค่า command ตัวพิมพ์เล็ก) | ได้ผลลัพธ์เหมือน WS-F-01 — server ต้องไม่คำนึงถึงตัวพิมพ์เล็ก/ใหญ่ทั้ง field name และค่า command | |
| **WS-F-03** | ส่ง `{"command": "PING"}` (ชื่อ field สำรอง) | ได้ผลลัพธ์เหมือน WS-F-01 — server รับ `cmd`, `Cmd`, `command`, `Command` ได้ทั้งหมด | |
| **WS-F-04** | ส่ง `{"cmd": "INFO"}` และตรวจสอบ field หลักระดับ root | Response มี `Command="INFO"`, `Status="OK"`, `Timestamp` ที่ถูกต้อง และ field จำนวนเต็ม `Total`, `Online`, `Alarm`, `Offline`, `Disabled` ทุกตัว ≥ 0 | |
| **WS-F-05** | ส่ง `{"cmd": "INFO"}` และตรวจสอบ array `Sensors` | ทุก object ใน `Sensors` มี `Status="Online"` (StatusCode=1) เท่านั้น ไม่มี sensor ที่ Disabled, Alarm หรือ Offline ปรากฏ | |
| **WS-F-06** | ส่ง `{"cmd": "INFO"}` และตรวจสอบยอดรวม sensor | `Total = Online + Alarm + Offline + Disabled` สมดุลพอดี | |
| **WS-F-07** | ส่ง `{"cmd": "INFO"}` และตรวจสอบ field ที่จำเป็นใน Sensor object | แต่ละ object มีครบ: `SensorId` (int), `SensorName` (string), `FlowId` (int), `Value` (int), `Accumulate` (uint), `Status` (string), `LastUpdated` (ISO 8601) | |

---

### MS-F: POST /GetDataMeterSum — Happy Path

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **MS-F-01** | ส่ง `{"Type":"Day","Meter":"PM001","DataSelect":["10","11","12"],"Interval":15,"Past":0,"Month":"06"}` | keys ใน `ArrDataTarget`/`ArrDataActual` เป็น `"10"`, `"11"`, `"12"` — `ArrCategories` มี label เวลาทุก 15 นาที (`"HH:mm"`) — `ShortMonth="Jun"`, `Year="2025"` | |
| **MS-F-02** | ส่ง `{"Type":"Week","Meter":"ALL","DataSelect":["2025-06-02\|\|2025-06-08","2025-06-09\|\|2025-06-15"],"Interval":7,"Past":0,"Month":"06"}` | keys ตรงกับ 2 ค่า DataSelect ที่ส่งไป — `ArrCategories` แสดง label วันในช่วงสัปดาห์ | |
| **MS-F-03** | ส่ง `{"Type":"Month","Meter":"G001","DataSelect":["04","05","06"],"Interval":0,"Past":0}` | keys เป็น `"04"`, `"05"`, `"06"` — `ArrCategories` แสดง label วันที่ในเดือน | |
| **MS-F-04** | ส่ง `{"Type":"Year","Meter":"PM001","DataSelect":["2023","2024","2025"],"Interval":0,"Past":0}` | keys เป็น `"2023"`, `"2024"`, `"2025"` — `ArrCategories` แสดงชื่อเดือนย่อ 12 รายการ | |
| **MS-F-05** | ส่ง `{"Type":"Max10Year","Meter":"ALL","DataSelect":["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"],"Interval":0,"Past":0}` | keys ครบ 10 ปี — `ArrCategories` แสดง label ปี | |

---

### MM-F: POST /GetDataMultimeter — Happy Path

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **MM-F-01** | ส่ง `{"Type":"Day","Meter":["PM001","PM002","PM003"],"DataSelect":"15","Interval":15,"Past":0,"Month":"06"}` | keys ใน `ArrDataTarget`/`ArrDataActual` เป็นรหัสมิเตอร์ — `ArrCategories` เป็นช่วง 15 นาที — มี `ShortMonth` และ `Year` | |
| **MM-F-02** | ส่ง `{"Type":"Week","Meter":["PM001","PM002"],"DataSelect":"2025-06-09\|\|2025-06-15","Interval":7,"Past":0,"Month":"06"}` | keys เป็น `"PM001"`, `"PM002"` — `ArrCategories` แสดง label วันในสัปดาห์ที่ระบุ | |
| **MM-F-03** | ส่ง `{"Type":"Month","Meter":["PM001","PM002"],"DataSelect":"06","Interval":0,"Past":0}` | keys เป็นรหัสมิเตอร์ — `ArrCategories` แสดงวันในเดือนมิถุนายน | |
| **MM-F-04** | ส่ง `{"Type":"Year","Meter":["PM001","PM002"],"DataSelect":"2025","Interval":0,"Past":0}` | keys เป็นรหัสมิเตอร์ — `ArrCategories` แสดงชื่อเดือนย่อ 12 รายการ | |
| **MM-F-05** | ส่ง `{"Type":"Max10Year","Meter":["PM001","PM002"],"DataSelect":"2025\|2016","Interval":0,"Past":0}` | keys เป็นรหัสมิเตอร์ — `ArrCategories` แสดง label ปีตั้งแต่ 2016 ถึง 2025 | |

---

### MD-F: POST /GetDataMeterDetail — Happy Path

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **MD-F-01** | ส่ง `{"Type":"Day","Meter":["PM001","PM002"],"DataSelect":"15","Interval":15,"Past":0,"Month":"06"}` | Response มี `MaxData`, `ArrDataChart` (array ของ ChartSeries), `ArrStrokeChart`, `ArrCategories`, `MeterLabelMap` — แต่ละ Series มี `Name`, `Type="bar"`, `Color` (HEX), `Data` (array of doubles) | |
| **MD-F-02** | ส่ง `{"Type":"Week","Meter":["PM001"],"DataSelect":"2025-06-09\|\|2025-06-15","Interval":7,"Past":0,"Month":"06"}` | โครงสร้าง Response เหมือน MD-F-01 — `ArrCategories` มี label วันในสัปดาห์ที่ระบุ | |
| **MD-F-03** | ส่ง `{"Type":"Month","Meter":["PM001"],"DataSelect":"06","Interval":0,"Past":0}` | โครงสร้าง Response เหมือน MD-F-01 — `ArrCategories` มี label วันที่ในเดือน | |
| **MD-F-04** | ส่ง `{"Type":"Year","Meter":["PM001","PM002"],"DataSelect":"2025","Interval":0,"Past":0}` | โครงสร้าง Response เหมือน MD-F-01 — `ArrCategories` มีชื่อเดือนย่อ 12 รายการ | |
| **MD-F-05** | ส่ง `{"Type":"Max10Year","Meter":["PM001"],"DataSelect":"2025\|2016","Interval":0,"Past":0}` | โครงสร้าง Response เหมือน MD-F-01 — `ArrCategories` มี label ปีตั้งแต่ 2016 ถึง 2025 | |

---

### RF: โครงสร้าง Response และความถูกต้องของ Field

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **RF-01** | MeterSum — ตรวจสอบประเภท key ใน response สำหรับ Type="Day" | keys ใน `ArrDataTarget`/`ArrDataActual` เป็น **string ช่วงเวลา** (เช่น `"10"`, `"11"`) ไม่ใช่รหัสมิเตอร์ — ต่างจาก Multimeter ที่ใช้รหัสมิเตอร์เป็น key | |
| **RF-02** | Multimeter — ตรวจสอบประเภท key ใน response สำหรับ Type="Day" | keys ใน `ArrDataTarget`/`ArrDataActual` เป็น **string รหัสมิเตอร์** (เช่น `"PM001"`) ไม่ใช่ string เวลา | |
| **RF-03** | MeterSum — ตรวจสอบความถูกต้องของค่าสูงสุดสำหรับ Type="Month" | `MaxValueTarget` ≥ ทุกค่าใน array ทั้งหมดของ `ArrDataTarget` — `MaxValueActual` ≥ ทุกค่าใน array ทั้งหมดของ `ArrDataActual` | |
| **RF-04** | Multimeter — ตรวจสอบความถูกต้องของค่าสูงสุดสำหรับ Type="Month" | เงื่อนไขเดียวกับ RF-03 แต่ใช้กับ Multimeter response | |
| **RF-05** | MeterDetail — ตรวจสอบโครงสร้าง ChartSeries object สำหรับ Type="Day" กับสองมิเตอร์ | แต่ละ object ใน `ArrDataChart` มีครบ: `Name` (string), `Type="bar"`, `Color` (hex color ที่ถูกต้อง เช่น `"#FF6384"`), `Data` (array of doubles ที่มีความยาวเท่ากับ `ArrCategories`) | |
| **RF-06** | MeterDetail — ตรวจสอบความครบถ้วนของ MeterLabelMap สำหรับ Meter=["PM001","PM002"] | `MeterLabelMap` มี 2 รายการพอดี — แต่ละรายการมี `id` และ `label` — ค่า `id` ตรงกับ `"PM001"` และ `"PM002"` | |
| **RF-07** | MeterDetail — ตรวจสอบความสอดคล้องของความยาว ArrStrokeChart | ความยาวของ `ArrStrokeChart` เท่ากับจำนวน object ใน `ArrDataChart` — ทุกค่าเป็น int ≥ 0 | |
| **RF-08** | MeterSum Day — ตรวจสอบความยาว ArrCategories ตาม Interval | Interval=5 → 288 รายการ / Interval=15 → 96 รายการ / Interval=60 → 24 รายการ — ความยาว Data array ตรงกับความยาว `ArrCategories` | |

---

## หมวดที่ 2 — Load Testing (การทดสอบภาระงาน)

### WS-L: WebSocket Load

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **WS-L-01** | เปิด 10 WebSocket connections พร้อมกัน แต่ละ client ส่ง `{"cmd":"PING"}` ในเวลาเดียวกัน | ทุก client ได้รับ PONG ที่ถูกต้องภายใน 1 วินาที ไม่มี connection ถูก drop | |
| **WS-L-02** | เปิด 50 WebSocket connections พร้อมกัน แต่ละ client ส่ง `{"cmd":"PING"}` ในเวลาเดียวกัน | ทุก client ได้รับ PONG ที่ถูกต้องภายใน 2 วินาที ไม่มี connection ถูก drop | |
| **WS-L-03** | เปิด 100 WebSocket connections พร้อมกัน แต่ละ client ส่ง `{"cmd":"PING"}` ในเวลาเดียวกัน | ทุก client ได้รับ PONG ที่ถูกต้องภายใน 5 วินาที server ไม่ crash หรือ restart | |
| **WS-L-04** | Client เดียวส่ง `{"cmd":"PING"}` 100 ครั้งติดต่อกันโดยไม่หยุด | ได้ response ที่ถูกต้องทุกครั้ง ไม่มี response ขาดหายหรือ malformed | |
| **WS-L-05** | Client เดียวส่ง `{"cmd":"INFO"}` 50 ครั้งติดต่อกันโดยไม่หยุด | ได้ response ที่ถูกต้องและมีข้อมูล sensor ครบทุกครั้ง ไม่มี timeout หรือข้อความหาย | |

---

### HTTP-L: REST API Load

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **HTTP-L-01** | ส่ง 20 POST requests ไปยัง `/GetDataMeterSum` พร้อมกัน (request body เดียวกัน Type="Month") | ทุก response ถูกต้องและเหมือนกัน — response time ≤ 3 วินาทีต่อ request | |
| **HTTP-L-02** | ส่ง 20 POST requests ไปยัง `/GetDataMultimeter` พร้อมกัน (request body เดียวกัน Type="Month") | ทุก response ถูกต้องและเหมือนกัน — response time ≤ 3 วินาทีต่อ request | |
| **HTTP-L-03** | ส่ง 20 POST requests ไปยัง `/GetDataMeterDetail` พร้อมกัน (request body เดียวกัน Type="Month") | ทุก response ถูกต้องและเหมือนกัน — response time ≤ 3 วินาทีต่อ request | |
| **HTTP-L-04** | ส่ง mixed load: 10 requests ต่อ endpoint ทั้ง 3 พร้อมกัน (รวม 30 concurrent requests) | ไม่มี request ล้มเหลว ไม่มี HTTP 500 ทุก response ถูกต้อง | |
| **HTTP-L-05** | ส่ง POST `/GetDataMeterSum` ทุก 1 วินาที ต่อเนื่องนาน 5 นาที (รวม 300 requests) | response time ไม่เพิ่มขึ้นเรื่อยๆ ตลอดการทดสอบ (ไม่มี memory leak) ไม่มี error หลัง 300 requests | |

---

## หมวดที่ 3 — Integration Testing (การทดสอบการเชื่อมต่อ)

### WS-I: WebSocket ↔ Sensor / PLC

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **WS-I-01** | ส่ง `{"cmd":"INFO"}` แล้วเปรียบเทียบค่า `Value` ของ Online sensor กับค่าที่อ่านได้จาก PLC โดยตรง | ค่า `Value` ใน response ตรงกับค่า PLC ภายใน tolerance ที่กำหนด | |
| **WS-I-02** | ส่ง `{"cmd":"INFO"}` และตรวจสอบ timestamp `LastUpdated` ของ Online sensors | `LastUpdated` ของทุก Online sensor ต้องไม่เก่ากว่า 5 นาทีจากเวลาที่ส่ง request | |
| **WS-I-03** | นับ sensor ที่ Online จาก PLC โดยตรง แล้วเปรียบเทียบกับ field `Online` ใน INFO response | ค่า `Online` ใน response เท่ากับจำนวน sensor ที่ Online ใน PLC | |

---

### DB-I: HTTP API ↔ SQL Server

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **DB-I-01** | เรียก `/GetDataMeterSum` (Type="Month", Meter="PM001", DataSelect=["06"]) แล้ว query ข้อมูลเดียวกันจาก `unimicron_db` โดยตรง | ค่าใน `ArrDataActual["06"]` ตรงกับ Actual records ในฐานข้อมูลทุกค่า | |
| **DB-I-02** | ใช้ request เดียวกับ DB-I-01 แล้ว query ข้อมูล Target จาก `unimicron_db` | ค่าใน `ArrDataTarget["06"]` ตรงกับ Target records ในฐานข้อมูลทุกค่า | |
| **DB-I-03** | เรียก `/GetDataMeterDetail` (Type="Month", Meter=["PM001","PM002"]) แล้ว query ชื่อมิเตอร์จาก `unimicron_db` | `label` ใน `MeterLabelMap` ทุกรายการตรงกับชื่อมิเตอร์ที่เก็บในฐานข้อมูล | |

---

### CE-I: Cross-Endpoint Consistency (ความสอดคล้องระหว่าง Endpoint)

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **CE-I-01** | เรียก MeterSum (Meter="PM001", Type="Month", DataSelect=["06"]) และ Multimeter (Meter=["PM001"], Type="Month", DataSelect="06") | ข้อมูล Actual ของ PM001 ในเดือนมิถุนายนต้องเหมือนกันทั้งสอง response | |
| **CE-I-02** | เรียก Multimeter และ MeterDetail สำหรับ meter เดียวกันและเดือนเดียวกัน | ผลรวมของค่าทุก Sub-Meter Data ต่อ category ใน MeterDetail สอดคล้องกับค่า Actual ใน Multimeter | |
| **CE-I-03** | เรียก MeterSum 2 ครั้งด้วย Past=0 และ Past=1 โดย parameter อื่นเหมือนกัน | Response ทั้งสองให้ข้อมูลต่างกัน — ยืนยันว่า parameter `Past` ทำงานได้จริงและเปลี่ยน context ปีอย่างถูกต้อง | |

---

### ERR-I: การจัดการเมื่อระบบล้มเหลว

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **ERR-I-01** | หยุด SQL Server แล้วเรียก POST `/GetDataMeterSum` | API คืน error response ที่มีความหมาย (ไม่ใช่ HTTP 500 ดิบ) server ไม่ crash หรือ restart | |
| **ERR-I-02** | หยุด WebSocket server แล้วพยายามเชื่อมต่อ client | Client ได้รับ connection-refused error ที่ชัดเจน ไม่ hang หรือ timeout ไม่มีกำหนด | |
| **ERR-I-03** | จำลอง DB load สูง (เช่น query ที่ใช้เวลานาน) แล้วเรียก POST `/GetDataMeterDetail` | API ยังคง respond ได้ (อาจช้าลง) แต่ไม่คืนข้อมูลผิด และไม่ crash | |

---

## หมวดที่ 4 — Validation Testing (การทดสอบการตรวจสอบ input)

### VR: Field ที่จำเป็นหายไป

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **VR-01** | POST `/GetDataMeterSum` — ไม่ส่ง field `Type` | Error response (HTTP 4xx หรือ `Status:"ERROR"`) ไม่มี HTTP 500 | |
| **VR-02** | POST `/GetDataMeterSum` — ไม่ส่ง field `Meter` | Error response ไม่มี HTTP 500 | |
| **VR-03** | POST `/GetDataMeterSum` — ไม่ส่ง field `DataSelect` | Error response ไม่มี HTTP 500 | |
| **VR-04** | POST `/GetDataMultimeter` — ไม่ส่ง field `Interval` | Error response ไม่มี HTTP 500 | |
| **VR-05** | POST `/GetDataMeterDetail` — ไม่ส่ง field `Past` | Error response ไม่มี HTTP 500 | |

---

### VT: ประเภทข้อมูลผิด

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **VT-01** | POST `/GetDataMeterSum` — ส่ง `"Interval": "fifteen"` (string แทน int) | Error response ไม่มี HTTP 500 | |
| **VT-02** | POST `/GetDataMultimeter` — ส่ง `"Meter": "PM001"` (string แทน string array) | Error response ไม่มี HTTP 500 | |
| **VT-03** | POST `/GetDataMeterSum` — ส่ง `"DataSelect": "10"` (string แทน string array) | Error response ไม่มี HTTP 500 | |
| **VT-04** | POST `/GetDataMeterDetail` — ส่ง `"Past": "zero"` (string แทน int) | Error response ไม่มี HTTP 500 | |

---

### VO: ค่าเกินขอบเขตที่กำหนด

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **VO-01** | POST `/GetDataMeterSum` — ส่ง `"Past": -1` (ค่าติดลบ) | Error response หรือ fallback อย่างเหมาะสม ไม่มี HTTP 500 | |
| **VO-02** | POST `/GetDataMeterSum` — ส่ง `"Type":"Day"` พร้อม `"Interval": 3` (ไม่ใช่ 5, 15 หรือ 60) | Error response หรือ data arrays ว่าง ไม่มี HTTP 500 | |
| **VO-03** | POST `/GetDataMeterSum` — ส่ง `"Month": "13"` (เดือนที่ 13 ไม่มีจริง) | Error response ไม่มี HTTP 500 | |
| **VO-04** | POST `/GetDataMeterDetail` — ส่ง `"Past": 999` (ค่ามากเกินจริง) | Error response หรือ empty data ไม่มี HTTP 500 | |

---

### VF: Format ที่ไม่ถูกต้อง

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **VF-01** | POST `/GetDataMeterSum` — ส่ง DataSelect แบบ Week เป็น `"20250609-20250615"` (ใช้ `-` แทน `\|\|`) | Error response ไม่มี HTTP 500 | |
| **VF-02** | POST `/GetDataMultimeter` — ส่ง DataSelect แบบ Max10Year เป็น `"2025-2016"` (ใช้ `-` แทน `\|`) | Error response ไม่มี HTTP 500 | |
| **VF-03** | POST `/GetDataMeterDetail` — ส่ง `"Month": "6"` (ไม่มี leading zero — spec กำหนดให้ใช้ `"06"`) | Server จัดการ zero-padding อย่างเหมาะสมหรือคืน descriptive error ไม่มี HTTP 500 | |

---

### VM: รหัสมิเตอร์ที่ไม่ถูกต้อง

| รหัสทดสอบ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์จริง |
|-----------|----------|-------------------|-------------|
| **VM-01** | POST `/GetDataMeterSum` — ส่ง `"Meter": "XXXX"` (รหัสมิเตอร์ที่ไม่มีในระบบ) | Error response หรือ data arrays ว่าง ไม่มี HTTP 500 | |
| **VM-02** | POST `/GetDataMultimeter` — ส่ง `"Meter": ["PM001", "XXXX"]` (มีทั้งรหัสถูกและผิด) | Server คืนข้อมูลเฉพาะ meter ที่มีจริง หรือ error ทั้ง request ไม่มี HTTP 500 — พฤติกรรมต้องมีเอกสารอธิบาย | |

---

## สรุปจำนวนกรณีทดสอบ

| หมวด | กลุ่มย่อย | จำนวน |
|------|----------|-------|
| Functional | WS Happy Path (WS-F) | 7 |
| Functional | GetDataMeterSum Happy Path (MS-F) | 5 |
| Functional | GetDataMultimeter Happy Path (MM-F) | 5 |
| Functional | GetDataMeterDetail Happy Path (MD-F) | 5 |
| Functional | โครงสร้าง Response & Field Integrity (RF) | 8 |
| **รวม Functional** | | **30** |
| Load | WebSocket Load (WS-L) | 5 |
| Load | REST API Load (HTTP-L) | 5 |
| **รวม Load** | | **10** |
| Integration | WebSocket ↔ Sensor/PLC (WS-I) | 3 |
| Integration | HTTP API ↔ SQL Server (DB-I) | 3 |
| Integration | Cross-Endpoint Consistency (CE-I) | 3 |
| Integration | การจัดการเมื่อระบบล้มเหลว (ERR-I) | 3 |
| **รวม Integration** | | **12** |
| Validation | Required Field Missing (VR) | 5 |
| Validation | Wrong Data Type (VT) | 4 |
| Validation | Out-of-Range Values (VO) | 4 |
| Validation | Invalid Format (VF) | 3 |
| Validation | Invalid Meter ID (VM) | 2 |
| **รวม Validation** | | **18** |
| **รวมทั้งหมด** | | **70** |

---

# III. ผลิตภัณฑ์การทดสอบ

- **ข้อกำหนดกรณีทดสอบ** — เอกสารฉบับนี้ (ตารางใน Section II)
- **บันทึกการทดสอบ** — บันทึกการรัน test case แต่ละครั้ง พร้อม timestamp, ชื่อผู้ทดสอบ และผลลัพธ์จริง
- **รายงานเหตุการณ์ผิดปกติ** — จัดทำสำหรับทุก test case ที่ล้มเหลว ระบุพฤติกรรมจริงเทียบกับที่คาดหวัง และขั้นตอนการจำลองปัญหา
- **รายงานสรุปการทดสอบ** — สถิติ pass/fail รายหมวดหลังแต่ละรอบการทดสอบ
- **ข้อมูล input/output การทดสอบ** — บันทึก JSON request body และ response payload ดิบของแต่ละ test case
- **ผลการทดสอบ Load** — ค่าวัด response time และ resource metrics (CPU, memory) ของ server สำหรับกรณีทดสอบ Load Testing ทั้งหมด

---

# IV. ข้อกำหนดสภาพแวดล้อม

| หมวดหมู่ | ข้อกำหนด |
|---------|---------|
| **Server** | แอปพลิเคชัน UMTH ต้องรันอยู่ และ SQL Server (`unimicron_db`) ต้องเข้าถึงได้ |
| **HTTP Port** | 5000 (HTTP) / 5001 (HTTPS) — ListenAnyIP |
| **WebSocket Port** | 9001 |
| **CORS** | AllowAnyOrigin, AllowAnyMethod, AllowAnyHeader |
| **Swagger** | เข้าถึงได้ที่ `/swagger` ทุก environment |
| **เครือข่าย** | เครื่องผู้ทดสอบต้องเข้าถึง TCP ของ host บน port 5000, 5001 และ 9001 ได้ |
| **REST Client** | Postman หรือ curl สำหรับ HTTP endpoint |
| **WebSocket Client** | `wscat` หรือ Postman WebSocket สำหรับ WS endpoint |
| **Load Testing Tool** | k6, JMeter หรือเครื่องมือที่เทียบเท่าสำหรับ Load Testing |
| **DB Access** | สิทธิ์อ่าน `unimicron_db` สำหรับการตรวจสอบ Integration Testing |
| **ความปลอดภัย** | ใช้เฉพาะเครือข่ายภายใน ไม่จำเป็นต้องเปิดเผยสู่ภายนอกระหว่างการทดสอบ |

---

# V. บุคลากร

| บทบาท | ความรับผิดชอบ |
|-------|--------------|
| **หัวหน้าทีมทดสอบ** | ดูแลภาพรวมการทดสอบ ตรวจสอบรายงานเหตุการณ์ผิดปกติ และอนุมัติรายงานสรุป |
| **ผู้ทดสอบ Functional** | รัน Functional และ Validation test cases; บันทึกผลลัพธ์จริง |
| **ผู้ทดสอบ Integration** | รัน Integration test cases; ต้องมีสิทธิ์อ่าน DB และมองเห็น PLC |
| **ผู้ทดสอบ Performance** | ตั้งค่าและรัน Load Testing cases; บันทึกค่าวัด timing และ resource |
| **นักพัฒนา** | พร้อมให้ข้อมูลพฤติกรรม API และแก้ไขข้อบกพร่องในระหว่างรอบการทดสอบ |

---

# VI. ตารางเวลา

| ระยะ | กิจกรรม | เป้าหมาย |
|-----|---------|----------|
| 1 | ตั้งค่าสภาพแวดล้อมและตรวจสอบการเชื่อมต่อ | วันที่ 1 |
| 2 | Functional Testing — WebSocket cases (WS-F) | วันที่ 1 |
| 3 | Functional Testing — HTTP happy path (MS-F, MM-F, MD-F, RF) | วันที่ 2 |
| 4 | Validation Testing — ทุกกลุ่ม (VR, VT, VO, VF, VM) | วันที่ 3 |
| 5 | Integration Testing — ทุกกลุ่ม (WS-I, DB-I, CE-I, ERR-I) | วันที่ 4 |
| 6 | Load Testing — ทุกกลุ่ม (WS-L, HTTP-L) | วันที่ 5 |
| 7 | ทดสอบซ้ำหลังแก้ข้อบกพร่อง และทดสอบ regression | วันที่ 6 |
| 8 | จัดทำรายงานสรุปการทดสอบและอนุมัติ | วันที่ 7 |

---

# VII. ความเสี่ยงและแผนรองรับ

| ความเสี่ยง | โอกาสเกิด | ผลกระทบ | แผนรองรับ |
|-----------|----------|---------|----------|
| SQL Server ไม่พร้อมใช้งานระหว่างทดสอบ | ปานกลาง | สูง | ยืนยันการเชื่อมต่อ DB ก่อนเริ่ม และประสานงานกับ DBA เพื่อจองช่วงเวลาทดสอบ |
| อุปกรณ์ sensor offline ส่งผลต่อข้อมูลจริงใน WS-I | ปานกลาง | ปานกลาง | ใช้สภาพแวดล้อม staging ที่มีข้อมูล sensor จำลอง |
| Load testing ทำให้เกิดการหยุดชะงักต่อผู้ใช้คนอื่น | ปานกลาง | สูง | รัน load test เฉพาะใน test environment ที่แยกออกจาก production |
| พฤติกรรม field `Month` ใน edge case ไม่มีเอกสาร | ต่ำ | ปานกลาง | สอบถามนักพัฒนาก่อนรัน VF-03 |
| `Past` ค่าติดลบทำให้เกิด unhandled exception | ต่ำ | สูง | รัน VO-01 ก่อนเพื่อตรวจหาความไม่เสถียรก่อนรันชุดทดสอบทั้งหมด |
| สิทธิ์อ่าน DB ไม่พร้อมสำหรับ Integration Testing | ต่ำ | ปานกลาง | ขอ credentials อ่าน DB ล่วงหน้าก่อนเริ่มรอบการทดสอบ |

---

# VIII. การอนุมัติ

| บทบาท | ชื่อ | ลายมือชื่อ | วันที่ |
|-------|-----|----------|-------|
| หัวหน้าทีมทดสอบ | | | |
| นักพัฒนา / เจ้าของ API | | | |
| ผู้สนับสนุนโครงการ | | | |

---

# IX. ประวัติการแก้ไขเอกสาร

| เวอร์ชัน | ชื่อ | วันที่ | รายละเอียดการเปลี่ยนแปลง |
|---------|-----|-------|------------------------|
| 1.0 | — | 26 เมษายน 2569 | จัดทำแผนการทดสอบฉบับแรก — 42 กรณี (Functional + error handling พื้นฐาน) |
| 2.0 | — | 26 เมษายน 2569 | ปรับโครงสร้างเป็น 4 หมวด: Functional, Load, Integration, Validation — รวม 70 กรณีทดสอบ |
