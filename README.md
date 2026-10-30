<div align="center">
  <h1>🎯 CareerAlign</h1>
  <p><strong>Analyze job fit. Identify skill gaps. Prepare for interviews with AI-powered feedback.</strong></p>
  <p>CareerAlign is an AI-powered career preparation tool that compares a resume against a job description, identifies relevant skill gaps, generates tailored interview practice, and improves resume bullet points while preserving factual accuracy.</p>
</div>

---
Live Demo: https://careeralign-grtp.onrender.com

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
    
- ### ⚡ Dual Mode: Gemini AI & Offline Analysis

- **Gemini AI Mode:** Uses Google's Gemini API to generate contextual resume-job match assessments, skill-gap insights, and interview feedback.
- **Offline Preview Mode:** Uses a lightweight, keyword-based engine when AI generation is unavailable. Results may miss context and should not be interpreted as hiring probabilities.
- **Configuration:** Set `GEMINI_API_KEY` in your local `.env.local` file for local development. For deployment, configure the variable in your hosting provider's environment settings.

- ## 🤖 AI Analysis & Offline Mode

CareerAlign supports AI-powered analysis through the Google Gemini API, with a local keyword-based fallback to keep the application useful when AI services are unavailable.

### ✨ Gemini AI Analysis
- CareerAlign uses Google Gemini to provide detailed, context-aware resume analysis, interview-answer evaluation, and resume bullet-point improvements.
- Depending on the request, response time, and service availability, AI analysis may take **up to 1–2 minutes**.
- Gemini analysis requires a valid API key and available API quota.

### 📴 Offline Preview Mode
- When the Gemini API quota is exhausted or the AI service is unavailable, CareerAlign automatically falls back to a **local keyword-based analysis engine**.
- Offline Preview Mode provides useful preliminary feedback based on keywords and matching rules, helping users continue using the application without waiting for API access to become available.
- Results may be less nuanced than Gemini-generated feedback and should be treated as estimates rather than equivalent AI analysis.
- Gemini-powered analysis becomes available again when the API quota is restored and the service is accessible.

### 🔐 Privacy & Data Handling

- Resume and job-description text is processed by the application's server.
- When Gemini AI is used, relevant request content is sent to Google's Gemini API for processing.
- Assessment history is stored in the current browser's local storage and remains there until cleared.
- Avoid submitting sensitive personal information. Review AI-generated results before using them professionally.
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

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, and Canvas Confetti
- **Backend:** Node.js, Express, and the `@google/genai` SDK for Gemini AI integration
- **AI Models:** Google Gemini (`gemini-3.8-flash` and `gemini-3.1-pro-preview`), with a fallback chain and a local keyword-based matching engine.
---


## 📁 Project Structure

```
careeralign/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HistoryModal.tsx
│   │   ├── InputSection.tsx
│   │   ├── ScoreOverviewCard.tsx
│   │   ├── MissingSkillsSection.tsx
│   │   ├── MatchedSkillsSection.tsx
│   │   ├── StrengthsAndImprovementsSection.tsx
│   │   ├── InterviewCoachSection.tsx
│   │   ├── BulletOptimizerSection.tsx
│   │   └── QuickStudyPlanSection.tsx
│   ├── data/
│   │   └── samplePresets.ts
│   ├── types.ts
│   ├── App.tsx
│   └── main.tsx
├── server.ts
├── vite.config.ts
├── package.json
├── pnpm-lock.yaml
├── bun.lock
├── .gitignore
└── README.md
```
