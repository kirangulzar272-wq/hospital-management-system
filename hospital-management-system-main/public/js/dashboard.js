// ---------- Auth guard ----------
const user = JSON.parse(localStorage.getItem('hms_user') || 'null');
if (!user) window.location.href = 'index.html';

document.getElementById('userName').textContent = user?.name || 'User';
document.getElementById('userRole').textContent = user?.role || '';
document.getElementById('userAvatar').textContent = (user?.name || 'U').charAt(0);

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('hms_user');
  window.location.href = 'index.html';
});

document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// ---------- Tab navigation ----------
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('tab-hidden'));
    document.getElementById('tab-' + item.dataset.tab).classList.remove('tab-hidden');
    loadAll();
  });
});

// ---------- API helpers ----------
async function api(path, options = {}) {
  const res = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return res.json();
}

function badge(text, type) {
  return `<span class="badge badge-${type}">${text}</span>`;
}

function statusBadge(status) {
  const map = {
    'Admitted': 'amber', 'Discharged': 'green',
    'Pending': 'amber', 'Confirmed': 'green', 'Completed': 'gray', 'Cancelled': 'coral'
  };
  return badge(status, map[status] || 'gray');
}

// ---------- Load everything ----------
async function loadAll() {
  const [stats, patients, doctors, appts] = await Promise.all([
    api('/stats'), api('/patients'), api('/doctors'), api('/appointments')
  ]);

  document.getElementById('statPatients').textContent = stats.totalPatients;
  document.getElementById('statAdmitted').textContent = stats.admittedPatients;
  document.getElementById('statDoctors').textContent = stats.totalDoctors;
  document.getElementById('statToday').textContent = stats.todayAppointments;

  renderRecentPatients(patients);
  renderRecentAppts(appts);
  renderPatientsTable(patients);
  renderDoctorsTable(doctors);
  renderApptTable(appts, patients, doctors);
}

function renderRecentPatients(patients) {
  const body = document.getElementById('recentPatientsBody');
  const recent = patients.slice(-4).reverse();
  body.innerHTML = recent.length ? recent.map(p => `
    <tr><td>${p.name}</td><td>${p.condition}</td><td>${p.ward}</td><td>${statusBadge(p.status)}</td></tr>
  `).join('') : `<tr><td colspan="4" class="empty-state">No patients yet</td></tr>`;
}

function renderRecentAppts(appts) {
  const body = document.getElementById('recentApptBody');
  const recent = appts.slice(-4).reverse();
  body.innerHTML = recent.length ? recent.map(a => `
    <tr><td>${a.patientName}</td><td>${a.doctorName}</td><td>${a.date}</td><td>${a.time}</td><td>${statusBadge(a.status)}</td></tr>
  `).join('') : `<tr><td colspan="5" class="empty-state">No appointments yet</td></tr>`;
}

function renderPatientsTable(patients) {
  const body = document.getElementById('patientsBody');
  body.innerHTML = patients.length ? patients.map(p => `
    <tr>
      <td>${p.name}</td><td>${p.age}</td><td>${p.gender}</td><td>${p.phone}</td>
      <td>${p.condition}</td><td>${p.ward}</td><td>${statusBadge(p.status)}</td>
      <td><div class="row-actions">
        <button class="icon-btn" onclick="editPatient(${p.id})">Edit</button>
        <button class="icon-btn danger" onclick="deleteItem('patients', ${p.id})">Del</button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="8" class="empty-state">No patient records yet. Click "+ Add patient" to get started.</td></tr>`;
}

function renderDoctorsTable(doctors) {
  const body = document.getElementById('doctorsBody');
  body.innerHTML = doctors.length ? doctors.map(d => `
    <tr>
      <td>${d.name}</td><td>${d.specialization}</td><td>${d.phone}</td><td>${d.email}</td><td>${d.availability}</td>
      <td><div class="row-actions">
        <button class="icon-btn" onclick="editDoctor(${d.id})">Edit</button>
        <button class="icon-btn danger" onclick="deleteItem('doctors', ${d.id})">Del</button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="6" class="empty-state">No doctor records yet.</td></tr>`;
}

function renderApptTable(appts, patients, doctors) {
  window.__patients = patients;
  window.__doctors = doctors;
  const body = document.getElementById('apptBody');
  body.innerHTML = appts.length ? appts.map(a => `
    <tr>
      <td>${a.patientName}</td><td>${a.doctorName}</td><td>${a.date}</td><td>${a.time}</td><td>${statusBadge(a.status)}</td>
      <td><div class="row-actions">
        <button class="icon-btn" onclick="editAppt(${a.id})">Edit</button>
        <button class="icon-btn danger" onclick="deleteItem('appointments', ${a.id})">Del</button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="6" class="empty-state">No appointments scheduled yet.</td></tr>`;
}

// ---------- Delete ----------
async function deleteItem(type, id) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  await api(`/${type}/${id}`, { method: 'DELETE' });
  loadAll();
}

// ---------- Modal system ----------
const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalFields = document.getElementById('modalFormFields');
const modalSaveBtn = document.getElementById('modalSaveBtn');
let modalMode = { type: null, id: null };

function openModal(title, fieldsHtml, onSave) {
  modalTitle.textContent = title;
  modalFields.innerHTML = fieldsHtml;
  overlay.classList.add('show');
  modalSaveBtn.onclick = onSave;
}

function closeModal() { overlay.classList.remove('show'); }
document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

function fieldHtml(label, id, value = '', type = 'text') {
  return `<div class="field"><label>${label}</label><input type="${type}" id="${id}" value="${value}"></div>`;
}
function selectHtml(label, id, options, selected = '') {
  const opts = options.map(o => `<option value="${o}" ${o === selected ? 'selected' : ''}>${o}</option>`).join('');
  return `<div class="field"><label>${label}</label><select id="${id}">${opts}</select></div>`;
}

// ---------- Patients ----------
document.getElementById('addPatientBtn').addEventListener('click', () => patientModal());
function patientModal(p = null) {
  modalMode = { type: 'patients', id: p?.id || null };
  openModal(p ? 'Edit patient' : 'Add patient', `
    ${fieldHtml('Full name', 'f_name', p?.name || '')}
    ${fieldHtml('Age', 'f_age', p?.age || '', 'number')}
    ${selectHtml('Gender', 'f_gender', ['Male', 'Female', 'Other'], p?.gender)}
    ${fieldHtml('Phone', 'f_phone', p?.phone || '')}
    ${fieldHtml('Condition', 'f_condition', p?.condition || '')}
    ${fieldHtml('Ward', 'f_ward', p?.ward || '-')}
    ${selectHtml('Status', 'f_status', ['Admitted', 'Discharged'], p?.status || 'Admitted')}
  `, savePatient);
}
async function savePatient() {
  const body = {
    name: val('f_name'), age: parseInt(val('f_age')) || 0, gender: val('f_gender'),
    phone: val('f_phone'), condition: val('f_condition'), ward: val('f_ward'),
    status: val('f_status'), admittedOn: new Date().toISOString().split('T')[0]
  };
  if (modalMode.id) await api(`/patients/${modalMode.id}`, { method: 'PUT', body: JSON.stringify(body) });
  else await api('/patients', { method: 'POST', body: JSON.stringify(body) });
  closeModal(); loadAll();
}
function editPatient(id) {
  const p = window.__patientsCache?.find(x => x.id === id);
  api('/patients').then(list => { window.__patientsCache = list; patientModal(list.find(x => x.id === id)); });
}

// ---------- Doctors ----------
document.getElementById('addDoctorBtn').addEventListener('click', () => doctorModal());
function doctorModal(d = null) {
  modalMode = { type: 'doctors', id: d?.id || null };
  openModal(d ? 'Edit doctor' : 'Add doctor', `
    ${fieldHtml('Full name', 'f_name', d?.name || '')}
    ${fieldHtml('Specialization', 'f_spec', d?.specialization || '')}
    ${fieldHtml('Phone', 'f_phone', d?.phone || '')}
    ${fieldHtml('Email', 'f_email', d?.email || '')}
    ${fieldHtml('Availability', 'f_avail', d?.availability || '')}
  `, saveDoctor);
}
async function saveDoctor() {
  const body = {
    name: val('f_name'), specialization: val('f_spec'), phone: val('f_phone'),
    email: val('f_email'), availability: val('f_avail')
  };
  if (modalMode.id) await api(`/doctors/${modalMode.id}`, { method: 'PUT', body: JSON.stringify(body) });
  else await api('/doctors', { method: 'POST', body: JSON.stringify(body) });
  closeModal(); loadAll();
}
function editDoctor(id) {
  api('/doctors').then(list => doctorModal(list.find(x => x.id === id)));
}

// ---------- Appointments ----------
document.getElementById('addApptBtn').addEventListener('click', () => apptModal());
function apptModal(a = null) {
  modalMode = { type: 'appointments', id: a?.id || null };
  const patientNames = (window.__patients || []).map(p => p.name);
  const doctorNames = (window.__doctors || []).map(d => d.name);
  openModal(a ? 'Edit appointment' : 'New appointment', `
    ${selectHtml('Patient', 'f_patient', patientNames, a?.patientName)}
    ${selectHtml('Doctor', 'f_doctor', doctorNames, a?.doctorName)}
    ${fieldHtml('Date', 'f_date', a?.date || '', 'date')}
    ${fieldHtml('Time', 'f_time', a?.time || '', 'time')}
    ${selectHtml('Status', 'f_status', ['Pending', 'Confirmed', 'Completed', 'Cancelled'], a?.status || 'Pending')}
  `, saveAppt);
}
async function saveAppt() {
  const body = {
    patientName: val('f_patient'), doctorName: val('f_doctor'),
    date: val('f_date'), time: val('f_time'), status: val('f_status')
  };
  if (modalMode.id) await api(`/appointments/${modalMode.id}`, { method: 'PUT', body: JSON.stringify(body) });
  else await api('/appointments', { method: 'POST', body: JSON.stringify(body) });
  closeModal(); loadAll();
}
function editAppt(id) {
  api('/appointments').then(list => apptModal(list.find(x => x.id === id)));
}

function val(id) { return document.getElementById(id).value; }

// ---------- Init ----------
loadAll();
