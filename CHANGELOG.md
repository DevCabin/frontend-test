# Changelog

All notable changes to this project are documented in this file.

---

## [Unreleased]

### 2026-09-24 — Mobile responsive & nav icons

**index.html — CSS**
- Added `.nav-link svg` sizing rule (17×17px, flex-shrink: 0).
- Added `.navbar-toggle` hamburger button styles (hidden by default, visible at ≤768px).
- Expanded `@media (max-width: 768px)` with full mobile responsive layout:
  - Toggle button visible, nav pills and doctor info hidden.
  - Dashboard switches to single-column layout with reduced padding.
  - Patient sidebar becomes a fixed slide-out drawer (85vw, max 340px) with smooth transform animation and box shadow.
  - Added `.sidebar-overlay` with fade transition for backdrop when drawer is open.
  - Patient profile auto-positions to full width.

**index.html — HTML**
- Added hamburger toggle button (`☰`) with `id="sidebarToggle"` and aria-label to navbar.
- Added `id="mainNav"` to nav element.
- Replaced text-only nav links with **SVG icons + text spans** for all five nav items (Overview, Patients, Schedule, Message, Transactions). Each icon is inline SVG with stroke-based design matching the Manrope font aesthetic.

**index.html — JavaScript**
- Enhanced `formatDate()` function to handle multiple date formats:
  - `YYYY-MM-DD` (ISO format from API)
  - `MM/DD/YYYY` (US format)
  - Fallback to native `Date` parsing for other formats.
- Added mobile sidebar drawer functionality:
  - Creates overlay element dynamically and appends to body.
  - Toggle button click handler opens/closes sidebar with `.patients-sidebar--open` class.
  - Overlay click handler closes sidebar and removes `.sidebar-overlay--visible` class.
  - Smooth slide-in/slide-out animation with backdrop fade.

---

### 2026-09-24 — Dynamic data-driven dashboard (API integration)

**index.html — CSS (inline `<style>`)**
- Added `cursor: pointer` to `.patient-item` for interactive feedback.
- Removed all hardcoded CSS count-up keyframes and classes (`.count-up--systolic`, `.count-up--diastolic`, `.count-up--respiratory`, `.count-up--heart`, `.count-up--temp-whole`) — now injected dynamically at runtime from API values.
- Added `data-fallback` attribute support for `@supports not (syntax: '<integer>')` fallback.
- Removed `animation-delay` from `.count-up` base rule (now set per-element via JS).
- Added `.loading-note` styles for the loading state placeholder.
- Removed CSS file header comment.

**index.html — HTML structure**
- Replaced hardcoded patient list with empty `<ul id="patientList">` for dynamic rendering.
- Replaced hardcoded diagnostic table rows with empty `<tbody id="diagnosticBody">`.
- Replaced hardcoded lab results with empty `<ul id="labResultsList">`.
- Replaced hardcoded patient profile data with placeholder elements and `id` attributes.
- Added `id` attributes to all vital sign elements (`systolicValue`, `diastolicValue`, `respiratoryValue`, `temperatureValue`, `heartValue`, etc.) for JS targeting.
- Updated doctor avatar URL from pravatar.cc to Google Cloud Storage (`fedskillstest.storage.googleapis.com`).
- Added loading note element for initial state.

**index.html — JavaScript (complete refactor)**
- Added API endpoint constant pointing to `https://fedskillstest.co.uk/api/v1/patients`.
- Added `TARGET_PATIENT` constant ("Jessica Taylor") per test requirements.
- Implemented `fetchPatients()` async function to fetch data from API.
- Implemented `fallbackPatients()` function with complete hardcoded patient data as offline fallback.
- Implemented `lastSixMonths()` helper to filter diagnosis history to last 6 months.
- Implemented `statusClass()` helper for mapping status strings to CSS classes.
- Implemented `trendArrow()` helper for rendering up/down trend indicators.
- Implemented `registerCountUp()` function for dynamic CSS count-up animations with IntersectionObserver support.
- Implemented `renderPatientList()` to dynamically populate patient sidebar with click handlers.
- Implemented `renderProfile()` to populate patient profile (name, DOB, gender, contact, insurance).
- Implemented `renderChart()` to render Chart.js blood pressure line chart from API data.
- Implemented `renderLegendAndVitals()` to populate chart legend and vital signs cards with animated values.
- Implemented `renderDiagnosticList()` to render diagnosis history table.
- Implemented `renderLabResults()` to render lab results list.
- Implemented `init()` boot function that orchestrates data fetching, fallback handling, and rendering.
- Added patient click handlers for switching between patients and re-rendering all dashboard sections.

---

### 2026-09-24 — Populate dashboard content & add Chart.js

**index.html**
- Replaced all local image paths (`assets/doctor.jpg`, `assets/patients/*`) with **pravatar.cc** placeholder URLs for doctor and patient avatars.
- Populated the **patient list** sidebar with full data: Emily Williams, Ryan Johnson, Brandon Mitchell, Jessica Taylor (active), Samantha Johnson, Ashley Martinez, etc.
- Added real **diagnosis history** table rows (e.g., Hypertension, Diabetes, Asthma, Osteoarthritis) with dates, status badges, etc.
- Added **lab results** data items (CBC, Lipid Panel, HbA1c, X-Rays) with dates and download buttons.
- Populated the **patient profile** (Jessica Taylor) with date of birth, gender, contact info, emergency contact, and insurance provider.
- Integrated **Chart.js** (`chart.umd.min.js`) with an inline script rendering a blood-pressure line chart (systolic in pink `#E66CAB`, diastolic in purple `#8C6FE6`) across 6 months (Oct 2023 – Mar 2024).
- Chart configured with Manrope font, custom grid, responsive sizing, and smooth curve tension.
- Flattened HTML indentation across the document for a cleaner structure.

---

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
