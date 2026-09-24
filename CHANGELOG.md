# Changelog

All notable changes to this project are documented in this file.

---

## [Unreleased]

### 2026-09-24 — Typography polish & CSS cleanup

**index.html**
- Added Google Fonts preconnect hints (`fonts.googleapis.com`, `fonts.gstatic.com`) for faster font loading.
- Imported the **Manrope** font (weights 400, 500, 700, 800) via Google Fonts stylesheet link.

**styles.css**
- Set global text color to `#072635` (dark navy) on `body`.
- Updated `.nav-link` color from `#333` → `#072635` for consistency with the new body color.
- Increased `.section-title` font-size from `22px` → `24px` and added `font-weight: 800`.
- Added new `.chart-card__title` rule: `font-size: 18px`, `font-weight: 700`.
- Added new `.patient-profile__name` rule: `font-size: 30px`, `font-weight: 800`.
- Removed all temporary "ghost" dashed borders that were used for skeleton visibility during early layout work (affected `.top-navbar`, `.patients-sidebar`, `.chart-card`, `.vital-card`, `.diagnostic-table-wrapper`, `.lab-results`, `.patient-profile`).
- Removed empty placeholder rules for `.status-badge--under-observation`, `.status-badge--cured`, `.status-badge--inactive`.
- Cleaned up inline comments throughout the stylesheet — removed "keep", "fill in later", and other development notes that are no longer relevant.
- Updated file header comment to reflect that real colors are now in place.

---

## [1.0.0] — 2026-09-24 — Initial scaffold

- **index.html** — Initial HTML structure for the Tech.Care HealthCare Dashboard. Includes top navbar, patient sidebar, chart card, vital signs cards, diagnostic table, lab results section, and patient profile.
- **styles.css** — Skeleton CSS with layout-only styles. Ghost/dashed borders for structure visibility. Placeholder color values and empty rules for components to be styled later.
