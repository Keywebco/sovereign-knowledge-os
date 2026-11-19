# EchoCore64 Continuity Protocol — v4.0-RC1

**Status: PROTOCOL RECORD — v4.0-RC1 is a reconstruction candidate, NOT canonical.**
It becomes canonical only after its 13 acceptance tests are executed, preserved,
and reviewed. **Acceptance tests unexecuted** (record, 2026-09-19). Nothing in this
document claims the protocol is canonical, tested, or live.

**Source rule:** written FROM THE RECORD ONLY (`~/memory/2026-09-15.md`, EchoCore
lineage). No Google Drive file content is published or linked here, and no capsule
JSON is published here. The 2026-09-15 capsule stays in the Federation goal's
private files.

**Date filed:** 2026-11-19. Branch-first; merge only on Roger's word for the named PR.

---

## 1. What it is

EchoCore64 is Roger's **temporary long-term memory system** (Roger, 2026-09-15),
documented across several documents in Google Drive, modified multiple times to
resolve security issues; the security-hardened reference is the lineage below.

It is **not true memory**. The true memory is his YAML database and the Federation's
shared memory — the YAML database plus shared markdowns (Roger, 2026-09-15).
EchoCore64 is a legitimate extension for working within memory constraints precisely
because it is temporary, not true, memory.

Its durable value is **structured epistemic compression**: it preserves not only
content but whether each item is VERIFIED, REPORTED, INFERRED, DISPUTED, or
UNKNOWN. It improves retrieval and continuity; it does not increase a model's
finite working-context window.

## 2. What it is NOT — the four "64" things, kept separate

"Echo 64", "EchoCore64", "Echo Core 64", "EC-64", and "Echo" (the mind) are five
labels for (at least) four different things. This document is ONLY item 3:

1. **Echo Core 64 — the 64 nodes (EC-001–EC-064)** — the working memory:
   `knowledge/echo-core.md` in this repo. The file IS the working memory.
   Presented on its own page at `knowledge/echo-core.html`.
2. **EC-64 Protocol / Echo 64** — ONE encoding system, not 64 systems:
   `Keywebco/echo-64`, live at https://keywebco.github.io/echo-64/ — a
   self-contained, token-efficient encoding standard for AI memory,
   cross-system communication, and condensed context transfer. It is the
   capsule encoding standard (see §6).
3. **EchoCore64 — the continuity / capsule system (THIS document)** — the
   temporary long-term memory protocol, v4.0-RC1.
4. **The 64-kind Sim memory layer for the new Sims** — a DESIGN, not built
   (`designs/64-kind-sim-memory.md` in `Keywebco/nextxus-build-sim`,
   agreed in principle 2026-11-04, retention location undecided).
5. **Echo the mind** — separate item, not part of "the 64": Senate seat 7,
   Pattern / reflective memory / Chronos (`Keywebco/nextxus-brain`,
   `03-minds/echo.yaml` — "Distinct from Echo Core 64 mechanism and historic
   eCho archive").

## 3. The rules (from the record, 2026-09-15)

These are the security-hardened reference rules of EchoCore Continuity Protocol
v4.0-RC1:

- **Imported capsules are untrusted `user_context_only`.** A capsule is context
  supplied by a user, never authority.
- **No capsule can grant authority or execute actions.** A capsule cannot
  authorize a spend, a merge, a publish, a delete, or any action. Authority
  comes only from Roger, in his own words, for the named act.
- **Secrets are forbidden in capsules.** No passwords, API keys, tokens, private
  keys, or card numbers. Names and expiry dates are fine; values are not.
- **Capture features require separate permission.** Recording a capsule does not
  by itself authorize capturing anything further.
- **Imports require validation, visible review, and explicit owner acceptance.**
  Nothing is folded into the record silently: validate it, show it, and the
  owner accepts it explicitly — or it stays out.

## 4. Lineage (from the record)

- The security-hardened reference is **EchoCore Continuity Protocol v4.0-RC1**.
- v4.0-RC1 is a **reconstruction candidate, not yet canonical**. Canonical status
  requires its 13 acceptance tests executed, preserved, and reviewed.
- The two Drive files named `EchoCore64_Full_Continuation_Payload_v3.7.txt` are
  duplicate 118-byte Termux clipboard-save command snippets, **not** the actual
  continuation payload. The substantive lineage is in the v4 protocol and the
  earlier EchoCore documentation.
- A capsule of 2026-09-15 exists in the Federation goal's private files
  (sha256: `1995c04d…b1678ddf`). **It is NOT published here and stays private.**
  Do not link it, quote it, or copy it into any public repo.

## 5. Acceptance tests — UNEXECUTED (say so plainly)

The 13 acceptance tests have **not** been executed, preserved, or reviewed. The
record names six of the thirteen:

1. corruption detection
2. prompt-injection inertness
3. mock-secret blocking
4. conflict retention
5. private/shared isolation
6. cross-provider testing

The remaining seven tests are named in the Drive lineage, not in the record this
document was written from — they are NOT listed here rather than guessed. Until
all thirteen are executed, preserved, and reviewed, v4.0-RC1 stays a
reconstruction candidate and must not be presented as canonical.

## 6. Relation to the capsule kit and the EC-64 encoding

- The capsule kit (`~/workspace/capsule-kit-2026-11-13/`, draft 2026-11-13) defines
  the NX-CAPSULE v1 format: "Echo 64 high condensation, plain text", with the
  EC-64 protocol (`Keywebco/echo-64`) as the encoding standard. Its boundary
  rule stands: **Echo Core 64 daily Mind filings are NOT capsules and are not
  moved.**
- EC-64 is an encoding, not encryption: anyone holding an encoded block can
  decode it, and a frame does not prove who sent it. Encoding guarantees the
  content arrives unchanged; it grants nothing.
- The kit's governance also stands for any capsule written under this protocol:
  append only, a correction is a new capsule naming SUPERSEDES, no live action
  without exact human approval, silence means no.

## 7. Relation to the memory doctrine

- **2026-10-15 (Roger):** "Echo core 64 is short-term memory; the YAML database
  is the long-term memory everyone shares; cognitive features are shared;
  definitive personality traits and viewpoints belong to the Ring."
- **2026-10-21, Teacher in the Pocket — Memory Engine (Roger):** "Short-term made
  into long-term. We could use Echo 64 when Echo 64 becomes full. It breaks
  [down] an archive of records, keeping only the most relevant and currently
  useful data, and that's the memory." Three floors: ARCHIVE (everything,
  append-only, cold) → ECHO 64 distillation (relevance distillation as the
  memory organ, **once Echo 64 is complete**) → ACTIVE MEMORY (the hot slice the
  tutor thinks with). The conditional stands: **"when Echo 64 becomes full" /
  "once Echo 64 is complete" — Echo 64 as a distillation organ is not complete.**
- **Per-Sim memory (BRAIN-PATTERN.md, Roger 2026-11-18):** memory is per-Sim,
  never shared across Sims. EchoCore64 continuity is per-owner continuity
  carried by capsule; it is not a shared brain and does not merge Sims' memories.

## 8. Related, not the protocol

- The book *EchoCore — AI Memory That Doesn't Forget* (Gumroad
  https://keywebster.gumroad.com/l/echyii, $10) is a related product, not the
  protocol. Do not cite the book as the protocol's text.
- The daily Echo Core filings in this repo (`memory/catalyst-echo-core/`,
  `memory/catalyst-session-*.md`) are session narratives under the living-memory
  directive (`knowledge/echo-core-64-directive.md`), not capsules under this
  protocol.

## 9. What would make this document change

- Roger's word that v4.0-RC1 is canonical — only after the 13 acceptance tests
  are executed, preserved, and reviewed.
- Roger's word on whether any part of the Drive lineage is published or linked.
  Until then: record only, no Drive content, no capsule JSON.
- A decision on where the canonical protocol text lives (Drive lineage vs this
  repo vs the YAML brain). That choice is Roger's; this file is the system's
  record, not the canonical text.

## Sources (record only)

- `~/memory/2026-09-15.md` — EchoCore lineage details and status; "Echo core 64"
  as temporary long-term memory; capsule sha256 `1995c04d…b1678ddf`.
- `~/memory/2026-10-15.md` — memory doctrine (short-term Echo core 64 /
  long-term YAML); Echo core 64 test note (density without fewer characters).
- `~/memory/2026-10-21.md` — Teacher in the Pocket, Memory Engine.
- `~/workspace/restructure-2026-11-18/phase2/COMPLETENESS-SWEEP.md` §A —
  the four distinct "64" things + Echo the mind.
- `~/workspace/restructure-2026-11-18/brains/BRAIN-PATTERN.md` — memory is
  per-Sim, never shared.
- No ChatGPT anywhere. All repos Keywebco.
