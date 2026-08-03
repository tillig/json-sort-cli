const assert = require('assert');
const { execFile } = require('child_process');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);
const cli = path.join(__dirname, '..', 'json-sort.js');

/**
 * Runs the CLI and resolves with the exit code and output regardless of whether
 * the process exits non-zero, which it does whenever a file needs sorting.
 * @param {string[]} args Arguments to pass to the CLI.
 * @returns {Promise<object>} The exit code, stdout, and stderr.
 */
async function runCli(args) {
  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [cli, ...args]);
    return { code: 0, stdout, stderr };
  } catch (e) {
    return { code: e.code, stdout: e.stdout, stderr: e.stderr };
  }
}

describe('cli', function () {
  // Spawning a process per test is slower than the unit tests.
  this.timeout(20000);

  let tempDirectory;

  beforeEach(async function () {
    tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'json-sort-cli-test'));
  });

  afterEach(async function () {
    await fs.rm(tempDirectory, { force: true, recursive: true });
  });

  // yargs 18 is ESM-only, and `require()` of an ES module throws
  // ERR_REQUIRE_ESM before Node 22.12.0. These tests exercise the entry point
  // end to end so reintroducing a top-level `require('yargs/yargs')` fails the
  // build instead of only breaking consumers on older Node 22 releases.
  it('loads yargs without an ESM require error', async function () {
    const result = await runCli(['--help']);

    assert.strictEqual(result.code, 0);
    assert.doesNotMatch(result.stderr, /ERR_REQUIRE_ESM/);
    assert.match(result.stdout, /Usage: /);
  });

  it('reports an unsorted file', async function () {
    const target = path.join(tempDirectory, 'unsorted.json');
    await fs.writeFile(target, '{"b":1,"a":2}\n');

    const result = await runCli([target]);

    assert.strictEqual(result.code, 1);
    assert.doesNotMatch(result.stderr, /ERR_REQUIRE_ESM/);
    assert.match(result.stderr, /is not properly sorted/);
  });

  it('sorts a file when autofix is specified', async function () {
    const target = path.join(tempDirectory, 'autofix.json');
    await fs.writeFile(target, '{"b":1,"a":2}\n');

    await runCli(['--autofix', target]);

    const actual = await fs.readFile(target, 'utf8');
    assert.strictEqual(actual, '{\n  "a": 2,\n  "b": 1\n}');
  });

  it('exits zero for a file that is already sorted', async function () {
    const target = path.join(tempDirectory, 'sorted.json');
    await fs.writeFile(target, '{\n  "a": 2,\n  "b": 1\n}');

    const result = await runCli([target]);

    assert.strictEqual(result.code, 0);
  });
});
