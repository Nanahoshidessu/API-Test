const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DEFAULT_COLLECTION = path.join(ROOT, 'unimicron-api.postman_collection.json');
const DEFAULT_ENVIRONMENT = path.join(ROOT, 'postman-environment.json');
const DEFAULT_RESULTS_DIR = path.join(ROOT, 'test-results');
const TRACEABILITY_PATH = path.join(ROOT, 'scenario-traceability.json');

const SUITES = {
  all: {
    description: 'Run the full Postman collection.',
    folders: null
  },
  iot: {
    description: 'Run only the original IoT API folder.',
    folders: ['IoT API (http://localhost:5000)']
  },
  scenario: {
    description: 'Run the automated scenario suite, excluding load profiles.',
    folders: [
      'Functional - MeterSum',
      'Functional - Multimeter',
      'Functional - MeterDetail',
      'Response Integrity',
      'Cross Endpoint Consistency',
      'Validation - Required Fields',
      'Validation - Wrong Data Type',
      'Validation - Out Of Range',
      'Validation - Invalid Format',
      'Validation - Invalid Meter ID'
    ]
  },
  'scenario:functional': {
    description: 'Run functional and response integrity scenario cases.',
    folders: [
      'Functional - MeterSum',
      'Functional - Multimeter',
      'Functional - MeterDetail',
      'Response Integrity'
    ]
  },
  'scenario:validation': {
    description: 'Run validation scenario cases.',
    folders: [
      'Validation - Required Fields',
      'Validation - Wrong Data Type',
      'Validation - Out Of Range',
      'Validation - Invalid Format',
      'Validation - Invalid Meter ID'
    ]
  },
  'scenario:cross': {
    description: 'Run cross-endpoint consistency cases in sequence.',
    folders: ['Cross Endpoint Consistency']
  },
  'http-load': {
    description: 'Run REST API load profile requests. Use --concurrency/--iteration-count intentionally.',
    folders: ['Load - HTTP']
  }
};

function usage() {
  console.log(`
Newman runner for Unimicron API scenario automation

Usage:
  node newman-run.js [options]

Options:
  --suite <name>              Suite to run. Default: scenario
  --folder <name>             Run a specific folder. Can be repeated.
  --scenario <TEST-ID>        Run requests whose name starts with a Test ID, e.g. MS-F-01.
  --collection <file>         Collection path. Default: unimicron-api.postman_collection.json
  --environment <file>        Environment path. Default: postman-environment.json
  --report-dir <dir>          Report output directory. Default: test-results
  --reporters <list>          Comma list. Default: cli,htmlextra,junit,json
  --env-var key=value         Override environment variable. Can be repeated.
  --iteration-count <n>       Newman iteration count.
  --delay-request <ms>        Delay between requests.
  --concurrency <n>           Run multiple Newman workers in parallel.
  --timeout <ms>              Total request timeout. Default: 30000
  --timeout-request <ms>      Per-request timeout. Default: 10000
  --timeout-script <ms>       Script timeout. Default: 5000
  --bail                      Stop on first failure.
  --insecure                  Allow self-signed certificates. Default: enabled.
  --dry-run                   Print the selected run plan without calling APIs.
  --list-suites               Print suite names and exit.
  --help                      Print this help.
`);
}

function parseArgs(argv) {
  const args = {
    suite: 'scenario',
    folders: [],
    envVars: [],
    collection: DEFAULT_COLLECTION,
    environment: DEFAULT_ENVIRONMENT,
    reportDir: DEFAULT_RESULTS_DIR,
    reporters: ['cli', 'htmlextra', 'junit', 'json'],
    iterationCount: undefined,
    delayRequest: undefined,
    concurrency: 1,
    timeout: 30000,
    timeoutRequest: 10000,
    timeoutScript: 5000,
    bail: false,
    insecure: true,
    dryRun: false,
    listSuites: false,
    scenario: null
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`${arg} requires a value`);
      i += 1;
      return argv[i];
    };

    switch (arg) {
      case '--suite':
        args.suite = next();
        break;
      case '--folder':
        args.folders.push(next());
        break;
      case '--scenario':
        args.scenario = next();
        break;
      case '--collection':
        args.collection = path.resolve(ROOT, next());
        break;
      case '--environment':
        args.environment = path.resolve(ROOT, next());
        break;
      case '--report-dir':
        args.reportDir = path.resolve(ROOT, next());
        break;
      case '--reporters':
        args.reporters = next().split(',').map((value) => value.trim()).filter(Boolean);
        break;
      case '--env-var':
        args.envVars.push(next());
        break;
      case '--iteration-count':
        args.iterationCount = Number(next());
        break;
      case '--delay-request':
        args.delayRequest = Number(next());
        break;
      case '--concurrency':
        args.concurrency = Number(next());
        break;
      case '--timeout':
        args.timeout = Number(next());
        break;
      case '--timeout-request':
        args.timeoutRequest = Number(next());
        break;
      case '--timeout-script':
        args.timeoutScript = Number(next());
        break;
      case '--bail':
        args.bail = true;
        break;
      case '--insecure':
        args.insecure = true;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--list-suites':
        args.listSuites = true;
        break;
      case '--help':
      case '-h':
        usage();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!Number.isInteger(args.concurrency) || args.concurrency < 1) {
    throw new Error('--concurrency must be a positive integer');
  }

  return args;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseEnvVars(values) {
  return values.map((entry) => {
    const index = entry.indexOf('=');
    if (index === -1) throw new Error(`Invalid --env-var "${entry}". Use key=value.`);
    return { key: entry.slice(0, index), value: entry.slice(index + 1) };
  });
}

function selectedFolders(args) {
  if (args.scenario && !args.folders.length) return null;
  if (args.folders.length) return args.folders;
  const suite = SUITES[args.suite];
  if (!suite) {
    throw new Error(`Unknown suite "${args.suite}". Use --list-suites to see available suites.`);
  }
  return suite.folders;
}

function printSuites() {
  console.log('Available suites:');
  Object.entries(SUITES).forEach(([name, suite]) => {
    const folders = suite.folders ? suite.folders.join(', ') : '(full collection)';
    console.log(`  ${name.padEnd(20)} ${suite.description}`);
    console.log(`  ${''.padEnd(20)} folders: ${folders}`);
  });
}

function itemMatchesScenario(item, scenarioId) {
  return String(item.name || '').toUpperCase().startsWith(scenarioId.toUpperCase());
}

function filterItemsByScenario(items, scenarioId) {
  return (items || []).reduce((kept, item) => {
    if (item.item) {
      const childItems = filterItemsByScenario(item.item, scenarioId);
      if (childItems.length) kept.push({ ...item, item: childItems });
    } else if (itemMatchesScenario(item, scenarioId)) {
      kept.push(item);
    }
    return kept;
  }, []);
}

function collectionForRun(args) {
  if (!args.scenario) return args.collection;

  const collection = readJson(args.collection);
  const filteredItems = filterItemsByScenario(collection.item, args.scenario);
  if (!filteredItems.length) {
    throw new Error(`No Postman request name starts with scenario "${args.scenario}".`);
  }
  return { ...collection, item: filteredItems };
}

function reporterConfig(reportDir, ts, workerIndex, reporters) {
  const suffix = workerIndex ? `${ts}-worker-${workerIndex}` : ts;
  const config = {};

  if (reporters.includes('htmlextra')) {
    config.htmlextra = {
      export: path.join(reportDir, `report-${suffix}.html`),
      title: 'Unimicron Pegasus API - Scenario Test Report',
      darkTheme: false,
      showMarkdownLinks: true,
      displayProgressBar: true
    };
  }

  if (reporters.includes('junit')) {
    config.junit = {
      export: path.join(reportDir, `junit-${suffix}.xml`)
    };
  }

  if (reporters.includes('json')) {
    config.json = {
      export: path.join(reportDir, `summary-${suffix}.json`)
    };
  }

  return config;
}

function makeOptions(args, workerIndex = 0) {
  const ts = timestamp();
  const folders = selectedFolders(args);
  const options = {
    collection: collectionForRun(args),
    environment: args.environment,
    envVar: parseEnvVars(args.envVars),
    reporters: args.reporters,
    reporter: reporterConfig(args.reportDir, ts, workerIndex, args.reporters),
    insecure: args.insecure,
    timeout: args.timeout,
    timeoutRequest: args.timeoutRequest,
    timeoutScript: args.timeoutScript,
    color: 'on'
  };

  if (folders) options.folder = folders;
  if (args.iterationCount) options.iterationCount = args.iterationCount;
  if (args.delayRequest) options.delayRequest = args.delayRequest;
  if (args.bail) options.bail = true;
  if (workerIndex) options.envVar.push({ key: 'scenario_worker', value: String(workerIndex) });

  return options;
}

function dryRun(args) {
  const folders = selectedFolders(args);
  const trace = fs.existsSync(TRACEABILITY_PATH) ? readJson(TRACEABILITY_PATH) : null;

  console.log('Dry run only. No API requests will be sent.');
  console.log(`Collection : ${args.collection}`);
  console.log(`Environment: ${args.environment}`);
  console.log(`Suite      : ${args.suite}`);
  console.log(`Scenario   : ${args.scenario || '(all selected)'}`);
  console.log(`Folders    : ${folders ? folders.join(', ') : '(full collection)'}`);
  console.log(`Reporters  : ${args.reporters.join(', ')}`);
  console.log(`Workers    : ${args.concurrency}`);
  if (args.iterationCount) console.log(`Iterations : ${args.iterationCount}`);
  if (args.delayRequest) console.log(`Delay      : ${args.delayRequest}ms`);

  if (trace) {
    const automated = trace.rows.filter((row) => row.automationStatus.includes('Automated')).length;
    const runner = trace.rows.filter((row) => row.automationStatus.includes('Runner')).length;
    console.log(`Traceability: ${trace.rows.length} cases (${automated} Postman/Newman, ${runner} runner profiles)`);
  }
}

function runNewman(options) {
  return new Promise((resolve, reject) => {
    const newman = require('newman');
    newman.run(options, (err, summary) => {
      if (err) {
        reject(err);
      } else {
        resolve(summary);
      }
    });
  });
}

function summarize(summaries) {
  const totals = summaries.reduce((acc, summary) => {
    const stats = summary.run.stats;
    acc.requests.total += stats.requests.total;
    acc.requests.failed += stats.requests.failed;
    acc.assertions.total += stats.assertions.total;
    acc.assertions.failed += stats.assertions.failed;
    acc.failures.push(...summary.run.failures);
    return acc;
  }, {
    requests: { total: 0, failed: 0 },
    assertions: { total: 0, failed: 0 },
    failures: []
  });

  console.log('\nTEST RESULTS SUMMARY');
  console.log('--------------------');
  console.log(`Requests   : ${totals.requests.total} (failed: ${totals.requests.failed})`);
  console.log(`Assertions : ${totals.assertions.total} (failed: ${totals.assertions.failed})`);

  if (totals.failures.length) {
    console.log(`\nFailures (${totals.failures.length}):`);
    totals.failures.forEach((failure, index) => {
      const source = failure.source && failure.source.name ? failure.source.name : '(unknown source)';
      const name = failure.error && failure.error.name ? failure.error.name : 'Error';
      const message = failure.error && failure.error.message ? failure.error.message : String(failure.error);
      console.log(`  ${index + 1}. ${source} - ${name}: ${message}`);
    });
  } else {
    console.log('\nAll assertions passed.');
  }

  return totals.assertions.failed || totals.requests.failed || totals.failures.length ? 1 : 0;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.listSuites) {
    printSuites();
    return 0;
  }

  ensureDir(args.reportDir);

  if (args.dryRun) {
    dryRun(args);
    return 0;
  }

  const workers = [];
  for (let i = 0; i < args.concurrency; i += 1) {
    workers.push(runNewman(makeOptions(args, args.concurrency > 1 ? i + 1 : 0)));
  }

  const summaries = await Promise.all(workers);
  return summarize(summaries);
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(`Newman runner failed: ${error.message}`);
    process.exit(1);
  });
