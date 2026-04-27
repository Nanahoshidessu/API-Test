const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "UMTH Sensor & Energy API — Test Plan";
pres.author = "QA Team";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  navy:    "0A3D62",
  teal:    "0D7377",
  mint:    "14A085",
  light:   "EAF4F4",
  white:   "FFFFFF",
  dark:    "0D1F2D",
  muted:   "5D7A8A",
  border:  "B2D8D8",
  pass:    "1E8449",
  warn:    "D4AC0D",
  fail:    "C0392B",
  gray:    "F4F6F7",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 });

function darkSlide(slide) {
  slide.background = { color: C.dark };
}

function lightSlide(slide) {
  slide.background = { color: C.light };
}

function whiteSlide(slide) {
  slide.background = { color: C.white };
}

// Top accent bar for content slides
function accentBar(slide, color = C.teal) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.07,
    fill: { color },
    line: { color, width: 0 },
  });
}

// Section label pill
function sectionPill(slide, label, color = C.mint) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.18, w: 1.6, h: 0.32,
    fill: { color },
    line: { color, width: 0 },
    shadow: makeShadow(),
  });
  slide.addText(label, {
    x: 0.5, y: 0.18, w: 1.6, h: 0.32,
    fontSize: 9, color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
  });
}

// Slide title
function slideTitle(slide, text, x = 0.5, y = 0.62, w = 9, color = C.navy) {
  slide.addText(text, {
    x, y, w, h: 0.52,
    fontSize: 24, fontFace: "Calibri", bold: true, color, align: "left", valign: "middle", margin: 0,
  });
}

// Divider line under title
function titleRule(slide, y = 1.18, color = C.border) {
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y, w: 9, h: 0,
    line: { color, width: 1.2 },
  });
}

// Card box
function card(slide, x, y, w, h, fillColor = C.white) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: fillColor },
    line: { color: C.border, width: 0.8 },
    shadow: makeShadow(),
  });
}

// ── Slide 1 — Title ───────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);

  // Top teal band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.6,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });

  // Bottom mint strip
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  s.addText("UMTH Sensor & Energy API", {
    x: 0.6, y: 0.22, w: 8.8, h: 0.7,
    fontSize: 28, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });
  s.addText("Test Plan", {
    x: 0.6, y: 0.88, w: 8.8, h: 0.6,
    fontSize: 20, fontFace: "Calibri", bold: false, color: "B2EBF2", align: "left", margin: 0,
  });

  s.addText("Version 2.0  ·  April 2026", {
    x: 0.6, y: 1.85, w: 8.8, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: C.muted, align: "left", margin: 0,
  });

  // 4 category badges
  const cats = [
    { label: "Functional",   count: "30", color: C.teal },
    { label: "Load",         count: "10", color: C.mint },
    { label: "Integration",  count: "12", color: "1A6B8A" },
    { label: "Validation",   count: "18", color: "1A7A6E" },
  ];
  cats.forEach((c, i) => {
    const x = 0.6 + i * 2.25;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.55, w: 2.05, h: 1.3,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
      shadow: makeShadow(),
    });
    s.addText(c.count, {
      x, y: 2.6, w: 2.05, h: 0.7,
      fontSize: 36, fontFace: "Calibri", bold: true, color: C.white, align: "center", margin: 0,
    });
    s.addText(c.label + " Tests", {
      x, y: 3.25, w: 2.05, h: 0.52,
      fontSize: 11, fontFace: "Calibri", color: "CCEEFF", align: "center", margin: 0,
    });
  });

  s.addText("Total: 70 Test Cases  ·  7-Day Execution Schedule  ·  2 Sub-Systems (WebSocket + REST API)", {
    x: 0.6, y: 4.5, w: 8.8, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: C.muted, align: "left", margin: 0,
  });

  s.addText("Prepared by QA Team  ·  UMTH Program  ·  2026-04-26", {
    x: 0, y: 5.32, w: 10, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.white, align: "center", margin: 0,
  });
}

// ── Slide 2 — System Overview ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  whiteSlide(s);
  accentBar(s, C.navy);
  sectionPill(s, "OVERVIEW");
  slideTitle(s, "System Under Test");
  titleRule(s);

  const boxes = [
    {
      title: "WebSocket Sensor Server",
      sub: "ws://{host}:9001/ws/",
      proto: "RFC 6455 · JSON text frames",
      items: ["PING — server health check", "INFO — real-time sensor summary", "Case-insensitive command field"],
      color: C.teal,
    },
    {
      title: "HTTP REST API",
      sub: "http://{host}:5000",
      proto: "POST endpoints · JSON body",
      items: ["POST /GetDataMeterSum", "POST /GetDataMultimeter", "POST /GetDataMeterDetail"],
      color: C.navy,
    },
  ];

  boxes.forEach((b, i) => {
    const x = 0.5 + i * 4.75;
    card(s, x, 1.35, 4.4, 3.8);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w: 4.4, h: 0.55,
      fill: { color: b.color }, line: { color: b.color, width: 0 },
    });
    s.addText(b.title, {
      x: x + 0.15, y: 1.35, w: 4.1, h: 0.55,
      fontSize: 13, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
    s.addText(b.sub, {
      x: x + 0.15, y: 2.0, w: 4.1, h: 0.35,
      fontSize: 12, fontFace: "Consolas", bold: true, color: b.color, margin: 0,
    });
    s.addText(b.proto, {
      x: x + 0.15, y: 2.35, w: 4.1, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.muted, margin: 0,
    });
    b.items.forEach((item, j) => {
      s.addText([{ text: item, options: { bullet: true } }], {
        x: x + 0.15, y: 2.75 + j * 0.38, w: 4.1, h: 0.38,
        fontSize: 11, fontFace: "Calibri", color: C.dark, margin: 0,
      });
    });
  });

  // Shared params box
  card(s, 0.5, 5.25, 9, 0.25, C.gray);
  s.addText("Common Parameters (all 3 REST endpoints):  Type · Interval · Past · Month · WeekMonth · DataSelect · Meter", {
    x: 0.6, y: 5.27, w: 8.8, h: 0.22,
    fontSize: 9.5, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });
}

// ── Slide 3 — Test Scope ──────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  accentBar(s, C.teal);
  sectionPill(s, "SCOPE");
  slideTitle(s, "Test Categories & Coverage");
  titleRule(s);

  const rows = [
    { cat: "Functional", id: "WS-F / MS-F / MM-F / MD-F / RF", desc: "Verify correct request→response behavior for every endpoint and Type", count: "30", color: C.teal },
    { cat: "Load",        id: "WS-L / HTTP-L",                  desc: "Concurrent connections, rapid sequential requests, 5-min sustained load", count: "10", color: C.mint },
    { cat: "Integration", id: "WS-I / DB-I / CE-I / ERR-I",     desc: "Sensor/PLC data fidelity, DB record matching, cross-endpoint consistency", count: "12", color: "1A6B8A" },
    { cat: "Validation",  id: "VR / VT / VO / VF / VM",         desc: "Missing fields, wrong types, out-of-range values, bad formats, invalid meter IDs", count: "18", color: "1A7A6E" },
  ];

  rows.forEach((r, i) => {
    const y = 1.4 + i * 0.98;
    card(s, 0.5, y, 9, 0.85, C.white);
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.08, h: 0.85,
      fill: { color: r.color }, line: { color: r.color, width: 0 },
    });
    s.addText(r.cat, {
      x: 0.72, y: y + 0.06, w: 1.6, h: 0.32,
      fontSize: 13, fontFace: "Calibri", bold: true, color: r.color, margin: 0,
    });
    s.addText(r.id, {
      x: 0.72, y: y + 0.44, w: 2.8, h: 0.3,
      fontSize: 9, fontFace: "Consolas", color: C.muted, margin: 0,
    });
    s.addText(r.desc, {
      x: 3.55, y: y + 0.18, w: 5.1, h: 0.52,
      fontSize: 11, fontFace: "Calibri", color: C.dark, margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.85, y, w: 0.65, h: 0.85,
      fill: { color: r.color }, line: { color: r.color, width: 0 },
    });
    s.addText(r.count, {
      x: 8.85, y, w: 0.65, h: 0.85,
      fontSize: 22, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
  });

  s.addText("TOTAL: 70 TEST CASES", {
    x: 0.5, y: 5.3, w: 9, h: 0.28,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.navy, align: "right", margin: 0,
  });
}

// ── Slide 4 — Section Divider: Functional ─────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: 5.625,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("01", {
    x: 0.55, y: 0.8, w: 3, h: 1.5,
    fontSize: 96, fontFace: "Calibri", bold: true, color: "0D373A", align: "left", margin: 0,
  });
  s.addText("Functional\nTesting", {
    x: 0.55, y: 2.1, w: 9, h: 1.5,
    fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });
  s.addText("30 test cases  ·  WS-F · MS-F · MM-F · MD-F · RF", {
    x: 0.55, y: 3.75, w: 9, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.muted, align: "left", margin: 0,
  });
}

// ── Slide 5 — WS-F: WebSocket Happy Path ──────────────────────────────────────
{
  const s = pres.addSlide();
  whiteSlide(s);
  accentBar(s, C.teal);
  sectionPill(s, "FUNCTIONAL");
  slideTitle(s, "WebSocket — Happy Path (WS-F-01 to 07)");
  titleRule(s);

  const cases = [
    { id: "WS-F-01", desc: 'Send {"cmd":"PING"}', expect: 'PONG + Status=OK + ISO 8601 Timestamp' },
    { id: "WS-F-02", desc: 'Send {"Cmd":"ping"} — case variation', expect: 'Same as WS-F-01 (case-insensitive)' },
    { id: "WS-F-03", desc: 'Send {"command":"PING"} — alt field', expect: 'Accepts cmd, Cmd, command, Command' },
    { id: "WS-F-04", desc: 'Send {"cmd":"INFO"} — root fields', expect: 'Total, Online, Alarm, Offline, Disabled all ≥ 0' },
    { id: "WS-F-05", desc: '"INFO" — Sensors array members', expect: 'Every sensor has Status=Online only (StatusCode=1)' },
    { id: "WS-F-06", desc: '"INFO" — count arithmetic', expect: 'Total = Online + Alarm + Offline + Disabled' },
    { id: "WS-F-07", desc: '"INFO" — Sensor object fields', expect: 'SensorId, SensorName, FlowId, Value, Accumulate, Status, LastUpdated' },
  ];

  cases.forEach((c, i) => {
    const y = 1.35 + i * 0.57;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 1.1, h: 0.44,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText(c.id, {
      x: 0.5, y, w: 1.1, h: 0.44,
      fontSize: 9, fontFace: "Consolas", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.68, y, w: 3.7, h: 0.44,
      fill: { color: C.gray }, line: { color: C.border, width: 0.5 },
    });
    s.addText(c.desc, {
      x: 1.78, y, w: 3.5, h: 0.44,
      fontSize: 10, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.46, y, w: 4.04, h: 0.44,
      fill: { color: C.light }, line: { color: C.border, width: 0.5 },
    });
    s.addText(c.expect, {
      x: 5.56, y, w: 3.85, h: 0.44,
      fontSize: 10, fontFace: "Calibri", color: C.navy, valign: "middle", margin: 0,
    });
  });

  // Column headers
  s.addText("Test ID", { x: 0.5, y: 1.1, w: 1.1, h: 0.22, fontSize: 9, bold: true, color: C.muted, align: "center", margin: 0 });
  s.addText("Description", { x: 1.68, y: 1.1, w: 3.7, h: 0.22, fontSize: 9, bold: true, color: C.muted, margin: 0 });
  s.addText("Expected Result", { x: 5.46, y: 1.1, w: 4.04, h: 0.22, fontSize: 9, bold: true, color: C.muted, margin: 0 });
}

// ── Slide 6 — WS Error Handling ───────────────────────────────────────────────
{
  const s = pres.addSlide();
  whiteSlide(s);
  accentBar(s, C.teal);
  sectionPill(s, "FUNCTIONAL");
  slideTitle(s, "WebSocket — Error Handling");
  titleRule(s);

  const errs = [
    { id: "WS-ERR-01", input: '"hello"  (not JSON)', code: "INVALID_JSON" },
    { id: "WS-ERR-02", input: "[1,2,3]  (JSON array)", code: "INVALID_JSON_OBJECT" },
    { id: "WS-ERR-03", input: "{}  (no cmd field)", code: "CMD_REQUIRED" },
    { id: "WS-ERR-04", input: '{"cmd":"HELLO"}  (unknown)', code: "UNKNOWN_CMD" },
  ];

  errs.forEach((e, i) => {
    const y = 1.55 + i * 0.9;
    card(s, 0.5, y, 9, 0.75, C.white);
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 1.5, h: 0.75,
      fill: { color: C.navy }, line: { color: C.navy, width: 0 },
    });
    s.addText(e.id, {
      x: 0.5, y, w: 1.5, h: 0.75,
      fontSize: 10, fontFace: "Consolas", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addText("Input: " + e.input, {
      x: 2.15, y: y + 0.12, w: 4.2, h: 0.45,
      fontSize: 11, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.5, y: y + 0.15, w: 2.75, h: 0.44,
      fill: { color: "FDF2F2" }, line: { color: "E8A0A0", width: 0.8 },
    });
    s.addText('Message: "' + e.code + '"', {
      x: 6.5, y: y + 0.15, w: 2.75, h: 0.44,
      fontSize: 10, fontFace: "Consolas", bold: true, color: C.fail, align: "center", valign: "middle", margin: 0,
    });
  });

  s.addText('All errors return:  {"Status": "ERROR", "Message": "<code>"}', {
    x: 0.5, y: 5.22, w: 9, h: 0.3,
    fontSize: 10, fontFace: "Consolas", color: C.muted, align: "center", margin: 0,
  });
}

// ── Slide 7 — HTTP Happy Path Overview ───────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  accentBar(s, C.teal);
  sectionPill(s, "FUNCTIONAL");
  slideTitle(s, "REST API — Happy Path Coverage (15 cases)");
  titleRule(s);

  const endpoints = [
    {
      name: "POST /GetDataMeterSum",
      id: "MS-F-01 to 05",
      note: "1 Meter · Multiple DataSelect",
      types: ["Day (Interval 15)", "Week (Interval 7)", "Month (Interval 0)", "Year (Interval 0)", "Max10Year (Interval 0)"],
      color: C.teal,
    },
    {
      name: "POST /GetDataMultimeter",
      id: "MM-F-01 to 05",
      note: "Multiple Meters · 1 DataSelect",
      types: ["Day (Interval 15)", "Week (Interval 7)", "Month (Interval 0)", "Year (Interval 0)", "Max10Year (Interval 0)"],
      color: C.navy,
    },
    {
      name: "POST /GetDataMeterDetail",
      id: "MD-F-01 to 05",
      note: "Multiple Meters · Sub-Meter Series",
      types: ["Day (Interval 15)", "Week (Interval 7)", "Month (Interval 0)", "Year (Interval 0)", "Max10Year (Interval 0)"],
      color: C.mint,
    },
  ];

  endpoints.forEach((ep, i) => {
    const x = 0.4 + i * 3.1;
    card(s, x, 1.38, 2.95, 3.9, C.white);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.38, w: 2.95, h: 0.5,
      fill: { color: ep.color }, line: { color: ep.color, width: 0 },
    });
    s.addText(ep.name, {
      x: x + 0.1, y: 1.38, w: 2.75, h: 0.5,
      fontSize: 10, fontFace: "Consolas", bold: true, color: C.white, valign: "middle", margin: 0,
    });
    s.addText(ep.id, {
      x: x + 0.1, y: 1.93, w: 2.75, h: 0.3,
      fontSize: 9.5, fontFace: "Calibri", bold: true, color: ep.color, margin: 0,
    });
    s.addText(ep.note, {
      x: x + 0.1, y: 2.22, w: 2.75, h: 0.28,
      fontSize: 9, fontFace: "Calibri", color: C.muted, margin: 0,
    });
    ep.types.forEach((t, j) => {
      s.addText([{ text: t, options: { bullet: true } }], {
        x: x + 0.1, y: 2.58 + j * 0.38, w: 2.75, h: 0.38,
        fontSize: 10, fontFace: "Calibri", color: C.dark, margin: 0,
      });
    });
  });

  s.addText("Each Type verifies: response keys · ArrCategories labels · ShortMonth · Year · MaxValue integrity", {
    x: 0.4, y: 5.3, w: 9.2, h: 0.25,
    fontSize: 9.5, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });
}

// ── Slide 8 — RF: Response Integrity ─────────────────────────────────────────
{
  const s = pres.addSlide();
  whiteSlide(s);
  accentBar(s, C.teal);
  sectionPill(s, "FUNCTIONAL");
  slideTitle(s, "Response Structure & Field Integrity (RF-01 to 08)");
  titleRule(s);

  const items = [
    { id: "RF-01", text: "MeterSum: keys in ArrDataTarget/Actual are time strings (not meter IDs)" },
    { id: "RF-02", text: "Multimeter: keys are meter IDs (not time strings) — opposite of MeterSum" },
    { id: "RF-03", text: "MeterSum: MaxValueTarget ≥ all values in every ArrDataTarget array" },
    { id: "RF-04", text: "Multimeter: same MaxValue rule applied to Multimeter response" },
    { id: "RF-05", text: "MeterDetail: each ChartSeries has Name, Type='bar', Color (HEX), Data (length = ArrCategories)" },
    { id: "RF-06", text: "MeterDetail: MeterLabelMap has exactly one entry per requested meter (id + label)" },
    { id: "RF-07", text: "MeterDetail: ArrStrokeChart length = number of series in ArrDataChart, all int ≥ 0" },
    { id: "RF-08", text: "MeterSum Day: Interval 5 → 288 entries · 15 → 96 · 60 → 24; Data length = ArrCategories length" },
  ];

  const half = 4;
  items.forEach((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i % half;
    const x = 0.5 + col * 4.75;
    const y = 1.35 + row * 0.98;
    card(s, x, y, 4.4, 0.82, C.white);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.85, h: 0.82,
      fill: { color: C.mint }, line: { color: C.mint, width: 0 },
    });
    s.addText(item.id, {
      x, y, w: 0.85, h: 0.82,
      fontSize: 10, fontFace: "Consolas", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addText(item.text, {
      x: x + 0.95, y: y + 0.12, w: 3.35, h: 0.62,
      fontSize: 10, fontFace: "Calibri", color: C.dark, margin: 0,
    });
  });
}

// ── Slide 9 — Section Divider: Load ──────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: 5.625,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });
  s.addText("02", {
    x: 0.55, y: 0.8, w: 3, h: 1.5,
    fontSize: 96, fontFace: "Calibri", bold: true, color: "0A2A20", align: "left", margin: 0,
  });
  s.addText("Load\nTesting", {
    x: 0.55, y: 2.1, w: 9, h: 1.5,
    fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });
  s.addText("10 test cases  ·  WS-L · HTTP-L", {
    x: 0.55, y: 3.75, w: 9, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.muted, align: "left", margin: 0,
  });
}

// ── Slide 10 — Load Testing ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  accentBar(s, C.mint);
  sectionPill(s, "LOAD", C.mint);
  slideTitle(s, "Load Testing — All Cases (WS-L & HTTP-L)");
  titleRule(s);

  // WS-L block
  card(s, 0.5, 1.38, 4.25, 3.78, C.white);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.38, w: 4.25, h: 0.42,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("WebSocket Load (WS-L)", {
    x: 0.65, y: 1.38, w: 4.0, h: 0.42,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
  });

  const wsL = [
    { id: "WS-L-01", desc: "10 concurrent connections → PING", threshold: "All respond < 1s" },
    { id: "WS-L-02", desc: "50 concurrent connections → PING", threshold: "All respond < 2s" },
    { id: "WS-L-03", desc: "100 concurrent connections → PING", threshold: "All respond < 5s, no crash" },
    { id: "WS-L-04", desc: "1 client × 100 sequential PING", threshold: "0 missing responses" },
    { id: "WS-L-05", desc: "1 client × 50 sequential INFO", threshold: "0 timeouts, valid data" },
  ];
  wsL.forEach((r, i) => {
    const y = 1.88 + i * 0.62;
    s.addText(r.id, { x: 0.6, y, w: 1.0, h: 0.28, fontSize: 9, fontFace: "Consolas", bold: true, color: C.teal, margin: 0 });
    s.addText(r.desc, { x: 1.65, y, w: 1.9, h: 0.28, fontSize: 9.5, fontFace: "Calibri", color: C.dark, margin: 0 });
    s.addText(r.threshold, { x: 3.6, y, w: 1.05, h: 0.28, fontSize: 8.5, fontFace: "Calibri", color: C.mint, margin: 0 });
  });

  // HTTP-L block
  card(s, 5.25, 1.38, 4.25, 3.78, C.white);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.25, y: 1.38, w: 4.25, h: 0.42,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  s.addText("REST API Load (HTTP-L)", {
    x: 5.4, y: 1.38, w: 4.0, h: 0.42,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
  });

  const httpL = [
    { id: "HTTP-L-01", desc: "20 concurrent → /GetDataMeterSum", threshold: "All correct < 3s" },
    { id: "HTTP-L-02", desc: "20 concurrent → /GetDataMultimeter", threshold: "All correct < 3s" },
    { id: "HTTP-L-03", desc: "20 concurrent → /GetDataMeterDetail", threshold: "All correct < 3s" },
    { id: "HTTP-L-04", desc: "Mixed: 30 total concurrent (all 3)", threshold: "0 failures, 0 HTTP 500" },
    { id: "HTTP-L-05", desc: "1 req/s × 5 min (300 total)", threshold: "No time increase, 0 errors" },
  ];
  httpL.forEach((r, i) => {
    const y = 1.88 + i * 0.62;
    s.addText(r.id, { x: 5.35, y, w: 1.1, h: 0.28, fontSize: 9, fontFace: "Consolas", bold: true, color: C.navy, margin: 0 });
    s.addText(r.desc, { x: 6.5, y, w: 1.8, h: 0.28, fontSize: 9.5, fontFace: "Calibri", color: C.dark, margin: 0 });
    s.addText(r.threshold, { x: 8.35, y, w: 1.05, h: 0.28, fontSize: 8.5, fontFace: "Calibri", color: C.mint, margin: 0 });
  });

  s.addText("Tools: k6 · JMeter · wscat  |  Run in isolated test environment — NOT production", {
    x: 0.5, y: 5.27, w: 9, h: 0.25,
    fontSize: 9.5, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });
}

// ── Slide 11 — Section Divider: Integration ───────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: 5.625,
    fill: { color: "1A6B8A" }, line: { color: "1A6B8A", width: 0 },
  });
  s.addText("03", {
    x: 0.55, y: 0.8, w: 3, h: 1.5,
    fontSize: 96, fontFace: "Calibri", bold: true, color: "0A1F2A", align: "left", margin: 0,
  });
  s.addText("Integration\nTesting", {
    x: 0.55, y: 2.1, w: 9, h: 1.5,
    fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });
  s.addText("12 test cases  ·  WS-I · DB-I · CE-I · ERR-I", {
    x: 0.55, y: 3.75, w: 9, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.muted, align: "left", margin: 0,
  });
}

// ── Slide 12 — Integration Testing ───────────────────────────────────────────
{
  const s = pres.addSlide();
  whiteSlide(s);
  accentBar(s, "1A6B8A");
  sectionPill(s, "INTEGRATION", "1A6B8A");
  slideTitle(s, "Integration Testing — All Cases");
  titleRule(s);

  const groups = [
    {
      title: "WS-I — WebSocket ↔ Sensor/PLC",
      color: C.teal,
      items: [
        "WS-I-01: Sensor Value matches PLC reading within tolerance",
        "WS-I-02: LastUpdated ≤ 5 min old for all Online sensors",
        "WS-I-03: INFO Online count = PLC online sensor count",
      ],
    },
    {
      title: "DB-I — HTTP API ↔ SQL Server",
      color: C.navy,
      items: [
        "DB-I-01: ArrDataActual values match Actual records in unimicron_db",
        "DB-I-02: ArrDataTarget values match Target records in unimicron_db",
        "DB-I-03: MeterLabelMap labels match meter names in DB",
      ],
    },
    {
      title: "CE-I — Cross-Endpoint Consistency",
      color: C.mint,
      items: [
        "CE-I-01: MeterSum vs Multimeter — same meter, same month, same data",
        "CE-I-02: Multimeter vs MeterDetail — Sub-Meter sums are consistent",
        "CE-I-03: Past=0 vs Past=1 — different years return different data",
      ],
    },
    {
      title: "ERR-I — System Failure Handling",
      color: C.fail,
      items: [
        "ERR-I-01: SQL Server down → meaningful error, no crash",
        "ERR-I-02: WS Server down → clear connection-refused, no hang",
        "ERR-I-03: DB high load → API responds slowly but correctly",
      ],
    },
  ];

  groups.forEach((g, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 1.35 + row * 2.05;
    card(s, x, y, 4.4, 1.88, C.white);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.4, h: 0.38,
      fill: { color: g.color }, line: { color: g.color, width: 0 },
    });
    s.addText(g.title, {
      x: x + 0.1, y, w: 4.2, h: 0.38,
      fontSize: 10.5, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
    g.items.forEach((item, j) => {
      s.addText([{ text: item, options: { bullet: true } }], {
        x: x + 0.1, y: y + 0.44 + j * 0.44, w: 4.2, h: 0.44,
        fontSize: 10, fontFace: "Calibri", color: C.dark, margin: 0,
      });
    });
  });
}

// ── Slide 13 — Section Divider: Validation ────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: 5.625,
    fill: { color: "1A7A6E" }, line: { color: "1A7A6E", width: 0 },
  });
  s.addText("04", {
    x: 0.55, y: 0.8, w: 3, h: 1.5,
    fontSize: 96, fontFace: "Calibri", bold: true, color: "0A1F1D", align: "left", margin: 0,
  });
  s.addText("Validation\nTesting", {
    x: 0.55, y: 2.1, w: 9, h: 1.5,
    fontSize: 40, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });
  s.addText("18 test cases  ·  VR · VT · VO · VF · VM", {
    x: 0.55, y: 3.75, w: 9, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.muted, align: "left", margin: 0,
  });
}

// ── Slide 14 — Validation Testing ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  accentBar(s, "1A7A6E");
  sectionPill(s, "VALIDATION", "1A7A6E");
  slideTitle(s, "Validation Testing — All Cases");
  titleRule(s);

  const groups = [
    {
      id: "VR", title: "Required Field Missing", count: 5, color: C.teal,
      items: ["VR-01: Missing Type", "VR-02: Missing Meter", "VR-03: Missing DataSelect", "VR-04: Missing Interval", "VR-05: Missing Past"],
    },
    {
      id: "VT", title: "Wrong Data Type", count: 4, color: C.navy,
      items: ['VT-01: Interval = "fifteen" (string)', 'VT-02: Meter = "PM001" (string, not array)', 'VT-03: DataSelect = "10" (string, not array)', 'VT-04: Past = "zero" (string)'],
    },
    {
      id: "VO", title: "Out-of-Range Values", count: 4, color: "B7770D",
      items: ["VO-01: Past = -1 (negative)", "VO-02: Day + Interval = 3 (not 5/15/60)", 'VO-03: Month = "13" (impossible)', "VO-04: Past = 999 (unreasonably large)"],
    },
    {
      id: "VF+VM", title: "Invalid Format + Meter ID", count: 5, color: C.fail,
      items: ['VF-01: Week DataSelect with "-" instead of "||"', 'VF-02: Max10Year with "-" instead of "|"', 'VF-03: Month = "6" missing zero-pad', "VM-01: Meter = 'XXXX' (unknown ID)", "VM-02: Mixed valid + invalid meter array"],
    },
  ];

  groups.forEach((g, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 1.35 + row * 2.08;
    card(s, x, y, 4.4, 1.95, C.white);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.4, h: 0.38,
      fill: { color: g.color }, line: { color: g.color, width: 0 },
    });
    s.addText(`${g.id} — ${g.title}  (${g.count})`, {
      x: x + 0.1, y, w: 4.2, h: 0.38,
      fontSize: 10.5, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
    });
    g.items.forEach((item, j) => {
      s.addText([{ text: item, options: { bullet: true } }], {
        x: x + 0.1, y: y + 0.44 + j * 0.3, w: 4.2, h: 0.3,
        fontSize: 9.5, fontFace: "Calibri", color: C.dark, margin: 0,
      });
    });
  });

  s.addText("All validation cases: expect error response (HTTP 4xx or Status:'ERROR') — never HTTP 500", {
    x: 0.5, y: 5.3, w: 9, h: 0.25,
    fontSize: 9.5, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });
}

// ── Slide 15 — Summary ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("Test Case Summary", {
    x: 0.5, y: 0.22, w: 9, h: 0.65,
    fontSize: 28, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });

  const summary = [
    { cat: "Functional Testing",   groups: "WS-F · MS-F · MM-F · MD-F · RF", n: 30, color: C.teal },
    { cat: "Load Testing",         groups: "WS-L · HTTP-L",                  n: 10, color: C.mint },
    { cat: "Integration Testing",  groups: "WS-I · DB-I · CE-I · ERR-I",    n: 12, color: "2E9FBF" },
    { cat: "Validation Testing",   groups: "VR · VT · VO · VF · VM",         n: 18, color: "2EB59F" },
  ];

  summary.forEach((r, i) => {
    const y = 1.28 + i * 0.9;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 7.7, h: 0.72,
      fill: { color: "112233" }, line: { color: "1C3A4A", width: 0.8 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.08, h: 0.72,
      fill: { color: r.color }, line: { color: r.color, width: 0 },
    });
    s.addText(r.cat, {
      x: 0.72, y: y + 0.06, w: 3.5, h: 0.32,
      fontSize: 13, fontFace: "Calibri", bold: true, color: C.white, margin: 0,
    });
    s.addText(r.groups, {
      x: 0.72, y: y + 0.38, w: 4.5, h: 0.26,
      fontSize: 9, fontFace: "Consolas", color: C.muted, margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.3, y, w: 1.2, h: 0.72,
      fill: { color: r.color }, line: { color: r.color, width: 0 },
    });
    s.addText(String(r.n), {
      x: 8.3, y, w: 1.2, h: 0.72,
      fontSize: 28, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    });
  });

  // Total
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.95, w: 9, h: 0.5,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("TOTAL", {
    x: 0.6, y: 4.95, w: 7.5, h: 0.5,
    fontSize: 16, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
  });
  s.addText("70", {
    x: 8.3, y: 4.95, w: 1.2, h: 0.5,
    fontSize: 22, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
  });
}

// ── Slide 16 — Environment & Schedule ────────────────────────────────────────
{
  const s = pres.addSlide();
  whiteSlide(s);
  accentBar(s, C.navy);
  sectionPill(s, "PLANNING");
  slideTitle(s, "Environment & Schedule");
  titleRule(s);

  // Env table
  card(s, 0.5, 1.35, 4.4, 3.9, C.white);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.35, w: 4.4, h: 0.4,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  s.addText("Environment Requirements", {
    x: 0.6, y: 1.35, w: 4.2, h: 0.4,
    fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
  });

  const env = [
    ["HTTP Port", "5000 / 5001"],
    ["WebSocket", "9001"],
    ["Database", "SQL Server (unimicron_db)"],
    ["REST Client", "Postman / curl"],
    ["WS Client", "wscat / Postman WS"],
    ["Load Tool", "k6 / JMeter"],
    ["DB Access", "Read access to unimicron_db"],
  ];
  env.forEach(([k, v], i) => {
    const y = 1.82 + i * 0.48;
    const bg = i % 2 === 0 ? C.gray : C.white;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 4.4, h: 0.46, fill: { color: bg }, line: { color: C.border, width: 0.4 } });
    s.addText(k, { x: 0.6, y, w: 1.5, h: 0.46, fontSize: 10, fontFace: "Calibri", bold: true, color: C.navy, valign: "middle", margin: 0 });
    s.addText(v, { x: 2.18, y, w: 2.6, h: 0.46, fontSize: 10, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0 });
  });

  // Schedule
  card(s, 5.25, 1.35, 4.25, 3.9, C.white);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.25, y: 1.35, w: 4.25, h: 0.4,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("7-Day Schedule", {
    x: 5.35, y: 1.35, w: 4.0, h: 0.4,
    fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
  });

  const sched = [
    ["Day 1", "Environment setup + WS-F cases"],
    ["Day 2", "HTTP happy-path (MS-F/MM-F/MD-F/RF)"],
    ["Day 3", "Validation Testing (VR/VT/VO/VF/VM)"],
    ["Day 4", "Integration Testing (WS-I/DB-I/CE-I/ERR-I)"],
    ["Day 5", "Load Testing (WS-L/HTTP-L)"],
    ["Day 6", "Defect re-test + Regression"],
    ["Day 7", "Summary Report + Sign-off"],
  ];
  sched.forEach(([day, act], i) => {
    const y = 1.82 + i * 0.48;
    const bg = i % 2 === 0 ? C.gray : C.white;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.25, y, w: 4.25, h: 0.46, fill: { color: bg }, line: { color: C.border, width: 0.4 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.25, y, w: 0.72, h: 0.46, fill: { color: C.teal }, line: { color: C.teal, width: 0 } });
    s.addText(day, { x: 5.25, y, w: 0.72, h: 0.46, fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(act, { x: 6.02, y, w: 3.4, h: 0.46, fontSize: 10, fontFace: "Calibri", color: C.dark, valign: "middle", margin: 0 });
  });
}

// ── Slide 17 — Risks ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  lightSlide(s);
  accentBar(s, C.navy);
  sectionPill(s, "RISKS");
  slideTitle(s, "Risks & Contingencies");
  titleRule(s);

  const risks = [
    { risk: "SQL Server unavailable during testing", like: "Medium", impact: "High", mit: "Confirm DB connectivity before start; reserve test window with DBA", likeColor: C.warn, impColor: C.fail },
    { risk: "Sensor devices offline (affects WS-I cases)", like: "Medium", impact: "Medium", mit: "Use staging environment with simulated sensor data", likeColor: C.warn, impColor: C.warn },
    { risk: "Load tests disrupt production users", like: "Medium", impact: "High", mit: "Run load tests in isolated test environment only — never production", likeColor: C.warn, impColor: C.fail },
    { risk: "Past = -1 causes unhandled server exception", like: "Low", impact: "High", mit: "Run VO-01 first before full suite to detect instability early", likeColor: C.mint, impColor: C.fail },
    { risk: "DB read access unavailable for Integration", like: "Low", impact: "Medium", mit: "Arrange DB read credentials before test cycle begins", likeColor: C.mint, impColor: C.warn },
  ];

  risks.forEach((r, i) => {
    const y = 1.38 + i * 0.8;
    card(s, 0.5, y, 9, 0.68, C.white);
    s.addText(r.risk, { x: 0.65, y: y + 0.1, w: 4.3, h: 0.48, fontSize: 11, fontFace: "Calibri", bold: true, color: C.dark, margin: 0 });

    s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: y + 0.15, w: 0.9, h: 0.36, fill: { color: r.likeColor }, line: { color: r.likeColor, width: 0 } });
    s.addText(r.like, { x: 5.1, y: y + 0.15, w: 0.9, h: 0.36, fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });

    s.addShape(pres.shapes.RECTANGLE, { x: 6.1, y: y + 0.15, w: 0.85, h: 0.36, fill: { color: r.impColor }, line: { color: r.impColor, width: 0 } });
    s.addText(r.impact, { x: 6.1, y: y + 0.15, w: 0.85, h: 0.36, fontSize: 9, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });

    s.addText(r.mit, { x: 7.05, y: y + 0.1, w: 2.35, h: 0.48, fontSize: 9, fontFace: "Calibri", color: C.muted, margin: 0 });
  });

  s.addText("Likelihood", { x: 5.1, y: 1.16, w: 0.9, h: 0.2, fontSize: 8, fontFace: "Calibri", bold: true, color: C.muted, align: "center", margin: 0 });
  s.addText("Impact", { x: 6.1, y: 1.16, w: 0.85, h: 0.2, fontSize: 8, fontFace: "Calibri", bold: true, color: C.muted, align: "center", margin: 0 });
  s.addText("Mitigation", { x: 7.05, y: 1.16, w: 2.35, h: 0.2, fontSize: 8, fontFace: "Calibri", bold: true, color: C.muted, margin: 0 });
}

// ── Slide 18 — Closing / Approval ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  darkSlide(s);

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.5, w: 10, h: 1.125,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });

  s.addText("Ready for Review", {
    x: 0.6, y: 0.7, w: 8.8, h: 1.1,
    fontSize: 44, fontFace: "Calibri", bold: true, color: C.white, align: "left", margin: 0,
  });
  s.addText("UMTH Sensor & Energy API — Test Plan v2.0", {
    x: 0.6, y: 1.75, w: 8.8, h: 0.45,
    fontSize: 16, fontFace: "Calibri", color: "7EB8C9", align: "left", margin: 0,
  });

  const approvers = ["Test Lead", "Developer / API Owner", "Project Sponsor"];
  approvers.forEach((role, i) => {
    const x = 0.9 + i * 2.85;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.5, w: 2.5, h: 1.65,
      fill: { color: "0D2535" }, line: { color: "1C3A4A", width: 0.8 },
    });
    s.addText(role, { x, y: 2.55, w: 2.5, h: 0.38, fontSize: 10.5, fontFace: "Calibri", bold: true, color: C.teal, align: "center", margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.25, y: 3.7, w: 2.0, h: 0, line: { color: "2A4A5A", width: 1.2 } });
    s.addText("Signature / Date", { x, y: 3.76, w: 2.5, h: 0.28, fontSize: 8.5, fontFace: "Calibri", color: C.muted, align: "center", margin: 0 });
  });

  s.addText("70 Test Cases  ·  4 Categories  ·  7-Day Schedule  ·  April 2026", {
    x: 0, y: 4.55, w: 10, h: 0.38,
    fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", margin: 0,
  });
  s.addText("Prepared by QA Team  ·  UMTH Program", {
    x: 0, y: 4.9, w: 10, h: 0.28,
    fontSize: 10, fontFace: "Calibri", color: "B2EBF2", align: "center", margin: 0,
  });
}

// ── Write file ────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "c:/API Test/UMTH-API-Test-Plan.pptx" })
  .then(() => console.log("✅  Created: c:/API Test/UMTH-API-Test-Plan.pptx"))
  .catch(e => { console.error("❌  Error:", e); process.exit(1); });