const assert = require('assert');
const opt = require('../src/options');

describe('createFormatOptions', () => {
  it('finds nested .editorconfig files', async () => {
    const options = await opt.createFormatOptions('test/nested-editorconfig/test.json');

    // This one comes from the nested config.
    assert.strictEqual(4, options.indent_size);

    // These are at the repo root config.
    assert.strictEqual(true, options.insert_final_newline);
    assert.strictEqual('space', options.indent_style);
  });

  it('allows override for indent size', async () => {
    const overrides = {
      indent_size: 6
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(6, options.indent_size);
    assert.strictEqual(true, options.insert_final_newline);
    assert.strictEqual('space', options.indent_style);
  });

  it('allows override for indent style', async () => {
    const overrides = {
      indent_style: 'tab'
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(2, options.indent_size);
    assert.strictEqual(true, options.insert_final_newline);
    assert.strictEqual('tab', options.indent_style);
  });

  it('allows override for final newline', async () => {
    const overrides = {
      insert_final_newline: false
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(2, options.indent_size);
    assert.strictEqual(false, options.insert_final_newline);
    assert.strictEqual('space', options.indent_style);
  });

  it('allows for defaults to work', async () => {
    const overrides = {
      indent_size: undefined,
      indent_style: undefined,
      insert_final_newline: undefined
    };
    // This will try getting an .editorconfig from the root of the drive, which
    // we assume will not have one. Really hope no one is putting .editorconfig
    // right at the root of their machine.
    const options = await opt.createFormatOptions('/test.no-editorconfig', overrides);

    assert.strictEqual(2, options.indent_size);
    assert.strictEqual(true, options.insert_final_newline);
    assert.strictEqual('space', options.indent_style);
  });

  it('calculates stringify options for tabs', async () => {
    const overrides = {
      indent_size: 4,
      indent_style: 'tab'
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual('\t', options.stringify_options.space);
  });

  it('calculates stringify options for spaces', async () => {
    const overrides = {
      indent_size: 4,
      indent_style: 'space'
    };
    const options = await opt.createFormatOptions('test.json', overrides);

    assert.strictEqual(4, options.stringify_options.space);
  });
});
