# Contributing

## Tools

- Node 18.x (check `.github/workflows/build.yml` to see what we're building with)
- [pre-commit](https://pre-commit.com/)

Once you clone the repo, run `pre-commit install` to connect the pre-commit hooks.

## Build

```powershell
# Restore packages.
npm install

# Do the lint/test cycle.
npm run build
```

## Test

There are Mocha tests that can be run to validate things at a unit test level.

```powershell
# Run tests.
npm run test
```

You can interactively test the CLI support by running it through node.

```powershell
# Show help.
node json-sort.js
node json-sort.js --help

# Run with some options.
node json-sort.js --autofix file.json
```

You can test the pre-commit hook using [the `pre-commit try-repo` command](https://pre-commit.com/#developing-hooks-interactively).

1. Clone this repo somewhere like `~/dev/json-sort-cli`.
2. Set up another repo with pre-commit.
3. While in the other repo, run `pre-commit try-repo ~/dev/json-sort-cli json-sort` to try out the hook. You can pass parameters at the end of the line. For example, `pre-commit try-repo ~/dev/json-sort-cli json-sort --verbose` turns on verbose output so you'll see the hook logs even if it passes.

[You can't pass arguments to `try-repo`.](https://github.com/pre-commit/pre-commit/issues/850) You'd need to actually set up a separate pre-commit hook configuration pointed to your local clone at a specific commit hash.

## Creating a New Release

GitHub Actions is set up to take care of the publishing side of things when a new release is published to GitHub.

- Update the version in `package.json`.
- Tag the repo.
- Create the release in GitHub and publish the release.
