/* ============================================================
   app.js — KMRL Document Intelligence
   Dashboard, pipeline animation, upload modal, KPI counter
   ============================================================ */

'use strict';

/* ---- Mobile sidebar toggle -------------------------------- */
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
let overlay;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.addEventListener('click', closeSidebar);
  document.body.appendChild(overlay);
}

function openSidebar() {
  sidebar?.classList.add('open');
  overlay?.classList.add('active');
  mobileMenuBtn?.setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  sidebar?.classList.remove('open');
  overlay?.classList.remove('active');
  mobileMenuBtn?.setAttribute('aria-expanded', 'false');
}
mobileMenuBtn?.addEventListener('click', () =>
  sidebar?.classList.contains('open') ? closeSidebar() : openSidebar()
);
createOverlay();

/* ---- Upload Modal ----------------------------------------- */
const uploadBtn  = document.getElementById('uploadBtn');
const modal      = document.getElementById('uploadModal');
const modalClose = document.getElementById('modalClose');
const cancelBtn  = document.getElementById('cancelUpload');
const startBtn   = document.getElementById('startUpload');
const dropzone   = document.getElementById('dropzone');

function openModal() {
  modal?.removeAttribute('hidden');
  modalClose?.focus();
}
function closeModal() {
  modal?.setAttribute('hidden', '');
  uploadBtn?.focus();
}
uploadBtn?.addEventListener('click', openModal);
modalClose?.addEventListener('click', closeModal);
cancelBtn?.addEventListener('click', closeModal);

// Escape key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) closeModal();
});

// Drag & drop
dropzone?.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
dropzone?.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  // In a real app, handle e.dataTransfer.files
});

startBtn?.addEventListener('click', () => {
  closeModal();
  // Simulate document entering pipeline
  showToast('Document submitted — watch the pipeline update');
});

/* ---- Toast notification ----------------------------------- */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  existing?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${type === 'info' ? 'var(--backwater)' : 'var(--coral)'};
    color: #fff; padding: 12px 18px; border-radius: 8px;
    font-family: var(--font-body); font-size: .83rem; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,.2);
    animation: fadeSlideUp .3s ease forwards;
    max-width: 320px; line-height: 1.5;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

/* ---- KPI counter animation -------------------------------- */
function animateCounters() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (prefersReduced) { el.textContent = target; return; }
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ---- Transit line hero animation -------------------------- */
function animateTransitLine() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stations = document.querySelectorAll('.transit-station');
  if (!stations.length) return;

  stations.forEach((station, i) => {
    if (prefersReduced) { station.style.opacity = '1'; return; }
    station.style.opacity = '0';
    setTimeout(() => {
      station.style.transition = 'opacity .25s ease';
      station.style.opacity = '1';
    }, i * 80);
  });
}

/* ---- Table row hover left-border animation (CSS handles it) */

/* ---- Search keyboard shortcut ----------------------------- */
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('globalSearch')?.focus();
  }
});

/* ---- Citation chips (dashboard) --------------------------- */
document.querySelectorAll('.citation-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    showToast(`Opening source: ${chip.textContent.trim()}`);
  });
});

/* ---- Init ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  animateTransitLine();
});

// Also run if DOM already ready (script at bottom)
if (document.readyState !== 'loading') {
  animateCounters();
  animateTransitLine();
}
