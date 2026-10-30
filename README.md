<div align="center">
  <h1>🎯 CareerAlign</h1>
  <p><strong>Grounded Resume &amp; Job Matcher with Role-Specific Interview Coach</strong></p>
  <p>Analyze resumes against any job posting to detect skill gaps, practice tailored interview scenarios with instant AI feedback, and optimize resume bullets without fabricating qualifications.</p>
</div>

---

## ✨ Features

- **📊 Comprehensive Fit Assessment**: Generates an overall qualification match score (0–100%) and tier (High Match, Moderate Match, Reach Role) with an executive summary.
- **🔍 Missing Skills & Gap Analysis**: Pinpoints required technologies, frameworks, and methodologies missing from the candidate's resume, categorized with contextual quotes and actionable bridging advice.
- **✅ Validated Overlaps**: Direct proof points showing where the candidate's resume satisfies job requirements.
- **🎙️ Interactive Interview Simulator**:
  - Voice dictation / text input with real-time response timer
  - Technical, Behavioral (STAR), Situational, and **Skill Gap Defense** scenarios
  - Instant AI answer scoring (1–10) with constructive strengths, improvement notes, and a polished model answer preserving your actual story.
- **✍️ Grounded Bullet Point Rewrites**:
  - Applies Google's *'Accomplished [X] as measured by [Y] by doing [Z]'* formula.
  - **Strict Anti-Hallucination Guardrail**: Inserts clean prompts like `[by X%]` or `[for Y users]` so your resume remains 100% honest.
  - Interactive Custom Rewriter Studio for any resume line.
- **🗓️ 7-Day Targeted Study Roadmap**: A step-by-step checklist to bridge priority skill gaps prior to interview day.
- **💾 History & Multi-Format Export**:
  - Automatically saves assessments to local browser history with instant restore.
  - Export full prep briefs as Markdown (`.md`), raw data (`.json`), or printable PDF documents (`window.print`).
- **⚡ Dual Mode (Gemini AI + Offline Keyword Engine)**:
  - Works without an API key using a lightweight keyword-based estimate; this mode can miss context and is not a hiring probability.
  - Configure `GEMINI_API_KEY` for Gemini-generated analysis and feedback.
- **🔐 Privacy note**: submitted text is processed by this app's server. When a Gemini key is configured, request content is sent to Google's Gemini API. Analysis results are stored in the current browser's local history until you clear it; avoid entering information you do not want processed or saved.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ or Antigravity Node)
- pnpm or npm

### Installation & Execution

1. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Configure API Key (Optional)**:
   Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) to `.env.local`:
   ```bash
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   *(If omitted, the app will run in keyword-based Offline Preview Mode using the built-in heuristic engine.)*

3. **Start the development server**:
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend**: Node.js / Express, `@google/genai` SDK
- **AI Models**: Google Gemini (`gemini-3.8-flash`,
    `gemini-3.8-flash`,
    `gemini-3.8-flash`,
    `gemini-3.1-pro-preview`) with resilient fallback chain and local matching engine

---

## 📁 Project Structure

```
careeralign/
├── src/
│   ├── components/
│   │   ├── Header.tsx                          # App header with presets, history, and exports
│   │   ├── HistoryModal.tsx                    # Modal to browse and restore past analyses
│   │   ├── InputSection.tsx                    # Dual-panel input with file upload & clipboard paste
│   │   ├── ScoreOverviewCard.tsx               # Score dial and interactive KPI cards
│   │   ├── MissingSkillsSection.tsx            # Missing skills filter, search, and bridging tips
│   │   ├── MatchedSkillsSection.tsx            # Validated candidate skills with resume evidence
│   │   ├── StrengthsAndImprovementsSection.tsx # Key strengths and growth action items
│   │   ├── InterviewCoachSection.tsx           # Voice/text mock simulator & answer evaluator
│   │   ├── BulletOptimizerSection.tsx          # Grounded bullet rewrites & custom rewriter studio
│   │   └── QuickStudyPlanSection.tsx           # 7-day interactive checklist roadmap
│   ├── data/
│   │   └── samplePresets.ts                    # Realistic presets (Student Intern, Full-Stack, MLE)
│   ├── types.ts                                # TypeScript domain interfaces
│   ├── App.tsx                                 # Master app state, tabs, and export orchestrator
│   └── main.tsx                                # React root mount
├── server.ts                                   # Express server, Gemini AI integration & fallback engine
├── vite.config.ts                              # Vite + Tailwind v4 bundler config
├── package.json                                # Scripts and dependencies
└── .env.local                                  # Local environment configuration
```
