# Contributing

## Build

```powershell
# Restore packages.
npm install

# Do the lint/test cycle.
npm run build
```

## Test

You can test the pre-commit hook using [the `pre-commit try-repo` command](https://pre-commit.com/#developing-hooks-interactively).

1. Clone this repo somewhere like `~/dev/pre-commit-json-sort`.
2. Set up another repo with pre-commit.
3. While in the other repo, run `pre-commit try-repo ~/dev/pre-commit-json-sort json-sort` to try out the hook. You can pass parameters at the end of the line. For example, `pre-commit try-repo ~/dev/pre-commit-json-sort json-sort --verbose` turns on verbose output so you'll see the hook logs even if it passes.
