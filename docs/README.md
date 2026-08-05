# Documentation

Choose the shortest document that answers your question.

| If you want to… | Start here |
|---|---|
| Try the tool with a small fictional workflow | [`TUTO.md`](../TUTO.md) |
| Run a real case with the people doing the work | [`METHOD.md`](METHOD.md) |
| See exactly what version 0.1.0 implements | [`BUILD-SPEC.md`](BUILD-SPEC.md) |
| Understand the thesis, safeguards and long-term direction | [`MEMORANDUM.md`](MEMORANDUM.md) |
| Understand the three-part licensing model | [`../LICENSES.md`](../LICENSES.md) |
| Contribute code or documentation | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) |

The build specification is authoritative for shipped scope. The memorandum is
broader by design and includes future capabilities behind evidence gates.

## Quick verification

```bash
npm ci
npm run check
node src/cli/index.ts calc examples/expense-claims.nelarvo.json
```

No test requires a network connection, API key or hosted service.
