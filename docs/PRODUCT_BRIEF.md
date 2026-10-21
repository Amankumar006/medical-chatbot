# Product Decision Brief: Offline-First Vernacular Care Navigation & Consultation Prep Companion (India Primary Care)

## 1. Product Goal
An **offline-first, vernacular, human-assisted care-navigation and consultation-prep companion** tailored for Indian primary care. 

Designed specifically to bridge the communication, literacy, and record-keeping gaps identified in rural and peri-urban primary care settings (supported by the Oxford Open Digital Health eSanjeevani utilization study [2025] and PLOS Digital Health Jharkhand digital-literacy study [2025]), this tool empowers patients—often supported by family helpers or ASHA/CHO (Accredited Social Health Activist / Community Health Officer) workers—to prepare structured consultation notes, maintain private on-device medical histories, and navigate local public health services.

---

## 2. MVP Feature Set
1. **Pre-Visit Preparation**: Structured symptom timeline builder and doctor question checklist generated in local languages (Hindi, Bengali, Telugu, Tamil, Marathi, etc.).
2. **Post-Visit Consultation Summary**: User-controlled, structured summary written after the doctor visit to track diagnoses, advice, and follow-up instructions.
3. **Offline-First Local Record-Keeping**: 100% on-device storage using SQLite (via WASM/IndexedDB persistence) ensuring **zero cloud-stored health PII (Personally Identifiable Information)**.
4. **Voice-First, Low-Literacy UI**: Voice input/output capabilities (Web Speech API / whisper-local integration where available) and visual-first iconography designed for collaborative use with ASHA/CHO workers or family helpers.
5. **Local Care Directory**: Plain-language "how to access care" directory for local public health services (Ayushman Arogya Mandirs, CHCs, PHCs, eSanjeevani hubs) with offline caching.

---

## 3. Explicit Non-Goals
- **No Diagnosis**: The system never suggests medical diagnoses or disease names.
- **No Prescriptions**: No medication recommendations, dosage calculations, or prescription generation.
- **No Autonomous Emergency Triage**: Does not perform automated clinical triage or replace emergency dispatch; refers red-flag symptoms immediately to human clinicians or emergency services.
- **No Replacing Clinicians**: Positioned strictly as a patient-facing preparation and record-keeping aid, never a substitute for professional medical consultation.

---

## 4. Success Measures
- **Preparation Efficacy**: Percentage of users attending consultations with a completed, structured question checklist.
- **Privacy & Data Retention**: 100% of patient health records retained locally on-device with zero server-side health PII persistence.
- **Accessibility & Inclusion**: Successful completion of core workflows by low-literacy users with assistance from ASHA/CHO workers or family helpers.
- **Offline Resilience**: Seamless operation and local record access during zero-connectivity network drops.
- **Clinical Communication**: Patient-reported improvement in clarity and recall of doctor instructions post-consultation.

---

## 5. Key Risks & Mitigations
- **Risk 1: Digital & Literacy Barriers**
  - *Mitigation*: Voice-first interaction model and visual-first UI designed for facilitated use by ASHA, CHO workers, or literate family members.
- **Risk 2: Privacy & Trust Deficits regarding Health Data**
  - *Mitigation*: Strict architectural guarantee of local-only SQLite storage with no cloud sync of health PII.
- **Risk 3: Scope Creep into Clinical Advice**
  - *Mitigation*: Hard-coded system boundaries, prominent non-diagnostic disclaimers, and mandatory human-in-the-loop design.

---

## 6. Focused Legal & Privacy Scan (India)

### A. Digital Personal Data Protection (DPDP) Act, 2023
- **Applicability & Compliance**: The DPDP Act 2023 governs digital personal data processing in India. Under our architecture, health PII is stored **strictly on-device** (SQLite/WASM) and is never transmitted to or stored on cloud servers. 
- **Fiduciary Status**: Because the application does not collect, store, or process personal data on remote servers as a data fiduciary, server-side data fiduciary compliance burdens (such as remote data breach notification and server-side consent manager integrations for health data storage) are structurally minimized. Local data is controlled entirely by the data principal (the patient).
- **Primary Source**: *Digital Personal Data Protection Act, 2023 (No. 22 of 2023)*.

### B. MoHFW Telemedicine Practice Guidelines (2020)
- **Applicability & Compliance**: Published by the Ministry of Health and Family Welfare (MoHFW) in partnership with NITI Aayog, these guidelines govern telemedicine practice by registered medical practitioners (RMPs). 
- **Distinction**: Our tool is explicitly a **non-diagnostic preparation and navigation aid**, not a telemedicine consultation platform. It does not enable RMPs to prescribe medicine remotely via our app, nor does it replace doctor consultations. It serves as a pre-consultation bridge (analogous to paper notes a patient brings to a clinic).
- **Primary Source**: *Telemedicine Practice Guidelines — Enabling Registration of RMPs to Provide Telemedicine (MoHFW, March 2020)*.

### C. CDSCO Software as a Medical Device (SaMD) Regulations
- **Applicability & Compliance**: Under Central Drugs Standard Control Organization (CDSCO) guidelines and Medical Device Rules (2017), software intended for medical purposes (diagnosis, prevention, monitoring, treatment of disease) falls under SaMD regulation.
- **Exemption / Classification Rationale**: Because our MVP features are strictly limited to **administrative preparation, symptom timeline note-taking, post-visit note-taking, and public service directory navigation**, it explicitly avoids diagnostic or therapeutic claims. Per international and CDSCO risk-based frameworks, general health wellness, administrative prep, and record-keeping software that do not diagnose or treat are outside the definition of active medical devices / SaMD requiring mandatory clinical trials or prior licensing.
- *Unverified Assumption / Flag*: Final classification can vary based on phrasing in marketing materials. We must maintain strict boundary language ensuring no diagnostic or therapeutic claims are ever made in user-facing UI or documentation.

---

## 7. Repository Inspection & Modern Replacement Stack Proposal

### Existing Stack Review (Node.js backend + client-side JS/HTML)
- *Previous state*: Centralized Node.js backend (`server/`), online API keys exposed or handled server-side, chat-centric model querying, brittle DOM manipulation.
- *Evaluation*:
  - **Discard**: Centralized cloud LLM dependency for basic record keeping and navigation, server-side PII risk, brittle multi-page HTML/CSS routing, and online-first assumptions.
  - **Keep**: Modular component patterns, ES module structure concepts, and clean styling primitives.

### Proposed Modern Replacement Stack (Offline-First, Vernacular, Voice-Capable PWA)
1. **Progressive Web App (PWA)**:
   - *Rationale*: Installable on low-cost Android devices common in rural India, works completely offline via Service Workers and cache storage.
2. **Client-Side SQLite via WASM (`sql.js` or `sqlite-wasm`)**:
   - *Rationale*: Relational querying, robust data integrity, zero server required for health records, guaranteeing 100% on-device privacy.
3. **Web Speech API & Local Speech-to-Text / Text-to-Speech**:
   - *Rationale*: Enables voice-first vernacular interaction for low-literacy users without requiring expensive cloud speech APIs.
4. **Vite + Vanilla ES Modules / Lightweight UI Framework (e.g., Preact or Vanilla Web Components)**:
   - *Rationale*: Extremely lightweight bundle, fast loading on 2G/3G networks, zero heavy framework bloat.
5. **Static Knowledge Pack (JSON/SQLite)**:
   - *Rationale*: Public service directory and health literacy guides pre-loaded on device and updated via periodic lightweight background sync when online.
