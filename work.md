# Work Log — Lumeza Shopify Theme

This file tracks all git commits with their ID, type, files changed, and a short description.
This file is committed alongside every change so the log is always up to date.

---

## Commit History

---

### `68aa638` — Initial Commit
- **Date:** 2026-09-04
- **Type:** `init`
- **Files Changed:** All base theme files (assets, blocks, config, layout, locales, sections, snippets, templates)
- **Details:** Initial upload of the Luna Shopify theme. Project setup, all default theme files included.

---

### `e02f917` — Add Coming Soon Page
- **Date:** 2026-09-04
- **Type:** `feat`
- **Files Changed:**
  - `sections/coming-soon.liquid` *(new)*
  - `templates/password.json` *(modified)*
- **Details:** Created a new Coming Soon section and wired it to the password page template. Included a newsletter signup form and basic countdown timer.

---

### `d5b27f3` — Redesign Coming Soon Page + Add work.md
- **Date:** 2026-09-04
- **Type:** `design`
- **Files Changed:**
  - `sections/coming-soon.liquid` *(redesigned)*
  - `work.md` *(new)*
- **Details:** Completely redesigned the Coming Soon page with a premium dark glassmorphism UI. Added animated gradient orbs, grid overlay, shimmer headline, live countdown timer, inline newsletter form with gradient button, and optional social links (Instagram, X, Facebook). Added `work.md` to track commit history.

---

### `1e3f55f` — Update work.md with Detailed Commit History
- **Date:** 2026-09-04
- **Type:** `docs`
- **Files Changed:**
  - `work.md` *(modified)*
- **Details:** Reformatted work.md so each commit has its own section with commit ID, date, type, files changed, and full details. Established the rule that work.md must be updated and committed with every change.

---

### `646da04` — Fix: Remove Scroll from Coming Soon Page
- **Date:** 2026-09-04
- **Type:** `fix`
- **Files Changed:**
  - `sections/coming-soon.liquid` *(modified)*
- **Details:** The Coming Soon page was scrollable because the password layout's header and footer were adding extra height outside the section. Fixed by changing `.cs-page` to `position: fixed; inset: 0; z-index: 9999` so it overlays the full viewport. Also hid `.template-password .password-header`, `footer`, and `hr` using `display: none` so the default password UI doesn't show underneath.

---

## Commit Type Reference



| Type | Meaning |
|------|---------|
| `init` | Initial project setup |
| `feat` | New feature added |
| `design` | UI/UX design update |
| `fix` | Bug fix |
| `refactor` | Code restructure without feature change |
| `style` | CSS/style-only changes |
| `config` | Configuration changes |
| `docs` | Documentation updates |
| `chore` | Maintenance tasks |

---

> **Rule:** Always update this file and include it in every commit so the log stays in sync.
