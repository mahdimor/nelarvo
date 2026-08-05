# Security policy

## Supported version

Nelarvo is pre-1.0. Security fixes are made on the latest `main` branch only.

## Reporting a vulnerability

Do not open a public issue for a vulnerability or include a real case file in a
report. Use GitHub's private vulnerability reporting for this repository. If it
is unavailable, contact the maintainer privately through the GitHub profile
before disclosing details.

Include the affected version or commit, the impact, reproduction steps and any
suggested mitigation. Remove names, client information and case contents that
are not essential to the report.

You should receive an acknowledgement within five business days. A confirmed
issue will receive a remediation plan and a coordinated disclosure date.

## Security model

Studio binds only to `127.0.0.1` and reads or writes case files only in the
directory where it was launched. It has no accounts, telemetry, database or
external API. Case files can still contain sensitive operational information;
users are responsible for access controls, backups and appropriate redaction.
