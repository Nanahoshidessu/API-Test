const pptxgen = require("pptxgenjs");

// ── Setup ─────────────────────────────────────────────────────────────────────
const pres = new pptxgen();
pres.defineLayout({ name: "PORTRAIT", width: 7.5, height: 10 });
pres.layout = "PORTRAIT";
pres.title  = "UMTH API Test Plan";
pres.author = "QA Team";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  navy:    "0A3D62",
  teal:    "0D7377",
  mint:    "14A085",
  light:   "EAF4F4",
  white:   "FFFFFF",
  dark:    "0D1F2D",
  muted:   "5D7A8A",
  border:  "C5DDE0",
  rowOdd:  "FFFFFF",
  rowEven: "F0F7F8",
  sub1:    "0A3D62",  // Functional
  sub2:    "145A5C",  // Load
  sub3:    "0D5C4A",  // Integration
  sub4:    "4A1942",  // Validation
  gray:    "F4F6F7",
};

// ── Dimensions ────────────────────────────────────────────────────────────────
const W      = 7.5;   // slide width
const H      = 10.0;  // slide height
const MX     = 0.5;   // left/right margin
const CW     = W - MX * 2;  // content width = 6.5"

const COL = { id: 1.0, desc: 2.1, exp: 2.1, act: 1.3 };  // column widths
const X = {
  id:   MX,
  desc: MX + COL.id,
  exp:  MX + COL.id + COL.desc,
  act:  MX + COL.id + COL.desc + COL.exp,
};

const ROW_H  = 0.50;  // data row height
const SUB_H  = 0.34;  // subheader row height
const COL_H  = 0.38;  // column header row height
const HDR_H  = 0.58;  // top navy bar height
const TITLE_Y = 0.65; // title text y
const RULE_Y  = 1.10; // divider rule y
const TABLE_Y = 1.20; // column header y
const DATA_Y  = TABLE_Y + COL_H; // first data row y
const FOOT_Y  = 9.52; // footer y

// ── Helpers ───────────────────────────────────────────────────────────────────
function pageHeader(slide, section, title, pageNum) {
  // Navy bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: HDR_H,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  // Teal left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: HDR_H,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  // Section label in bar
  slide.addText(section, {
    x: 0.18, y: 0, w: 5, h: HDR_H,
    fontSize: 9, fontFace: "Calibri", color: "8EC6D0", valign: "middle", margin: 0,
  });
  // Page number in bar
  slide.addText(`${pageNum} / 15`, {
    x: W - 1.1, y: 0, w: 1.0, h: HDR_H,
    fontSize: 9, fontFace: "Calibri", color: "8EC6D0", align: "right", valign: "middle", margin: 0,
  });
  // Title below bar
  slide.addText(title, {
    x: MX, y: TITLE_Y, w: CW, h: 0.42,
    fontSize: 16, fontFace: "Calibri", bold: true, color: C.navy, valign: "middle", margin: 0,
  });
  // Rule
  slide.addShape(pres.shapes.LINE, {
    x: MX, y: RULE_Y, w: CW, h: 0,
    line: { color: C.border, width: 1.0 },
  });
}

function pageFooter(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: FOOT_Y, w: W, h: 0.38,
    fill: { color: C.gray }, line: { color: C.border, width: 0.4 },
  });
  slide.addText("UMTH Sensor & Energy API  ·  Test Plan v2.0  ·  April 2026  ·  Confidential", {
    x: MX, y: FOOT_Y, w: CW, h: 0.38,
    fontSize: 7.5, fontFace: "Calibri", color: C.muted, align: "center", valign: "middle", margin: 0,
  });
}

function tableColHeader(slide) {
  const hdr = C.navy;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MX, y: TABLE_Y, w: CW, h: COL_H,
    fill: { color: hdr }, line: { color: hdr, width: 0 },
  });
  const cols = [
    { label: "Test ID",          x: X.id,   w: COL.id },
    { label: "Description",      x: X.desc, w: COL.desc },
    { label: "Expected Results", x: X.exp,  w: COL.exp },
    { label: "Actual Results",   x: X.act,  w: COL.act },
  ];
  cols.forEach(c => {
    slide.addText(c.label, {
      x: c.x + 0.05, y: TABLE_Y, w: c.w - 0.05, h: COL_H,
      fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
  });
}

function subheaderRow(slide, label, color, y) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: SUB_H,
    fill: { color }, line: { color, width: 0 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: 0.05, h: SUB_H,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });
  slide.addText(label, {
    x: MX + 0.12, y, w: CW - 0.12, h: SUB_H,
    fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
  });
  return y + SUB_H;
}

function dataRow(slide, id, desc, expected, even, y) {
  const bg = even ? C.rowEven : C.rowOdd;
  // borders
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: ROW_H,
    fill: { color: bg }, line: { color: C.border, width: 0.4 },
  });
  // Vertical dividers
  [X.desc, X.exp, X.act].forEach(xpos => {
    slide.addShape(pres.shapes.LINE, {
      x: xpos, y, w: 0, h: ROW_H,
      line: { color: C.border, width: 0.4 },
    });
  });
  // Test ID
  slide.addText(id, {
    x: X.id + 0.04, y: y + 0.02, w: COL.id - 0.08, h: ROW_H - 0.04,
    fontSize: 8, fontFace: "Consolas", bold: true, color: C.teal, valign: "top", margin: 0,
  });
  // Description
  slide.addText(desc, {
    x: X.desc + 0.04, y: y + 0.02, w: COL.desc - 0.08, h: ROW_H - 0.04,
    fontSize: 7.5, fontFace: "Calibri", color: C.dark, valign: "top", margin: 0,
  });
  // Expected
  slide.addText(expected, {
    x: X.exp + 0.04, y: y + 0.02, w: COL.exp - 0.08, h: ROW_H - 0.04,
    fontSize: 7.5, fontFace: "Calibri", color: C.dark, valign: "top", margin: 0,
  });
  // Actual (blank)
  return y + ROW_H;
}

// ── Test Case Data ────────────────────────────────────────────────────────────
const groups = [
  {
    label: "Functional — WebSocket Happy Path (WS-F)",
    color: C.sub1,
    cases: [
      ["WS-F-01", 'Send {"cmd":"PING"} to ws://{host}:9001/ws/', 'Command="PING", Status="OK", Response="PONG", valid ISO 8601 Timestamp'],
      ["WS-F-02", 'Send {"Cmd":"ping"} — mixed-case field & value', "Same as WS-F-01; server is case-insensitive for field name and value"],
      ["WS-F-03", 'Send {"command":"PING"} — alternative field name', "Same as WS-F-01; server accepts cmd, Cmd, command, Command"],
      ["WS-F-04", 'Send {"cmd":"INFO"} — verify root fields', 'Command="INFO", Status="OK", valid Timestamp; Total/Online/Alarm/Offline/Disabled all ≥ 0'],
      ["WS-F-05", 'Send {"cmd":"INFO"} — inspect Sensors array', 'Every Sensor object has Status="Online" (StatusCode=1) only; no Disabled/Alarm/Offline entries'],
      ["WS-F-06", 'Send {"cmd":"INFO"} — count arithmetic', "Total = Online + Alarm + Offline + Disabled (must balance exactly)"],
      ["WS-F-07", 'Send {"cmd":"INFO"} — inspect Sensor object fields', "Each object has: SensorId, SensorName, FlowId, Value, Accumulate, Status, LastUpdated (ISO 8601)"],
    ],
  },
  {
    label: "Functional — POST /GetDataMeterSum Happy Path (MS-F)",
    color: C.sub1,
    cases: [
      ["MS-F-01", 'Type="Day", Meter="PM001", DataSelect=["10","11","12"], Interval=15, Month="06"', 'Keys in ArrDataTarget/Actual are "10","11","12"; ArrCategories in 15-min HH:mm labels; ShortMonth="Jun", Year="2025"'],
      ["MS-F-02", 'Type="Week", Meter="ALL", DataSelect=["2025-06-02||2025-06-08","2025-06-09||2025-06-15"], Interval=7', "Keys match both DataSelect strings; ArrCategories lists day labels for each week range"],
      ["MS-F-03", 'Type="Month", Meter="G001", DataSelect=["04","05","06"], Interval=0', 'Keys are "04","05","06"; ArrCategories lists day-of-month labels'],
      ["MS-F-04", 'Type="Year", Meter="PM001", DataSelect=["2023","2024","2025"], Interval=0', 'Keys are "2023","2024","2025"; ArrCategories lists 12 month abbreviations'],
      ["MS-F-05", 'Type="Max10Year", Meter="ALL", DataSelect=["2016"…"2025"], Interval=0', "Keys match all 10 year strings; ArrCategories lists year labels 2016–2025"],
    ],
  },
  {
    label: "Functional — POST /GetDataMultimeter Happy Path (MM-F)",
    color: C.sub1,
    cases: [
      ["MM-F-01", 'Type="Day", Meter=["PM001","PM002","PM003"], DataSelect="15", Interval=15, Month="06"', "Keys in ArrDataTarget/Actual are meter IDs; ArrCategories in 15-min intervals; ShortMonth and Year present"],
      ["MM-F-02", 'Type="Week", Meter=["PM001","PM002"], DataSelect="2025-06-09||2025-06-15", Interval=7', 'Keys are "PM001","PM002"; ArrCategories lists day labels for the specified week'],
      ["MM-F-03", 'Type="Month", Meter=["PM001","PM002"], DataSelect="06", Interval=0', "Keys are meter IDs; ArrCategories lists day-of-month labels for June"],
      ["MM-F-04", 'Type="Year", Meter=["PM001","PM002"], DataSelect="2025", Interval=0', "Keys are meter IDs; ArrCategories lists 12 month abbreviations"],
      ["MM-F-05", 'Type="Max10Year", Meter=["PM001","PM002"], DataSelect="2025|2016", Interval=0', "Keys are meter IDs; ArrCategories lists year labels from 2016 to 2025"],
    ],
  },
  {
    label: "Functional — POST /GetDataMeterDetail Happy Path (MD-F)",
    color: C.sub1,
    cases: [
      ["MD-F-01", 'Type="Day", Meter=["PM001","PM002"], DataSelect="15", Interval=15, Month="06"', "Response has MaxData, ArrDataChart (ChartSeries), ArrStrokeChart, ArrCategories, MeterLabelMap; each series has Name, Type='bar', Color (HEX), Data (doubles)"],
      ["MD-F-02", 'Type="Week", Meter=["PM001"], DataSelect="2025-06-09||2025-06-15", Interval=7', "Same structure as MD-F-01; ArrCategories contains day labels for specified week"],
      ["MD-F-03", 'Type="Month", Meter=["PM001"], DataSelect="06", Interval=0', "Same structure as MD-F-01; ArrCategories contains day-of-month labels"],
      ["MD-F-04", 'Type="Year", Meter=["PM001","PM002"], DataSelect="2025", Interval=0', "Same structure as MD-F-01; ArrCategories contains 12 month abbreviation labels"],
      ["MD-F-05", 'Type="Max10Year", Meter=["PM001"], DataSelect="2025|2016", Interval=0', "Same structure as MD-F-01; ArrCategories contains year labels from 2016 to 2025"],
    ],
  },
  {
    label: "Functional — Response Structure & Field Integrity (RF)",
    color: C.sub1,
    cases: [
      ["RF-01", "MeterSum: verify response key type for Type='Day'", "Keys in ArrDataTarget/Actual are time strings (e.g. '10','11') — NOT meter IDs"],
      ["RF-02", "Multimeter: verify response key type for Type='Day'", "Keys in ArrDataTarget/Actual are meter ID strings (e.g. 'PM001') — NOT time strings"],
      ["RF-03", "MeterSum: verify MaxValueTarget/Actual for Type='Month'", "MaxValueTarget ≥ every value across all ArrDataTarget arrays; MaxValueActual ≥ every value across all ArrDataActual arrays"],
      ["RF-04", "Multimeter: verify max value integrity for Type='Month'", "Same max-value rule applied to Multimeter response"],
      ["RF-05", "MeterDetail: verify ChartSeries object structure (Type='Day')", "Each object in ArrDataChart has: Name (string), Type='bar', Color (valid HEX e.g. '#FF6384'), Data (doubles; length = ArrCategories)"],
      ["RF-06", "MeterDetail: verify MeterLabelMap for Meter=['PM001','PM002']", "MeterLabelMap has exactly 2 entries; each entry has id and label; id values match PM001 and PM002"],
      ["RF-07", "MeterDetail: verify ArrStrokeChart length consistency", "ArrStrokeChart length = number of objects in ArrDataChart; every value is int ≥ 0"],
      ["RF-08", "MeterSum Day: verify ArrCategories length by Interval", "Interval=5 → 288 entries; Interval=15 → 96; Interval=60 → 24; Data array length matches ArrCategories length"],
    ],
  },
  {
    label: "Load — WebSocket Load (WS-L)",
    color: C.sub2,
    cases: [
      ["WS-L-01", "Open 10 simultaneous WS connections; each sends PING at the same moment", "All 10 clients receive correct PONG within 1 second; no connections dropped"],
      ["WS-L-02", "Open 50 simultaneous WS connections; each sends PING at the same moment", "All 50 clients receive correct PONG within 2 seconds; no connections dropped"],
      ["WS-L-03", "Open 100 simultaneous WS connections; each sends PING at the same moment", "All 100 clients receive correct PONG within 5 seconds; server does not crash"],
      ["WS-L-04", "Single client sends PING 100 times consecutively without pause", "All 100 responses correct; no missing or malformed responses"],
      ["WS-L-05", "Single client sends INFO 50 times consecutively without pause", "All 50 responses correct and contain valid sensor data; no timeouts"],
    ],
  },
  {
    label: "Load — REST API Load (HTTP-L)",
    color: C.sub2,
    cases: [
      ["HTTP-L-01", "Send 20 concurrent POST /GetDataMeterSum (Type='Month')", "All 20 responses correct and identical; response time ≤ 3s each"],
      ["HTTP-L-02", "Send 20 concurrent POST /GetDataMultimeter (Type='Month')", "All 20 responses correct and identical; response time ≤ 3s each"],
      ["HTTP-L-03", "Send 20 concurrent POST /GetDataMeterDetail (Type='Month')", "All 20 responses correct and identical; response time ≤ 3s each"],
      ["HTTP-L-04", "Mixed: 10 req each to all 3 endpoints simultaneously (30 total)", "No request fails; no HTTP 500; all responses correct"],
      ["HTTP-L-05", "Send 1 POST /GetDataMeterSum per second for 5 minutes (300 total)", "Response time does not increase progressively; no errors after sustained 5-min run"],
    ],
  },
  {
    label: "Integration — WebSocket ↔ Sensor/PLC (WS-I)",
    color: C.sub3,
    cases: [
      ["WS-I-01", "Send INFO; compare Value of an Online sensor against PLC reading directly", "Value in response matches PLC reading within defined tolerance"],
      ["WS-I-02", "Send INFO; check LastUpdated timestamp of Online sensors", "LastUpdated for every Online sensor is no older than 5 minutes from request time"],
      ["WS-I-03", "Count Online sensors from PLC; compare against INFO Online field", "Online field in response equals PLC Online sensor count"],
    ],
  },
  {
    label: "Integration — HTTP API ↔ SQL Server (DB-I)",
    color: C.sub3,
    cases: [
      ["DB-I-01", "Call /GetDataMeterSum (Type='Month', Meter='PM001', DataSelect=['06']); query same data from unimicron_db", "ArrDataActual['06'] values match Actual records in DB exactly"],
      ["DB-I-02", "Same request as DB-I-01; query Target data from unimicron_db", "ArrDataTarget['06'] values match Target records in DB exactly"],
      ["DB-I-03", "Call /GetDataMeterDetail (Type='Month', Meter=['PM001','PM002']); query meter names from DB", "Each label in MeterLabelMap matches the meter name stored in unimicron_db"],
    ],
  },
  {
    label: "Integration — Cross-Endpoint Consistency (CE-I)",
    color: C.sub3,
    cases: [
      ["CE-I-01", "Call MeterSum (Meter='PM001', Type='Month', DataSelect=['06']) and Multimeter (Meter=['PM001'], DataSelect='06')", "Actual data for PM001 in June is identical across both responses"],
      ["CE-I-02", "Call Multimeter and MeterDetail for same meters and same month", "Sum of all Sub-Meter Data values per category in MeterDetail is consistent with Actual values in Multimeter"],
      ["CE-I-03", "Call MeterSum twice with Past=0 and Past=1; all other params identical", "Two responses return different data — confirms Past parameter correctly shifts year context"],
    ],
  },
  {
    label: "Integration — System Failure Handling (ERR-I)",
    color: C.sub3,
    cases: [
      ["ERR-I-01", "Stop SQL Server; call POST /GetDataMeterSum", "API returns meaningful error response (not raw HTTP 500); server does not crash"],
      ["ERR-I-02", "Stop WebSocket server; attempt client connection", "Client receives clear connection-refused error; no indefinite hang"],
      ["ERR-I-03", "Simulate high DB load (long-running query); call POST /GetDataMeterDetail", "API responds (possibly slower) but does not return incorrect data and does not crash"],
    ],
  },
  {
    label: "Validation — Required Field Missing (VR)",
    color: C.sub4,
    cases: [
      ["VR-01", "POST /GetDataMeterSum — omit the Type field entirely", "Error response (HTTP 4xx or Status:'ERROR'); no HTTP 500"],
      ["VR-02", "POST /GetDataMeterSum — omit the Meter field entirely", "Error response; no HTTP 500"],
      ["VR-03", "POST /GetDataMeterSum — omit the DataSelect field entirely", "Error response; no HTTP 500"],
      ["VR-04", "POST /GetDataMultimeter — omit the Interval field entirely", "Error response; no HTTP 500"],
      ["VR-05", "POST /GetDataMeterDetail — omit the Past field entirely", "Error response; no HTTP 500"],
    ],
  },
  {
    label: "Validation — Wrong Data Type (VT)",
    color: C.sub4,
    cases: [
      ["VT-01", 'POST /GetDataMeterSum — send Interval: "fifteen" (string instead of int)', "Error response; no HTTP 500"],
      ["VT-02", 'POST /GetDataMultimeter — send Meter: "PM001" (string instead of string array)', "Error response; no HTTP 500"],
      ["VT-03", 'POST /GetDataMeterSum — send DataSelect: "10" (string instead of string array)', "Error response; no HTTP 500"],
      ["VT-04", 'POST /GetDataMeterDetail — send Past: "zero" (string instead of int)', "Error response; no HTTP 500"],
    ],
  },
  {
    label: "Validation — Out-of-Range Values (VO)",
    color: C.sub4,
    cases: [
      ["VO-01", "POST /GetDataMeterSum — send Past: -1 (negative value)", "Error response or graceful fallback; no HTTP 500"],
      ["VO-02", 'POST /GetDataMeterSum — send Type="Day" with Interval=3 (not 5/15/60)', "Error response or empty data arrays; no HTTP 500"],
      ["VO-03", 'POST /GetDataMeterSum — send Month: "13" (month 13 does not exist)', "Error response; no HTTP 500"],
      ["VO-04", "POST /GetDataMeterDetail — send Past: 999 (unreasonably large)", "Error response or empty data; no HTTP 500"],
    ],
  },
  {
    label: "Validation — Invalid Format (VF)",
    color: C.sub4,
    cases: [
      ["VF-01", 'POST /GetDataMeterSum — Week DataSelect sent as "20250609-20250615" (dash instead of ||)', "Error response; no HTTP 500"],
      ["VF-02", 'POST /GetDataMultimeter — Max10Year DataSelect sent as "2025-2016" (dash instead of |)', "Error response; no HTTP 500"],
      ["VF-03", 'POST /GetDataMeterDetail — send Month: "6" (missing leading zero; spec requires "06")', 'Server handles zero-padding gracefully or returns descriptive error; no HTTP 500'],
    ],
  },
  {
    label: "Validation — Invalid Meter ID (VM)",
    color: C.sub4,
    cases: [
      ["VM-01", 'POST /GetDataMeterSum — send Meter: "XXXX" (meter ID does not exist)', "Error response or empty data arrays; no HTTP 500"],
      ["VM-02", 'POST /GetDataMultimeter — send Meter: ["PM001","XXXX"] (one valid, one invalid)', "Server returns data for valid meters only, or errors on whole request; no HTTP 500; behavior documented"],
    ],
  },
];

// ── Assign groups to slides ───────────────────────────────────────────────────
// Pre-calculated to fit within DATA_Y → FOOT_Y = 9.52"  (available = 9.52 - DATA_Y = 7.92")
// Row heights: subheader 0.34", data 0.50"
const slideGroups = [
  [0, 1],          // Slide 4: WS-F + MS-F   → 2×0.34 + 12×0.50 = 6.68"
  [2, 3],          // Slide 5: MM-F + MD-F   → 2×0.34 + 10×0.50 = 5.68"
  [4, 5],          // Slide 6: RF + WS-L     → 2×0.34 + 13×0.50 = 7.18"
  [6, 7, 8],       // Slide 7: HTTP-L+WS-I+DB-I  → 3×0.34 + 11×0.50 = 6.52"
  [9, 10, 11],     // Slide 8: CE-I+ERR-I+VR     → 3×0.34 + 11×0.50 = 6.52"
  [12, 13, 14, 15],// Slide 9: VT+VO+VF+VM       → 4×0.34 + 13×0.50 = 7.86"
];

// ── Slide 1 — Cover ───────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  // Top band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 3.2,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  // Teal accent strip left
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 3.2,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  // Mint bottom of band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 3.1, w: W, h: 0.1,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  s.addText("UMTH Sensor &\nEnergy API", {
    x: 0.4, y: 0.3, w: 6.7, h: 1.5,
    fontSize: 32, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });
  s.addText("Test Plan", {
    x: 0.4, y: 1.75, w: 6.7, h: 0.65,
    fontSize: 22, fontFace: "Calibri", color: "8EC6D0", align: "left", margin: 0,
  });
  s.addText("Version 2.0  ·  Portrait Edition", {
    x: 0.4, y: 2.45, w: 6.7, h: 0.38,
    fontSize: 11, fontFace: "Calibri", color: "567A8A", align: "left", margin: 0,
  });

  // Metadata table
  const meta = [
    ["Document Version", "2.0"],
    ["Date",             "26 April 2026"],
    ["Project Team",     "—"],
    ["Document Author",  "—"],
    ["Project Sponsor",  "—"],
  ];
  meta.forEach(([k, v], i) => {
    const y = 3.5 + i * 0.52;
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h: 0.5,
      fill: { color: bg }, line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.LINE, {
      x: MX + 2.4, y, w: 0, h: 0.5,
      line: { color: C.border, width: 0.5 },
    });
    s.addText(k, {
      x: MX + 0.1, y, w: 2.2, h: 0.5,
      fontSize: 10, fontFace: "Calibri", bold: true, color: C.navy, valign: "middle", margin: 0,
    });
    s.addText(v, {
      x: MX + 2.5, y, w: 3.9, h: 0.5,
      fontSize: 10, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0,
    });
  });

  pageFooter(s);
}

// ── Slide 2 — I. Introduction ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section I", "I. Introduction", 2);
  pageFooter(s);

  const body = [
    { label: "Purpose", text: "This document serves as the test plan for the UMTH Sensor & Energy Monitoring API system. It specifies the black-box test cases used to verify all software artifacts and report test results." },
    { label: "System Under Test", text: "The system consists of two sub-systems:\n1. WebSocket Sensor Server — real-time sensor data via ws://{host}:9001/ws/ using JSON text frames (RFC 6455)\n2. HTTP REST API — energy meter data via http://{host}:5000 with three POST endpoints: /GetDataMeterSum, /GetDataMultimeter, /GetDataMeterDetail" },
    { label: "Test Approach", text: "Testing is organized into four categories covering the full quality scope of the system:\n· Functional Testing (30 cases) — correct request/response behavior per specification\n· Load Testing (10 cases) — stability and response time under concurrent and sustained load\n· Integration Testing (12 cases) — data integrity across API, SQL Server, and sensor/PLC hardware\n· Validation Testing (18 cases) — proper rejection of malformed, missing, and out-of-range inputs" },
    { label: "Total Coverage", text: "70 test cases across 16 test groups — executed over a 7-day schedule." },
  ];

  let y = 1.3;
  body.forEach(b => {
    s.addText(b.label, {
      x: MX, y, w: CW, h: 0.3,
      fontSize: 10, fontFace: "Calibri", bold: true, color: C.navy, margin: 0,
    });
    y += 0.3;
    const lineCount = b.text.split("\n").length;
    const textH = Math.max(0.4, lineCount * 0.22 + 0.2);
    s.addText(b.text, {
      x: MX + 0.15, y, w: CW - 0.15, h: textH,
      fontSize: 9.5, fontFace: "Calibri", color: C.dark, margin: 0,
    });
    y += textH + 0.22;
    s.addShape(pres.shapes.LINE, {
      x: MX, y: y - 0.1, w: CW, h: 0,
      line: { color: C.border, width: 0.5 },
    });
  });
}

// ── Slide 3 — II. Test Plan (Column Legend) ────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section II", "II. Test Plan", 3);
  pageFooter(s);

  s.addText("The table below specifies the black-box test cases for all 70 requirements. Each requirement has at least one test case derived from equivalence class partitioning, boundary value analysis, and error-condition coverage.", {
    x: MX, y: 1.25, w: CW, h: 0.6,
    fontSize: 9.5, fontFace: "Calibri", color: C.dark, margin: 0,
  });

  const defs = [
    { term: "Test ID",          desc: "Unique identifier relating to the requirement group and sub-test. Format: GROUP-NN (e.g. WS-F-01, MS-F-03). Acceptance test cases end with *." },
    { term: "Description",      desc: "Step-by-step actions to execute the test case. Written specifically enough that any team member can run the test without the author being present." },
    { term: "Expected Results", desc: "Statement of what should happen when the test case is executed correctly against a conforming implementation." },
    { term: "Actual Results",   desc: "Filled in during execution. Record 'Pass' or 'Fail' and describe actual behavior when the test fails." },
  ];

  let y = 2.05;
  defs.forEach((d, i) => {
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    const h = 0.9;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h,
      fill: { color: bg }, line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: 0.06, h,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText(d.term, {
      x: MX + 0.15, y: y + 0.06, w: 1.5, h: 0.3,
      fontSize: 10, fontFace: "Calibri", bold: true, color: C.navy, margin: 0,
    });
    s.addText(d.desc, {
      x: MX + 0.15, y: y + 0.34, w: CW - 0.25, h: 0.52,
      fontSize: 9, fontFace: "Calibri", color: C.dark, margin: 0,
    });
    y += h + 0.08;
  });

  // Category summary
  y += 0.1;
  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: 0.38,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  s.addText("Test cases are organized into 4 categories:  Functional (30)  ·  Load (10)  ·  Integration (12)  ·  Validation (18)  =  70 Total", {
    x: MX + 0.15, y, w: CW - 0.2, h: 0.38,
    fontSize: 9.5, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
  });
}

// ── Slides 4–9 — II. Test Cases ───────────────────────────────────────────────
slideGroups.forEach((groupIdxArr, si) => {
  const s = pres.addSlide();
  s.background = { color: C.white };
  const pageNum = si + 4;
  pageHeader(s, "Section II — Test Plan", `II. Test Cases (${pageNum - 3}/6)`, pageNum);
  pageFooter(s);
  tableColHeader(s);

  let y = DATA_Y;
  let evenRow = false;

  groupIdxArr.forEach(gi => {
    const g = groups[gi];
    y = subheaderRow(s, g.label, g.color, y);
    g.cases.forEach(([id, desc, exp]) => {
      y = dataRow(s, id, desc, exp, evenRow, y);
      evenRow = !evenRow;
    });
    evenRow = false; // reset zebra per group
  });
});

// ── Slide 10 — III. Testing Deliverables ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section III", "III. Testing Deliverables", 10);
  pageFooter(s);

  const items = [
    { title: "Test Case Specification",       desc: "This document (Sections I–IX) including all 70 test cases with Test ID, Description, Expected Results, and Actual Results columns." },
    { title: "Test Log",                      desc: "Execution record for each test case: timestamp, tester name, build version, and actual result (Pass/Fail with notes)." },
    { title: "Test Incident Report",          desc: "Filed for every failing test case. Documents: actual vs. expected behavior, reproduction steps, severity, and assigned developer." },
    { title: "Test Summary Report",           desc: "Pass/fail statistics per category (Functional/Load/Integration/Validation) and overall after each test cycle." },
    { title: "Test Input and Output Data",    desc: "Saved raw JSON request bodies and response payloads for each test case execution." },
    { title: "Load Test Results",             desc: "Response time measurements and server resource metrics (CPU, memory) for all Load Testing cases (WS-L, HTTP-L)." },
    { title: "Test Design Specification",     desc: "Coverage rationale: equivalence classes, boundary values, and error conditions considered when deriving each test case." },
  ];

  let y = 1.28;
  items.forEach((item, i) => {
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    const h = 0.88;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h, fill: { color: bg }, line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: 0.06, h, fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText(`${i + 1}. ${item.title}`, {
      x: MX + 0.15, y: y + 0.06, w: CW - 0.2, h: 0.28,
      fontSize: 10, fontFace: "Calibri", bold: true, color: C.navy, margin: 0,
    });
    s.addText(item.desc, {
      x: MX + 0.15, y: y + 0.34, w: CW - 0.2, h: 0.48,
      fontSize: 9, fontFace: "Calibri", color: C.dark, margin: 0,
    });
    y += h + 0.06;
  });
}

// ── Slide 11 — IV. Environmental Requirements ─────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section IV", "IV. Environmental Requirements", 11);
  pageFooter(s);

  const sections = [
    {
      heading: "Hardware & System Software",
      rows: [
        ["Application Server", "UMTH application running and accessible"],
        ["Database",           "SQL Server with unimicron_db accessible"],
        ["HTTP Port",          "5000 (HTTP) / 5001 (HTTPS) — ListenAnyIP"],
        ["WebSocket Port",     "9001"],
        ["Network",            "Tester machine must reach host on TCP ports 5000, 5001, 9001"],
      ],
    },
    {
      heading: "Testing Tools",
      rows: [
        ["REST Client",      "Postman or curl — for HTTP endpoint testing"],
        ["WebSocket Client", "wscat or Postman WebSocket — for WS endpoint testing"],
        ["Load Tool",        "k6, JMeter, or equivalent — for Load Testing cases"],
        ["DB Access",        "Read access to unimicron_db — required for Integration Testing"],
        ["API Explorer",     "Swagger UI available at /swagger on all environments"],
      ],
    },
    {
      heading: "Security",
      rows: [
        ["Scope",       "Internal network only; no external exposure required during testing"],
        ["CORS Policy", "AllowAnyOrigin, AllowAnyMethod, AllowAnyHeader (test environment)"],
      ],
    },
  ];

  let y = 1.25;
  sections.forEach(sec => {
    s.addText(sec.heading, {
      x: MX, y, w: CW, h: 0.3,
      fontSize: 10.5, fontFace: "Calibri", bold: true, color: C.navy, margin: 0,
    });
    y += 0.3;
    sec.rows.forEach((r, i) => {
      const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
      s.addShape(pres.shapes.RECTANGLE, {
        x: MX, y, w: CW, h: 0.4, fill: { color: bg }, line: { color: C.border, width: 0.4 },
      });
      s.addShape(pres.shapes.LINE, {
        x: MX + 2.0, y, w: 0, h: 0.4, line: { color: C.border, width: 0.4 },
      });
      s.addText(r[0], {
        x: MX + 0.08, y, w: 1.85, h: 0.4,
        fontSize: 9, fontFace: "Calibri", bold: true, color: C.navy, valign: "middle", margin: 0,
      });
      s.addText(r[1], {
        x: MX + 2.1, y, w: CW - 2.1, h: 0.4,
        fontSize: 9, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0,
      });
      y += 0.4;
    });
    y += 0.22;
  });
}

// ── Slide 12 — V. Staffing ────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section V", "V. Staffing", 12);
  pageFooter(s);

  const roles = [
    { role: "Test Lead",             resp: "Oversees test execution across all four categories. Reviews all incident reports. Signs off on the final Test Summary Report. Escalates blockers to Project Sponsor." },
    { role: "Functional Tester",     resp: "Executes Functional Testing (WS-F, MS-F, MM-F, MD-F, RF) and Validation Testing (VR, VT, VO, VF, VM) cases. Records actual results in the Test Log." },
    { role: "Integration Tester",    resp: "Executes Integration Testing (WS-I, DB-I, CE-I, ERR-I) cases. Requires read access to unimicron_db and network visibility to PLC/sensor hardware." },
    { role: "Performance Tester",    resp: "Configures and runs Load Testing (WS-L, HTTP-L) cases using k6 or JMeter. Records response times and server resource metrics (CPU, memory)." },
    { role: "Developer / API Owner", resp: "Available during test execution to clarify API specification, resolve defects, and provide build versions. Does not execute tests directly." },
  ];

  let y = 1.28;
  roles.forEach((r, i) => {
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    const h = 1.12;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h, fill: { color: bg }, line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: 0.06, h, fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addShape(pres.shapes.LINE, {
      x: MX + 1.8, y, w: 0, h, line: { color: C.border, width: 0.5 },
    });
    s.addText(r.role, {
      x: MX + 0.15, y: y + 0.08, w: 1.55, h: h - 0.16,
      fontSize: 9.5, fontFace: "Calibri", bold: true, color: C.navy, valign: "top", margin: 0,
    });
    s.addText(r.resp, {
      x: MX + 1.9, y: y + 0.08, w: CW - 2.0, h: h - 0.16,
      fontSize: 9, fontFace: "Calibri", color: C.dark, valign: "top", margin: 0,
    });
    y += h + 0.06;
  });
}

// ── Slide 13 — VI. Schedule ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section VI", "VI. Schedule", 13);
  pageFooter(s);

  const rows = [
    { phase: "Phase 1", day: "Day 1",   act: "Environment setup and connectivity verification",               cases: "—",       owner: "Test Lead" },
    { phase: "Phase 2", day: "Day 1",   act: "Functional Testing — WebSocket cases (WS-F-01 to WS-F-07)",   cases: "7",       owner: "Functional Tester" },
    { phase: "Phase 3", day: "Day 2",   act: "Functional Testing — HTTP happy path (MS-F, MM-F, MD-F, RF)", cases: "23",      owner: "Functional Tester" },
    { phase: "Phase 4", day: "Day 3",   act: "Validation Testing — all groups (VR, VT, VO, VF, VM)",        cases: "18",      owner: "Functional Tester" },
    { phase: "Phase 5", day: "Day 4",   act: "Integration Testing — all groups (WS-I, DB-I, CE-I, ERR-I)", cases: "12",      owner: "Integration Tester" },
    { phase: "Phase 6", day: "Day 5",   act: "Load Testing — all groups (WS-L, HTTP-L)",                    cases: "10",      owner: "Performance Tester" },
    { phase: "Phase 7", day: "Day 6",   act: "Defect re-testing and regression",                             cases: "TBD",     owner: "All Testers" },
    { phase: "Phase 8", day: "Day 7",   act: "Test Summary Report compilation and sign-off",                 cases: "—",       owner: "Test Lead" },
  ];

  // Table header
  let y = 1.28;
  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: 0.38,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  [["Phase", 0.7, 0], ["Day", 0.55, 0.7], ["Activity", 2.55, 1.25], ["Cases", 0.55, 3.8], ["Owner", 1.15, 4.35]].forEach(([lbl, w, xoff]) => {
    s.addText(lbl, {
      x: MX + xoff + 0.06, y, w, h: 0.38,
      fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
  });
  y += 0.38;

  rows.forEach((r, i) => {
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    const h = 0.56;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h, fill: { color: bg }, line: { color: C.border, width: 0.4 },
    });
    [0.7, 0.7+0.55, 1.25+2.55, 3.8+0.55].forEach(xoff => {
      s.addShape(pres.shapes.LINE, {
        x: MX + xoff, y, w: 0, h, line: { color: C.border, width: 0.4 },
      });
    });
    s.addText(r.phase, { x: MX+0.06, y, w: 0.62, h, fontSize: 8.5, fontFace: "Calibri", bold: true, color: C.navy, valign: "middle", margin: 0 });
    s.addText(r.day,   { x: MX+0.76, y, w: 0.48, h, fontSize: 8.5, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0 });
    s.addText(r.act,   { x: MX+1.31, y, w: 2.44, h, fontSize: 8.5, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0 });
    s.addText(r.cases, { x: MX+3.86, y, w: 0.48, h, fontSize: 8.5, fontFace: "Calibri", color: C.dark, align: "center", valign: "middle", margin: 0 });
    s.addText(r.owner, { x: MX+4.41, y, w: 1.08, h, fontSize: 8, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0 });
    y += h;
  });
}

// ── Slide 14 — VII. Risks and Contingencies ───────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section VII", "VII. Risks and Contingencies", 14);
  pageFooter(s);

  const risks = [
    { risk: "SQL Server unavailable during testing",            like: "Medium", imp: "High",   mit: "Confirm DB connectivity before start; coordinate dedicated test window with DBA." },
    { risk: "Sensor devices offline (affects WS-I data cases)", like: "Medium", imp: "Medium", mit: "Use staging environment with simulated sensor data for WS-I cases." },
    { risk: "Load tests disrupt other users or services",       like: "Medium", imp: "High",   mit: "Run all load tests in isolated test environment — never against production." },
    { risk: "Past = -1 causes unhandled server exception",      like: "Low",    imp: "High",   mit: "Execute VO-01 first to detect server instability before running the full suite." },
    { risk: "DB read credentials unavailable for Integration",  like: "Low",    imp: "Medium", mit: "Arrange read access to unimicron_db in advance of the test cycle." },
  ];

  const likeColor = { High: "C0392B", Medium: "D4AC0D", Low: "14A085" };
  const impColor  = { High: "C0392B", Medium: "D4AC0D", Low: "14A085" };

  // Header
  let y = 1.28;
  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: 0.36,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  [["Risk", 3.2, 0], ["Likelihood", 0.9, 3.2], ["Impact", 0.8, 4.1], ["Mitigation", 1.5, 4.9]].forEach(([lbl, w, xoff]) => {
    s.addText(lbl, {
      x: MX + xoff + 0.06, y, w, h: 0.36,
      fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
  });
  y += 0.36;

  risks.forEach((r, i) => {
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    const h = 1.12;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h, fill: { color: bg }, line: { color: C.border, width: 0.5 },
    });
    [3.2, 4.1, 4.9].forEach(xoff => {
      s.addShape(pres.shapes.LINE, {
        x: MX + xoff, y, w: 0, h, line: { color: C.border, width: 0.4 },
      });
    });
    s.addText(r.risk, {
      x: MX + 0.1, y: y + 0.08, w: 3.05, h: h - 0.16,
      fontSize: 9, fontFace: "Calibri", bold: true, color: C.dark, valign: "top", margin: 0,
    });
    // Likelihood badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX + 3.28, y: y + 0.32, w: 0.72, h: 0.3,
      fill: { color: likeColor[r.like] }, line: { color: likeColor[r.like], width: 0 },
    });
    s.addText(r.like, {
      x: MX + 3.28, y: y + 0.32, w: 0.72, h: 0.3,
      fontSize: 7.5, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    // Impact badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX + 4.18, y: y + 0.32, w: 0.62, h: 0.3,
      fill: { color: impColor[r.imp] }, line: { color: impColor[r.imp], width: 0 },
    });
    s.addText(r.imp, {
      x: MX + 4.18, y: y + 0.32, w: 0.62, h: 0.3,
      fontSize: 7.5, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addText(r.mit, {
      x: MX + 5.0, y: y + 0.08, w: 1.45, h: h - 0.16,
      fontSize: 8, fontFace: "Calibri", color: C.dark, valign: "top", margin: 0,
    });
    y += h + 0.06;
  });
}

// ── Slide 15 — VIII. Approvals + IX. Revision History ────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  pageHeader(s, "Section VIII / IX", "VIII. Approvals  ·  IX. Document Revision History", 15);
  pageFooter(s);

  // VIII. Approvals
  s.addText("VIII. Approvals", {
    x: MX, y: 1.25, w: CW, h: 0.3,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.navy, margin: 0,
  });

  const approvals = [
    ["Test Lead",             "", ""],
    ["Developer / API Owner", "", ""],
    ["Project Sponsor",       "", ""],
  ];

  // Approval table header
  let y = 1.6;
  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: 0.36,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  [["Role", 2.5, 0], ["Name", 2.0, 2.5], ["Signature", 1.0, 4.5], ["Date", 1.0, 5.5]].forEach(([lbl, w, xoff]) => {
    s.addText(lbl, {
      x: MX + xoff + 0.06, y, w, h: 0.36,
      fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
  });
  y += 0.36;

  approvals.forEach(([role, name, sig], i) => {
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h: 0.52, fill: { color: bg }, line: { color: C.border, width: 0.4 },
    });
    [2.5, 4.5, 5.5].forEach(xoff => {
      s.addShape(pres.shapes.LINE, {
        x: MX + xoff, y, w: 0, h: 0.52, line: { color: C.border, width: 0.4 },
      });
    });
    s.addText(role, { x: MX+0.08, y, w: 2.38, h: 0.52, fontSize: 9.5, fontFace: "Calibri", bold: true, color: C.navy, valign: "middle", margin: 0 });
    y += 0.52;
  });

  // IX. Revision History
  y += 0.35;
  s.addText("IX. Document Revision History", {
    x: MX, y, w: CW, h: 0.3,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.navy, margin: 0,
  });
  y += 0.35;

  // History header
  s.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: 0.36,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  [["Version", 0.7, 0], ["Name(s)", 1.5, 0.7], ["Date", 1.2, 2.2], ["Change Description", 3.1, 3.4]].forEach(([lbl, w, xoff]) => {
    s.addText(lbl, {
      x: MX + xoff + 0.06, y, w, h: 0.36,
      fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
  });
  y += 0.36;

  const history = [
    ["1.0", "—", "26 Apr 2026", "Initial test plan — 42 cases (Functional + basic error handling)"],
    ["2.0", "—", "26 Apr 2026", "Restructured into 4 categories: Functional, Load, Integration, Validation — 70 cases total"],
  ];
  history.forEach((r, i) => {
    const bg = i % 2 === 0 ? C.rowEven : C.rowOdd;
    s.addShape(pres.shapes.RECTANGLE, {
      x: MX, y, w: CW, h: 0.52, fill: { color: bg }, line: { color: C.border, width: 0.4 },
    });
    [0.7, 2.2, 3.4].map(x => MX + x).forEach(xpos => {
      s.addShape(pres.shapes.LINE, {
        x: xpos, y, w: 0, h: 0.52, line: { color: C.border, width: 0.4 },
      });
    });
    [r[0], r[1], r[2], r[3]].forEach((cell, ci) => {
      const xoffs = [0.06, 0.76, 2.26, 3.46];
      const ws    = [0.62, 1.4, 1.1, 3.0];
      s.addText(cell, {
        x: MX + xoffs[ci], y, w: ws[ci], h: 0.52,
        fontSize: 9, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0,
      });
    });
    y += 0.52;
  });
}

// ── Write File ────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "c:/API Test/UMTH-API-Test-Plan-Portrait.pptx" })
  .then(() => console.log("✅  Created: c:/API Test/UMTH-API-Test-Plan-Portrait.pptx"))
  .catch(e => { console.error("❌  Error:", e); process.exit(1); });
