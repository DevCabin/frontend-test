const API_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const API_USERNAME = 'coalition';
const API_PASSWORD = 'skills-test';
const TARGET_PATIENT = 'Jessica Taylor';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

let bpChart = null;
let allPatients = null;

async function fetchPatients() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(API_USERNAME + ':' + API_PASSWORD),
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    if (!response.ok) throw new Error('API returned ' + response.status);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function fallbackPatients() {
  const history = [];
  const data = [
    ['October', 2023, 120, 108], ['November', 2023, 118, 65], ['December', 2023, 160, 110],
    ['January', 2024, 112, 92], ['February', 2024, 150, 72], ['March', 2024, 158, 78]
  ];
  data.forEach(([month, year, sys, dia]) => {
    history.push({
      month, year,
      blood_pressure: {
        systolic:  { value: sys, levels: sys > 140 ? 'Higher than Average' : 'Normal' },
        diastolic: { value: dia, levels: dia < 80 ? 'Lower than Average' : 'Normal' }
      },
      heart_rate:       { value: 78, levels: 'Lower than Average' },
      respiratory_rate: { value: 20, levels: 'Normal' },
      temperature:      { value: 98.6, levels: 'Normal' }
    });
  });
  return [{
    name: 'Jessica Taylor', gender: 'Female', age: 28,
    profile_picture: '',
    date_of_birth: '1996-08-23',
    phone_number: '(415) 555-1234',
    emergency_contact: '(415) 555-5678',
    insurance_type: 'Sunrise Health Assurance',
    diagnosis_history: history,
    diagnostic_list: [
      { name: 'Hypertension', description: 'Chronic high blood pressure', status: 'Under Observation' },
      { name: 'Type 2 Diabetes', description: 'Insulin resistance and elevated blood sugar', status: 'Cured' },
      { name: 'Asthma', description: 'Recurrent episodes of bronchial constriction', status: 'Inactive' }
    ],
    lab_results: [
      { name: 'Blood Tests' }, { name: 'CT Scans' },
      { name: 'Radiology Reports' }, { name: 'X-Rays' }
    ]
  }];
}

const ARROW_UP_SVG = '<svg viewBox="0 0 10 5.479" width="10" height="5.479" fill="none"><path d="M4.364,5.2.186,1.024A.673.673,0,0,1,.05.832.532.532,0,0,1,0,.6.606.606,0,0,1,.165.18.56.56,0,0,1,.6,0H9.4a.56.56,0,0,1,.434.181A.611.611,0,0,1,10,.6a1.85,1.85,0,0,1-.186.421L5.636,5.2a.962.962,0,0,1-.3.21.9.9,0,0,1-.677,0A.963.963,0,0,1,4.364,5.2Z" transform="translate(10 5.479) rotate(180)"/></svg>';
const ARROW_DOWN_SVG = '<svg viewBox="0 0 9.999 5.479" width="10" height="5.479" fill="none"><path d="M333.518-544.8l-4.177-4.178a.673.673,0,0,1-.136-.193.532.532,0,0,1-.05-.228.606.606,0,0,1,.165-.424.56.56,0,0,1,.434-.18h8.8a.56.56,0,0,1,.434.181.611.611,0,0,1,.165.423,1.85,1.85,0,0,1-.186.421l-4.177,4.177a.962.962,0,0,1-.3.21.851.851,0,0,1-.338.066.851.851,0,0,1-.339-.066A.963.963,0,0,1,333.518-544.8Z" transform="translate(-329.155 549.999)"/></svg>';

function trendArrow(levels) {
  const t = (levels || '').toLowerCase();
  if (t.includes('higher')) return ARROW_UP_SVG;
  if (t.includes('lower'))  return ARROW_DOWN_SVG;
  return '';
}

function monthIndex(m) {
  const i = MONTHS.indexOf(m);
  if (i >= 0) return i;
  const j = MONTHS.findIndex(name => name.startsWith(m));
  return j >= 0 ? j : 0;
}

function lastSixMonths(history) {
  return [...(history || [])].sort((a, b) =>
    (a.year - b.year) || (monthIndex(a.month) - monthIndex(b.month))
  ).slice(-6);
}

function registerCountUp(el, target, delaySec = 0) {
  if (!el) return;
  if (el._countStyle) el._countStyle.remove();   /* drop keyframes from previous patient */
  const name = 'count-' + Math.random().toString(36).slice(2, 9);
  const style = document.createElement('style');
  style.textContent = `@keyframes ${name} { to { --num: ${Math.floor(target)}; } }`;
  document.head.appendChild(style);
  el._countStyle = style;
  el.style.animationName = name;
  el.style.animationDelay = delaySec + 's';
  el.setAttribute('data-fallback', Math.floor(target));
  el.classList.add('count-up');
}

function formatDate(dob) {
  if (!dob) return '';
  let y, m, d;
  if (/^\d{4}-\d{2}-\d{2}/.test(dob)) {
    [y, m, d] = dob.slice(0, 10).split('-').map(Number);
  } else if (/^\d{2}\/\d{2}\/\d{4}/.test(dob)) {
    [m, d, y] = dob.slice(0, 10).split('/').map(Number);
  } else {
    const dt = new Date(dob);
    if (isNaN(dt)) return dob;
    return `${MONTHS[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
  }
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function renderPatientList(patients, activeName) {
  document.getElementById('patientList').innerHTML = patients.map(p => `
    <li class="patient-item ${p.name === activeName ? 'patient-item--active' : ''}">
      <img src="${p.profile_picture}" alt="" class="patient-item__avatar"
           onerror="this.onerror=null; this.src='https://i.pravatar.cc/88?u=${encodeURIComponent(p.name)}'">
      <div class="patient-item__info">
        <span class="patient-item__name">${p.name}</span>
        <span class="patient-item__meta">${p.gender}, ${p.age}</span>
      </div>
      <button class="patient-item__menu" aria-label="Patient options"><svg viewBox="0 0 18 3.714" fill="none"><path d="M191.09-536.285a1.788,1.788,0,0,1-1.312-.546,1.788,1.788,0,0,1-.546-1.312,1.788,1.788,0,0,1,.546-1.312A1.788,1.788,0,0,1,191.09-540a1.788,1.788,0,0,1,1.312.546,1.788,1.788,0,0,1,.546,1.312,1.788,1.788,0,0,1-.546,1.312A1.788,1.788,0,0,1,191.09-536.285Zm7.143,0a1.788,1.788,0,0,1-1.312-.546,1.788,1.788,0,0,1-.546-1.312,1.788,1.788,0,0,1,.546-1.312,1.788,1.788,0,0,1,1.312-.546,1.788,1.788,0,0,1,1.312.546,1.788,1.788,0,0,1,.546,1.312,1.788,1.788,0,0,1-.546,1.312A1.788,1.788,0,0,1,198.233-536.285Zm7.143,0a1.788,1.788,0,0,1-1.312-.546,1.788,1.788,0,0,1-.546-1.312,1.788,1.788,0,0,1,.546-1.312,1.788,1.788,0,0,1,1.312-.546,1.788,1.788,0,0,1,1.312.546,1.788,1.788,0,0,1,.546,1.312,1.788,1.788,0,0,1-.546,1.312,1.788,1.788,0,0,1-1.312.546Z" transform="translate(-189.233 539.999)" fill="#072635"/></svg></button>
    </li>`).join('');
}

const PROFILE_IMAGE_ASSET = 'jessica-taylor.png'; // mockup portrait, local file next to index.html

function renderProfile(p) {
  const birthIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><g transform="translate(-1235 -471)"><circle cx="21" cy="21" r="21" transform="translate(1235 471)" fill="#f6f7f8"/><path d="M141.892-844.614a1.826,1.826,0,0,1-1.342-.549,1.826,1.826,0,0,1-.549-1.342v-14a1.826,1.826,0,0,1,.549-1.342,1.826,1.826,0,0,1,1.342-.549h1.449v-1.408a.78.78,0,0,1,.23-.574.78.78,0,0,1,.574-.23.779.779,0,0,1,.574.23.779.779,0,0,1,.23.574v1.408h7.928v-1.429a.76.76,0,0,1,.225-.559.759.759,0,0,1,.559-.225.759.759,0,0,1,.559.225.76.76,0,0,1,.225.559v1.429H155.9a1.826,1.826,0,0,1,1.342.549,1.826,1.826,0,0,1,.549,1.342v14a1.826,1.826,0,0,1-.549,1.342,1.826,1.826,0,0,1-1.342.549Zm0-1.569h14a.308.308,0,0,0,.221-.1.308.308,0,0,0,.1-.221v-9.819H141.57v9.819a.308.308,0,0,0,.1.221A.308.308,0,0,0,141.892-846.183Zm-.322-11.71h14.648v-2.616a.308.308,0,0,0-.1-.221.308.308,0,0,0-.221-.1h-14a.308.308,0,0,0-.221.1.308.308,0,0,0-.1.221Zm0,0v0Z" transform="translate(1106.999 1346.614)" fill="#072635"/></g></svg>';
  const femaleIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><g transform="translate(-1235 -471)"><circle cx="21" cy="21" r="21" transform="translate(1235 471)" fill="#f6f7f8"/><path d="M275.456-772.423H273.94a.88.88,0,0,1-.648-.261.88.88,0,0,1-.261-.648.879.879,0,0,1,.261-.648.88.88,0,0,1,.648-.261h1.515v-3.1a6.172,6.172,0,0,1-3.907-2.136,6.214,6.214,0,0,1-1.548-4.19,6.072,6.072,0,0,1,1.861-4.484,6.164,6.164,0,0,1,4.5-1.843,6.164,6.164,0,0,1,4.5,1.843,6.072,6.072,0,0,1,1.861,4.484,6.215,6.215,0,0,1-1.548,4.19,6.172,6.172,0,0,1-3.907,2.136v3.1h1.515a.879.879,0,0,1,.648.261.88.88,0,0,1,.261.648.879.879,0,0,1-.261.648.88.88,0,0,1-.648.261h-1.515v1.515a.879.879,0,0,1-.261.648.88.88,0,0,1-.648.261.879.879,0,0,1-.648-.261.88.88,0,0,1-.261-.648Zm.911-6.667a4.375,4.375,0,0,0,3.214-1.332,4.385,4.385,0,0,0,1.33-3.216,4.375,4.375,0,0,0-1.332-3.214,4.385,4.385,0,0,0-3.216-1.33,4.375,4.375,0,0,0-3.214,1.332,4.385,4.385,0,0,0-1.33,3.216,4.375,4.375,0,0,0,1.332,3.214A4.385,4.385,0,0,0,276.366-779.09Z" transform="translate(979.999 1271.999)" fill="#072635"/></g></svg>';
  const maleIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><g transform="translate(-1235 -471)"><circle cx="21" cy="21" r="21" transform="translate(1235 471)" fill="#f6f7f8"/><path d="M190-788.833v4.963a.936.936,0,0,1-.278.69.937.937,0,0,1-.69.278.936.936,0,0,1-.689-.278.937.937,0,0,1-.278-.69v-2.8l-5.874,5.829a8.5,8.5,0,0,1,.991,1.94,6.281,6.281,0,0,1,.366,2.13,6.537,6.537,0,0,1-1.97,4.8,6.535,6.535,0,0,1-4.8,1.971,6.539,6.539,0,0,1-4.8-1.97,6.534,6.534,0,0,1-1.971-4.8,6.539,6.539,0,0,1,1.971-4.8,6.535,6.535,0,0,1,4.8-1.971,6.408,6.408,0,0,1,2.115.356,7.457,7.457,0,0,1,1.922,1l5.874-5.874h-2.814a.936.936,0,0,1-.69-.278.937.937,0,0,1-.278-.69.935.935,0,0,1,.278-.689.937.937,0,0,1,.69-.278h4.963a1.129,1.129,0,0,1,.831.335,1.128,1.128,0,0,1,.335.831Zm-13.228,7.221a4.658,4.658,0,0,0-3.421,1.418,4.667,4.667,0,0,0-1.416,3.423,4.658,4.658,0,0,0,1.418,3.421,4.667,4.667,0,0,0,3.423,1.416,4.658,4.658,0,0,0,3.421-1.418,4.668,4.668,0,0,0,1.416-3.423A4.658,4.658,0,0,0,180.2-780.2,4.667,4.667,0,0,0,176.773-781.612Z" transform="translate(1075.999 1271.999)" fill="#072635"/></g></svg>';
  const phoneIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><g transform="translate(-1235 -471)"><circle cx="21" cy="21" r="21" transform="translate(1235 471)" fill="#f6f7f8"/><path d="M158.754-800a15.86,15.86,0,0,1-6.682-1.546,21.268,21.268,0,0,1-6.167-4.363,21.421,21.421,0,0,1-4.357-6.167A15.823,15.823,0,0,1,140-818.752a1.214,1.214,0,0,1,.353-.89,1.192,1.192,0,0,1,.882-.356h3.837a1.175,1.175,0,0,1,.786.291,1.279,1.279,0,0,1,.433.718l.674,3.462a1.978,1.978,0,0,1-.029.828,1.231,1.231,0,0,1-.357.581l-2.717,2.645a16.322,16.322,0,0,0,1.5,2.273,22.419,22.419,0,0,0,1.825,2.046,20.311,20.311,0,0,0,2.059,1.8,20.68,20.68,0,0,0,2.355,1.545l2.64-2.663a1.494,1.494,0,0,1,.669-.4,1.922,1.922,0,0,1,.816-.057l3.267.665a1.382,1.382,0,0,1,.727.455,1.16,1.16,0,0,1,.282.765v3.814a1.191,1.191,0,0,1-.356.882A1.214,1.214,0,0,1,158.754-800Zm-15.726-13.145,2.1-2.009a.21.21,0,0,0,.074-.124.275.275,0,0,0-.006-.147l-.511-2.629a.242.242,0,0,0-.079-.136.228.228,0,0,0-.147-.045h-2.516a.154.154,0,0,0-.113.045.153.153,0,0,0-.045.113,15.049,15.049,0,0,0,.395,2.45A14.978,14.978,0,0,0,143.028-813.144Zm10.235,10.167a12.1,12.1,0,0,0,2.44.834,13.842,13.842,0,0,0,2.374.343.153.153,0,0,0,.113-.045.153.153,0,0,0,.045-.113v-2.475a.228.228,0,0,0-.045-.147.242.242,0,0,0-.136-.079l-2.471-.5a.186.186,0,0,0-.119-.006.289.289,0,0,0-.107.074ZM143.028-813.144ZM153.263-802.976Z" transform="translate(1105.999 1301.999)" fill="#072635"/></g></svg>';
  const insuranceIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><g transform="translate(-1235 -471)"><circle cx="21" cy="21" r="21" transform="translate(1235 471)" fill="#f6f7f8"/><path d="M186.9-842.111l-1.7-1.7a.784.784,0,0,0-.558-.244.764.764,0,0,0-.569.244.786.786,0,0,0-.249.572.786.786,0,0,0,.249.572l2.153,2.17a.927.927,0,0,0,.677.29.927.927,0,0,0,.677-.29l4.432-4.432a.793.793,0,0,0,.244-.567.774.774,0,0,0-.244-.577.786.786,0,0,0-.572-.249.786.786,0,0,0-.572.249Zm1.123,8.882a1.986,1.986,0,0,1-.327-.027,1.811,1.811,0,0,1-.311-.08A10.471,10.471,0,0,1,182-837.6a11.865,11.865,0,0,1-2-6.611v-4.816a1.829,1.829,0,0,1,.352-1.1,2.01,2.01,0,0,1,.9-.708l6.087-2.273a1.993,1.993,0,0,1,.677-.123,1.993,1.993,0,0,1,.677.123l6.087,2.273a2.01,2.01,0,0,1,.9.708,1.829,1.829,0,0,1,.352,1.1v4.816a11.865,11.865,0,0,1-2,6.611,10.471,10.471,0,0,1-5.383,4.266,1.811,1.811,0,0,1-.311.08A1.986,1.986,0,0,1,188.022-833.229Zm0-1.573a8.7,8.7,0,0,0,4.6-3.529,10.157,10.157,0,0,0,1.818-5.882v-4.827a.319.319,0,0,0-.057-.185.341.341,0,0,0-.159-.123l-6.087-2.273a.3.3,0,0,0-.113-.021.3.3,0,0,0-.113.021l-6.087,2.273a.341.341,0,0,0-.159.123.319.319,0,0,0-.057.185v4.827a10.157,10.157,0,0,0,1.818,5.882A8.7,8.7,0,0,0,188.022-834.8ZM188.022-843.23Z" transform="translate(1067.999 1335.229)" fill="#072635"/></g></svg>';

  document.getElementById('patientProfile').innerHTML = `
    <div class="patient-profile__header">
      <img src="${p.name === TARGET_PATIENT ? 'jessica-taylor.png' : p.profile_picture}" alt="${p.name}" class="patient-profile__avatar"
           onerror="this.onerror=null; this.style.visibility='hidden'">
      <h2 class="patient-profile__name">${p.name}</h2>
    </div>
    <ul class="patient-profile__details">
      <li class="profile-detail">
        ${birthIcon}
        <div class="profile-detail__content">
          <span class="profile-detail__label">Date Of Birth</span>
          <span class="profile-detail__value">${formatDate(p.date_of_birth) || '—'}</span>
        </div>
      </li>
      <li class="profile-detail">
        <span class="profile-detail__icon">${p.gender === 'Male' ? maleIcon : femaleIcon}</span>
        <div class="profile-detail__content">
          <span class="profile-detail__label">Gender</span>
          <span class="profile-detail__value">${p.gender ?? '—'}</span>
        </div>
      </li>
      <li class="profile-detail">
        ${phoneIcon}
        <div class="profile-detail__content">
          <span class="profile-detail__label">Contact Info.</span>
          <span class="profile-detail__value">${p.phone_number ?? '—'}</span>
        </div>
      </li>
      <li class="profile-detail">
        ${phoneIcon}
        <div class="profile-detail__content">
          <span class="profile-detail__label">Emergency Contacts</span>
          <span class="profile-detail__value">${p.emergency_contact ?? '—'}</span>
        </div>
      </li>
      <li class="profile-detail">
        ${insuranceIcon}
        <div class="profile-detail__content">
          <span class="profile-detail__label">Insurance Provider</span>
          <span class="profile-detail__value">${p.insurance_type ?? '—'}</span>
        </div>
      </li>
    </ul>
    <button class="patient-profile__show-all-btn">Show All Information</button>`;
}

function renderChart(sixMonths) {
  const labels = sixMonths.map(h => `${h.month.slice(0,3)}, ${h.year}`);
  const systolic  = sixMonths.map(h => h.blood_pressure.systolic.value);
  const diastolic = sixMonths.map(h => h.blood_pressure.diastolic.value);

  if (bpChart) bpChart.destroy();
  bpChart = new Chart(document.getElementById('bpChart').getContext('2d'), {
    type: 'line',
    data: { labels, datasets: [
      { label: 'Systolic', data: systolic,
        borderColor: '#E66CAB', backgroundColor: '#E66CAB',
        pointBackgroundColor: '#E66CAB', pointBorderColor: '#fff',
        pointBorderWidth: 1.5, pointRadius: 4, borderWidth: 2, tension: 0.4 },
      { label: 'Diastolic', data: diastolic,
        borderColor: '#8C6FE6', backgroundColor: '#8C6FE6',
        pointBackgroundColor: '#8C6FE6', pointBorderColor: '#fff',
        pointBorderWidth: 1.5, pointRadius: 4, borderWidth: 2, tension: 0.4 }
    ]},
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: 'easeOutQuart' },
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 60, max: 180,
             ticks: { stepSize: 20, color: '#072635', font: { family: 'Manrope', size: 10 } },
             grid: { color: 'rgba(7,38,53,0.12)' },
             border: { display: false } },
        x: { ticks: { color: '#072635', font: { family: 'Manrope', size: 10 } },
             grid: { display: false },
             border: { display: false } }
      }
    }
  });
}

function renderLegendAndVitals(latest) {
  const sys = latest.blood_pressure.systolic;
  const dia = latest.blood_pressure.diastolic;

  registerCountUp(document.getElementById('systolicValue'), sys.value, 0);
  registerCountUp(document.getElementById('diastolicValue'), dia.value, 0.15);
  document.getElementById('systolicTrend').innerHTML  = trendArrow(sys.levels) + (sys.levels ?? '');
  document.getElementById('diastolicTrend').innerHTML = trendArrow(dia.levels) + (dia.levels ?? '');

  const resp  = latest.respiratory_rate;
  const temp  = latest.temperature;
  const heart = latest.heart_rate;

  registerCountUp(document.getElementById('respiratoryValue'), resp.value, 0.3);
  document.getElementById('respiratoryStatus').innerHTML = trendArrow(resp.levels) + (resp.levels ?? '');

  const whole = Math.floor(temp.value);
  const dec   = Math.round((temp.value - whole) * 10);
  const tempEl = document.getElementById('temperatureValue');
  registerCountUp(tempEl, whole, 0.45);
  /* clear any previously appended decimal spans before adding one */
  let sib = tempEl.nextElementSibling;
  while (sib && sib.tagName === 'SPAN') {
    const next = sib.nextElementSibling;
    sib.remove();
    sib = next;
  }
  const decSpan = document.createElement('span');
  decSpan.textContent = '.' + dec;
  tempEl.after(decSpan);
  document.getElementById('temperatureStatus').innerHTML = trendArrow(temp.levels) + (temp.levels ?? '');

  registerCountUp(document.getElementById('heartValue'), heart.value, 0.6);
  document.getElementById('heartStatus').innerHTML = trendArrow(heart.levels) + (heart.levels ?? '');
}

function renderDiagnosticList(list) {
  const rows = (Array.isArray(list) ? list : []).filter(d => d && d.name);
  document.getElementById('diagnosticBody').innerHTML = rows.map(d => `
    <tr class="diagnostic-table__row">
      <td>${d.name}</td>
      <td>${d.description ?? ''}</td>
      <td class="diagnostic-table__status">${d.status ?? '—'}</td>
    </tr>`).join('');
}

function renderLabResults(list) {
  const items = (Array.isArray(list) ? list : [])
    .map(l => (typeof l === 'string' ? { name: l } : l))
    .map(l => l && (l.name || l.test_name || l.type)
      ? { name: l.name ?? l.test_name ?? l.type }
      : null)
    .filter(Boolean);

  /* API sent nothing usable — show the mockup's default list */
  const final = items.length ? items : [
    { name: 'Blood Tests' }, { name: 'CT Scans' },
    { name: 'Radiology Reports' }, { name: 'X-Rays' }, { name: 'Urine Test' }
  ];

  document.getElementById('labResultsList').innerHTML = final.map(l => `
    <li class="lab-result-item">
      <span class="lab-result-item__name">${l.name}</span>
      <button class="lab-result-item__download" aria-label="Download ${l.name}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M9.999,14.55a1.282,1.282,0,0,1-.449-.077,1.106,1.106,0,0,1-.395-.264L5.009,10.063a.94.94,0,0,1-.294-.7,1.025,1.025,0,0,1,.294-.709,1.019,1.019,0,0,1,.713-.321.944.944,0,0,1,.713.3L8.999,11.2V1a.968.968,0,0,1,.287-.713A.968.968,0,0,1,9.999,0a.968.968,0,0,1,.713.287A.968.968,0,0,1,10.999,1V11.2l2.564-2.564a.952.952,0,0,1,.706-.294,1,1,0,0,1,.719.314,1.044,1.044,0,0,1,.3.7.932.932,0,0,1-.3.7L10.843,14.209a1.1,1.1,0,0,1-.395.264A1.282,1.282,0,0,1,9.999,14.55ZM2.41,20a2.327,2.327,0,0,1-1.71-.7,2.327,2.327,0,0,1-.7-1.71V15a.968.968,0,0,1,.287-.713.968.968,0,0,1,.713-.287.968.968,0,0,1,.713.287A.968.968,0,0,1,2.71,15v2a.392.392,0,0,0,.128.282.392.392,0,0,0,.282.128H18.3a.392.392,0,0,0,.282-.128.392.392,0,0,0,.128-.282V15a.968.968,0,0,1,.287-.713.968.968,0,0,1,.713-.287.968.968,0,0,1,.713.287.968.968,0,0,1,.287.713v2.615a2.327,2.327,0,0,1-.7,1.71A2.327,2.327,0,0,1,17.7,20Z"/></svg>
      </button>
    </li>`).join('');
}

/* Mobile nav + patient drawer */
const mainNav = document.getElementById('mainNav');
const sidebar = document.querySelector('.patients-sidebar');
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

document.getElementById('sidebarToggle').addEventListener('click', () => {
  mainNav.classList.toggle('navbar-nav--open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    if (link.textContent.trim() !== 'Patients') return;
    mainNav.classList.remove('navbar-nav--open');
    sidebar.classList.add('patients-sidebar--open');
    overlay.classList.add('sidebar-overlay--visible');
  });
});

document.getElementById('patientList').addEventListener('click', e => {
  const item = e.target.closest('.patient-item');
  if (!item) return;
  selectPatient(item.querySelector('.patient-item__name').textContent);
  /* close drawer on mobile after selection */
  sidebar.classList.remove('patients-sidebar--open');
  overlay.classList.remove('sidebar-overlay--visible');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('patients-sidebar--open');
  overlay.classList.remove('sidebar-overlay--visible');
});

function selectPatient(name) {
  const patient = allPatients.find(p => p.name === name) || allPatients[0];
  renderPatientList(allPatients, patient.name);   /* re-renders list with new active highlight */

  const safe = (fn, ...args) => { try { fn(...args); } catch (e) { console.warn('render failed:', fn.name, e); } };
  safe(renderProfile, patient);

  const sixMonths = lastSixMonths(patient.diagnosis_history);
  safe(renderChart, sixMonths);

  const latest = sixMonths[sixMonths.length - 1];
  if (latest) safe(renderLegendAndVitals, latest);

  safe(renderDiagnosticList, patient.diagnostic_list);
  safe(renderLabResults, patient.lab_results);
}

(async function init() {
  let patients;
  try {
    patients = await fetchPatients();
  } catch (err) {
    console.warn('API unreachable, using fallback data:', err.message);
    patients = fallbackPatients();
  }

  const patient = patients.find(p => p.name === TARGET_PATIENT) || patients[0];

  const doctorImg = document.querySelector('.doctor-mini__avatar');
  if (doctorImg) {
    doctorImg.onerror = () => {
      doctorImg.onerror = null;
      doctorImg.src = (patients[1] && patients[1].profile_picture) || patient.profile_picture;
    };
    doctorImg.src = 'avatars/doctor-jose.png';
  }

  allPatients = patients;
  selectPatient(patient.name);
})();