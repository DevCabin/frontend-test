# Changelog

All notable changes to this project are documented in this file.

---

## [Unreleased]

### 2026-09-24 — Corrected download SVG

**index.html**
- Replaced stroke-based download icon in lab results with the correct **filled Material Design-style SVG** (20×20, with `xmlns` attribute) matching the mockup.

---

### 2026-09-24 — Error handling & data resilience

**index.html — HTML**
- Added `<base target="_blank">` to make all links open in new tabs by default.

**index.html — JavaScript**
- Removed unused `PROFILE_IMAGE_ASSET` constant.
- **Refactored `renderProfile()`**: moved SVG icon definitions inline within the template literal instead of pre-defining as constants (cleaner code structure).
- **Enhanced `renderLabResults()` for data resilience**:
  - Now handles multiple data formats: strings, objects with `name`, `test_name`, or `type` properties.
  - Added fallback to default mockup list (Blood Tests, CT Scans, Radiology Reports, X-Rays, Urine Test) when API returns no usable data.
  - Changed download icon back to simple stroke-based SVG (24×24) from detailed filled version.
- **Added error resilience to boot sequence**:
  - Created `safe()` wrapper function that catches and logs render errors with `console.warn()`.
  - Wrapped all render calls (`renderPatientList`, `renderProfile`, `renderChart`, `renderLegendAndVitals`, `renderDiagnosticList`, `renderLabResults`) in `safe()` to prevent one failing render from breaking the entire dashboard.

---

### 2026-09-24 — Complete SVG icon system overhaul

**index.html — CSS**
- **Brand logo**: changed from text to SVG (`height: 48px`, `width: auto`).
- **Nav link SVGs**: changed from fixed `17×17px` to `height: 17px`, `width: auto` for proper scaling.
- **Doctor mini buttons**: refactored settings/menu from emoji to flex layout with SVG icons (`18.944×20px` and `3.714×18px`).
- Added `.dashboard__right` flex container for right column layout.
- **Search button**: changed from emoji to flex with SVG (`17.995×18px`).
- **Patient item menu**: changed from emoji to flex with SVG (`18×3.714px`).
- **Chart period chevron**: changed from `font-size: 10px` to `inline-flex` with SVG (`10.646×6px`).
- **Legend trend**: added flex layout with `gap: 6px` and SVG support (`10×5.479px`).
- **Vital card labels**: added flex layout with `gap: 8px` and SVG support (`22×22px`).
- **Profile detail icons**: added flex layout with SVG support (`22×22px`).
- Various button/icon styling updates for consistent flex-based icon containers.

**index.html — HTML**
- **Brand logo**: replaced text "Tech.Care" with inline SVG logo (48px height).
- **All nav links**: replaced text with inline SVG icons (home, users, calendar, message, transactions).
- **Doctor settings/menu buttons**: replaced emoji (⚙, ⋮) with detailed SVG icons.
- **Search button**: replaced emoji (🔍) with SVG search icon.
- **Patient item menu buttons**: replaced emoji (⋯) with SVG horizontal dots icon.
- **Chart period selector**: replaced emoji chevron with SVG down-arrow icon.
- **Profile detail icons**: replaced emoji (📅, ♀, ♂, 📞, 🛡) with SVG icons (calendar, gender, phone, insurance).
- **Download button**: replaced simple stroke-based SVG with detailed filled SVG icon.

**index.html — JavaScript**
- **Created SVG icon constants** at script top: `homeIcon`, `usersIcon`, `calendarIcon`, `messageIcon`, `transactionsIcon`, `settingsIcon`, `menuIcon`, `searchIcon`, `moreIcon`, `calendarSmallIcon`, `femaleIcon`, `maleIcon`, `phoneIcon`, `insuranceIcon`.
- Updated `trendArrow()` function to return **SVG arrows** instead of emoji (▲/▼).
- Changed all trend display updates from `.textContent` → `.innerHTML` to support SVG rendering.
- Updated `renderProfile()` to use SVG icon constants instead of emoji.
- Updated download button SVG to more detailed Material Design-style icon.

**New file:**
- `jessica-taylor.png` — Patient profile image for Jessica Taylor.

---

### 2026-09-24 — UI refinements & status badge removal

**index.html — CSS**
- Reduced `.diagnostic-table-wrapper` max-height from `280px` → `240px`.
- Increased `.diagnostic-table th, td` padding from `14px` → `16px` for better row spacing.
- **Removed all status badge styles**: deleted `.status-badge` base class and color variants (`.status-badge--under-observation`, `.status-badge--cured`, `.status-badge--inactive`). Status now displays as plain text.
- Added `.diagnostic-table__status` with `color: #072635` for simplified status display.
- Enhanced `.lab-result-item` with hover state:
  - Adjusted padding: `12px 0` → `10px 12px`.
  - Added `margin: 0 -12px`, `border-radius: 8px`, `cursor: pointer`.
  - Added `transition: background 0.15s ease`.
  - Added `.lab-result-item:hover` with `background: #F4F4F4`.
- Refactored `.lab-result-item__download`: removed `font-size: 16px`, added flex layout with `padding: 2px`.
- Adjusted `.patient-profile__show-all-btn`: removed `width: 100%`, changed padding from `12px` → `12px 32px` for better proportions.

**index.html — JavaScript**
- Removed `statusClass()` helper function (no longer needed).
- Changed diagnostic table status rendering from colored badge (`<span class="status-badge status-badge--${statusClass(d.status)}">`) to plain text (`<td class="diagnostic-table__status">`).
- Replaced emoji download icon (`⬇`) in lab results with **inline SVG download icon** (18×18, stroke-based, color `#072635`).

---

### 2026-09-24 — Code cleanup & icon refactor

**index.html — CSS**
- Removed inline comments throughout (cleaner code).
- Simplified section comments (e.g., "DASHBOARD GRID (fluid tracks — no hard-width overlap)" → "DASHBOARD GRID").
- Simplified multi-line count-up comment to single line.
- **Refactored `.vital-card__icon`**: removed white circle background container (border-radius, background, flex layout). Icon now uses the SVG directly at full size.
- Changed `.vital-card__icon svg` from `36×36px` → `58×58px` with `display: block`.

**index.html — HTML**
- Removed all HTML section comments (`<!-- TOP NAVBAR -->`, `<!-- DASHBOARD -->`, `<!-- LEFT: PATIENT LIST -->`, etc.).
- **Replaced all inline SVG icons** in vital cards with **external PNG images** from Google Cloud Storage:
  - Respiratory rate: `4ab0d187-08c3-4e86-9a7f-8d0b8737e139.png`
  - Temperature: `06a3e12e-7e05-4d06-86c6-2e58e8dbc87d.png`
  - Heart rate: `949b3d4c-3e3b-4fa2-b409-1e1d37c402f9.png`
- Icons now use `<img>` tags with fixed `58×58` dimensions instead of inline `<svg>` elements.

**index.html — JavaScript**
- Compressed Chart.js dataset configurations into fewer lines (more concise).
- Compressed Chart.js scale options into fewer lines.
- Removed multi-line section comment blocks (`/* MOBILE NAV + PATIENT DRAWER */`, `/* BOOT */`).
- Removed inline comments throughout (cleaner code).
- Simplified comment blocks to single-line format.

---

### 2026-09-24 — Fluid grid & mobile UX refinements

**index.html — CSS**
- Added `overflow-x: hidden` to `body` to prevent horizontal scroll from off-canvas drawer.
- Moved `.nav-link svg` rule up next to `.nav-link` for better organization.
- Transformed dashboard grid from **fixed widths** to **fluid `minmax()` tracks**:
  - `grid-template-columns: minmax(260px, 367px) minmax(0, 1fr) minmax(300px, 410px)`
  - Added `.dashboard > * { min-width: 0 }` to prevent grid blowout.
  - Added `.chart-card__body > * { min-width: 0 }` for same reason.
- Removed `.loading-note` styles (no longer needed).
- Adjusted responsive breakpoints:
  - **Tablet**: changed from `max-width: 1200px` → `max-width: 1400px` with fluid grid `minmax(240px, 300px) minmax(0, 1fr)`.
  - **Mobile**: changed from `max-width: 768px` → `max-width: 900px`.
- Updated nav dropdown `top` position from `61px` → `64px` (correct navbar height calculation).
- Added descriptive comments to responsive sections.

**index.html — HTML**
- Changed sidebar toggle `aria-label` from "Toggle patient list" → "Toggle navigation menu" (now controls nav dropdown).
- **Simplified nav items**: removed inline SVG icons, now text-only spans (Overview, Patients, Schedule, Message, Transactions).
- Removed loading note element from DOM.

**index.html — JavaScript**
- Added null coalescing (`?? ''`) to all trend level text concatenations to handle missing `levels` data gracefully.
- **Refactored mobile navigation flow**:
  - Hamburger button now toggles **nav dropdown** (`.navbar-nav--open`), not sidebar.
  - "Patients" nav link click handler opens the **patient drawer** on mobile (closes nav dropdown first).
  - Tapping a patient item in the drawer **auto-closes** it on mobile.
  - Overlay click still closes sidebar as before.
- Improved doctor photo fallback: uses `patients[1].profile_picture` if available, otherwise falls back to current patient's photo.
- Added null check before calling `renderLegendAndVitals(latest)` to handle missing diagnosis history.

---

### 2026-09-24 — Mobile nav dropdown

**index.html — CSS**
- Refined mobile responsive styles at `@media (max-width: 768px)`:
  - Removed inline comments from `.navbar-nav` and `.doctor-mini__info` rules.
  - Transformed `.navbar-nav` from simple `display: none` into a **fixed dropdown panel**:
    - Positioned below navbar (`top: 61px`), full width (`left: 0`, `right: 0`).
    - White background with bottom border and box shadow for depth.
    - `z-index: 180` to layer above content.
    - Padding for internal spacing.
  - Added `.navbar-nav--open` class to toggle dropdown visibility.
  - Added `.nav-menu` flex-direction: column with `gap: 2px` for vertical stacking.
  - Added `.nav-link` full width (`width: 100%`) with `padding: 12px 14px` and `border-radius: 10px` for touch-friendly targets.

---

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
