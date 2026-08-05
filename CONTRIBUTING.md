# Contributing to Nelarvo

Thank you for helping improve the method or the software.

## Before changing code

Read `docs/BUILD-SPEC.md`, especially the architecture, constraints and deferred
work. A new field needs a real case that cannot be described without it. A new
check needs a passing fixture, a failing fixture and a limitation that can be
stated in one sentence.

For a substantial feature, open an issue first. Describe the user need and the
evidence that the deferred feature's trigger has fired.

## Development

Nelarvo requires Node.js 22.6 or later.

```bash
npm ci
npm run check
```

Keep the core deterministic. Code under `src/core/` must not use the filesystem,
the network, process state or AI. Do not add a dependency without explaining why
the standard library is insufficient.

## Pull requests

- Keep one concern per pull request.
- Add tests for behavior changes.
- Update the relevant documentation when a product promise changes.
- Do not include real case files, personal data or client information.
- Run `npm run check` before submitting.

Contributions use the licence of the repository section they modify. See
`LICENSES.md` for the code, documentation and example-data boundaries.

All commits must include a Developer Certificate of Origin sign-off:

```bash
git commit -s -m "Describe the change"
```

The sign-off certifies the Developer Certificate of Origin 1.1 available at
<https://developercertificate.org/>.
