# Licensing

Nelarvo is licensed in three parts, because code, method, and reference cases
are used differently and deserve different terms.

| What | Where | Licence |
|---|---|---|
| Code — engine, checks, report, interface | `src/`, `tests/`, build files | [Apache 2.0](LICENSE) |
| Method and documentation | `docs/` | [CC BY 4.0](docs/LICENSE) |
| Reference cases | `examples/` | [CC BY-SA 4.0](examples/LICENSE) |

## Why these

**Apache 2.0 for the code.** Permissive, with an explicit patent grant that
enterprise and government legal reviews expect. Anyone may use, modify, and
redistribute the code, including inside a closed commercial product.

That is intentional. The durable asset of this project is not the source —
the engine is a few thousand lines that anyone could rebuild from the
specification in a week. It is the method, the reference cases, the practitioner
network, and the evidence from real engagements. A consultancy adopting Nelarvo
is the standard succeeding, not a theft.

**CC BY 4.0 for the method.** The interview protocol, the checks, and the
reasoning behind them should spread as widely as possible, including into other
people's tools and training. Attribution is the only condition.

**CC BY-SA 4.0 for the cases.** Share-alike, and deliberately stricter than the
rest. Reference cases are the part of this project most likely to be absorbed
into a closed product, and the corpus is worth more to everyone if additions
come back to it.

## What this means if you want to build on it

**You may** use Nelarvo commercially, run it inside your organization, fork it,
build closed products on top of it, offer paid services around it, and
implement the specification in your own tool and say so.

**You may not** claim to *be* Nelarvo, or issue conformance statements or
certifications in its name, without permission. The name is not covered by these
licences.

## Contributions

Contributions are accepted under the licence of the part of the repository they
touch, certified with a [Developer Certificate of Origin](https://developercertificate.org/)
sign-off — `git commit -s`.

There is no Contributor License Agreement, and that is a deliberate choice: a
CLA would let this project relicense contributed code into proprietary products,
and asking for that right deters exactly the operations leads, union
researchers, and public-sector practitioners this project needs most.

The consequence is a boundary the maintainers hold themselves to: **any future
commercial module is the maintainers' own work, in a separate repository.**
Contributed code stays under the licence it arrived with.

## Not legal advice

This file explains intent. The licence files are the operative terms. If you
need certainty for a commercial or public-sector deployment, ask your own
counsel.
