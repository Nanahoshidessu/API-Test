const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COLLECTION_PATH = path.join(ROOT, 'unimicron-api.postman_collection.json');
const ENV_PATH = path.join(ROOT, 'postman-environment.json');
const TRACE_JSON_PATH = path.join(ROOT, 'scenario-traceability.json');
const TRACE_MD_PATH = path.join(ROOT, 'scenario-traceability.md');

const AUTOMATION_FOLDER = 'Automated Scenario Tests';

const envDefaults = {
  iot_url: 'http://localhost:5000',
  websocket_url: 'ws://localhost:9001/ws/',
  scenario_year: '2025',
  scenario_year_previous: '2024',
  scenario_year_start: '2016',
  scenario_month: '06',
  scenario_month_previous_1: '04',
  scenario_month_previous_2: '05',
  scenario_day_1: '10',
  scenario_day_2: '11',
  scenario_day_3: '12',
  scenario_day_single: '15',
  scenario_week_1: '2025-06-02||2025-06-08',
  scenario_week_2: '2025-06-09||2025-06-15',
  scenario_interval_day: '15',
  scenario_interval_fast: '5',
  scenario_interval_hour: '60',
  scenario_interval_week: '7',
  scenario_past_current: '0',
  scenario_past_previous: '1',
  test_meter_1: 'PM001',
  test_meter_2: 'PM002',
  test_meter_3: 'PM003',
  test_meter_missing: 'PM9999',
  test_meter_all: 'ALL'
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function postJson(endpoint, body, description, testScript) {
  return {
    request: {
      method: 'POST',
      header: [{ key: 'Content-Type', value: 'application/json' }],
      url: `{{iot_url}}/${endpoint}`,
      body: {
        mode: 'raw',
        raw: JSON.stringify(body, null, 2),
        options: { raw: { language: 'json' } }
      },
      description
    },
    event: [
      {
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: testScript.split('\n')
        }
      }
    ]
  };
}

function baseBody(type, dataSelect, meter, overrides = {}) {
  return {
    Type: type,
    Meter: meter,
    DataSelect: dataSelect,
    Interval: overrides.Interval ?? 0,
    Past: overrides.Past ?? 0,
    Month: overrides.Month ?? '',
    WeekMonth: overrides.WeekMonth ?? ''
  };
}

function detailBody(type, dataSelect, meter, overrides = {}) {
  return {
    type,
    Meter: meter,
    DataSelect: dataSelect,
    interval: overrides.interval ?? 0,
    past: overrides.past ?? 0,
    month: overrides.month ?? '',
    WeekMonth: overrides.WeekMonth ?? ''
  };
}

function scenarioScript(config) {
  return `const tc = ${JSON.stringify(config, null, 2)};

function expand(value) {
  if (Array.isArray(value)) return value.map(expand);
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce(function(acc, key) {
      acc[key] = expand(value[key]);
      return acc;
    }, {});
  }
  return pm.variables.replaceIn(String(value));
}

function asJson() {
  try {
    return pm.response.json();
  } catch (error) {
    throw new Error('Response is not valid JSON: ' + error.message);
  }
}

function field(obj, names) {
  for (const name of names) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, name)) return obj[name];
  }
  return undefined;
}

function valuesFromDictionary(dict) {
  if (!dict || typeof dict !== 'object') return [];
  return Object.keys(dict).reduce(function(values, key) {
    return values.concat(Array.isArray(dict[key]) ? dict[key] : []);
  }, []);
}

function maxNumber(values) {
  const numbers = values.filter(function(value) { return typeof value === 'number' && isFinite(value); });
  return numbers.length ? Math.max.apply(null, numbers) : 0;
}

function hasErrorSignal(body) {
  const text = JSON.stringify(body || {}).toLowerCase();
  return pm.response.code >= 400 ||
    body === false ||
    body === null ||
    field(body, ['success', 'Success']) === false ||
    String(field(body, ['Status', 'status', 'Result', 'result']) || '').toLowerCase() === 'error' ||
    ['error', 'invalid', 'required', 'missing', 'exception'].some(function(token) { return text.includes(token); });
}

function hasEmptyData(body) {
  const target = field(body, ['ArrDataTarget', 'arrDataTarget']);
  const actual = field(body, ['ArrDataActual', 'arrDataActual']);
  const chart = field(body, ['ArrDataChart', 'arrDataChart']);
  return [target, actual, chart].some(function(value) {
    if (Array.isArray(value)) return value.length === 0;
    return value && typeof value === 'object' && Object.keys(value).length === 0;
  });
}

function expectNoServerError() {
  pm.test(tc.id + ' - request completed and returned a response code', function() {
    pm.expect(pm.response.code, 'HTTP response code').to.be.a('number');
  });
  pm.test(tc.id + ' - no HTTP 500 server error', function() {
    if (typeof pm.response.code === 'number') {
      pm.expect(pm.response.code).to.not.equal(500);
    }
  });
}

function expectSuccessJson() {
  pm.test(tc.id + ' - HTTP status is success', function() {
    pm.expect(pm.response.code || 0).to.be.within(200, 299);
  });
  if (!pm.response || typeof pm.response.code !== 'number' || pm.response.code < 200 || pm.response.code > 299) {
    return null;
  }
  const json = asJson();
  pm.test(tc.id + ' - response is a JSON object', function() {
    pm.expect(json).to.be.an('object');
  });
  return json;
}

function expectCategoryLength(categories) {
  if (!tc.expectedCategoryLength) return;
  pm.test(tc.id + ' - ArrCategories length matches scenario interval', function() {
    pm.expect(categories.length).to.equal(Number(expand(tc.expectedCategoryLength)));
  });
}

function expectMeterCompare(json) {
  const target = field(json, ['ArrDataTarget', 'arrDataTarget']);
  const actual = field(json, ['ArrDataActual', 'arrDataActual']);
  const categories = field(json, ['ArrCategories', 'arrCategories']);
  const expectedKeys = expand(tc.expectedKeys || []);

  pm.test(tc.id + ' - MeterCompare response has chart dictionaries and categories', function() {
    pm.expect(target).to.be.an('object');
    pm.expect(actual).to.be.an('object');
    pm.expect(categories).to.be.an('array').that.is.not.empty;
  });

  pm.test(tc.id + ' - response dictionary keys match expected scenario keys', function() {
    expectedKeys.forEach(function(key) {
      pm.expect(Object.keys(target)).to.include(key);
      pm.expect(Object.keys(actual)).to.include(key);
    });
  });

  pm.test(tc.id + ' - data arrays align with ArrCategories', function() {
    Object.keys(target).forEach(function(key) {
      pm.expect(target[key]).to.be.an('array');
      pm.expect(target[key].length).to.equal(categories.length);
    });
    Object.keys(actual).forEach(function(key) {
      pm.expect(actual[key]).to.be.an('array');
      pm.expect(actual[key].length).to.equal(categories.length);
    });
  });

  pm.test(tc.id + ' - max values are not lower than returned data', function() {
    const maxTarget = Number(field(json, ['MaxValueTarget', 'maxValueTarget']));
    const maxActual = Number(field(json, ['MaxValueActual', 'maxValueActual']));
    pm.expect(maxTarget).to.be.at.least(maxNumber(valuesFromDictionary(target)));
    pm.expect(maxActual).to.be.at.least(maxNumber(valuesFromDictionary(actual)));
  });

  expectCategoryLength(categories);
  return { target, actual, categories };
}

function expectMeterDetail(json) {
  const maxData = Number(field(json, ['MaxData', 'maxData']));
  const chart = field(json, ['ArrDataChart', 'arrDataChart']);
  const strokes = field(json, ['ArrStrokeChart', 'arrStrokeChart']);
  const categories = field(json, ['ArrCategories', 'arrCategories']);
  const labelMap = field(json, ['MeterLabelMap', 'meterLabelMap']);

  pm.test(tc.id + ' - MeterDetail response has chart structure', function() {
    pm.expect(maxData).to.be.a('number');
    pm.expect(chart).to.be.an('array').that.is.not.empty;
    pm.expect(strokes).to.be.an('array');
    pm.expect(categories).to.be.an('array').that.is.not.empty;
    pm.expect(labelMap).to.be.an('array');
  });

  pm.test(tc.id + ' - each chart series is a bar series with valid data', function() {
    chart.forEach(function(series) {
      const name = field(series, ['Name', 'name']);
      const type = field(series, ['Type', 'type']);
      const color = field(series, ['Color', 'color']);
      const data = field(series, ['Data', 'data']);
      pm.expect(name).to.be.a('string').and.not.empty;
      pm.expect(String(type).toLowerCase()).to.equal('bar');
      pm.expect(color).to.match(/^#[0-9a-f]{6}$/i);
      pm.expect(data).to.be.an('array');
      pm.expect(data.length).to.equal(categories.length);
    });
  });

  pm.test(tc.id + ' - stroke chart length matches chart series length', function() {
    pm.expect(strokes.length).to.equal(chart.length);
    strokes.forEach(function(value) {
      pm.expect(Number(value)).to.be.at.least(0);
    });
  });

  if (tc.expectedLabelIds) {
    const expectedLabelIds = expand(tc.expectedLabelIds);
    pm.test(tc.id + ' - MeterLabelMap contains selected meter IDs', function() {
      const ids = labelMap.map(function(item) {
        return String(field(item, ['id', 'Id', 'Meter', 'meter']));
      });
      expectedLabelIds.forEach(function(id) {
        pm.expect(ids).to.include(id);
      });
    });
  }

  expectCategoryLength(categories);
  return { chart, strokes, categories, labelMap };
}

expectNoServerError();

if (tc.mode === 'validation') {
  pm.test(tc.id + ' - controlled validation response', function() {
    pm.expect(pm.response.code, 'HTTP response code').to.be.a('number');
    if (pm.response.code >= 400 && pm.response.code < 500) return;
    const body = asJson();
    const graceful = Boolean(tc.allowEmptyData && hasEmptyData(body));
    pm.expect(hasErrorSignal(body) || graceful).to.equal(true);
  });
} else if (tc.mode === 'meterCompare') {
  const json = expectSuccessJson();
  if (json) {
    const result = expectMeterCompare(json);
    if (tc.storeActualKey) {
      const key = expand(tc.storeActualKey);
      pm.environment.set(tc.storeAs, JSON.stringify(result.actual[key]));
    }
    if (tc.compareActualKey && tc.compareWith) {
      const key = expand(tc.compareActualKey);
      const expected = JSON.parse(pm.environment.get(tc.compareWith) || '[]');
      pm.test(tc.id + ' - actual data matches stored cross-endpoint baseline', function() {
        pm.expect(result.actual[key]).to.eql(expected);
      });
    }
    if (tc.compareDifferentFrom && tc.compareActualKey) {
      const key = expand(tc.compareActualKey);
      const previous = JSON.parse(pm.environment.get(tc.compareDifferentFrom) || '[]');
      pm.test(tc.id + ' - actual data differs from stored baseline', function() {
        pm.expect(JSON.stringify(result.actual[key])).to.not.equal(JSON.stringify(previous));
      });
    }
  }
} else if (tc.mode === 'meterDetail') {
  const json = expectSuccessJson();
  if (json) {
    const result = expectMeterDetail(json);
    if (tc.compareDetailSumWith) {
      const expected = JSON.parse(pm.environment.get(tc.compareDetailSumWith) || '[]');
      pm.test(tc.id + ' - summed detail data matches stored multimeter baseline', function() {
        const totals = result.categories.map(function(_, index) {
          return result.chart.reduce(function(sum, series) {
            const data = field(series, ['Data', 'data']) || [];
            return sum + Number(data[index] || 0);
          }, 0);
        });
        pm.expect(totals.length).to.equal(expected.length);
        totals.forEach(function(value, index) {
          pm.expect(Math.abs(value - Number(expected[index] || 0))).to.be.below(0.0001);
        });
      });
    }
  }
}`;
}

const requests = [];

function addRequest(group, id, endpoint, body, mode, title, config = {}) {
  const request = postJson(
    endpoint,
    body,
    `${id}: ${title}`,
    scenarioScript({ id, mode, ...config })
  );
  request.name = `${id} - ${title}`;
  request._trace = { id, group, endpoint, title, mode };
  requests.push(request);
  return request;
}

function meterSum(group, id, body, title, expectedKeys, config = {}) {
  return addRequest(group, id, 'GetDataMeterSum', body, 'meterCompare', title, { expectedKeys, ...config });
}

function multiMeter(group, id, body, title, expectedKeys, config = {}) {
  return addRequest(group, id, 'GetDataMultimeter', body, 'meterCompare', title, { expectedKeys, ...config });
}

function meterDetail(group, id, body, title, config = {}) {
  return addRequest(group, id, 'GetDataMeterDetail', body, 'meterDetail', title, config);
}

function validation(group, id, endpoint, body, title, config = {}) {
  return addRequest(group, id, endpoint, body, 'validation', title, config);
}

const dayKeys = ['{{scenario_day_1}}', '{{scenario_day_2}}', '{{scenario_day_3}}'];
const monthKeys = ['{{scenario_month_previous_1}}', '{{scenario_month_previous_2}}', '{{scenario_month}}'];
const yearKeys = ['2023', '{{scenario_year_previous}}', '{{scenario_year}}'];
const tenYearKeys = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '{{scenario_year_previous}}', '{{scenario_year}}'];
const meters3 = ['{{test_meter_1}}', '{{test_meter_2}}', '{{test_meter_3}}'];
const meters2 = ['{{test_meter_1}}', '{{test_meter_2}}'];
const meters1 = ['{{test_meter_1}}'];

meterSum('Functional - MeterSum', 'MS-F-01', baseBody('Day', dayKeys, '{{test_meter_1}}', { Interval: 15, Month: '{{scenario_month}}' }), 'Day comparison by selected days', dayKeys, { expectedCategoryLength: 96 });
meterSum('Functional - MeterSum', 'MS-F-02', baseBody('Week', ['{{scenario_week_1}}', '{{scenario_week_2}}'], '{{test_meter_all}}', { Interval: 7, Month: '{{scenario_month}}' }), 'Week comparison by selected week ranges', ['{{scenario_week_1}}', '{{scenario_week_2}}']);
meterSum('Functional - MeterSum', 'MS-F-03', baseBody('Month', monthKeys, '{{test_meter_1}}'), 'Month comparison by selected months', monthKeys);
meterSum('Functional - MeterSum', 'MS-F-04', baseBody('Year', yearKeys, '{{test_meter_1}}'), 'Year comparison by selected years', yearKeys);
meterSum('Functional - MeterSum', 'MS-F-05', baseBody('Max10Year', tenYearKeys, '{{test_meter_all}}'), 'Max10Year comparison across ten years', tenYearKeys);

multiMeter('Functional - Multimeter', 'MM-F-01', baseBody('Day', '{{scenario_day_single}}', meters3, { Interval: 15, Month: '{{scenario_month}}' }), 'Day data for multiple meters', meters3, { expectedCategoryLength: 96 });
multiMeter('Functional - Multimeter', 'MM-F-02', baseBody('Week', '{{scenario_week_2}}', meters2, { Interval: 7, Month: '{{scenario_month}}' }), 'Week data for multiple meters', meters2);
multiMeter('Functional - Multimeter', 'MM-F-03', baseBody('Month', '{{scenario_month}}', meters2), 'Month data for multiple meters', meters2);
multiMeter('Functional - Multimeter', 'MM-F-04', baseBody('Year', '{{scenario_year}}', meters2), 'Year data for multiple meters', meters2);
multiMeter('Functional - Multimeter', 'MM-F-05', baseBody('Max10Year', '{{scenario_year}}|{{scenario_year_start}}', meters2), 'Max10Year data for multiple meters', meters2);

meterDetail('Functional - MeterDetail', 'MD-F-01', detailBody('Day', '{{scenario_day_single}}', meters2, { interval: 15, month: '{{scenario_month}}' }), 'Day detail chart', { expectedLabelIds: meters2, expectedCategoryLength: 96 });
meterDetail('Functional - MeterDetail', 'MD-F-02', detailBody('Week', '{{scenario_week_2}}', meters1, { interval: 7, month: '{{scenario_month}}' }), 'Week detail chart', { expectedLabelIds: meters1 });
meterDetail('Functional - MeterDetail', 'MD-F-03', detailBody('Month', '{{scenario_month}}', meters1), 'Month detail chart', { expectedLabelIds: meters1 });
meterDetail('Functional - MeterDetail', 'MD-F-04', detailBody('Year', '{{scenario_year}}', meters2), 'Year detail chart', { expectedLabelIds: meters2 });
meterDetail('Functional - MeterDetail', 'MD-F-05', detailBody('Max10Year', '{{scenario_year}}|{{scenario_year_start}}', meters1), 'Max10Year detail chart', { expectedLabelIds: meters1 });

meterSum('Response Integrity', 'RF-01', baseBody('Day', dayKeys, '{{test_meter_1}}', { Interval: 15, Month: '{{scenario_month}}' }), 'MeterSum Day keys are time/data-select strings', dayKeys, { expectedCategoryLength: 96 });
multiMeter('Response Integrity', 'RF-02', baseBody('Day', '{{scenario_day_single}}', meters1, { Interval: 15, Month: '{{scenario_month}}' }), 'Multimeter Day keys are meter IDs', meters1, { expectedCategoryLength: 96 });
meterSum('Response Integrity', 'RF-03', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_1}}'), 'MeterSum max values cover Month data', ['{{scenario_month}}']);
multiMeter('Response Integrity', 'RF-04', baseBody('Month', '{{scenario_month}}', meters2), 'Multimeter max values cover Month data', meters2);
meterDetail('Response Integrity', 'RF-05', detailBody('Day', '{{scenario_day_single}}', meters2, { interval: 15, month: '{{scenario_month}}' }), 'MeterDetail chart series object structure', { expectedLabelIds: meters2, expectedCategoryLength: 96 });
meterDetail('Response Integrity', 'RF-06', detailBody('Month', '{{scenario_month}}', meters2), 'MeterDetail MeterLabelMap selected IDs', { expectedLabelIds: meters2 });
meterDetail('Response Integrity', 'RF-07', detailBody('Month', '{{scenario_month}}', meters2), 'MeterDetail stroke length consistency', { expectedLabelIds: meters2 });
meterSum('Response Integrity', 'RF-08a', baseBody('Day', ['{{scenario_day_single}}'], '{{test_meter_1}}', { Interval: 5, Month: '{{scenario_month}}' }), 'MeterSum Day categories for 5 minute interval', ['{{scenario_day_single}}'], { expectedCategoryLength: 288 });
meterSum('Response Integrity', 'RF-08b', baseBody('Day', ['{{scenario_day_single}}'], '{{test_meter_1}}', { Interval: 15, Month: '{{scenario_month}}' }), 'MeterSum Day categories for 15 minute interval', ['{{scenario_day_single}}'], { expectedCategoryLength: 96 });
meterSum('Response Integrity', 'RF-08c', baseBody('Day', ['{{scenario_day_single}}'], '{{test_meter_1}}', { Interval: 60, Month: '{{scenario_month}}' }), 'MeterSum Day categories for 60 minute interval', ['{{scenario_day_single}}'], { expectedCategoryLength: 24 });

meterSum('Cross Endpoint Consistency', 'CE-I-01a', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_1}}'), 'Store MeterSum actual Month data for CE-I-01', ['{{scenario_month}}'], { storeActualKey: '{{scenario_month}}', storeAs: 'ce_i_01_meter_sum_actual' });
multiMeter('Cross Endpoint Consistency', 'CE-I-01b', baseBody('Month', '{{scenario_month}}', meters1), 'Compare Multimeter actual data with MeterSum for CE-I-01', meters1, { compareActualKey: '{{test_meter_1}}', compareWith: 'ce_i_01_meter_sum_actual' });
multiMeter('Cross Endpoint Consistency', 'CE-I-02a', baseBody('Month', '{{scenario_month}}', meters1), 'Store Multimeter actual Month data for CE-I-02', meters1, { storeActualKey: '{{test_meter_1}}', storeAs: 'ce_i_02_multimeter_actual' });
meterDetail('Cross Endpoint Consistency', 'CE-I-02b', detailBody('Month', '{{scenario_month}}', meters1), 'Compare MeterDetail summed data with Multimeter for CE-I-02', { expectedLabelIds: meters1, compareDetailSumWith: 'ce_i_02_multimeter_actual' });
meterSum('Cross Endpoint Consistency', 'CE-I-03a', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_1}}', { Past: 0 }), 'Store MeterSum Past 0 data for CE-I-03', ['{{scenario_month}}'], { storeActualKey: '{{scenario_month}}', storeAs: 'ce_i_03_past_0_actual' });
meterSum('Cross Endpoint Consistency', 'CE-I-03b', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_1}}', { Past: 1 }), 'Compare MeterSum Past 1 data differs for CE-I-03', ['{{scenario_month}}'], { compareActualKey: '{{scenario_month}}', compareDifferentFrom: 'ce_i_03_past_0_actual' });

meterSum('Load - HTTP', 'HTTP-L-01', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_1}}'), 'Load profile request for GetDataMeterSum Month', ['{{scenario_month}}']);
multiMeter('Load - HTTP', 'HTTP-L-02', baseBody('Month', '{{scenario_month}}', meters2), 'Load profile request for GetDataMultimeter Month', meters2);
meterDetail('Load - HTTP', 'HTTP-L-03', detailBody('Month', '{{scenario_month}}', meters2), 'Load profile request for GetDataMeterDetail Month', { expectedLabelIds: meters2 });
meterSum('Load - HTTP', 'HTTP-L-04a', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_1}}'), 'Mixed load MeterSum request', ['{{scenario_month}}']);
multiMeter('Load - HTTP', 'HTTP-L-04b', baseBody('Month', '{{scenario_month}}', meters2), 'Mixed load Multimeter request', meters2);
meterDetail('Load - HTTP', 'HTTP-L-04c', detailBody('Month', '{{scenario_month}}', meters2), 'Mixed load MeterDetail request', { expectedLabelIds: meters2 });
meterSum('Load - HTTP', 'HTTP-L-05', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_1}}'), 'Sustained load MeterSum request', ['{{scenario_month}}']);

validation('Validation - Required Fields', 'VR-01', 'GetDataMeterSum', { Meter: '{{test_meter_1}}', DataSelect: ['{{scenario_day_1}}'], Interval: 15, Past: 0, Month: '{{scenario_month}}' }, 'MeterSum missing Type');
validation('Validation - Required Fields', 'VR-02', 'GetDataMeterSum', { Type: 'Day', DataSelect: ['{{scenario_day_1}}'], Interval: 15, Past: 0, Month: '{{scenario_month}}' }, 'MeterSum missing Meter');
validation('Validation - Required Fields', 'VR-03', 'GetDataMeterSum', { Type: 'Day', Meter: '{{test_meter_1}}', Interval: 15, Past: 0, Month: '{{scenario_month}}' }, 'MeterSum missing DataSelect');
validation('Validation - Required Fields', 'VR-04', 'GetDataMultimeter', { Type: 'Day', Meter: meters1, DataSelect: '{{scenario_day_single}}', Past: 0, Month: '{{scenario_month}}' }, 'Multimeter missing Interval');
validation('Validation - Required Fields', 'VR-05', 'GetDataMeterDetail', { type: 'Day', Meter: meters1, DataSelect: '{{scenario_day_single}}', interval: 15, month: '{{scenario_month}}' }, 'MeterDetail missing past');

validation('Validation - Wrong Data Type', 'VT-01', 'GetDataMeterSum', baseBody('Day', ['{{scenario_day_1}}'], '{{test_meter_1}}', { Interval: 'fifteen', Month: '{{scenario_month}}' }), 'MeterSum Interval as string');
validation('Validation - Wrong Data Type', 'VT-02', 'GetDataMultimeter', baseBody('Day', '{{scenario_day_single}}', '{{test_meter_1}}', { Interval: 15, Month: '{{scenario_month}}' }), 'Multimeter Meter as scalar');
validation('Validation - Wrong Data Type', 'VT-03', 'GetDataMeterSum', baseBody('Day', '{{scenario_day_1}}', '{{test_meter_1}}', { Interval: 15, Month: '{{scenario_month}}' }), 'MeterSum DataSelect as string');
validation('Validation - Wrong Data Type', 'VT-04', 'GetDataMeterDetail', detailBody('Day', '{{scenario_day_single}}', meters1, { interval: 15, past: 'zero', month: '{{scenario_month}}' }), 'MeterDetail past as string');

validation('Validation - Out Of Range', 'VO-01', 'GetDataMeterSum', baseBody('Day', ['{{scenario_day_1}}'], '{{test_meter_1}}', { Interval: 15, Past: -1, Month: '{{scenario_month}}' }), 'MeterSum negative Past', { allowEmptyData: true });
validation('Validation - Out Of Range', 'VO-02', 'GetDataMeterSum', baseBody('Day', ['{{scenario_day_1}}'], '{{test_meter_1}}', { Interval: 3, Month: '{{scenario_month}}' }), 'MeterSum unsupported Day interval', { allowEmptyData: true });
validation('Validation - Out Of Range', 'VO-03', 'GetDataMeterSum', baseBody('Day', ['{{scenario_day_1}}'], '{{test_meter_1}}', { Interval: 15, Month: '13' }), 'MeterSum invalid Month 13');
validation('Validation - Out Of Range', 'VO-04', 'GetDataMeterDetail', detailBody('Month', '{{scenario_month}}', meters1, { past: 999 }), 'MeterDetail unreasonably large past', { allowEmptyData: true });

validation('Validation - Invalid Format', 'VF-01', 'GetDataMeterSum', baseBody('Week', ['20250609-20250615'], '{{test_meter_1}}', { Interval: 7, Month: '{{scenario_month}}' }), 'MeterSum malformed week DataSelect');
validation('Validation - Invalid Format', 'VF-02', 'GetDataMultimeter', baseBody('Max10Year', '{{scenario_year}}-{{scenario_year_start}}', meters1), 'Multimeter malformed Max10Year DataSelect');
validation('Validation - Invalid Format', 'VF-03', 'GetDataMeterDetail', detailBody('Day', '{{scenario_day_single}}', meters1, { interval: 15, month: '6' }), 'MeterDetail month without leading zero', { allowEmptyData: true });

validation('Validation - Invalid Meter ID', 'VM-01', 'GetDataMeterSum', baseBody('Month', ['{{scenario_month}}'], '{{test_meter_missing}}'), 'MeterSum invalid meter ID', { allowEmptyData: true });
validation('Validation - Invalid Meter ID', 'VM-02', 'GetDataMultimeter', baseBody('Month', '{{scenario_month}}', ['{{test_meter_1}}', '{{test_meter_missing}}']), 'Multimeter mixed valid and invalid meter IDs', { allowEmptyData: true });

function groupRequests() {
  const groups = new Map();
  requests.forEach(function(request) {
    const trace = request._trace;
    const item = { ...request };
    delete item._trace;
    if (!groups.has(trace.group)) groups.set(trace.group, []);
    groups.get(trace.group).push(item);
  });

  return Array.from(groups.entries()).map(function([name, item]) {
    return { name, item };
  });
}

function upsertEnvironment() {
  const env = readJson(ENV_PATH);
  const valuesByKey = new Map((env.values || []).map(function(value) { return [value.key, value]; }));
  Object.keys(envDefaults).forEach(function(key) {
    if (!valuesByKey.has(key)) {
      env.values.push({
        key,
        value: envDefaults[key],
        type: key.includes('password') ? 'secret' : 'default',
        enabled: true
      });
    }
  });
  writeJson(ENV_PATH, env);
}

function upsertCollection() {
  const collection = readJson(COLLECTION_PATH);
  collection.item = (collection.item || []).filter(function(item) {
    return item.name !== AUTOMATION_FOLDER;
  });
  collection.item.push({
    name: AUTOMATION_FOLDER,
    description: 'Generated from API Test Scenario Unimicron. Re-run scripts/apply-scenario-automation.js to refresh.',
    item: groupRequests()
  });
  writeJson(COLLECTION_PATH, collection);
}

const manualTrace = [
  ['WS-F-01', 'Functional', 'WebSocket Happy Path', 'WebSocket helper required', 'Send PING and validate PONG fields.'],
  ['WS-F-02', 'Functional', 'WebSocket Happy Path', 'WebSocket helper required', 'Validate case-insensitive Cmd/ping.'],
  ['WS-F-03', 'Functional', 'WebSocket Happy Path', 'WebSocket helper required', 'Validate alternative command field name.'],
  ['WS-F-04', 'Functional', 'WebSocket Happy Path', 'WebSocket helper required', 'Validate INFO root fields.'],
  ['WS-F-05', 'Functional', 'WebSocket Happy Path', 'WebSocket helper required', 'Validate INFO Sensors array filters.'],
  ['WS-F-06', 'Functional', 'WebSocket Happy Path', 'WebSocket helper required', 'Validate INFO count arithmetic.'],
  ['WS-F-07', 'Functional', 'WebSocket Happy Path', 'WebSocket helper required', 'Validate INFO sensor object fields.'],
  ['WS-L-01', 'Load', 'WebSocket Load', 'Load helper required', '10 concurrent WS PING clients.'],
  ['WS-L-02', 'Load', 'WebSocket Load', 'Load helper required', '50 concurrent WS PING clients.'],
  ['WS-L-03', 'Load', 'WebSocket Load', 'Load helper required', '100 concurrent WS PING clients.'],
  ['WS-L-04', 'Load', 'WebSocket Load', 'Load helper required', 'Single client sends 100 PING frames.'],
  ['WS-L-05', 'Load', 'WebSocket Load', 'Load helper required', 'Single client sends 50 INFO frames.'],
  ['HTTP-L-01', 'Load', 'REST API Load', 'Runner profile', 'Use newman-run.js --suite http-load --scenario HTTP-L-01.'],
  ['HTTP-L-02', 'Load', 'REST API Load', 'Runner profile', 'Use newman-run.js --suite http-load --scenario HTTP-L-02.'],
  ['HTTP-L-03', 'Load', 'REST API Load', 'Runner profile', 'Use newman-run.js --suite http-load --scenario HTTP-L-03.'],
  ['HTTP-L-04', 'Load', 'REST API Load', 'Runner profile', 'Use newman-run.js --suite http-load --scenario HTTP-L-04.'],
  ['HTTP-L-05', 'Load', 'REST API Load', 'Runner profile', 'Use newman-run.js --suite http-load --scenario HTTP-L-05.'],
  ['WS-I-01', 'Integration', 'WebSocket Sensor/PLC', 'Manual with PLC reference', 'Compare INFO Value with direct PLC reading.'],
  ['WS-I-02', 'Integration', 'WebSocket Sensor/PLC', 'Manual with PLC reference', 'Verify LastUpdated age for online sensors.'],
  ['WS-I-03', 'Integration', 'WebSocket Sensor/PLC', 'Manual with PLC reference', 'Compare Online count with PLC count.'],
  ['DB-I-01', 'Integration', 'HTTP API SQL Server', 'DB helper required', 'Compare MeterSum Actual with SQL query result.'],
  ['DB-I-02', 'Integration', 'HTTP API SQL Server', 'DB helper required', 'Compare MeterSum Target with SQL query result.'],
  ['DB-I-03', 'Integration', 'HTTP API SQL Server', 'DB helper required', 'Compare MeterDetail labels with SQL meter names.'],
  ['ERR-I-01', 'Integration', 'System Failure Handling', 'Manual ops step', 'Stop SQL Server before request.'],
  ['ERR-I-02', 'Integration', 'System Failure Handling', 'Manual ops step', 'Stop WebSocket server before client connect.'],
  ['ERR-I-03', 'Integration', 'System Failure Handling', 'Manual ops step', 'Simulate high DB load.']
];

function traceRows() {
  const rowsById = new Map();
  requests.forEach(function(request) {
    const trace = request._trace;
    const id = trace.id.replace(/[abc]$/, '');
    if (!rowsById.has(id)) {
      rowsById.set(id, {
        testId: id,
        category: trace.group.includes('Validation') ? 'Validation' : trace.group.includes('Cross') ? 'Integration' : 'Functional',
        group: trace.group,
        automationStatus: 'Automated in Postman/Newman',
        endpoint: trace.endpoint,
        postmanItems: [],
        notes: 'Generated under Automated Scenario Tests.'
      });
    }
    const row = rowsById.get(id);
    if (row.endpoint && !row.endpoint.split(', ').includes(trace.endpoint)) {
      row.endpoint = `${row.endpoint}, ${trace.endpoint}`;
    }
    row.postmanItems.push(request.name);
  });

  manualTrace.forEach(function(row) {
    const [testId, category, group, automationStatus, notes] = row;
    if (rowsById.has(testId)) {
      rowsById.set(testId, {
        ...rowsById.get(testId),
        category,
        group,
        automationStatus,
        notes
      });
    } else {
      rowsById.set(testId, {
        testId,
        category,
        group,
        automationStatus,
        endpoint: '',
        postmanItems: [],
        notes
      });
    }
  });

  return Array.from(rowsById.values()).sort(function(a, b) {
    return a.testId.localeCompare(b.testId, undefined, { numeric: true });
  });
}

function writeTraceability() {
  const rows = traceRows();
  writeJson(TRACE_JSON_PATH, {
    source: 'API Test Scenario Unimicron',
    generatedBy: 'scripts/apply-scenario-automation.js',
    totalScenarioCases: rows.length,
    rows
  });

  const lines = [
    '# Scenario Traceability Matrix',
    '',
    'Generated from `API Test Scenario Unimicron` and the Postman collection.',
    '',
    '| Test ID | Category | Group | Automation Status | Endpoint / Runner | Postman Items / Notes |',
    '|---|---|---|---|---|---|'
  ];

  rows.forEach(function(row) {
    const itemText = row.postmanItems.length ? row.postmanItems.join('<br>') : row.notes;
    lines.push(`| ${row.testId} | ${row.category} | ${row.group} | ${row.automationStatus} | ${row.endpoint || '-'} | ${itemText} |`);
  });

  fs.writeFileSync(TRACE_MD_PATH, `${lines.join('\n')}\n`);
}

upsertEnvironment();
upsertCollection();
writeTraceability();

console.log(`Updated ${path.basename(COLLECTION_PATH)} with "${AUTOMATION_FOLDER}".`);
console.log(`Updated ${path.basename(ENV_PATH)} with scenario variables.`);
console.log(`Wrote ${path.basename(TRACE_JSON_PATH)} and ${path.basename(TRACE_MD_PATH)}.`);
