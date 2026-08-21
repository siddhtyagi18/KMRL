/* ============================================================
   chat.js — AI Assistant / RAG interface
   Simulated streaming answers with inline citations
   ============================================================ */
'use strict';

const chatMessages = document.getElementById('chatMessages');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');
const chatEmpty    = document.getElementById('chatEmpty');
const sourcePaneBody = document.getElementById('sourcePaneBody');
const sourceCount    = document.getElementById('sourceCount');

let isStreaming = false;

/* ---- Simulated knowledge base ----------------------------- */
const KB = [
  {
    q: ['total value', 'civil works', 'contracts', 'contract value', 'how much'],
    a: `The total value of active civil works contracts currently held by KMRL is <strong>₹847.3 Crore</strong> across 12 active agreements.`,
    citations: [
      { ref: 'KMRL-CON-2026-0441', label: 'Contract 0441, §3.1', page: 1, excerpt: '…The Accepted Contract Amount is INR 342,00,00,000 (Rupees Three Hundred Forty-Two Crore)…' },
      { ref: 'KMRL-CON-2025-0387', label: 'Contract 0387, §4.2', page: 2, excerpt: '…Total contract value: INR 156,00,00,000 for Track Renewal Phase 2…' },
    ],
    sources: [
      { ref: 'KMRL-CON-2026-0441', type: 'contract', name: 'Civil Works Package C7', page: 1, excerpt: 'The Accepted Contract Amount is INR 342,00,00,000 (Rupees Three Hundred Forty-Two Crore), subject to additions and deductions…' },
      { ref: 'KMRL-CON-2025-0387', type: 'contract', name: 'Track Renewal Phase 2', page: 2, excerpt: 'Total contract consideration: INR 156,00,00,000 for the work of track renewal between Aluva and Thrippunithura…' },
      { ref: 'KMRL-CON-2024-0271', type: 'contract', name: 'Security Services', page: 1, excerpt: 'Annual contract value of INR 8,40,00,000 for security services at all operational stations…' },
    ]
  },
  {
    q: ['tender', 'closing', '30 days', 'deadline', 'submission', 'upcoming'],
    a: `There are <strong>3 tenders</strong> with submission deadlines in the next 30 days:\n\n1. **NIT-2026-122** — Automated Fare Collection Systems. Deadline: 5 September 2026\n2. **NIT-2026-118** — Electrical Systems Maintenance. Deadline: 12 September 2026\n3. **NIT-2026-094** — Depot Expansion Works, Muttom Yard. Pre-bid queries close: 2 September 2026`,
    citations: [
      { ref: 'NIT-2026-122', label: 'NIT-122, Cover Sheet', page: 1, excerpt: 'Last date and time for receipt of bids: 05 September 2026, 15:00 hrs IST…' },
      { ref: 'NIT-2026-094', label: 'NIT-094, p.3', page: 3, excerpt: 'Pre-Bid Meeting: 28 August 2026. Submission Deadline: 25 September 2026.' },
    ],
    sources: [
      { ref: 'NIT-2026-122', type: 'tender', name: 'Automated Fare Collection — Next Gen', page: 1, excerpt: 'Last date and time for receipt of bids: 05 September 2026, 15:00 hrs IST at the office of the Chief Procurement Officer, KMRL.' },
      { ref: 'NIT-2026-118', type: 'tender', name: 'Electrical Systems Maintenance', page: 1, excerpt: 'Closing date for tender submission: 12 September 2026. Technical and Financial bids to be submitted in separate sealed envelopes.' },
      { ref: 'NIT-2026-094', type: 'tender', name: 'Depot Expansion Works', page: 3, excerpt: 'Pre-Bid Meeting shall be held on 28 August 2026 at KMRL HQ. Submission Deadline: 25 September 2026.' },
    ]
  },
  {
    q: ['performance guarantee', 'performance security', '0441', 'contract 0441'],
    a: `For **Contract KMRL-CON-2026-0441** (Civil Works Package C7), the performance security terms are:\n\n- **Amount:** 10% of the Accepted Contract Amount = **₹34.2 Crore**\n- **Form:** Bank guarantee from a nationalised bank\n- **Submission:** Within 28 days of the Letter of Acceptance\n- **Validity:** Until 60 days after the Defects Notification Period expires`,
    citations: [
      { ref: 'KMRL-CON-2026-0441', label: 'Contract 0441, §5', page: 1, excerpt: 'Performance Security of 10% of the Accepted Contract Amount (INR 34.2 Crore) in the form of a bank guarantee…' },
    ],
    sources: [
      { ref: 'KMRL-CON-2026-0441', type: 'contract', name: 'Civil Works Package C7', page: 1, excerpt: 'Within 28 days of the Letter of Acceptance, the Contractor shall furnish Performance Security of 10% of the Accepted Contract Amount (INR 34.2 Crore) in the form of a bank guarantee from a nationalised bank, valid until 60 days after the Defects Notification Period.' },
    ]
  },
  {
    q: ['invoice', 'pending', 'payment', 'outstanding', 'unpaid'],
    a: `There are currently <strong>3 invoices</strong> pending payment:\n\n1. **INV-2026-7654** — Alstom Transport Propulsion Q2, ₹47.1 Cr. Due 28 Aug 2026 (7 days)\n2. **INV-2026-7832** — Siemens Signalling Systems Q2, ₹28.4 Cr. Due 15 Sep 2026\n3. **INV-2026-7291** — BEML Coaches Batch 3, ₹89.2 Cr. <span style="color:var(--coral);font-weight:500">Amount mismatch flagged — pending review</span>`,
    citations: [
      { ref: 'INV-2026-7654', label: 'Invoice 7654, p.1', page: 1, excerpt: 'Payment due within 30 days of invoice date: 28 August 2026. Amount: ₹47,10,00,000.' },
      { ref: 'INV-2026-7291', label: 'Invoice 7291, p.2', page: 2, excerpt: 'Invoice amount ₹89,20,00,000 — discrepancy noted vs Purchase Order PO-2026-0812: difference of ₹4,20,000.' },
    ],
    sources: [
      { ref: 'INV-2026-7654', type: 'invoice', name: 'Alstom — Propulsion Systems Q2', page: 1, excerpt: 'Invoice Date: 29 July 2026. Payment due: 28 August 2026. Total Amount: INR 47,10,00,000. Bank details and GSTIN as per Purchase Order PO-2026-0741.' },
      { ref: 'INV-2026-7832', type: 'invoice', name: 'Siemens — Signalling Systems Q2', page: 1, excerpt: 'Invoice for supply of ETCS Level 2 signalling equipment. Amount: INR 28,40,00,000. Payment due: 15 September 2026.' },
      { ref: 'INV-2026-7291', type: 'invoice', name: 'BEML — Coaches Batch 3', page: 2, excerpt: 'Invoice amount INR 89,20,00,000. Note: AI flagged potential mismatch with PO-2026-0812 (₹89,15,80,000). Difference: ₹4,20,000. Pending verification.' },
    ]
  },
  {
    q: ['safety audit', 'q1', '2026', 'safety', 'audit findings'],
    a: `The **Q1 2026 Safety Audit Report** (KMRL-RPT-2026-Q1) by CMRS identified the following key findings:\n\n1. **Fire suppression systems** at 3 underground stations require calibration — medium priority\n2. **Emergency lighting** backup duration below IS:3646 specification at Ernakulam South station\n3. **Platform screen doors** gap tolerance exceeded at 2 locations on Aluva-bound platform\n4. **Overall compliance score:** 87.3% (target: 90%)\n\n*Note: 3 data tables in this report could not be fully extracted — manual review recommended.*`,
    citations: [
      { ref: 'KMRL-RPT-2026-Q1', label: 'Safety Audit, §4', page: 4, excerpt: 'Section 4: Key Findings — Fire Suppression, Emergency Lighting, PSD Gap Tolerance…' },
      { ref: 'KMRL-RPT-2026-Q1', label: 'Safety Audit, §6.1', page: 6, excerpt: 'Overall Compliance Score: 87.3% against benchmark target of 90%…' },
    ],
    sources: [
      { ref: 'KMRL-RPT-2026-Q1', type: 'report', name: 'Q1 2026 Safety Audit Report', page: 4, excerpt: 'Section 4 — Key Findings: (a) Fire suppression systems at Ernakulam South, MG Road, and High Court stations require recalibration. Priority: Medium. Estimated rectification: 45 days.' },
    ]
  },
];

function matchKB(query) {
  const q = query.toLowerCase();
  let best = null, bestScore = 0;
  for (const item of KB) {
    const score = item.q.filter(kw => q.includes(kw)).length;
    if (score > bestScore) { bestScore = score; best = item; }
  }
  return best;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

/* ---- Append a user message -------------------------------- */
function appendUser(text) {
  if (chatEmpty) chatEmpty.style.display = 'none';
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.setAttribute('role', 'article');
  div.innerHTML = `
    <span class="msg-role" aria-hidden="true">You</span>
    <div class="msg-bubble">${escapeHtml(text)}</div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ---- Append an assistant message with streaming ----------- */
function appendAssistant(item, query) {
  const div = document.createElement('div');
  div.className = 'chat-msg assistant';
  div.setAttribute('role', 'article');
  div.setAttribute('aria-label', 'AI response');
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !item) {
    // Instant reveal
    const text = item
      ? formatText(item.a)
      : 'I couldn\'t find specific information about that in the indexed documents. Try rephrasing or check the Document Library directly.';
    bubble.innerHTML = text;
    if (item?.citations) appendCitations(div, item.citations);
    updateSources(item?.sources || []);
    return;
  }

  // Streaming simulation
  const fullText = item
    ? item.a
    : 'I couldn\'t find specific information about that in the indexed documents. Try rephrasing your question or browse the Document Library.';

  let cursor = document.createElement('span');
  cursor.className = 'streaming-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  bubble.innerHTML = '';
  bubble.appendChild(cursor);

  let i = 0;
  const speed = fullText.length > 300 ? 10 : 14; // ms per char

  function streamChar() {
    if (i < fullText.length) {
      const remaining = fullText.slice(i);
      // Handle bold markers
      if (remaining.startsWith('**')) {
        const endBold = remaining.indexOf('**', 2);
        if (endBold > 0) {
          const boldText = remaining.slice(2, endBold);
          const strong = document.createElement('strong');
          strong.textContent = boldText;
          bubble.insertBefore(strong, cursor);
          i += endBold + 2;
          setTimeout(streamChar, speed * boldText.length);
          return;
        }
      }
      if (remaining.startsWith('\n\n')) {
        bubble.insertBefore(document.createElement('br'), cursor);
        bubble.insertBefore(document.createElement('br'), cursor);
        i += 2;
      } else if (remaining.startsWith('\n')) {
        bubble.insertBefore(document.createElement('br'), cursor);
        i += 1;
      } else {
        const text = document.createTextNode(fullText[i]);
        bubble.insertBefore(text, cursor);
        i++;
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(streamChar, speed);
    } else {
      // Done streaming
      cursor.remove();
      // Add citations after a short delay
      if (item?.citations?.length) {
        setTimeout(() => appendCitations(div, item.citations), 300);
      }
      updateSources(item?.sources || []);
      isStreaming = false;
      chatInput.disabled = false;
      chatSend.disabled = false;
      chatInput.focus();
    }
  }

  isStreaming = true;
  chatInput.disabled = true;
  chatSend.disabled = true;
  streamChar();
}

/* ---- Citation chips --------------------------------------- */
function appendCitations(parentDiv, citations) {
  const row = document.createElement('div');
  row.className = 'msg-citations';
  citations.forEach((cit, idx) => {
    const chip = document.createElement('button');
    chip.className = 'citation-chip-lg';
    chip.style.animationDelay = `${idx * 80}ms`;
    chip.innerHTML = `<span class="citation-dot" aria-hidden="true"></span>${escapeHtml(cit.label)}`;
    chip.setAttribute('aria-label', `Source: ${cit.label}`);
    chip.addEventListener('click', () => {
      // In real app, open source doc and scroll to page
      showToast(`Jumping to ${cit.ref}, page ${cit.page}`);
      highlightSourceCard(cit.ref);
    });
    row.appendChild(chip);
  });
  parentDiv.appendChild(row);
}

function highlightSourceCard(ref) {
  document.querySelectorAll('.source-card').forEach(c => {
    c.style.borderColor = c.dataset.ref === ref ? 'var(--brass)' : '';
    c.style.background  = c.dataset.ref === ref ? 'rgba(184,135,61,.06)' : '';
  });
}

/* ---- Update sources pane ---------------------------------- */
function updateSources(sources) {
  if (!sources || sources.length === 0) {
    sourcePaneBody.innerHTML = '<div style="padding:24px 0;text-align:center"><p style="font-size:.78rem;color:var(--text-muted)">No sources found</p></div>';
    sourceCount.textContent = '—';
    return;
  }
  sourceCount.textContent = `${sources.length} source${sources.length > 1 ? 's' : ''}`;
  sourcePaneBody.innerHTML = sources.map(s => `
    <div class="source-card" data-ref="${escapeHtml(s.ref)}" role="article" tabindex="0" aria-label="Source: ${escapeHtml(s.name)}">
      <div class="source-card-header">
        <span class="doc-type-tag ${s.type}">${s.type}</span>
        <div>
          <div class="source-card-title">${escapeHtml(s.name)}</div>
          <div class="source-card-meta">${escapeHtml(s.ref)}</div>
        </div>
      </div>
      <p class="source-excerpt">"<span class="source-highlight">${escapeHtml(s.excerpt)}</span>"</p>
      <div class="source-page-ref">→ Page ${s.page} &nbsp;<a href="document.html?ref=${encodeURIComponent(s.ref)}" style="color:var(--backwater);text-decoration:none;font-size:.63rem">Open document ↗</a></div>
    </div>
  `).join('');

  // Keyboard support
  sourcePaneBody.querySelectorAll('.source-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') card.querySelector('a')?.click();
    });
  });
}

/* ---- Send handler ----------------------------------------- */
function sendMessage() {
  if (isStreaming) return;
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  chatInput.style.height = 'auto';
  appendUser(text);
  const match = matchKB(text);
  setTimeout(() => appendAssistant(match, text), 400);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// Auto-resize textarea
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
});

// Suggested prompt chips
function usePrompt(text) {
  chatInput.value = text;
  chatInput.focus();
  sendMessage();
}
window.usePrompt = usePrompt;

// New conversation
document.getElementById('newChatBtn')?.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  chatMessages.appendChild(chatEmpty);
  chatEmpty.style.display = '';
  updateSources([]);
  chatInput.value = '';
  chatInput.focus();
});

// Toast (fallback if app.js not loaded yet)
if (typeof showToast === 'undefined') {
  window.showToast = (msg) => console.log(msg);
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str || ''));
  return d.innerHTML;
}
