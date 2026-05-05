'use strict';

const pptxgen = require('pptxgenjs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'test-results', 'functional-test-report.pptx');

// A4 Portrait: 8.27" × 11.69"
const W  = 8.27;
const H  = 11.69;
const MX = 0.5;          // left/right margin
const CW = W - MX * 2;  // content width = 7.27"

const HEADER_H   = 0.65;  // navy band height
const SUB_H      = 0.28;  // subtitle row height
const CTOP       = HEADER_H + SUB_H;  // content starts at 0.93"
const FOOTER_H   = 0.3;
const CBOT       = H - FOOTER_H;      // 11.39"
const CAVAIL     = CBOT - CTOP;       // 10.46" usable

// ── Colors (no # prefix) ────────────────────────────────────────────────
const C = {
  navy:      '1A2E5A',
  navyDark:  '0F1E3D',
  blue:      '2563EB',
  bgPage:    'F8FAFC',
  white:     'FFFFFF',
  text:      '1F2937',
  muted:     '6B7280',
  border:    'E5E7EB',
  altRow:    'F1F5FB',
  passText:  '166534',
  passBg:    'DCFCE7',
  partText:  '92400E',
  partBg:    'FEF3C7',
  failText:  '991B1B',
  failBg:    'FEE2E2',
  blueLight: 'EFF6FF',
  blueTxt:   '1E40AF',
  slate:     '94A3B8',
  ice:       'CADCFC',
};

const statusStyle = (s) => {
  if (s === 'PASS') return { fill: { color: C.passBg }, color: C.passText };
  if (s === 'FAIL') return { fill: { color: C.failBg }, color: C.failText };
  return { fill: { color: C.partBg }, color: C.partText };
};

// ── Presentation setup ───────────────────────────────────────────────────
const pres = new pptxgen();
pres.defineLayout({ name: 'A4P', width: W, height: H });
pres.layout = 'A4P';
pres.author = 'Tomas Tech Co., Ltd.';
pres.title  = 'รายงานผลการทดสอบ API — PJ250104';

// ── Shared decorations ───────────────────────────────────────────────────
function addHeader(slide, title, sub) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: HEADER_H,
    fill: { color: C.navy }, line: { color: C.navy },
  });
  slide.addText(title, {
    x: MX, y: 0, w: CW, h: HEADER_H,
    fontSize: 14, fontFace: 'Calibri', bold: true,
    color: C.white, valign: 'middle', margin: 0,
  });
  if (sub) {
    slide.addText(sub, {
      x: MX, y: HEADER_H, w: CW, h: SUB_H,
      fontSize: 8, fontFace: 'Calibri', color: C.muted, valign: 'middle', margin: 0,
    });
  }
}

function addFooter(slide, pg) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H - FOOTER_H, w: W, h: FOOTER_H,
    fill: { color: C.navy }, line: { color: C.navy },
  });
  slide.addText(
    'Tomas Tech Co., Ltd.  ·  PJ250104  ·  Unimicron (Thailand) Co., Ltd.  ·  28 เมษายน 2569',
    {
      x: MX, y: H - FOOTER_H, w: CW - 0.35, h: FOOTER_H,
      fontSize: 6.5, fontFace: 'Calibri', color: C.white, valign: 'middle', margin: 0,
    }
  );
  if (pg) {
    slide.addText(String(pg), {
      x: W - MX - 0.25, y: H - FOOTER_H, w: 0.25, h: FOOTER_H,
      fontSize: 7, fontFace: 'Calibri', color: C.white,
      align: 'right', valign: 'middle', margin: 0,
    });
  }
}

function sectionHead(slide, text, y) {
  slide.addText(text, {
    x: MX, y, w: CW, h: 0.26,
    fontSize: 10, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  return y + 0.28;
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ════════════════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.navyDark };

  // Top accent bar
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.12, fill: { color: C.blue }, line: { color: C.blue },
  });
  // Left accent bar
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: H, fill: { color: C.blue }, line: { color: C.blue },
  });

  // Logo circle
  sl.addShape(pres.shapes.OVAL, {
    x: W / 2 - 0.65, y: 1.8, w: 1.3, h: 1.3,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  sl.addText('TT', {
    x: W / 2 - 0.65, y: 1.8, w: 1.3, h: 1.3,
    fontSize: 30, fontFace: 'Calibri', bold: true,
    color: C.white, align: 'center', valign: 'middle', margin: 0,
  });

  // "TEST REPORT" pill
  sl.addShape(pres.shapes.RECTANGLE, {
    x: W / 2 - 1.0, y: 3.4, w: 2.0, h: 0.3,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  sl.addText('TEST REPORT', {
    x: W / 2 - 1.0, y: 3.4, w: 2.0, h: 0.3,
    fontSize: 9, fontFace: 'Calibri', bold: true, charSpacing: 4,
    color: C.white, align: 'center', valign: 'middle', margin: 0,
  });

  // Title
  sl.addText('รายงานผลการทดสอบ API', {
    x: 0.3, y: 4.0, w: W - 0.6, h: 0.9,
    fontSize: 28, fontFace: 'Calibri', bold: true,
    color: C.white, align: 'center', valign: 'middle', margin: 0,
  });

  // Subtitle
  sl.addText('UMTH Flow meter Visualization API', {
    x: 0.3, y: 4.9, w: W - 0.6, h: 0.42,
    fontSize: 14, fontFace: 'Calibri',
    color: C.ice, align: 'center', valign: 'middle', margin: 0,
  });

  // Divider
  sl.addShape(pres.shapes.LINE, {
    x: MX, y: 5.55, w: CW, h: 0,
    line: { color: C.blue, width: 1.5 },
  });

  // Info block
  const info = [
    ['โครงการ',         'PJ250104'],
    ['ลูกค้า',          'Unimicron (Thailand) Co., Ltd.'],
    ['จัดทำโดย',        'Tomas Tech Co., Ltd.'],
    ['วันที่รายงาน',    '5 พฤษภาคม 2569'],
    ['ชุดทดสอบ',        'Functional — MS-F · MM-F · MD-F · RF'],
    ['เวอร์ชันเอกสาร', '1.2'],
  ];
  let iy = 5.75;
  for (const [lbl, val] of info) {
    sl.addText([
      { text: `${lbl}:  `, options: { color: C.slate, bold: false } },
      { text: val,         options: { color: C.white, bold: true  } },
    ], {
      x: MX + 0.6, y: iy, w: CW - 0.6, h: 0.33,
      fontSize: 10.5, fontFace: 'Calibri', valign: 'middle', margin: 0,
    });
    iy += 0.33;
  }

  // Bottom bar
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H - 0.35, w: W, h: 0.35,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  sl.addText('ลับเฉพาะ  ·  Confidential', {
    x: 0, y: H - 0.35, w: W, h: 0.35,
    fontSize: 8, fontFace: 'Calibri', color: C.white,
    align: 'center', valign: 'middle', margin: 0,
  });
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 2 — EXECUTIVE SUMMARY
// ════════════════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.bgPage };
  addHeader(sl, '1. สรุปผลการทดสอบ', 'Functional Test Suite — รันเมื่อ 5 พฤษภาคม 2569 เวลา 04:24 UTC');
  addFooter(sl, 2);

  let y = CTOP + 0.08;

  // Overall status banner
  sl.addShape(pres.shapes.RECTANGLE, {
    x: MX, y, w: CW, h: 0.52,
    fill: { color: C.passBg }, line: { color: '86EFAC', width: 1 },
  });
  sl.addText(
    '✅  สถานะโดยรวม: PASS  —  ผ่านทุก 209 assertions  —  ข้อบกพร่อง 4 รายการได้รับการแก้ไขแล้วในเวอร์ชัน v1.2',
    {
      x: MX + 0.12, y, w: CW - 0.24, h: 0.52,
      fontSize: 10, fontFace: 'Calibri', bold: true, color: C.passText,
      align: 'center', valign: 'middle', margin: 0,
    }
  );
  y += 0.60;

  // Stat cards — 3 per row × 2 rows
  const CARD_W = (CW - 0.24) / 3;
  const CARD_H = 1.08;
  const GAP    = 0.12;

  const stats = [
    { lbl: 'Requests ที่รัน',      val: '25',   sub: 'requests',    bg: C.blueLight, tc: C.blueTxt },
    { lbl: 'Assertions ทั้งหมด',   val: '209',  sub: 'assertions',  bg: C.blueLight, tc: C.blueTxt },
    { lbl: 'Assertions ผ่าน',      val: '209',  sub: '100%',        bg: C.passBg,    tc: C.passText },
    { lbl: 'Assertions ล้มเหลว',   val: '0',    sub: '0%',          bg: C.passBg,    tc: C.passText },
    { lbl: 'เทสเคสผ่านทั้งหมด',   val: '25',   sub: 'จาก 25',      bg: C.passBg,    tc: C.passText },
    { lbl: 'HTTP 500 Error',       val: '0',    sub: 'กรณี',        bg: C.passBg,    tc: C.passText },
  ];

  for (let i = 0; i < stats.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx  = MX + col * (CARD_W + GAP);
    const cy  = y  + row * (CARD_H + GAP);
    const s   = stats[i];

    sl.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: CARD_W, h: CARD_H,
      fill: { color: s.bg },
      line: { color: C.border, width: 0.75 },
      shadow: { type: 'outer', blur: 4, offset: 2, angle: 135, color: '000000', opacity: 0.06 },
    });
    sl.addText(s.val, {
      x: cx, y: cy + 0.1, w: CARD_W, h: 0.55,
      fontSize: 34, fontFace: 'Calibri', bold: true,
      color: s.tc, align: 'center', valign: 'middle', margin: 0,
    });
    sl.addText(s.sub, {
      x: cx, y: cy + 0.64, w: CARD_W, h: 0.2,
      fontSize: 9, fontFace: 'Calibri', color: s.tc,
      align: 'center', valign: 'top', margin: 0,
    });
    sl.addText(s.lbl, {
      x: cx, y: cy + 0.83, w: CARD_W, h: 0.2,
      fontSize: 8, fontFace: 'Calibri', bold: true, color: C.muted,
      align: 'center', valign: 'top', margin: 0,
    });
  }
  y += 2 * (CARD_H + GAP) + 0.1;

  // Group summary table
  y = sectionHead(sl, 'ผลสรุปแยกตามกลุ่มทดสอบ', y);

  // colW must sum to CW = 7.27
  // [3.0, 0.65, 0.62, 0.62, 0.63, 0.75] = 6.27 — need 7.27, diff 1.0 → group col = 4.0
  const grpColW = [3.55, 0.62, 0.62, 0.62, 0.62, 0.74]; // sum = 6.77... still short
  // Let me be exact: 3.55+0.62+0.62+0.62+0.62+0.74 = 6.77, need 7.27 → diff 0.5 → group = 4.05
  // 4.05+0.62+0.62+0.62+0.62+0.72 = 7.25 ≈ 7.27 — close enough, pptxgenjs stretches
  // Actually let me just use [3.6, 0.62, 0.6, 0.62, 0.62, 0.71] = 6.77... ugh
  // Simplest: [4.0, 0.6, 0.57, 0.57, 0.57, 0.96] = 7.27 exactly
  const gColW = [4.0, 0.6, 0.57, 0.57, 0.57, 0.96];

  const grpHdr = ['กลุ่มทดสอบ', 'เทสเคส', 'ผ่าน', 'บางส่วน', 'ล้มเหลว', 'สถานะ'];
  const grpData = [
    ['MS-F — GetDataMeterSum Functional',      '5',  '5',  '0', '0', 'PASS'],
    ['MM-F — GetDataMultimeter Functional',     '5',  '5',  '0', '0', 'PASS'],
    ['MD-F — GetDataMeterDetail Functional',    '5',  '5',  '0', '0', 'PASS'],
    ['RF — Response Structure & Integrity',     '10', '10', '0', '0', 'PASS'],
    ['รวมทั้งหมด',                              '25', '25', '0', '0', 'PASS'],
  ];

  const grpRows = [
    grpHdr.map((h) => ({
      text: h,
      options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' },
    })),
    ...grpData.map((row, ri) => {
      const isTotal = ri === grpData.length - 1;
      const ss = statusStyle(row[5]);
      return row.map((cell, ci) => {
        const rowBg = isTotal ? 'E8EDF5' : ri % 2 === 0 ? C.altRow : C.white;
        if (ci === 5) {
          return { text: cell, options: { fill: ss.fill, color: ss.color, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } };
        }
        return {
          text: cell,
          options: {
            fill: { color: rowBg }, color: ci === 0 ? C.text : (ci >= 2 && ci <= 4 ? (ci === 2 ? C.passText : ci === 4 ? C.failText : C.text) : C.text),
            bold: isTotal || ci === 0,
            fontSize: 8, fontFace: 'Calibri', align: ci === 0 ? 'left' : 'center',
          },
        };
      });
    }),
  ];

  sl.addTable(grpRows, {
    x: MX, y, w: CW, colW: gColW,
    border: { pt: 0.5, color: C.border }, rowH: 0.3,
  });
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 3 — TEST ENVIRONMENT
// ════════════════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.bgPage };
  addHeader(sl, '2. สภาพแวดล้อมการทดสอบ', 'Test Environment');
  addFooter(sl, 3);

  let y = CTOP + 0.1;

  // colW: [2.4, 4.87] = 7.27
  const envColW = [2.4, 4.87];

  const envData = [
    ['รายการ',                'ค่า'],
    ['API Base URL',           'https://tom-demo-01.proen.app.ruk-com.cloud/unimicron-api'],
    ['WebSocket URL',          'ws://localhost:9001/ws/'],
    ['Meter ID ที่ทดสอบ',      '1, 2, 3'],
    ['Meter ID ที่ไม่มีในระบบ', '9999'],
    ['เดือนทดสอบ (Month)',     '06 — มิถุนายน 2025'],
    ['ปีทดสอบ (Year)',          '2025'],
    ['ช่วงสัปดาห์ (Week 1)',   '2025-06-02 || 2025-06-08'],
    ['ช่วงสัปดาห์ (Week 2)',   '2025-06-09 || 2025-06-15'],
    ['เครื่องมืออัตโนมัติ',   'Newman 6.2.1 + newman-reporter-htmlextra'],
    ['Postman Collection',     'unimicron-api.postman_collection.json'],
    ['Environment File',       'postman-environment.json'],
    ['วันที่รันทดสอบ',         '5 พฤษภาคม 2569 เวลา 04:24 UTC'],
    ['ผู้ทดสอบ',               'Tomas Tech Co., Ltd.'],
  ];

  const envRows = envData.map((row, ri) => {
    const isHdr = ri === 0;
    return [
      {
        text: row[0],
        options: {
          fill: { color: isHdr ? C.navyDark : ri % 2 === 0 ? C.altRow : C.white },
          color: isHdr ? C.white : C.navy,
          bold: true, fontSize: 9, fontFace: 'Calibri', align: 'left',
        },
      },
      {
        text: row[1],
        options: {
          fill: { color: isHdr ? C.navyDark : ri % 2 === 0 ? C.altRow : C.white },
          color: isHdr ? C.white : C.text,
          bold: isHdr, fontSize: 9, fontFace: isHdr ? 'Calibri' : 'Consolas', align: 'left',
        },
      },
    ];
  });

  sl.addTable(envRows, {
    x: MX, y, w: CW, colW: envColW,
    border: { pt: 0.5, color: C.border }, rowH: 0.31,
  });
}

// ════════════════════════════════════════════════════════════════════════
// Helper — group result page
// ════════════════════════════════════════════════════════════════════════
function addGroupSlide(pageNum, headerTitle, headerSub, groupNote, cases, failures) {
  const sl = pres.addSlide();
  sl.background = { color: C.bgPage };
  addHeader(sl, headerTitle, headerSub);
  addFooter(sl, pageNum);

  let y = CTOP + 0.08;

  // ── Results table ──────────────────────────────────────────────────────
  y = sectionHead(sl, 'ผลการทดสอบ', y);

  // colW: [0.82, 3.65, 0.56, 0.48, 0.48, 0.72] = 6.71 — diff 0.56 → desc = 4.21
  // Let me compute: 0.82+4.21+0.56+0.48+0.48+0.72 = 7.27 ✓
  const caseColW = [0.82, 4.21, 0.56, 0.48, 0.48, 0.72];

  const caseHdr = [
    { text: 'Test ID',    options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
    { text: 'รายละเอียด', options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
    { text: 'HTTP',       options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
    { text: 'ผ่าน',      options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
    { text: 'ล้มเหลว',   options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
    { text: 'สถานะ',     options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
  ];

  const caseRows = [
    caseHdr,
    ...cases.map((c, ri) => {
      const ss = statusStyle(c.status);
      const rowBg = ri % 2 === 0 ? C.altRow : C.white;
      return [
        { text: c.id,     options: { fill: { color: rowBg }, color: C.navy,    bold: true,        fontSize: 8, fontFace: 'Calibri', align: 'center' } },
        { text: c.desc,   options: { fill: { color: rowBg }, color: C.text,    bold: false,       fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
        { text: String(c.http), options: { fill: { color: rowBg }, color: c.http >= 200 && c.http < 300 ? C.passText : C.failText, bold: false, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
        { text: String(c.pass), options: { fill: { color: rowBg }, color: C.passText, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
        { text: String(c.fail), options: { fill: { color: rowBg }, color: c.fail > 0 ? C.failText : C.muted, bold: c.fail > 0, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
        { text: c.status, options: { fill: ss.fill, color: ss.color, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
      ];
    }),
  ];

  sl.addTable(caseRows, {
    x: MX, y, w: CW, colW: caseColW,
    border: { pt: 0.5, color: C.border }, rowH: 0.3,
  });
  y += (cases.length + 1) * 0.3 + 0.06;

  // Group note
  if (groupNote) {
    sl.addText(groupNote, {
      x: MX, y, w: CW, h: 0.24,
      fontSize: 8.5, fontFace: 'Calibri', italic: true, color: C.muted, margin: 0,
    });
    y += 0.28;
  }

  // ── Failures table ─────────────────────────────────────────────────────
  if (failures && failures.length > 0) {
    y = sectionHead(sl, 'Assertion ที่ล้มเหลว', y);

    // colW: [0.82, 2.35, 2.05, 2.05] = 7.27 ✓
    const failColW = [0.82, 2.35, 2.05, 2.05];

    const failHdr = [
      { text: 'Test ID',         options: { fill: { color: C.failText }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
      { text: 'Assertion',       options: { fill: { color: C.failText }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
      { text: 'คาดหวัง',        options: { fill: { color: C.failText }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
      { text: 'ที่ได้รับจริง',  options: { fill: { color: C.failText }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
    ];

    const failRows = [
      failHdr,
      ...failures.map((f, ri) => {
        const rowBg = ri % 2 === 0 ? 'FFF5F5' : C.white;
        return [
          { text: f.id,        options: { fill: { color: rowBg }, color: C.failText,  bold: true,  fontSize: 7.5, fontFace: 'Calibri',  align: 'center' } },
          { text: f.assertion, options: { fill: { color: rowBg }, color: C.text,       bold: false, fontSize: 7.5, fontFace: 'Calibri',  align: 'left'   } },
          { text: f.expected,  options: { fill: { color: rowBg }, color: C.passText,   bold: false, fontSize: 7.5, fontFace: 'Consolas', align: 'left'   } },
          { text: f.actual,    options: { fill: { color: rowBg }, color: C.failText,   bold: false, fontSize: 7.5, fontFace: 'Consolas', align: 'left'   } },
        ];
      }),
    ];

    sl.addTable(failRows, {
      x: MX, y, w: CW, colW: failColW,
      border: { pt: 0.5, color: 'FCA5A5' }, rowH: 0.3,
    });
  }
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 4 — MS-F
// ════════════════════════════════════════════════════════════════════════
addGroupSlide(
  4,
  '3. POST /GetDataMeterSum — Functional (MS-F)',
  'Happy Path — Type: Day, Week, Month, Year, Max10Year  |  ผลกลุ่ม: 5 / 5 เทสเคสผ่าน',
  'ทุกเทสเคสผ่านสมบูรณ์ — DEF-001 และ DEF-002 ได้รับการแก้ไขแล้วในเวอร์ชัน v1.2',
  [
    { id: 'MS-F-01', desc: 'Day comparison by selected days',         http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'MS-F-02', desc: 'Week comparison by selected week ranges', http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MS-F-03', desc: 'Month comparison by selected months',     http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MS-F-04', desc: 'Year comparison by selected years',       http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MS-F-05', desc: 'Max10Year comparison across ten years',   http: 200, pass: 8, fail: 0, status: 'PASS' },
  ],
  []
);

// ════════════════════════════════════════════════════════════════════════
// PAGE 5 — MM-F
// ════════════════════════════════════════════════════════════════════════
addGroupSlide(
  5,
  '4. POST /GetDataMultimeter — Functional (MM-F)',
  'Happy Path — Type: Day, Week, Month, Year, Max10Year  |  ผลกลุ่ม: 5 / 5 เทสเคสผ่าน',
  'ทุกเทสเคสผ่านสมบูรณ์ — DEF-001 ได้รับการแก้ไขแล้วในเวอร์ชัน v1.2',
  [
    { id: 'MM-F-01', desc: 'Day data for multiple meters',      http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'MM-F-02', desc: 'Week data for multiple meters',     http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MM-F-03', desc: 'Month data for multiple meters',    http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MM-F-04', desc: 'Year data for multiple meters',     http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MM-F-05', desc: 'Max10Year data for multiple meters',http: 200, pass: 8, fail: 0, status: 'PASS' },
  ],
  []
);

// ════════════════════════════════════════════════════════════════════════
// PAGE 6 — MD-F
// ════════════════════════════════════════════════════════════════════════
addGroupSlide(
  6,
  '5. POST /GetDataMeterDetail — Functional (MD-F)',
  'Happy Path — Type: Day, Week, Month, Year, Max10Year  |  ผลกลุ่ม: 5 / 5 เทสเคสผ่าน',
  'ทุกเทสเคสผ่านสมบูรณ์ — DEF-001, DEF-003, และ DEF-004 ได้รับการแก้ไขแล้วในเวอร์ชัน v1.2 (HTTP 500 บน Max10Year หายแล้ว)',
  [
    { id: 'MD-F-01', desc: 'Day detail chart',       http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'MD-F-02', desc: 'Week detail chart',      http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MD-F-03', desc: 'Month detail chart',     http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MD-F-04', desc: 'Year detail chart',      http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'MD-F-05', desc: 'Max10Year detail chart', http: 200, pass: 8, fail: 0, status: 'PASS' },
  ],
  []
);

// ════════════════════════════════════════════════════════════════════════
// PAGE 7 — RF
// ════════════════════════════════════════════════════════════════════════
addGroupSlide(
  7,
  '6. Response Structure & Field Integrity (RF)',
  'ตรวจสอบโครงสร้าง Response และความถูกต้องของ Field  |  ผลกลุ่ม: 10 / 10 เทสเคสผ่าน',
  'ทุกเทสเคสผ่านสมบูรณ์ — DEF-001, DEF-002, และ DEF-003 ได้รับการแก้ไขแล้วในเวอร์ชัน v1.2',
  [
    { id: 'RF-01',  desc: 'MeterSum Day keys เป็น time string',          http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'RF-02',  desc: 'Multimeter Day keys เป็น meter ID',           http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'RF-03',  desc: 'MeterSum max values ครอบคลุม Month data',     http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'RF-04',  desc: 'Multimeter max values ครอบคลุม Month data',   http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'RF-05',  desc: 'MeterDetail ChartSeries object structure',     http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'RF-06',  desc: 'MeterDetail MeterLabelMap selected IDs',       http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'RF-07',  desc: 'MeterDetail ArrStrokeChart length consistency', http: 200, pass: 8, fail: 0, status: 'PASS' },
    { id: 'RF-08a', desc: 'MeterSum Day categories — Interval=5 min',    http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'RF-08b', desc: 'MeterSum Day categories — Interval=15 min',   http: 200, pass: 9, fail: 0, status: 'PASS' },
    { id: 'RF-08c', desc: 'MeterSum Day categories — Interval=60 min',   http: 200, pass: 9, fail: 0, status: 'PASS' },
  ],
  []
);

// ════════════════════════════════════════════════════════════════════════
// Helper — defect card
// ════════════════════════════════════════════════════════════════════════
function defectCard(sl, def, x, y, w, h) {
  const isHigh = def.severity === 'High';
  const isCrit = def.priority === 'Critical';
  const accentColor  = isHigh ? C.failText : C.partText;
  const sevBg        = isHigh ? C.failBg   : C.partBg;
  const sevTc        = isHigh ? C.failText : C.partText;
  const priBg        = isCrit ? C.failBg   : C.partBg;
  const priTc        = isCrit ? C.failText : C.partText;

  // Card bg
  sl.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: C.border, width: 0.75 },
    shadow: { type: 'outer', blur: 5, offset: 2, angle: 135, color: '000000', opacity: 0.07 },
  });
  // Left accent stripe
  sl.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.1, h,
    fill: { color: accentColor }, line: { color: accentColor },
  });

  const px = x + 0.18;
  const pw = w - 0.22;

  // DEF ID + Title
  sl.addText([
    { text: `${def.id}   `, options: { bold: true, color: C.navy, fontSize: 12 } },
    { text: def.title,       options: { bold: false, color: C.text, fontSize: 10.5 } },
  ], { x: px, y: y + 0.1, w: pw, h: 0.32, fontFace: 'Calibri', margin: 0 });

  // Badges
  const bby = y + 0.44;
  sl.addShape(pres.shapes.RECTANGLE, { x: px,        y: bby, w: 1.05, h: 0.22, fill: { color: sevBg }, line: { color: sevBg } });
  sl.addText(`Severity: ${def.severity}`, { x: px, y: bby, w: 1.05, h: 0.22, fontSize: 7.5, fontFace: 'Calibri', bold: true, color: sevTc, align: 'center', valign: 'middle', margin: 0 });

  sl.addShape(pres.shapes.RECTANGLE, { x: px + 1.12, y: bby, w: 1.0,  h: 0.22, fill: { color: priBg }, line: { color: priBg } });
  sl.addText(`Priority: ${def.priority}`, { x: px + 1.12, y: bby, w: 1.0, h: 0.22, fontSize: 7.5, fontFace: 'Calibri', bold: true, color: priTc, align: 'center', valign: 'middle', margin: 0 });

  // Endpoint
  sl.addText(`Endpoint: ${def.endpoint}`, {
    x: px, y: y + 0.69, w: pw, h: 0.2,
    fontSize: 7.5, fontFace: 'Calibri', color: C.muted, margin: 0,
  });

  // Affected cases
  sl.addText(`กรณีที่ได้รับผล: ${def.cases}`, {
    x: px, y: y + 0.88, w: pw, h: 0.2,
    fontSize: 7.5, fontFace: 'Calibri', bold: true, color: C.failText, margin: 0,
  });

  // Description
  sl.addText(def.desc, {
    x: px, y: y + 1.1, w: pw, h: h - 1.25,
    fontSize: 8.5, fontFace: 'Calibri', color: C.text, valign: 'top', margin: 0,
  });
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 8 — DEFECT REGISTER (DEF-001, DEF-002)
// ════════════════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.bgPage };
  addHeader(sl, '7. ทะเบียนข้อบกพร่อง (Defect Register)', 'DEF-001 และ DEF-002');
  addFooter(sl, 8);

  const CARD_H = (CAVAIL - 0.2) / 2;

  defectCard(sl, {
    id: 'DEF-001', severity: 'Medium', priority: 'High',
    title: '✅ RESOLVED v1.2 — ArrCategories Count ไม่ถูกต้องสำหรับ Type=Day',
    endpoint: '/GetDataMeterSum · /GetDataMultimeter · /GetDataMeterDetail',
    cases: 'MS-F-01, MM-F-01, MD-F-01, RF-01, RF-02, RF-05, RF-08a, RF-08b (8 กรณี)',
    desc:
      'เมื่อ Type=Day — API ส่งคืนจำนวน time-slot categories น้อยกว่าที่ Specification กำหนด\n' +
      '\nInterval=15 min : คาดหวัง 96 รายการ (24h × 4)  →  ได้รับจริง 93 รายการ' +
      '\nInterval=5 min  : คาดหวัง 288 รายการ (24h × 12) →  ได้รับจริง 277 รายการ' +
      '\n\n✅ การแก้ไข (v1.2): ปรับ GenerateTimeCategories() ให้สร้าง full-day grid 24 ชั่วโมง โดยใช้ count = 1440 / interval — ตอนนี้ Interval=15 ได้ 96, Interval=5 ได้ 288, Interval=60 ได้ 24 ตามที่ Specification กำหนด',
  }, MX, CTOP + 0.05, CW, CARD_H);

  defectCard(sl, {
    id: 'DEF-002', severity: 'High', priority: 'Critical',
    title: '✅ RESOLVED v1.2 — Dictionary Keys ใช้ Numeric Index แทน DataSelect Values',
    endpoint: '/GetDataMeterSum',
    cases: 'MS-F-02, MS-F-03, MS-F-04, MS-F-05, RF-03 (5 กรณี)',
    desc:
      'สำหรับ Type=Week, Month, Year, Max10Year — key ใน ArrDataTarget และ ArrDataActual เป็น index ตัวเลข แทนที่จะเป็น DataSelect string' +
      '\n\nตัวอย่าง: POST /GetDataMeterSum Type=Month DataSelect=["04","05","06"]' +
      '\nคาดหวัง key: "04", "05", "06"' +
      '\nได้รับจริง: "0", "1", "2"' +
      '\n\n✅ การแก้ไข (v1.2): เปลี่ยน arrDataTarget[r.ToString()] เป็น arrDataTarget[request.DataSelect[r]] สำหรับ Month/Year — และใช้ year string เป็น key สำหรับ Max10Year — ตอนนี้ key match กับ DataSelect input ที่ส่งมาทุก type',
  }, MX, CTOP + 0.05 + CARD_H + 0.1, CW, CARD_H);
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 9 — DEFECT REGISTER (DEF-003, DEF-004)
// ════════════════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.bgPage };
  addHeader(sl, '7. ทะเบียนข้อบกพร่อง (Defect Register)', 'DEF-003 และ DEF-004');
  addFooter(sl, 9);

  const CARD_H = (CAVAIL - 0.2) / 2;

  defectCard(sl, {
    id: 'DEF-003', severity: 'Medium', priority: 'High',
    title: '✅ RESOLVED v1.2 — MeterLabelMap ID Field ไม่สามารถระบุได้',
    endpoint: '/GetDataMeterDetail',
    cases: 'MD-F-01, MD-F-02, MD-F-03, MD-F-04, RF-05, RF-06, RF-07 (7 กรณี)',
    desc:
      'Script ทดสอบ lookup meter identifier จาก MeterLabelMap ด้วยชื่อ field: id, Id, Meter, meter — ไม่พบ field เหล่านี้ทั้งหมด ทำให้ lookup คืนค่า undefined' +
      '\n\nตัวอย่าง: POST /GetDataMeterDetail Type=Month Meter=[1,2]' +
      '\nคาดหวัง: MeterLabelMap แต่ละรายการมี field id ที่ match กับ Meter ที่ร้องขอ' +
      '\nได้รับจริง: ["undefined", "undefined"] — ไม่พบ field ชื่อดังกล่าว' +
      '\n\n✅ การแก้ไข (v1.2): เปลี่ยน MeterLabelMap จาก List<Dictionary<string,string>> เป็น List<MeterLabel> — แต่ละ object มี field id และ label ตามที่ Specification กำหนด — เพิ่ม meterLabelMap.Add() ใน Week และ Max10Year case ที่ขาดด้วย',
  }, MX, CTOP + 0.05, CW, CARD_H);

  defectCard(sl, {
    id: 'DEF-004', severity: 'High', priority: 'Critical',
    title: '✅ RESOLVED v1.2 — HTTP 500 บน /GetDataMeterDetail ด้วย type=Max10Year',
    endpoint: '/GetDataMeterDetail',
    cases: 'MD-F-05 (1 กรณี)',
    desc:
      'เมื่อส่ง type=Max10Year ไปยัง /GetDataMeterDetail — Server ตอบกลับ HTTP 500 Internal Server Error โดยไม่มี response body นี่คือสภาวะ server crash สำหรับ input combination นี้' +
      '\n\nขั้นตอนการทำซ้ำ:' +
      '\n  POST /GetDataMeterDetail' +
      '\n  Body: { "type": "Max10Year", "Meter": [1], "DataSelect": "2025|2016", "interval": 0 }' +
      '\n\nคาดหวัง: HTTP 200 พร้อม chart series response' +
      '\nได้รับจริง: HTTP 500 Internal Server Error' +
      '\n\n✅ การแก้ไข (v1.2): handle DataSelect format "year|year" โดย split + TryParse เพื่อหลีกเลี่ยง Int32.Parse FormatException — Multimeter normalize min/max year — ตอนนี้ Max10Year ตอบ HTTP 200 ทุกกรณี',
  }, MX, CTOP + 0.05 + CARD_H + 0.1, CW, CARD_H);
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 10 — COMPLETION MATRIX
// ════════════════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.bgPage };
  addHeader(sl, '8. ตารางสรุปผลการทดสอบ (Completion Matrix)', 'สถานะทุกเทสเคสที่รันในชุด Functional');
  addFooter(sl, 10);

  const matrix = [
    ['MS-F-01', 'PASS', '—'],
    ['MS-F-02', 'PASS', '—'],
    ['MS-F-03', 'PASS', '—'],
    ['MS-F-04', 'PASS', '—'],
    ['MS-F-05', 'PASS', '—'],
    ['MM-F-01', 'PASS', '—'],
    ['MM-F-02', 'PASS', '—'],
    ['MM-F-03', 'PASS', '—'],
    ['MM-F-04', 'PASS', '—'],
    ['MM-F-05', 'PASS', '—'],
    ['MD-F-01', 'PASS', '—'],
    ['MD-F-02', 'PASS', '—'],
    ['MD-F-03', 'PASS', '—'],
    ['MD-F-04', 'PASS', '—'],
    ['MD-F-05', 'PASS', '—'],
    ['RF-01',   'PASS', '—'],
    ['RF-02',   'PASS', '—'],
    ['RF-03',   'PASS', '—'],
    ['RF-04',   'PASS', '—'],
    ['RF-05',   'PASS', '—'],
    ['RF-06',   'PASS', '—'],
    ['RF-07',   'PASS', '—'],
    ['RF-08a',  'PASS', '—'],
    ['RF-08b',  'PASS', '—'],
    ['RF-08c',  'PASS', '—'],
  ];

  // Split into 2 columns of 13 rows each (header + 12 / header + 13)
  // CW=7.27, 2 cols with 0.12 gap → each col = (7.27-0.12)/2 = 3.575"
  const COL_W = (CW - 0.12) / 2;  // 3.575"
  // colW per sub-table: [0.85, 0.95, 1.775] = 3.575 ✓
  const subColW = [0.85, 0.95, 1.775];

  const hdrRow = (fill) => [
    { text: 'Test ID', options: { fill: { color: fill }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
    { text: 'สถานะ',   options: { fill: { color: fill }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
    { text: 'Defect',  options: { fill: { color: fill }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
  ];

  const buildMatrixRows = (rows) => [
    hdrRow(C.navyDark),
    ...rows.map((row, ri) => {
      const ss = statusStyle(row[1]);
      const rowBg = ri % 2 === 0 ? C.altRow : C.white;
      return [
        { text: row[0], options: { fill: { color: rowBg }, color: C.navy,     bold: true,  fontSize: 8, fontFace: 'Calibri', align: 'center' } },
        { text: row[1], options: { fill: ss.fill,          color: ss.color,   bold: true,  fontSize: 8, fontFace: 'Calibri', align: 'center' } },
        { text: row[2], options: { fill: { color: rowBg }, color: row[2] === '—' ? C.muted : C.failText, bold: false, fontSize: 7.5, fontFace: 'Calibri', align: 'center' } },
      ];
    }),
  ];

  const half = Math.ceil(matrix.length / 2);
  const leftData  = matrix.slice(0, half);
  const rightData = matrix.slice(half);

  sl.addTable(buildMatrixRows(leftData), {
    x: MX, y: CTOP + 0.08, w: COL_W, colW: subColW,
    border: { pt: 0.5, color: C.border }, rowH: 0.3,
  });
  sl.addTable(buildMatrixRows(rightData), {
    x: MX + COL_W + 0.12, y: CTOP + 0.08, w: COL_W, colW: subColW,
    border: { pt: 0.5, color: C.border }, rowH: 0.3,
  });

  // Summary stat bar
  const passCount    = matrix.filter((r) => r[1] === 'PASS').length;
  const partialCount = matrix.filter((r) => r[1] === 'PARTIAL').length;
  const failCount    = matrix.filter((r) => r[1] === 'FAIL').length;
  const barY = CTOP + 0.08 + (Math.max(leftData.length, rightData.length) + 1) * 0.3 + 0.2;

  const statItems = [
    { label: `PASS   ${passCount} กรณี`,    bg: C.passBg, tc: C.passText },
    { label: `PARTIAL  ${partialCount} กรณี`, bg: C.partBg, tc: C.partText },
    { label: `FAIL   ${failCount} กรณี`,    bg: C.failBg, tc: C.failText },
  ];
  const barW = (CW - 0.24) / 3;
  statItems.forEach((st, i) => {
    const bx = MX + i * (barW + 0.12);
    sl.addShape(pres.shapes.RECTANGLE, { x: bx, y: barY, w: barW, h: 0.38, fill: { color: st.bg }, line: { color: C.border, width: 0.5 } });
    sl.addText(st.label, { x: bx, y: barY, w: barW, h: 0.38, fontSize: 10, fontFace: 'Calibri', bold: true, color: st.tc, align: 'center', valign: 'middle', margin: 0 });
  });
}

// ════════════════════════════════════════════════════════════════════════
// PAGE 11 — RECOMMENDATIONS + REMAINING SCOPE
// ════════════════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.bgPage };
  addHeader(sl, '9. ข้อเสนอแนะและขอบเขตที่เหลือ', 'Recommendations & Remaining Test Scope');
  addFooter(sl, 11);

  let y = CTOP + 0.08;

  // Recommendations
  y = sectionHead(sl, 'ข้อเสนอแนะ (Recommendations)', y);

  // colW: [0.9, 4.75, 1.62] = 7.27 ✓
  const recColW = [0.9, 4.75, 1.62];
  const recData = [
    { pri: 'Resolved', action: 'แก้ไข HTTP 500 บน /GetDataMeterDetail ด้วย type=Max10Year — เพิ่ม TryParse + Split("|") handle multi-year DataSelect format', def: 'DEF-004' },
    { pri: 'Resolved', action: 'แก้ไข Dictionary Key ใน ArrDataTarget/ArrDataActual ให้ใช้ DataSelect string เป็น key แทน array index (0,1,2)', def: 'DEF-002' },
    { pri: 'Resolved', action: 'เปลี่ยน MeterLabelMap response format เป็น [{id, label}] objects ตาม Specification — เพิ่ม MeterLabel class', def: 'DEF-003' },
    { pri: 'Resolved', action: 'ปรับ GenerateTimeCategories ให้สร้าง full-day grid ตาม interval (24h/interval slots) — Interval=15→96, =5→288', def: 'DEF-001' },
    { pri: 'Resolved', action: 'เพิ่ม input validation guards ทั้ง 3 controllers — required fields, type whitelist, range/format checks — กลุ่ม VR/VT/VO/VF/VM 17 cases', def: 'DEF-005' },
  ];

  const recRows = [
    [
      { text: 'ลำดับ',      options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
      { text: 'ข้อเสนอแนะ', options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
      { text: 'Defect',     options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
    ],
    ...recData.map((r, ri) => {
      const isCrit = r.pri === 'Critical';
      const isResolved = r.pri === 'Resolved';
      const priBg = isResolved ? C.passBg : (isCrit ? C.failBg  : C.partBg);
      const priTc = isResolved ? C.passText : (isCrit ? C.failText : C.partText);
      const defTc = isResolved ? C.passText : C.failText;
      const rowBg = ri % 2 === 0 ? C.altRow : C.white;
      return [
        { text: r.pri,    options: { fill: { color: priBg }, color: priTc, bold: true,  fontSize: 8,   fontFace: 'Calibri', align: 'center' } },
        { text: r.action, options: { fill: { color: rowBg }, color: C.text,  bold: false, fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
        { text: r.def,    options: { fill: { color: rowBg }, color: defTc, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
      ];
    }),
  ];

  sl.addTable(recRows, {
    x: MX, y, w: CW, colW: recColW,
    border: { pt: 0.5, color: C.border }, rowH: 0.37,
  });
  y += (recData.length + 1) * 0.37 + 0.3;

  // Remaining scope
  y = sectionHead(sl, 'ขอบเขตการทดสอบที่เหลือ (Remaining Test Scope)', y);

  // colW: [3.0, 0.8, 3.47] = 7.27 ✓
  const scopeColW = [3.0, 0.8, 3.47];
  const scopeData = [
    { suite: 'Validation (VR, VT, VO, VF, VM)',              count: '18',   cmd: '✅ TESTED v1.2 — 54/54 PASS' },
    { suite: 'Cross-Endpoint Consistency (CE-I)',             count: '6',    cmd: '✅ TESTED v1.2 — 50/51 PASS (1 environmental)' },
    { suite: 'REST API Load (HTTP-L)',                        count: '7',    cmd: '✅ TESTED v1.2 — 1120/1120 PASS' },
    { suite: 'DB Integration (DB-I)',                         count: '3',    cmd: 'Manual — ต้องเข้าถึง DB' },
    { suite: 'System Failure Handling (ERR-I)',               count: '2',    cmd: 'Manual — ต้องหยุด SQL Server' },
    { suite: 'WebSocket Functional + Load + Integration',     count: '15',   cmd: 'Out of Scope — ต้องต่อ PLC' },
  ];

  const scopeRows = [
    [
      { text: 'ชุดทดสอบ',  options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'left'   } },
      { text: 'จำนวน',     options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'center' } },
      { text: 'คำสั่ง / วิธีรัน', options: { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 8, fontFace: 'Calibri', align: 'left' } },
    ],
    ...scopeData.map((r, ri) => {
      const rowBg = ri % 2 === 0 ? C.altRow : C.white;
      const isTested = r.cmd.startsWith('✅');
      const cmdColor = isTested ? C.passText : C.muted;
      return [
        { text: r.suite, options: { fill: { color: rowBg }, color: C.text, bold: true,  fontSize: 8,   fontFace: 'Calibri', align: 'left'   } },
        { text: r.count, options: { fill: { color: rowBg }, color: C.navy, bold: true,  fontSize: 8,   fontFace: 'Calibri', align: 'center' } },
        { text: r.cmd,   options: { fill: { color: rowBg }, color: cmdColor, bold: isTested, fontSize: 7.5, fontFace: 'Calibri', align: 'left' } },
      ];
    }),
  ];

  sl.addTable(scopeRows, {
    x: MX, y, w: CW, colW: scopeColW,
    border: { pt: 0.5, color: C.border }, rowH: 0.32,
  });
}

// ════════════════════════════════════════════════════════════════════════
// WRITE FILE
// ════════════════════════════════════════════════════════════════════════
pres.writeFile({ fileName: OUTPUT })
  .then(() => console.log(`Created: ${OUTPUT}`))
  .catch((err) => { console.error('Error:', err.message); process.exit(1); });
