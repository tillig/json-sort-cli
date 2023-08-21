const assert = require('assert');
const opt = require('../src/options');

// If you provide a filename that appears relative to the repo (like
// 'test.json') you will get the repo .editorconfig included in the options!
describe('createFormatOptions', () => {
  it('finds nested .editorconfig files', async () => {
    const options = await opt.createFormatOptions('test/nested-editorconfig/test.json');

    // This one comes from the nested config.
    assert.strictEqual(options.indent_size, 4);

    // These are at the repo root config.
    assert.strictEqual(options.insert_final_newline, true);
    assert.strictEqual(options.indent_style, 'space');
  });

  it('allows override for indent size', async () => {
    const overrides = {
      indent_size: 6
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(options.indent_size, 6);
    assert.strictEqual(options.insert_final_newline, true);
    assert.strictEqual(options.indent_style, 'space');
  });

  it('allows override for indent style', async () => {
    const overrides = {
      indent_style: 'tab'
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(options.indent_size, 2);
    assert.strictEqual(options.insert_final_newline, true);
    assert.strictEqual(options.indent_style, 'tab');
  });

  it('allows override for final newline', async () => {
    const overrides = {
      insert_final_newline: false
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(options.indent_size, 2);
    assert.strictEqual(options.insert_final_newline, false);
    assert.strictEqual(options.indent_style, 'space');
  });

  it('allows for defaults to work', async () => {
    const overrides = {
    };
    // This will try getting an .editorconfig from the root of the drive, which
    // we assume will not have one. Really hope no one is putting .editorconfig
    // right at the root of their machine.
    const options = await opt.createFormatOptions('/test.no-editorconfig', overrides);

    assert.strictEqual(options.indent_size, 2);
    assert.strictEqual(options.insert_final_newline, false);
    assert.strictEqual(options.indent_style, 'space');
  });

  it('calculates stringify options for tabs', async () => {
    const overrides = {
      indent_size: 4,
      indent_style: 'tab'
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(options.stringify_options.space, '\t');
  });

  it('calculates stringify options for spaces', async () => {
    const overrides = {
      indent_size: 4,
      indent_style: 'space'
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(options.stringify_options.space, 4);
  });
});
