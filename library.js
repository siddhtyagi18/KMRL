/* ============================================================
   library.js — Document Library data and table rendering
   ============================================================ */
'use strict';

const DOCUMENTS = [
  { id: 'DOC-20260821-0441', ref: 'KMRL-CON-2026-0441', name: 'Civil Works Package C7 — Elevated Viaduct', type: 'contract', date: '2026-08-21', parties: 'KCC Ltd, KMRL', value: '₹342 Cr', confidence: 97, status: 'processing' },
  { id: 'DOC-20260820-0118', ref: 'NIT-2026-118',        name: 'Electrical Systems Maintenance — Annual Contract', type: 'tender', date: '2026-08-20', parties: 'Open Tender', value: '—', confidence: 0, status: 'processing' },
  { id: 'DOC-20260819-7832', ref: 'INV-2026-7832',       name: 'Siemens Signalling Systems Supply — Q2 2026', type: 'invoice', date: '2026-08-19', parties: 'Siemens AG, KMRL', value: '₹28.4 Cr', confidence: 95, status: 'processing' },
  { id: 'DOC-20260815-0387', ref: 'KMRL-CON-2025-0387',  name: 'Track Renewal Phase 2 — Aluva to Thrippunithura', type: 'contract', date: '2025-11-03', parties: 'RITES Ltd, KMRL', value: '₹156 Cr', confidence: 71, status: 'review' },
  { id: 'DOC-20260814-0094', ref: 'NIT-2026-094',        name: 'Depot Expansion Works — Muttom Yard', type: 'tender', date: '2026-07-18', parties: 'Open Tender', value: '—', confidence: 83, status: 'review' },
  { id: 'DOC-20260812-7291', ref: 'INV-2026-7291',       name: 'BEML Limited — Coaches Supply Batch 3', type: 'invoice', date: '2026-08-12', parties: 'BEML Ltd, KMRL', value: '₹89.2 Cr', confidence: 88, status: 'review' },
  { id: 'DOC-20260810-Q1',   ref: 'KMRL-RPT-2026-Q1',   name: 'Safety Audit Report Q1 2026', type: 'report', date: '2026-08-10', parties: 'CMRS, KMRL', value: '—', confidence: 79, status: 'review' },
  { id: 'DOC-20260808-0412', ref: 'KMRL-CON-2026-0412',  name: 'IT Infrastructure Modernisation — Phase 1', type: 'contract', date: '2026-06-22', parties: 'TCS, KMRL', value: '₹12.8 Cr', confidence: 76, status: 'review' },
  { id: 'DOC-20260730-7654', ref: 'INV-2026-7654',       name: 'Alstom Transport — Propulsion Systems Q2', type: 'invoice', date: '2026-07-30', parties: 'Alstom SA, KMRL', value: '₹47.1 Cr', confidence: 94, status: 'searchable' },
  { id: 'DOC-20260725-0271', ref: 'KMRL-CON-2024-0271',  name: 'Security Services — All Stations', type: 'contract', date: '2024-08-24', parties: 'G4S India, KMRL', value: '₹8.4 Cr', confidence: 98, status: 'searchable' },
  { id: 'DOC-20260720-0089', ref: 'NIT-2026-089',        name: 'Rolling Stock Maintenance 2026–2028', type: 'tender', date: '2026-07-01', parties: 'Open Tender', value: '—', confidence: 92, status: 'searchable' },
  { id: 'DOC-20260715-7199', ref: 'INV-2026-7199',       name: 'KELTRON — Station Display Systems', type: 'invoice', date: '2026-07-15', parties: 'KELTRON, KMRL', value: '₹3.6 Cr', confidence: 96, status: 'searchable' },
  { id: 'DOC-20260710-0322', ref: 'KMRL-CON-2023-0322',  name: 'Passenger Information System — Turnkey', type: 'contract', date: '2023-04-12', parties: 'Wabtec Corp, KMRL', value: '₹22.7 Cr', confidence: 99, status: 'searchable' },
  { id: 'DOC-20260705-0122', ref: 'NIT-2026-122',        name: 'Automated Fare Collection — Next Gen', type: 'tender', date: '2026-08-01', parties: 'Open Tender', value: '—', confidence: 0, status: 'processing' },
  { id: 'DOC-20260628-Q2',   ref: 'KMRL-RPT-2026-Q2',   name: 'Financial Audit Report Q2 2026', type: 'report', date: '2026-06-28', parties: 'Deloitte, KMRL', value: '—', confidence: 91, status: 'searchable' },
];

function confidenceClass(c) {
  if (c >= 90) return 'conf-high';
  if (c >= 70) return 'conf-medium';
  return 'conf-low';
}

function renderTable(docs) {
  const tbody = document.getElementById('docTableBody');
  if (!tbody) return;
  tbody.innerHTML = docs.map(doc => `
    <tr onclick="window.location='document.html?id=${doc.id}'" tabindex="0" aria-label="Open document ${doc.ref}">
      <td>
        <a href="document.html?id=${doc.id}" class="doc-link-name">${doc.name}</a>
        <span class="doc-sub-id">${doc.ref}</span>
      </td>
      <td><span class="doc-type-tag ${doc.type}">${doc.type}</span></td>
      <td><span class="mono" style="font-size:.75rem;color:var(--text-muted)">${doc.date}</span></td>
      <td style="font-size:.78rem;color:var(--text-secondary);max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${doc.parties}</td>
      <td><span class="mono" style="font-size:.78rem">${doc.value}</span></td>
      <td>
        ${doc.confidence > 0 ? `
          <div class="confidence-bar-wrap">
            <div class="confidence-bar"><div class="confidence-fill ${confidenceClass(doc.confidence)}" style="width:${doc.confidence}%"></div></div>
            <span class="confidence-val">${doc.confidence}%</span>
          </div>
        ` : '<span style="font-size:.73rem;color:var(--text-muted)">Pending</span>'}
      </td>
      <td><span class="status-tag ${doc.status}">${doc.status === 'searchable' ? 'Searchable' : doc.status === 'processing' ? 'Processing' : 'Review'}</span></td>
    </tr>
  `).join('');

  // Keyboard navigation for table rows
  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.querySelector('a')?.click();
      }
    });
  });
}

// Filter logic
let activeFilters = { types: new Set(['contract','tender','invoice','report']), statuses: new Set() };

function filterAndRender() {
  let filtered = DOCUMENTS.filter(d => activeFilters.types.has(d.type));
  if (activeFilters.statuses.size > 0) filtered = filtered.filter(d => activeFilters.statuses.has(d.status));
  const count = document.querySelector('.table-count');
  if (count) count.textContent = `${filtered.length} document${filtered.length !== 1 ? 's' : ''}`;
  renderTable(filtered);
}

// Wire up checkboxes
document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const label = cb.parentElement.textContent.trim().toLowerCase().split(' ')[0];
    const types = ['contracts','tenders','invoices','reports'];
    if (types.some(t => label.startsWith(t.slice(0,-1)))) {
      const type = label.replace(/s$/, '');
      cb.checked ? activeFilters.types.add(type) : activeFilters.types.delete(type);
    }
    filterAndRender();
  });
});

// Search
document.getElementById('librarySearch')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = DOCUMENTS.filter(d =>
    d.name.toLowerCase().includes(q) || d.ref.toLowerCase().includes(q) || d.parties.toLowerCase().includes(q)
  );
  renderTable(filtered);
  const count = document.querySelector('.table-count');
  if (count) count.textContent = `${filtered.length} document${filtered.length !== 1 ? 's' : ''}`;
});

// Upload button #2
document.getElementById('uploadBtn2')?.addEventListener('click', () => {
  document.getElementById('uploadModal')?.removeAttribute('hidden');
  document.getElementById('modalClose')?.focus();
});

// Init
filterAndRender();
