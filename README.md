# JSON Stable Stringify/Sort Pre-Commit Hook

Runs JSON stable sort on specified files as a [pre-commit hook](https://pre-commit.com).

This is _similar to_ the [`pretty-format-json` hook](https://github.com/pre-commit/pre-commit-hooks/blob/main/pre_commit_hooks/pretty_format_json.py) with the following differences:

- Uses [`json-stable-stringify`](https://github.com/ljharb/json-stable-stringify) as the algorithm for sorting and formatting (for example, empty arrays will be expanded to two lines).
- Supports JSON with comments (but will _remove any comments_ on sort!).
- Obeys `.editorconfig`, if present, for indents and line endings.
