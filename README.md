# KMRL Document Intelligence Platform

> An enterprise AI platform turning Kochi Metro Rail Limited's contracts, tenders, invoices, and reports into searchable, evidence-backed, actionable information.

![Design Language](https://img.shields.io/badge/Design_Language-Transit_Line_Identity-0E5C63)
![License](https://img.shields.io/badge/License-Proprietary-B8873D)
![KMRL Identity](https://img.shields.io/badge/KMRL-Enterprise_Ops-0B2B26)

---

## 🚇 Design Direction & Visual Identity

The UI identity is grounded in two physical domains:
1. **Kochi Metro's Transit-Map Identity**: Clean rail lines, station nodes, directional flow, and sequential document pipeline tracking (`Uploaded` → `OCR` → `Classified` → `Extracted` → `Indexed` → `Searchable`).
2. **Official Governmental Document Language**: Physical stamps, ledger rules, brass confidence seals, and verified marks.

### Color Tokens
- **Ink (`#0B2B26`)**: Primary text & sidebar background (near-black teal).
- **Backwater (`#0E5C63`)**: Primary brand color representing Kerala backwaters and Kochi Metro teal.
- **Paper (`#F6F3EC`)**: Warm off-white page background imitating official document paper.
- **Brass (`#B8873D`)**: Official seals, verified marks, and action accents.
- **Signal Amber (`#D98E36`)**: Review alerts and pending state indicators.
- **Alert Coral (`#C1502E`)**: Overdue actions and critical mismatches.
- **Line-idle (`#C7CCC4`)**: Inactive pipeline stages.

---

## 📦 Key Platform Modules

### 1. 📊 Executive Dashboard (`index.html`)
- **Real-time KPI Counters**: Animated metrics for total indexed documents, pipeline load, review items, and average confidence.
- **Hero Transit Line Visualization**: Staggered pipeline stage rendering representing active documents in flight with pulse feedback.
- **Three-Column Operational Triage**:
  - **Needs Review**: Confidence alerts, missing clauses, PO mismatches.
  - **Upcoming Deadlines**: Tender submissions, contract renewals, milestone payment due dates.
  - **Recent AI Answers**: Verified RAG answers with clickable source citations.

### 2. 🗂️ Document Library (`library.html` & `library.js`)
- Dense, scannable data grid for operations and contract management.
- Multi-dimensional sidebar filters: Document types (Contracts, Tenders, Invoices, Reports), extraction confidence levels, status flags, and date ranges.
- Real-time search by vendor, contractor, or tender reference code.

### 3. 🔍 Split-View Document Inspector (`document.html`)
- **Left Pane**: High-fidelity document canvas simulation with interactive highlighted entities.
- **Right Pane**: Extracted metadata fields, AI-generated summary, mini transit-line lifecycle tracker, and animated brass wax seals indicating extraction confidence scores.

### 4. 💬 AI Assistant & RAG Engine (`chat.html` & `chat.js`)
- Character-by-character token streaming simulation.
- Inline citation chips with delayed elevation animation (`[Contract 4471, §3.1]`).
- Interactive Source Documents pane linked dynamically to context references.
- Pre-configured domain queries covering civil works contracts, upcoming tenders, and payment reconciliation.

---

## ⚡ Quick Start

You can run this project with any static file server:

```bash
# Using Python
python -m http.server 7890

# Using Node.js (npx)
npx serve .
```

Open [http://localhost:7890](http://localhost:7890) in your browser.

---

## 🏛️ Architecture & File Structure

```
KMRL/
├── index.html        # Dashboard & transit pipeline overview
├── library.html      # Document repository & metadata filter rail
├── document.html     # Split-view inspection & confidence seals
├── chat.html         # RAG AI assistant & source citation viewer
├── styles.css        # Unified design system & transit-line theme
├── app.js            # Shared core UI logic, modal controls, & animations
├── library.js        # Data store, search indexing, & table interactions
├── chat.js           # RAG simulator, token streaming, & citation linking
└── .gitignore        # Version control ignore definitions
```
