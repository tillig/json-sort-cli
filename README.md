# JSON Stable Stringify CLI and Pre-Commit Hook

This is a command line interface to the [`json-stable-stringify`](https://github.com/ljharb/json-stable-stringify) library so you can format/sort JSON files using that algorithm. It supports `.editorconfig` and provides a [pre-commit hook](https://pre-commit.com) configuration.

- [Use as CLI](#use-as-cli)
- [Use as Pre-Commit Hook](#use-as-pre-commit-hook)
- [Controlling Formatting](#controlling-formatting)
- [Warn vs. Autofix](#warn-vs-autofix)
- [Known Issues](#known-issues)
  - [Comments Will Be Lost](#comments-will-be-lost)
  - [Number Formats Will Be Lost](#number-formats-will-be-lost)
  - [Non-Required Unicode Encoding Will Be Lost](#non-required-unicode-encoding-will-be-lost)

## Use as CLI

```sh
# Install
npm install -g @tillig/json-sort-cli

# See the options available
json-sort --help

# Check if files are sorted
json-sort *.json --insert-final-newline true

# Sort files if needed
json-sort *.json --insert-final-newline true --autofix
```

## Use as Pre-Commit Hook

This is _similar to_ the [`pretty-format-json` hook](https://github.com/pre-commit/pre-commit-hooks/blob/main/pre_commit_hooks/pretty_format_json.py) with the following differences:

- Uses [`json-stable-stringify`](https://github.com/ljharb/json-stable-stringify) as the algorithm for sorting and formatting (for example, empty arrays will be expanded to two lines).
- Supports JSON with comments (but will _remove any comments_ on sort!).
- Obeys `.editorconfig`, if present, for indents and line endings.

For basic checking, your hook will look like this:

```yaml
repos:
  - repo: https://github.com/tillig/json-sort-cli
    rev: v1.0.0 # Use a version tag or SHA commit hash
    hooks:
      - id: json-sort
```

You can also pass arguments to control behavior, like auto-fixing any issues:

```yaml
repos:
  - repo: https://github.com/tillig/json-sort-cli
    rev: v1.0.0 # Use a version tag or SHA commit hash
    hooks:
      - id: json-sort
        args:
          - --autofix
```

## Controlling Formatting

The default formatting for `json-sort` is:

- Two-spaces for indents.
- System newline for line endings.
- No final newline at the end of the content.

`json-sort` will obey [`.editorconfig` settings](https://editorconfig.org/) in your repo. A sample `.editorconfig` might look like this:

```text
root = true

# Default for all files
[*]
indent_style = space
insert_final_newline = true

# Specific overrides for JSON files
[*.json]
indent_size = 2
```

The specific `.editorconfig` directives that can affect formatting are:

- `end_of_line`: Set to `lf`, `cr`, or `crlf` to specify the line ending type. If unset, the system line ending will be used.
- `indent_size`: The number of spaces to use for an indent. If `indent_style` is `tab`, this value is ignored.
- `indent_style`: Set to `tab` or `space` to use hard or soft tabs respectively.
- `insert_final_newline`: Set to `true` to add a newline at the end of the sorted content, `false` to skip adding the line ending.

You can specify command line options to control formatting as well. These correspond to the `.editorconfig` settings.

- `--end-of-line`
- `--indent-size`
- `--indent-style`
- `--insert-final-newline`

Command line options take precedence over `.editorconfig` settings; `.editorconfig` settings override defaults.

## Warn vs. Autofix

If `json-sort` detects any changes in content due to sorting, it will exit with a non-zero code.

By default, the formatter is non-destructive - it will _warn you_ if the sorted content is different from the original content. This allows for easier integration with pre-commit hooks and build scripts where you don't want these things automatically changing content.

If you want the formatter to overwrite the existing file with the sorted content, specify the `--autofix` argument.

Console output from the command will tell you if the difference is _structural_ or _whitespace_. Since the sort command obeys `.editorconfig` there are sometimes non-obvious differences - file encoding, tabs vs. spaces, etc. The messages will tell you what the sort thinks needs changing.

## Known Issues

Here are some things you'll discover on sorting JSON. (If you have a fix for these, [I'd love a PR.](https://github.com/tillig/json-sort-cli/pulls))

### Comments Will Be Lost

Technically JSON doesn't support comments. The parser uses the JSON5 reader to allow sorting JSON with comments, but the comments will be removed from the sorted output.

### Number Formats Will Be Lost

For example, if you have:

```json
{
  "value": 5.551634280063769e-06
}
```

The sorted version of that is:

```json
{
  "value": 0.000005551634280063769
}
```

This is all part of how [`JSON.stringify()` works](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and is not within the control of the CLI or parsing libraries.

### Non-Required Unicode Encoding Will Be Lost

For example, if you have:

```json
{
  "value": "Qu\u00e9bec"
}
```

The sorted version of that is:

```json
{
  "value": "Québec"
}
```

The original `\u` encoding will not be retained. This is all part of how [`JSON.stringify()` works](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and is not within the control of the CLI or parsing libraries.

If you do have characters that require encoding, like this:

```json
{
  "value": "data\ndata"
}
```

That character _will remain encoded_ in the serialized output.
