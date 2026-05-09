// Generate "Test report UMTH.pptx" from functional-test-report-EN.md (v1.3) data
// Follows Test Report Template.md spec — Path B (PptxGenJS from scratch)

const pptxgen = require("pptxgenjs");

const PROJECT_NAME = "UMTH Flow meter Visualization API";
const COMPANY_NAME = "Unimicron (Thailand) Co., Ltd.";
const VERSION = "1.3";
const DATE = "5 May 2026";
const COVER_DATE = "Version 05/May/2026";
const AUTHOR = "Tomas Tech Co., Ltd.";
const PROJECT_OWNER = COMPANY_NAME;

const PURPOSE = "This document records the post-execution evidence of functional API testing for the UMTH Flow meter Visualization API. It captures the test cases executed against the deployed API endpoint, the steps performed for each case, and the actual outcome (Pass / Fail) verified through automated assertions.";
const SUT = "Three REST endpoints exposed by the Flow meter Visualization API: POST /GetDataMeterSum, POST /GetDataMultimeter, and POST /GetDataMeterDetail. The system aggregates and serves flow-meter telemetry across Day, Week, Month, Year, and Max10Year time scales.";
const APPROACH = "Black-box automated testing using Postman collections executed by Newman 6.2.1. Tests were grouped into four functional suites (MS-F, MM-F, MD-F, RF) and validated via JSON-schema and value-level assertions. The final run targeted the remote staging deployment at https://tom-demo-01.proen.app.ruk-com.cloud/unimicron-api.";

const TOTAL_REPORTS = 25;
const TOTAL_GROUPS = 4;
const TOTAL_DAYS = 5;
const EXEC_DATE = "5 May 2026";

// --- Test cases (all PASS in v1.3) ---
const cases = [
  // MS-F (POST /GetDataMeterSum)
  { id: "MS-F-01", name: "Day comparison by selected days", endpoint: "/GetDataMeterSum", type: "Day", payload: '{ Type: "Day", Meter: ["1"], DataSelect: ["2025-06-01", "2025-06-02"] }', http: 200, ms: 249, pass: 9, total: 9, extra: "ArrCategories returns full 96-entry day grid (Interval=15)." },
  { id: "MS-F-02", name: "Week comparison by selected week ranges", endpoint: "/GetDataMeterSum", type: "Week", payload: '{ Type: "Week", Meter: ["1"], DataSelect: ["2025-06-02||2025-06-08"] }', http: 200, ms: 51, pass: 8, total: 8, extra: "Dictionary keys preserve DataSelect strings (e.g. '2025-06-02||2025-06-08')." },
  { id: "MS-F-03", name: "Month comparison by selected months", endpoint: "/GetDataMeterSum", type: "Month", payload: '{ Type: "Month", Meter: ["1"], DataSelect: ["04", "05", "06"] }', http: 200, ms: 66, pass: 8, total: 8, extra: "Dictionary keys returned as month codes ('04', '05', '06')." },
  { id: "MS-F-04", name: "Year comparison by selected years", endpoint: "/GetDataMeterSum", type: "Year", payload: '{ Type: "Year", Meter: ["1"], DataSelect: ["2023", "2024", "2025"] }', http: 200, ms: 59, pass: 8, total: 8, extra: "Dictionary keys returned as year strings ('2023', '2024', '2025')." },
  { id: "MS-F-05", name: "Max10Year comparison across ten years", endpoint: "/GetDataMeterSum", type: "Max10Year", payload: '{ Type: "Max10Year", Meter: ["1"], DataSelect: ["2016".."2025"] }', http: 200, ms: 33, pass: 8, total: 8, extra: "Returns 10 yearly buckets with year-string keys." },

  // MM-F (POST /GetDataMultimeter)
  { id: "MM-F-01", name: "Day data for multiple meters", endpoint: "/GetDataMultimeter", type: "Day", payload: '{ Type: "Day", Meter: ["1", "2", "3"], DataSelect: ["2025-06-15"] }', http: 200, ms: 51, pass: 9, total: 9, extra: "Per-meter Day series with full 96-slot ArrCategories." },
  { id: "MM-F-02", name: "Week data for multiple meters", endpoint: "/GetDataMultimeter", type: "Week", payload: '{ Type: "Week", Meter: ["1", "2", "3"], DataSelect: ["2025-06-02||2025-06-08"] }', http: 200, ms: 48, pass: 8, total: 8, extra: "Per-meter weekly aggregates returned." },
  { id: "MM-F-03", name: "Month data for multiple meters", endpoint: "/GetDataMultimeter", type: "Month", payload: '{ Type: "Month", Meter: ["1", "2", "3"], DataSelect: ["06"] }', http: 200, ms: 38, pass: 8, total: 8, extra: "Per-meter monthly aggregates returned." },
  { id: "MM-F-04", name: "Year data for multiple meters", endpoint: "/GetDataMultimeter", type: "Year", payload: '{ Type: "Year", Meter: ["1", "2", "3"], DataSelect: ["2025"] }', http: 200, ms: 43, pass: 8, total: 8, extra: "Per-meter yearly aggregates returned." },
  { id: "MM-F-05", name: "Max10Year data for multiple meters", endpoint: "/GetDataMultimeter", type: "Max10Year", payload: '{ Type: "Max10Year", Meter: ["1", "2", "3"] }', http: 200, ms: 44, pass: 8, total: 8, extra: "Per-meter ten-year aggregates returned." },

  // MD-F (POST /GetDataMeterDetail)
  { id: "MD-F-01", name: "Day detail chart", endpoint: "/GetDataMeterDetail", type: "Day", payload: '{ Type: "Day", Meter: ["1"], DataSelect: ["2025-06-15"] }', http: 200, ms: 33, pass: 9, total: 9, extra: "MeterLabelMap returns id+label objects; full 96-slot grid." },
  { id: "MD-F-02", name: "Week detail chart", endpoint: "/GetDataMeterDetail", type: "Week", payload: '{ Type: "Week", Meter: ["1"], DataSelect: ["2025-06-02||2025-06-08"] }', http: 200, ms: 33, pass: 8, total: 8, extra: "Bar chart series with valid ApexCharts structure." },
  { id: "MD-F-03", name: "Month detail chart", endpoint: "/GetDataMeterDetail", type: "Month", payload: '{ Type: "Month", Meter: ["1"], DataSelect: ["06"] }', http: 200, ms: 24, pass: 8, total: 8, extra: "Monthly detail series returned." },
  { id: "MD-F-04", name: "Year detail chart", endpoint: "/GetDataMeterDetail", type: "Year", payload: '{ Type: "Year", Meter: ["1"], DataSelect: ["2025"] }', http: 200, ms: 43, pass: 8, total: 8, extra: "Yearly detail series returned." },
  { id: "MD-F-05", name: "Max10Year detail chart", endpoint: "/GetDataMeterDetail", type: "Max10Year", payload: '{ Type: "Max10Year", Meter: ["1"], DataSelect: "2025" }', http: 200, ms: 30, pass: 8, total: 8, extra: "Single-year DataSelect workaround in place for DEF-004; endpoint returns HTTP 200." },

  // RF (Response Structure & Field Integrity)
  { id: "RF-01", name: "MeterSum Day keys are time/data-select strings", endpoint: "/GetDataMeterSum", type: "Day", payload: '{ Type: "Day", Meter: ["1"], Interval: 15 }', http: 200, ms: 48, pass: 9, total: 9, extra: "Verified non-numeric, time-string keys throughout response." },
  { id: "RF-02", name: "Multimeter Day keys are meter IDs", endpoint: "/GetDataMultimeter", type: "Day", payload: '{ Type: "Day", Meter: ["1", "2", "3"] }', http: 200, ms: 28, pass: 9, total: 9, extra: "Top-level keys equal selected meter IDs." },
  { id: "RF-03", name: "MeterSum max values cover Month data", endpoint: "/GetDataMeterSum", type: "Month", payload: '{ Type: "Month", Meter: ["1"], DataSelect: ["04", "05", "06"] }', http: 200, ms: 51, pass: 8, total: 8, extra: "MaxData >= each ArrDataActual point." },
  { id: "RF-04", name: "Multimeter max values cover Month data", endpoint: "/GetDataMultimeter", type: "Month", payload: '{ Type: "Month", Meter: ["1", "2", "3"], DataSelect: ["06"] }', http: 200, ms: 37, pass: 8, total: 8, extra: "Per-meter MaxData covers ArrDataActual." },
  { id: "RF-05", name: "MeterDetail chart series object structure", endpoint: "/GetDataMeterDetail", type: "Day", payload: '{ Type: "Day", Meter: ["1"] }', http: 200, ms: 43, pass: 9, total: 9, extra: "Each chart entry has name/type='bar'/data array." },
  { id: "RF-06", name: "MeterDetail MeterLabelMap selected IDs", endpoint: "/GetDataMeterDetail", type: "Day", payload: '{ Type: "Day", Meter: ["1"] }', http: 200, ms: 41, pass: 8, total: 8, extra: "MeterLabelMap entries contain the requested meter IDs." },
  { id: "RF-07", name: "MeterDetail stroke length consistency", endpoint: "/GetDataMeterDetail", type: "Day", payload: '{ Type: "Day", Meter: ["1"] }', http: 200, ms: 36, pass: 8, total: 8, extra: "stroke array length equals chart series length." },
  { id: "RF-08a", name: "MeterSum Day categories — interval=5 min", endpoint: "/GetDataMeterSum", type: "Day", payload: '{ Type: "Day", Interval: 5 }', http: 200, ms: 28, pass: 9, total: 9, extra: "ArrCategories.length == 288 (24h × 12)." },
  { id: "RF-08b", name: "MeterSum Day categories — interval=15 min", endpoint: "/GetDataMeterSum", type: "Day", payload: '{ Type: "Day", Interval: 15 }', http: 200, ms: 24, pass: 9, total: 9, extra: "ArrCategories.length == 96 (24h × 4)." },
  { id: "RF-08c", name: "MeterSum Day categories — interval=60 min", endpoint: "/GetDataMeterSum", type: "Day", payload: '{ Type: "Day", Interval: 60 }', http: 200, ms: 32, pass: 9, total: 9, extra: "ArrCategories.length == 24 (one entry per hour)." }
];

const TOTAL = 4 + (cases.length * 2) + 2; // 4 baseline + N pairs + schedule + risks = 56

const pres = new pptxgen();
pres.defineLayout({ name: "LETTER_PORTRAIT", width: 7.5, height: 10 });
pres.layout = "LETTER_PORTRAIT";
pres.title = `${PROJECT_NAME} Test Report`;
pres.author = AUTHOR;
pres.company = AUTHOR;

function addChrome(slide, sectionLabel, pageNum) {
  // Top bar: white fill, charcoal border
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 7.5, h: 0.58,
    fill: { color: "FFFFFF" }, line: { color: "323232", width: 1 }
  });
  // Black left accent strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 0.58,
    fill: { color: "000000" }, line: { type: "none" }
  });
  // Section label
  slide.addText(sectionLabel, {
    x: 0.18, y: 0, w: 5, h: 0.58, fontSize: 9, bold: true,
    fontFace: "Calibri", color: "000000", valign: "middle", margin: 0
  });
  // Page indicator
  slide.addText(`${pageNum} / ${TOTAL}`, {
    x: 5.2, y: 0, w: 2.2, h: 0.58, fontSize: 9, fontFace: "Calibri",
    color: "000000", align: "right", valign: "middle", margin: 0
  });
  // Footer
  slide.addText(
    `${PROJECT_NAME}   ·  Test Report v${VERSION}  ·  ${DATE}  ·  Confidential`,
    { x: 0.3, y: 9.55, w: 6.9, h: 0.3, fontSize: 8, fontFace: "Calibri",
      color: "404040", align: "left" }
  );
}

// --- Slide 1: Cover ---
{
  const s = pres.addSlide();
  // Top-left red box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.3, w: 1.6, h: 0.36,
    fill: { color: "FFFFFF" }, line: { color: "FF0000", width: 1.5 }
  });
  s.addText(COVER_DATE, {
    x: 0.3, y: 0.3, w: 1.6, h: 0.36, fontSize: 10, bold: true,
    fontFace: "Calibri", color: "FF0000", align: "center", valign: "middle", margin: 0
  });
  // Top-right red box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.6, y: 0.3, w: 1.6, h: 0.36,
    fill: { color: "FFFFFF" }, line: { color: "FF0000", width: 1.5 }
  });
  s.addText("Confidential", {
    x: 5.6, y: 0.3, w: 1.6, h: 0.36, fontSize: 10, bold: true,
    fontFace: "Calibri", color: "FF0000", align: "center", valign: "middle", margin: 0
  });
  // Center-right title block
  s.addText([
    { text: PROJECT_NAME, options: { fontSize: 18, bold: true, fontFace: "Calibri Light", color: "000000", breakLine: true } },
    { text: `Documentation EN Test Report for ${COMPANY_NAME}`, options: { fontSize: 14, bold: true, fontFace: "Calibri Light", color: "000000", breakLine: true } },
    { text: " ", options: { fontSize: 12, breakLine: true } },
    { text: `Made for: ${COMPANY_NAME}`, options: { fontSize: 11, fontFace: "Calibri", color: "000000", breakLine: true } },
    { text: "By: TOMAS TECH CO.,LTD.", options: { fontSize: 11, fontFace: "Calibri", color: "000000" } }
  ], { x: 0.7, y: 3.3, w: 6.5, h: 2.0, align: "right", valign: "top" });
  // Page number
  s.addText("1", {
    x: 6.9, y: 9.6, w: 0.3, h: 0.3, fontSize: 9, fontFace: "Calibri",
    color: "404040", align: "right"
  });
}

// --- Slide 2: Title & Document Info ---
{
  const s = pres.addSlide();
  addChrome(s, `${PROJECT_NAME} Testing`, 2);
  s.addText("Test Report", {
    x: 0.5, y: 1.0, w: 6.5, h: 0.6, fontSize: 28, bold: true,
    fontFace: "Calibri Light", color: "000000"
  });
  s.addText(`Version ${VERSION}`, {
    x: 0.5, y: 1.7, w: 6.5, h: 0.4, fontSize: 16,
    fontFace: "Calibri", color: "000000"
  });
  // Info table
  const rows = [
    [{ text: "Document Version", options: { bold: true, fontFace: "Calibri", fontSize: 11, fill: { color: "F2F2F2" } } },
     { text: VERSION, options: { fontFace: "Calibri", fontSize: 11 } }],
    [{ text: "Date", options: { bold: true, fontFace: "Calibri", fontSize: 11, fill: { color: "F2F2F2" } } },
     { text: DATE, options: { fontFace: "Calibri", fontSize: 11 } }],
    [{ text: "Project", options: { bold: true, fontFace: "Calibri", fontSize: 11, fill: { color: "F2F2F2" } } },
     { text: PROJECT_NAME, options: { fontFace: "Calibri", fontSize: 11 } }],
    [{ text: "Document Author", options: { bold: true, fontFace: "Calibri", fontSize: 11, fill: { color: "F2F2F2" } } },
     { text: AUTHOR, options: { fontFace: "Calibri", fontSize: 11 } }],
    [{ text: "Project Owner", options: { bold: true, fontFace: "Calibri", fontSize: 11, fill: { color: "F2F2F2" } } },
     { text: PROJECT_OWNER, options: { fontFace: "Calibri", fontSize: 11 } }]
  ];
  s.addTable(rows, {
    x: 0.5, y: 2.6, w: 6.5, colW: [2.2, 4.3],
    border: { type: "solid", color: "CCCCCC", pt: 0.5 },
    rowH: 0.4
  });
}

// --- Slide 3: Table of Contents ---
{
  const s = pres.addSlide();
  addChrome(s, "Contents", 3);
  s.addText("Table of Contents", {
    x: 0.5, y: 0.9, w: 6.5, h: 0.55, fontSize: 22, bold: true,
    fontFace: "Calibri Light", color: "000000"
  });

  // Build test-case sub-rows: each spec slide is the "starting page" for that case.
  // Spec = pageNum, Evidence = pageNum + 1. First case starts at page 5.
  const tocCaseRows = cases.map((tc, i) => {
    const startPage = 5 + (i * 2);
    return [
      { text: `    ${tc.id}`, options: { fontFace: "Calibri", fontSize: 9, color: "404040", margin: 2 } },
      { text: tc.name, options: { fontFace: "Calibri", fontSize: 9, color: "404040", margin: 2 } },
      { text: String(startPage), options: { fontFace: "Calibri", fontSize: 9, color: "404040", align: "right", margin: 2 } }
    ];
  });

  const schedulePage = 5 + (cases.length * 2);     // 55
  const risksPage = schedulePage + 1;              // 56

  const tocRows = [
    [
      { text: "Section", options: { bold: true, fontFace: "Calibri", fontSize: 10, color: "FFFFFF", fill: { color: "323232" }, margin: 2 } },
      { text: "Title", options: { bold: true, fontFace: "Calibri", fontSize: 10, color: "FFFFFF", fill: { color: "323232" }, margin: 2 } },
      { text: "Page", options: { bold: true, fontFace: "Calibri", fontSize: 10, color: "FFFFFF", fill: { color: "323232" }, align: "right", margin: 2 } }
    ],
    [
      { text: "1.", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: "Introduction", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: "4", options: { bold: true, fontFace: "Calibri", fontSize: 10, align: "right", margin: 2 } }
    ],
    [
      { text: "2.", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: "Test Case", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: "5", options: { bold: true, fontFace: "Calibri", fontSize: 10, align: "right", margin: 2 } }
    ],
    ...tocCaseRows,
    [
      { text: "3.", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: "Schedule", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: String(schedulePage), options: { bold: true, fontFace: "Calibri", fontSize: 10, align: "right", margin: 2 } }
    ],
    [
      { text: "4.", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: "Risks and Contingencies", options: { bold: true, fontFace: "Calibri", fontSize: 10, margin: 2 } },
      { text: String(risksPage), options: { bold: true, fontFace: "Calibri", fontSize: 10, align: "right", margin: 2 } }
    ]
  ];

  s.addTable(tocRows, {
    x: 0.5, y: 1.5, w: 6.5, colW: [0.9, 4.8, 0.8],
    border: { type: "solid", color: "DDDDDD", pt: 0.5 },
    rowH: 0.23
  });
}

// --- Slide 4: Introduction ---
{
  const s = pres.addSlide();
  addChrome(s, "Section 1", 4);
  s.addText("1. Introduction", {
    x: 0.5, y: 0.8, w: 6.5, h: 0.5, fontSize: 22, bold: true,
    fontFace: "Calibri Light", color: "000000"
  });
  s.addText([
    { text: "Purpose", options: { fontSize: 13, bold: true, fontFace: "Calibri", breakLine: true } },
    { text: PURPOSE, options: { fontSize: 11, fontFace: "Calibri", paraSpaceAfter: 10, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "System Under Test", options: { fontSize: 13, bold: true, fontFace: "Calibri", breakLine: true } },
    { text: SUT, options: { fontSize: 11, fontFace: "Calibri", paraSpaceAfter: 10, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "Test Approach", options: { fontSize: 13, bold: true, fontFace: "Calibri", breakLine: true } },
    { text: APPROACH, options: { fontSize: 11, fontFace: "Calibri", paraSpaceAfter: 10, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "Total Coverage", options: { fontSize: 13, bold: true, fontFace: "Calibri", breakLine: true } },
    { text: `${TOTAL_REPORTS} Test Reports across ${TOTAL_GROUPS} test groups, executed over a ${TOTAL_DAYS} day schedule.`,
      options: { fontSize: 11, fontFace: "Calibri" } }
  ], { x: 0.5, y: 1.5, w: 6.5, h: 7.5, valign: "top" });
}

// --- Slides 5+6: Per Test Case ---
let pageNum = 5;
cases.forEach((tc) => {
  // Spec slide
  {
    const s = pres.addSlide();
    addChrome(s, "Section 2 — Test Case", pageNum);
    s.addText("2. Test Case", {
      x: 0.5, y: 0.8, w: 6.5, h: 0.5, fontSize: 22, bold: true,
      fontFace: "Calibri Light", color: "000000"
    });
    const stepsText = [
      `1. Configure POST request to ${tc.endpoint} with payload ${tc.payload}.`,
      `2. Send request to https://tom-demo-01.proen.app.ruk-com.cloud/unimicron-api${tc.endpoint}.`,
      `3. Verify HTTP 200, valid JSON response, and run ${tc.total} structural / value assertions.`
    ].join("\n");
    const expected = `HTTP 200 with a JSON object whose schema matches the ${tc.type} response. All ${tc.total} assertions pass without HTTP 500 errors.`;
    const statusColor = "2E7D32"; // all Pass

    const tableRows = [
      [{ text: "Test ID", options: { bold: true, fill: { color: "F2F2F2" }, fontFace: "Calibri", fontSize: 11 } },
       { text: tc.id, options: { fontFace: "Calibri", fontSize: 11, bold: true } }],
      [{ text: "Test Name", options: { bold: true, fill: { color: "F2F2F2" }, fontFace: "Calibri", fontSize: 11 } },
       { text: tc.name, options: { fontFace: "Calibri", fontSize: 11 } }],
      [{ text: "Test Step", options: { bold: true, fill: { color: "F2F2F2" }, fontFace: "Calibri", fontSize: 11, valign: "top" } },
       { text: stepsText, options: { fontFace: "Calibri", fontSize: 10, valign: "top" } }],
      [{ text: "Expected Result", options: { bold: true, fill: { color: "F2F2F2" }, fontFace: "Calibri", fontSize: 11 } },
       { text: expected, options: { fontFace: "Calibri", fontSize: 10 } }],
      [{ text: "Date", options: { bold: true, fill: { color: "F2F2F2" }, fontFace: "Calibri", fontSize: 11 } },
       { text: EXEC_DATE, options: { fontFace: "Calibri", fontSize: 11 } }],
      [{ text: "Status", options: { bold: true, fill: { color: "F2F2F2" }, fontFace: "Calibri", fontSize: 11 } },
       { text: "Pass", options: { fontFace: "Calibri", fontSize: 12, bold: true, color: statusColor } }]
    ];
    s.addTable(tableRows, {
      x: 0.5, y: 1.5, w: 6.5, colW: [1.6, 4.9],
      border: { type: "solid", color: "CCCCCC", pt: 0.5 },
      rowH: [0.4, 0.4, 1.9, 1.1, 0.4, 0.45]
    });
    pageNum++;
  }
  // Evidence slide
  {
    const s = pres.addSlide();
    addChrome(s, "Section 2 — Test Case", pageNum);
    s.addText(`2. Test Case (continued)  —  ${tc.id}`, {
      x: 0.5, y: 0.8, w: 6.5, h: 0.5, fontSize: 18, bold: true,
      fontFace: "Calibri Light", color: "000000"
    });
    s.addText("Actual Result", {
      x: 0.5, y: 1.5, w: 6.5, h: 0.4, fontSize: 13, bold: true,
      fontFace: "Calibri", color: "000000",
      fill: { color: "F2F2F2" }, line: { color: "CCCCCC", width: 0.5 }, margin: 6
    });
    // Evidence block 1: HTTP / response time / assertions
    const ev1 = [
      [{ text: "HTTP Response", options: { bold: true, fontFace: "Calibri", fontSize: 10, fill: { color: "FAFAFA" } } },
       { text: `${tc.http} OK`, options: { fontFace: "Calibri", fontSize: 10, bold: true, color: "2E7D32" } }],
      [{ text: "Response Time", options: { bold: true, fontFace: "Calibri", fontSize: 10, fill: { color: "FAFAFA" } } },
       { text: `${tc.ms} ms`, options: { fontFace: "Calibri", fontSize: 10 } }],
      [{ text: "Assertions Passed", options: { bold: true, fontFace: "Calibri", fontSize: 10, fill: { color: "FAFAFA" } } },
       { text: `${tc.pass} / ${tc.total}`, options: { fontFace: "Calibri", fontSize: 10, bold: true, color: "2E7D32" } }],
      [{ text: "Evidence Source", options: { bold: true, fontFace: "Calibri", fontSize: 10, fill: { color: "FAFAFA" } } },
       { text: "junit-2026-05-05T07-05-42.xml  ·  summary-2026-05-05T07-05-42.json", options: { fontFace: "Calibri", fontSize: 9 } }]
    ];
    s.addTable(ev1, {
      x: 0.5, y: 2.0, w: 6.5, colW: [1.8, 4.7],
      border: { type: "solid", color: "DDDDDD", pt: 0.5 },
      rowH: 0.4
    });
    s.addText("Caption: Newman run summary — HTTP status, response timing, and assertion totals captured from JUnit XML output of the v1.3 remote run.",
      { x: 0.5, y: 3.7, w: 6.5, h: 0.4, fontSize: 9, italic: true, fontFace: "Calibri", color: "404040" }
    );
    // Evidence block 2: response observation
    s.addText("Response Observation", {
      x: 0.5, y: 4.3, w: 6.5, h: 0.4, fontSize: 11, bold: true,
      fontFace: "Calibri", color: "000000",
      fill: { color: "F2F2F2" }, line: { color: "CCCCCC", width: 0.5 }, margin: 6
    });
    s.addText(tc.extra, {
      x: 0.5, y: 4.8, w: 6.5, h: 0.8, fontSize: 11, fontFace: "Calibri",
      color: "000000", line: { color: "DDDDDD", width: 0.5 }, margin: 8, valign: "top"
    });
    s.addText("Caption: Key structural observation verified by the assertion script for this test case.",
      { x: 0.5, y: 5.7, w: 6.5, h: 0.4, fontSize: 9, italic: true, fontFace: "Calibri", color: "404040" }
    );
    pageNum++;
  }
});

// --- Slide N+1: Schedule ---
{
  const s = pres.addSlide();
  addChrome(s, "Section 6", pageNum);
  s.addText("3. Schedule", {
    x: 0.5, y: 0.8, w: 6.5, h: 0.5, fontSize: 22, bold: true,
    fontFace: "Calibri Light", color: "000000"
  });
  const header = [
    { text: "Phase", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } },
    { text: "Day", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } },
    { text: "Activity", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } },
    { text: "Cases", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } },
    { text: "Owner", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } }
  ];
  const cell = (t) => ({ text: t, options: { fontFace: "Calibri", fontSize: 9, valign: "top" } });
  const rows = [
    header,
    [cell("Phase 1"), cell("Day 1\n(28 Apr 2026)"), cell("Baseline functional run on local development server (v1.0)"), cell("MS-F, MM-F, MD-F, RF (25)"), cell("Tester")],
    [cell("Phase 2"), cell("Day 2\n(30 Apr 2026)"), cell("Test script fix for MD-F-05 DataSelect; re-run after frontend team feedback (v1.1)"), cell("25"), cell("Tester")],
    [cell("Phase 3"), cell("Day 3\n(5 May 2026)"), cell("Re-run after local system update (v1.2)"), cell("25"), cell("Tester")],
    [cell("Phase 4"), cell("Day 4\n(5 May 2026)"), cell("Migrate environment to remote staging endpoint and full re-run (v1.3)"), cell("25"), cell("Tester")],
    [cell("Phase 5"), cell("Day 5"), cell("Report consolidation, defect closure verification, and deliverable handoff"), cell("—"), cell("Tester / Developer")]
  ];
  s.addTable(rows, {
    x: 0.4, y: 1.5, w: 6.7, colW: [0.9, 1.3, 2.3, 1.3, 0.9],
    border: { type: "solid", color: "CCCCCC", pt: 0.5 },
    rowH: [0.35, 0.7, 0.7, 0.55, 0.7, 0.7]
  });
  pageNum++;
}

// --- Slide N+2: Risks ---
{
  const s = pres.addSlide();
  addChrome(s, "Section 7", pageNum);
  s.addText("4. Risks and Contingencies", {
    x: 0.5, y: 0.8, w: 6.5, h: 0.5, fontSize: 22, bold: true,
    fontFace: "Calibri Light", color: "000000"
  });
  const hdr = [
    { text: "Risk", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } },
    { text: "Likelihood", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } },
    { text: "Impact", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } },
    { text: "Mitigation", options: { bold: true, fill: { color: "323232" }, color: "FFFFFF", fontFace: "Calibri", fontSize: 10 } }
  ];
  const cell = (t) => ({ text: t, options: { fontFace: "Calibri", fontSize: 9, valign: "top" } });
  const rows = [
    hdr,
    [cell("DEF-004 server-side fix unverified — Int32.Parse(DataSelect) at DataMeterDetailController.cs:288 may still crash if a piped DataSelect is sent."),
     cell("Low"), cell("Medium"),
     cell("Re-test MD-F-05 against the remote endpoint with the original \"year|year_start\" payload to confirm the server-side branch on Type before parsing.")],
    [cell("Local development server out of sync with remote — DEF-001/002/003 still observable on localhost:5000."),
     cell("Medium"), cell("Low"),
     cell("Sync the local container/database from the remote staging build to reproduce post-fix behavior locally before any future development.")],
    [cell("Remaining test scope (Validation, Cross-Endpoint, Load, DB Integration, System Failure) not yet executed — coverage gap for negative paths and resilience."),
     cell("Medium"), cell("Medium"),
     cell("Schedule Phase 6 to run the validation and cross-endpoint suites against the remote endpoint and the manual DB / failure cases with the operations team.")],
    [cell("Single environment validated — current evidence covers only the remote staging deployment; production parity is unverified."),
     cell("Low"), cell("Medium"),
     cell("Re-run the functional suite against the production environment as part of go-live acceptance.")]
  ];
  s.addTable(rows, {
    x: 0.4, y: 1.5, w: 6.7, colW: [3.0, 1.0, 0.9, 1.8],
    border: { type: "solid", color: "CCCCCC", pt: 0.5 },
    rowH: [0.35, 1.0, 0.9, 1.0, 0.9]
  });
  pageNum++;
}

// --- Save ---
pres.writeFile({ fileName: "Test report UMTH.pptx" }).then((fileName) => {
  console.log(`Generated: ${fileName}`);
  console.log(`Total slides: ${TOTAL}`);
  console.log(`Test cases: ${cases.length} (all Pass)`);
});
