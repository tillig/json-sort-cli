const assert = require('assert');
const formatter = require('../src/formatter');

describe('formatJson', function () {
  it('handles JSON without comments', async function () {
    const json = '{"test":"value"}';
    const options = {
      insert_final_newline: false,
      line_end_string: '\n',
      stringify_options: {
        space: 2
      }
    };

    const actual = formatter.formatJson(json, options);
    assert.strictEqual(actual, '{\n  "test": "value"\n}');
  });

  it('handles JSON with comments but strips comments', async function () {
    const json = `
    // This is a comment.
    { "test": "value" }`;

    const options = {
      insert_final_newline: false,
      line_end_string: '\n',
      stringify_options: {
        space: 2
      }
    };

    const actual = formatter.formatJson(json, options);
    assert.strictEqual(actual, '{\n  "test": "value"\n}');
  });

  it('adds the trailing newline if directed', async function () {
    const json = '{"test":"value"}';
    const options = {
      insert_final_newline: true,
      line_end_string: '\n',
      stringify_options: {
        space: 2
      }
    };

    const actual = formatter.formatJson(json, options);
    assert.strictEqual(actual, '{\n  "test": "value"\n}\n');
  });

  it('obeys line endings', async function () {
    const json = '{"test":"value"}';
    const options = {
      insert_final_newline: true,
      line_end_string: '\r\n',
      stringify_options: {
        space: 2
      }
    };

    const actual = formatter.formatJson(json, options);
    assert.strictEqual(actual, '{\r\n  "test": "value"\r\n}\r\n');
  });

  it('handles unset insert_final_newline', async function () {
    const json = '{"test":"value"}';
    const options = {
      insert_final_newline: 'unset',
      line_end_string: '\n',
      stringify_options: {
        space: 2
      }
    };

    const actual = formatter.formatJson(json, options);
    assert.strictEqual(actual, '{\n  "test": "value"\n}');
  });
});
