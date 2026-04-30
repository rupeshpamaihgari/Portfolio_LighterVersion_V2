import { useState, useEffect, useRef } from 'react'
import { asset } from '../../utils/asset'

const PALETTE = ['#F4A58A', '#B8D4F8', '#B8F4D4', '#F8E4A0', '#D4B8F8', '#c8f4f0', '#f4c8d4', '#e4d4f8']

const T = {
  kicker: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: '10px',
    display: 'block',
    fontFamily: "'Nunito', sans-serif",
  },
  h1: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: 800,
    letterSpacing: '-0.035em',
    lineHeight: 1.08,
    color: '#111',
    marginBottom: '18px',
    fontFamily: "'Fredoka', sans-serif",
  },
  h2: {
    fontSize: 'clamp(22px, 3vw, 34px)',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1.15,
    color: '#111',
    marginBottom: '20px',
    marginTop: '48px',
    fontFamily: "'Fredoka', sans-serif",
  },
  h3: {
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '-0.015em',
    color: '#111',
    marginBottom: '12px',
    marginTop: '32px',
    fontFamily: "'Nunito', sans-serif",
  },
  h4: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: '10px',
    marginTop: '28px',
    fontFamily: "'Nunito', sans-serif",
  },
  body: {
    fontSize: '14.5px',
    lineHeight: 1.7,
    color: '#777',
    marginBottom: '16px',
    fontFamily: "'Nunito', sans-serif",
  },
}

const AGENTS = [
  {
    id: 'senseiq',
    label: 'SenseIQ',
    sublabel: 'Intelligence',
    color: '#B8D4F8',
    icon: '🧠',
    context: 'SenseIQ is the intelligence backbone of the Sense platform — an AI layer that enables natural language search, semantic candidate filtering, and automated list generation without requiring recruiters to write complex Boolean queries.',
    why: [
      'Recruiters were spending significant time constructing complex Boolean strings to find the right candidates — a skill most didn\'t have.',
      'Candidate databases had millions of records but no smart way to surface the right talent quickly. A recruiter typing "Java developers in SF available now" should not need a database degree to get results.',
      'The gap between recruiter intent and system capability was creating a 15–20 minute overhead per search — SenseIQ was built to collapse that to seconds.',
    ],
    research: [
      { title: 'Recruiter Mental Models', body: 'We ran 12 interviews with recruiters across 6 agencies to understand how they think about candidate targeting. Most described their intent in plain English — "someone who has done this before and lives nearby." We mapped these patterns to query primitives.' },
      { title: 'AI Lister Prototyping', body: 'Three interaction models were tested: a chat-style natural language input, a guided multi-step filter builder, and a hybrid prompt + filter refinement flow. Usability sessions showed the hybrid model reduced errors by 60% vs pure chat.' },
      { title: 'Semantic Matching Research', body: 'We studied embedding-based search models to understand how "React Developer" matches "Frontend Engineer" — and built explainability affordances so recruiters could see WHY a candidate was included.' },
    ],
    constraints: [
      { title: 'ATS Data Quality', body: 'Many agencies had inconsistent or missing fields in their ATS. SenseIQ had to gracefully degrade — returning best-effort results and surfacing data quality warnings rather than failing silently.' },
      { title: 'Query Accuracy vs. Speed', body: 'Natural language is ambiguous. "Senior developer available now" could mean many things. We had to balance query precision with recall, and build correction affordances when the AI misunderstood intent.' },
      { title: 'False Positive Risk', body: 'Over-matching candidates to irrelevant jobs would erode recruiter trust. We set conservative thresholds and always showed a "why this match" rationale card for each result.' },
    ],
    guardrails: [
      'Always display the interpreted filter criteria so recruiters can verify the AI understood their intent',
      'Provide one-click override to switch to manual filter builder at any point',
      'Surface data quality warnings when results are based on incomplete ATS records',
      'Never silently exclude candidates — show count of filtered-out records with reason',
    ],
    variations: [
      { title: 'Conversational Chat Input', body: 'Free-text entry with AI interpretation. Fastest to use but highest error rate. Best for power users who could validate the generated filters.' },
      { title: 'Guided Filter Builder', body: 'Step-by-step structured input. Slower but more accurate. Preferred by new users who needed scaffolding.' },
      { title: 'Hybrid: Prompt + Refine', body: 'Natural language generates a draft filter set; user tweaks chips. Combined speed of NL with precision of manual. Shipped as the default interaction.' },
    ],
    impact: [
      { value: 'Seconds', label: 'List creation time (vs. 15–20 min manually)' },
      { value: '297', label: 'Lists created in first month of AI Lister launch' },
      { value: '87', label: 'Unique workflows driven by AI-generated lists' },
      { value: '50+', label: 'Active agencies using SenseIQ in month 1' },
    ],
  },
  {
    id: 'matching',
    label: 'Matching Agent',
    sublabel: 'Sourcing',
    color: '#B8F4D4',
    icon: '🎯',
    context: 'The Matching Agent is the sourcing engine of the AI Recruiter ecosystem. It uses Deep Match logic — combining skills, location, availability, and behavioral signals — to automatically surface the most qualified candidates for a job order without manual search.',
    why: [
      'Before the Matching Agent, recruiters manually searched candidate databases for each new job order — a process that took 30–60 minutes per role and relied heavily on keyword guessing.',
      'The platform handled thousands of job orders simultaneously. Manual matching couldn\'t scale. A 3× increase in weekly starts per recruiter required removing the sourcing bottleneck entirely.',
      'Semantic gap: a "Registered Nurse - ICU" and "Critical Care RN" are the same role, but keyword search missed these matches. Deep Match was built to close this gap using embedding-based similarity.',
    ],
    research: [
      { title: 'Recruiter Sourcing Patterns', body: 'We shadowed 8 recruiters during live sourcing sessions. The average recruiter ran 4–6 searches before finding viable candidates, adjusting keywords each time. We documented every search reformulation as a signal for what the AI needed to infer automatically.' },
      { title: 'Skills Taxonomy Study', body: 'We worked with the ML team to map 50,000+ skill variants to a normalized taxonomy. This powered semantic equivalence ("React" = "React.js" = "ReactJS") and role-level matching ("Software Engineer" ≈ "SWE" ≈ "Developer").' },
      { title: 'Batch Processing UX', body: 'We tested two models for showing results: a ranked list (single pass) and batch processing with live progress. Recruiters strongly preferred seeing the system work — the batch UI with a running count built trust that the AI was being thorough.' },
    ],
    constraints: [
      { title: 'Cold Start on New Job Types', body: 'For niche or emerging roles with few historical matches, the model had limited training signal. We designed a fallback to keyword search with a clear "low confidence" indicator so recruiters knew when to manually review.' },
      { title: 'Bias Mitigation', body: 'Matching on behavioral signals (past engagement, response rates) could inadvertently surface demographic bias from historical data. The team built bias monitoring dashboards and we added recruiter override controls as a required guardrail.' },
      { title: 'Goal-Based Exit Logic', body: 'Agencies set targets like "find 50 qualified candidates." The agent needed to stop at the right time — not too early (insufficient results) and not too late (wasted compute). Exit thresholds were configurable per agency.' },
    ],
    guardrails: [
      'Always show "why this match" rationale — skills matched, location proximity, availability signals',
      'Recruiter can demote or remove any match before the agent proceeds to engagement',
      'Confidence indicators: High / Medium / Low based on data completeness',
      'Zip Code Radius filter always visible and adjustable — never hidden',
      'Bias monitoring dashboard accessible to admin users',
    ],
    variations: [
      { title: 'Ranked List View', body: 'Single scored list with fit percentage. Clean and fast but overwhelming for large batches. Used for small job orders.' },
      { title: 'Batch Processing View', body: 'Real-time progress bar showing candidates being evaluated. Builds trust and lets recruiters monitor without waiting. Became the primary view for large-scale sourcing.' },
      { title: 'Side-by-Side Comparison', body: 'Two candidates compared head-to-head on matched criteria. Useful for final shortlist decisions but not scalable as a primary interface.' },
    ],
    impact: [
      { value: '20/100', label: 'Qualified evaluations per candidates sourced' },
      { value: '50', label: 'Top matches delivered per job order automatically' },
      { value: '12,821', label: 'Candidates matched in one live deployment' },
      { value: '3×', label: 'Increase in weekly start capacity (Carvana)' },
    ],
  },
  {
    id: 'voice',
    label: 'Voice Agent',
    sublabel: 'Engagement',
    color: '#F4A58A',
    icon: '🎙️',
    context: 'The Voice Agent conducts AI-powered phone screens on behalf of recruiters — calling candidates, asking dynamic role-specific questions generated from the Job Description, and capturing structured responses. It handles retries, voicemails, and channel-switching autonomously.',
    why: [
      'Phone screening was the single biggest bottleneck in the recruitment funnel. A recruiter screening 50 candidates could spend 2–3 full days on calls alone — most of which were voicemails or no-answers.',
      'Candidates expected instant engagement. Research showed that responding to an application within 2 minutes increased connection rates by 400%. Human recruiters could not achieve this at scale.',
      'The Voice Agent was designed to turn "calls" into "conversations" — structured, contextual, and capable of handling candidate questions dynamically rather than reading from a rigid script.',
    ],
    research: [
      { title: 'Voice UX Principles', body: 'We studied conversational AI interaction models across 15 production voice systems. Key findings: candidates needed to know immediately they were speaking to AI, questions must sound natural (not read), and silence handling (pauses) was critical to perceived intelligence.' },
      { title: 'Dynamic Question Module (DQM)', body: 'The DQM reads the Job Description and generates role-specific screening questions at runtime. We tested 3 question generation strategies — templated, JD-parsed, and fully generative — finding JD-parsed questions had the highest candidate completion rate at 73%.' },
      { title: 'Retry Logic Design', body: 'We mapped every failure state: voicemail, no answer, hung up, wrong number. Each required a different retry strategy. The agent supports up to 3 retries with configurable delays and switches to SMS/chat if all voice attempts fail.' },
    ],
    constraints: [
      { title: 'Accent and Language Diversity', body: 'The voice model needed to handle a wide range of accents across US, UK, and APAC markets. We worked with the vendor to test against 12 accent profiles and set minimum transcription confidence thresholds before accepting a response as valid.' },
      { title: 'Regulatory Compliance', body: 'In several US states, AI disclosure at the start of a call is legally required. The agent always opens with "I am an AI assistant calling on behalf of [Agency Name]." This was non-negotiable and validated with legal before launch.' },
      { title: 'No Visual Feedback Channel', body: 'Unlike chat, voice gives candidates no visual affordance. We had to design audio cues and verbal prompts to guide the conversation — adding audio confirmations, explicit transition phrases ("Moving to the next question..."), and a clear closing statement.' },
    ],
    guardrails: [
      'Always disclose AI identity at the start of every call — no exceptions',
      'Candidate can say "speak to a human" or "stop" at any point to trigger human escalation',
      'Maximum 3 retry attempts per candidate with minimum 4-hour spacing',
      'All transcripts stored and available for recruiter review — no black-box conversations',
      'Dynamic questions reviewed by recruiter before agent is activated for a new role type',
    ],
    variations: [
      { title: 'Scripted Question Flow', body: 'Fixed sequence of predefined questions. Predictable and auditable but inflexible. Used for high-compliance industries (healthcare, finance).' },
      { title: 'Dynamic JD-Parsed Flow', body: 'Questions generated from Job Description at runtime. More relevant and candidate-specific. Became the default for staffing agency use cases.' },
      { title: 'Adaptive Conversation Flow', body: 'Agent adjusts follow-up questions based on candidate responses. Most natural but highest complexity. Shipped as an experimental feature for select enterprise clients.' },
    ],
    impact: [
      { value: '60%', label: 'Cold calls lasting over 8 minutes' },
      { value: '2 min', label: 'Engagement time after application' },
      { value: '7 min', label: 'Full screening completion time' },
      { value: '3×', label: 'More candidates screened vs. human recruiter per day' },
    ],
  },
  {
    id: 'screening',
    label: 'Screening Agent',
    sublabel: 'Evaluation',
    color: '#D4B8F8',
    icon: '⚖️',
    context: 'The Screening Agent — also known as the Evaluation Agent — analyses voice call transcripts and resumes to assign a structured Fit Score (1–10) for each candidate. When a candidate meets the threshold, it automatically creates a submission record in the ATS with zero human data entry.',
    why: [
      'Evaluation was the subjective bottleneck. Two recruiters reviewing the same candidate could arrive at completely different conclusions based on personal heuristics. Standardisation was needed at scale.',
      'The manual process of reviewing call notes, reading resumes, and deciding on next steps took 15–20 minutes per candidate. With 50+ candidates per job order, this alone was a full-time job.',
      'The ATS writeback was the final automation gap. Candidates who passed screening still required manual data entry to update their status. The Screening Agent closed this loop completely.',
    ],
    research: [
      { title: 'Recruiter Scoring Rubrics', body: 'We interviewed 10 senior recruiters to extract their mental models for candidate evaluation. We identified 6 universal criteria: skills match, availability, location, compensation alignment, communication quality, and role-specific qualifications. These became the scoring dimensions.' },
      { title: 'Explainability Testing', body: 'Early versions showed only a numeric score. Usability tests revealed recruiters distrusted scores without rationale. We redesigned to always show score + reason for each dimension — increasing adoption from 34% to 81% in A/B testing.' },
      { title: 'Evaluation Mode Research', body: 'Three modes were designed: Resume-only (fast, less accurate), Voice Transcript-only (contextual, no document needed), and Combined (holistic). We found combined mode improved qualification accuracy by 34% vs. single-signal evaluation.' },
    ],
    constraints: [
      { title: 'Low Transcript Quality', body: 'Background noise, poor connection, or very short calls could produce unreliable transcripts. We built confidence scoring for transcription quality and flagged low-confidence evaluations for mandatory human review.' },
      { title: 'Explainability Requirements', body: 'Enterprise clients required audit trails for every hiring decision. Every Fit Score must be traceable to specific evidence from resume or transcript. The agent never produces a score without citing source material.' },
      { title: 'Threshold Calibration', body: 'Different agencies and roles require different quality bars. A score of 7/10 might be "submit" for a high-volume staffing role and "reject" for a senior specialist. Thresholds were made configurable per job template.' },
    ],
    guardrails: [
      'Score always accompanied by dimension-level breakdown — never a number alone',
      'Human override is always available — recruiter can accept or reject any AI evaluation',
      'Candidates flagged as "low confidence" always route to human review queue',
      'ATS writeback only triggers on explicit threshold crossing — configurable per agency',
      'Full evaluation audit trail stored per candidate for compliance',
    ],
    variations: [
      { title: 'Resume-Only Mode', body: 'Fastest evaluation path. Good for initial screening at top of funnel. Lower accuracy on soft skills and communication ability. Used when no voice data is available.' },
      { title: 'Voice Transcript Mode', body: 'Scores based on call analysis alone. Best for roles where communication is the primary qualifier. Not suitable for highly technical roles requiring resume depth.' },
      { title: 'Combined Mode (Default)', body: 'Holistic analysis of resume + transcript. Most accurate. 34% improvement in qualification precision. Shipped as the default for AI Recruiter deployments.' },
    ],
    impact: [
      { value: '33 min', label: 'Time from application to scored evaluation' },
      { value: '20/100', label: 'Qualified evaluations — outperforming human average' },
      { value: '0', label: 'Manual data entry required for ATS submission writeback' },
      { value: '8/10', label: 'Default submission threshold (configurable per agency)' },
    ],
  },
  {
    id: 'data',
    label: 'Data Agent',
    sublabel: 'Analytics',
    color: '#c8f4f0',
    icon: '📊',
    context: 'The Data Agent — internally called Jarvis — is a conversational analytics agent that lets recruiters and operations managers query workflow performance in plain English. Instead of navigating complex dashboards, users ask questions and get instant diagnostic insights and recommendations.',
    why: [
      'Analytics dashboards were powerful but passive. They showed what happened, not why — and required a data-literate user to extract actionable insight. Most recruiters couldn\'t diagnose a failing workflow without exporting to Excel.',
      'The feedback loop between workflow performance and optimization was too slow. A recruiter might not notice a 40% drop in SMS response rates until week-end reporting — losing days of candidate engagement.',
      'Ops managers needed to answer "why is this workflow failing?" in real-time during client calls. Jarvis was designed to give a confident, cited answer in under 10 seconds.',
    ],
    research: [
      { title: 'Analytics Mental Models', body: 'We ran card sorting sessions with 8 ops managers to understand how they think about workflow health. Three dominant patterns emerged: funnel analysis (where do candidates drop?), time analysis (when are candidates most responsive?), and comparative analysis (which template performs best?).' },
      { title: 'Query Pattern Analysis', body: 'We analysed 3 months of support tickets and dashboard exports to identify the 20 most common analytics questions. These became the seed set for training the conversational interface and validating completeness of the underlying data model.' },
      { title: 'Trust and Citation Design', body: 'Early user testing showed that a confident-sounding wrong answer was worse than a uncertain correct answer. We redesigned Jarvis to always cite its data source (e.g., "Based on 1,101 workflows between Jan–Mar 2025...") and show confidence level.' },
    ],
    constraints: [
      { title: 'Data Freshness', body: 'Analytics data was refreshed on a lag — some metrics were near-real-time, others were daily. Jarvis needed to clearly communicate data freshness per query so users didn\'t make decisions on stale numbers.' },
      { title: 'Complex Multi-Step Queries', body: 'Questions like "Show me the ROI of workflows that used AI matching vs. manual lists over the past quarter" required joining multiple data sources. We designed a query planner UI showing Jarvis\'s reasoning steps before returning results.' },
      { title: 'Scope Limitations', body: 'Jarvis could only answer questions about Sense data — not ATS data outside the Sense sync boundary. Clear scope messages ("I can only see data synced to Sense") were essential to prevent user confusion.' },
    ],
    guardrails: [
      'Every answer cites its data source and time window — no unattributed insights',
      'Data freshness indicator shown for every metric returned',
      'Out-of-scope queries get a clear explanation and redirect, never a hallucinated answer',
      'Sensitive data (individual candidate PII) is excluded from conversational responses',
      'Recommendations are framed as suggestions with supporting evidence — never directives',
    ],
    variations: [
      { title: 'Chat Interface', body: 'Free-form question entry with conversational responses. Natural but can feel unpredictable. Best for experienced ops users who know what they want to ask.' },
      { title: 'Insight Cards (Pre-built)', body: 'Auto-generated summaries of key metrics surfaced proactively. Lower learning curve, higher trust. Became the homepage of the Analytics section.' },
      { title: 'Hybrid: Chat + Pre-built', body: 'Insight cards for ambient awareness, chat for deep-dive. Shipped configuration — insight cards shown by default, Jarvis chat available on demand.' },
    ],
    impact: [
      { value: '97%', label: 'QoQ workflow growth Q2→Q3 2025' },
      { value: '10s', label: 'Time to get workflow diagnostic insight' },
      { value: '1,101', label: 'Active workflows analysed in real-time' },
      { value: '199', label: 'Agencies with active workflow monitoring' },
    ],
  },
  {
    id: 'ai-recruiter',
    label: 'AI Recruiter',
    sublabel: 'Orchestrator',
    color: '#F8E4A0',
    icon: '🤖',
    context: 'The AI Recruiter — internally called Grace — is the central orchestrator of the entire agent ecosystem. Grace doesn\'t do the work herself; she delegates it. When a new job order arrives, she activates the Matching Agent, deploys the Voice Agent, instructs the Screening Agent, and closes the loop with an ATS writeback — all without a human recruiter logging in.',
    why: [
      'The sub-agents (Matching, Voice, Screening) existed independently but lacked a coordinating intelligence. Recruiters still had to manually chain them together — activating each in sequence, copying outputs between them. This "human middleware" was the final bottleneck.',
      'True autonomy required a decision-making layer that could handle branching scenarios: what if a candidate doesn\'t answer? What if they want to negotiate rate? What if the Voice Agent scores a 6/10 but they\'re the 50th match and the role is urgent? Grace was built to reason through these states.',
      'The vision was "One Recruiter with the Power of a Team." Grace embodies this by acting as the senior recruiter who delegates to specialists — rather than being yet another tool that a recruiter must operate.',
    ],
    research: [
      { title: 'Orchestration UX Research', body: 'We studied how recruiters mentally model a full hiring process — the handoffs, decisions, and fallbacks. We mapped these into an agent state machine: Sourcing → Engagement → Evaluation → Submission, with defined fallback paths at each node.' },
      { title: 'Supervisor Mental Model', body: 'Research showed recruiters were most comfortable with Grace when she was framed as a supervisor they were managing, not a tool they were operating. This shifted UI language from "configure agent" to "set goals for Grace" — a critical reframe that improved adoption.' },
      { title: 'Failure State Design', body: 'We ran exhaustive failure scenario mapping: agent timeout, candidate opt-out, low-confidence evaluation, ATS API failure. Each scenario needed a clear recruiter notification, a defined fallback state, and a one-click recovery action.' },
    ],
    constraints: [
      { title: 'Partial Automation States', body: 'In real deployments, some candidates fall through agent handoffs — they answer the voice call but don\'t complete screening, or the ATS writeback fails. Grace needed to surface these "stuck" candidates clearly rather than silently dropping them.' },
      { title: 'Trust and Transparency', body: 'Recruiters worried Grace would make bad decisions they\'d be blamed for. The "Glass Box" design principle was central: every decision Grace makes is visible, traceable, and overrideable. Recruiters are supervisors, not passengers.' },
      { title: 'Multi-Tenancy Isolation', body: 'Grace operates across thousands of concurrent job orders from hundreds of agencies. Agent actions for one agency must never bleed into another\'s data or workflows. Strict tenant isolation was a non-negotiable architectural constraint.' },
    ],
    guardrails: [
      'Every agent action is logged and attributed — Grace never acts silently',
      'Recruiter can pause, override, or terminate any agent action at any stage',
      'Grace surfaces a "needs attention" queue for candidates requiring human judgment',
      '"Glass Box" principle: all AI reasoning steps visible on the workflow canvas',
      'ATS writes always require a confidence threshold — never write on uncertain data',
      'Candidate opt-out at any channel immediately halts all agent activity for that candidate',
    ],
    variations: [
      { title: 'Dashboard View', body: 'Real-time status of all active Grace deployments in a card grid. Shows candidates in each stage, stuck states, and completion metrics. Preferred by ops managers for oversight.' },
      { title: 'Workflow Canvas Integration', body: 'Grace\'s agent logic visualised directly on the Workflow Canvas node graph. Each agent is a node; active state shown with live indicators. Preferred by power users who build custom configurations.' },
      { title: 'Goal-Setting Wizard', body: 'Simplified onboarding flow: recruiter sets job order goals (target candidates, quality threshold, timeline). Grace handles everything else. Designed for non-technical recruiters adopting AI Recruiter for the first time.' },
    ],
    impact: [
      { value: '11.1 hrs', label: 'Fastest time to fill a hard role (BGSF)' },
      { value: '$5M+', label: 'Booked ARR tracked from AI Recruiter product line' },
      { value: '50K+', label: 'Hours of manager time saved (HCA Healthcare)' },
      { value: '404K', label: 'Meetings scheduled YTD — 175% YoY increase' },
    ],
  },
]

const SUMMARY_KPIS = [
  { value: '30–81%', label: 'Reduction in Time-to-Hire across deployments', color: '#F4A58A' },
  { value: '1M+', label: 'Candidates engaged per year across all agents', color: '#B8D4F8' },
  { value: '50K+', label: 'Hours of recruiter time saved (HCA Healthcare alone)', color: '#B8F4D4' },
]

/* ── Shared helpers ─────────────────────────────────────────── */

function AccentH2({ children, color = PALETTE[0] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
      <div style={{ width: '3px', minHeight: '36px', background: color, borderRadius: '2px', flexShrink: 0, marginTop: '6px' }} />
      <h2 style={{ ...T.h2, marginTop: 0 }}>{children}</h2>
    </div>
  )
}

function MetricCard({ value, label, color }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '20px 22px',
      textAlign: 'center',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color, borderRadius: '16px 16px 0 0' }} />
      <div style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1, marginBottom: '6px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#888', fontWeight: 500, lineHeight: 1.4 }}>{label}</div>
    </div>
  )
}

function InfoCard({ title, children, accent = PALETTE[0] }) {
  return (
    <div
      className="cs-info-card"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '8px', letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: '#777', margin: 0 }}>{children}</p>
    </div>
  )
}

function GuardrailItem({ children, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 16px',
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '6px' }} />
      <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#666', margin: 0 }}>{children}</p>
    </div>
  )
}

function ImagePlaceholder({ label = 'Hero Screenshot', height = '340px', color = '#F4A58A' }) {
  return (
    <div style={{
      width: '100%',
      height,
      borderRadius: '20px',
      border: `2px dashed ${color}66`,
      background: `${color}0D`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '8px',
      marginBottom: '8px',
    }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5"/>
          <circle cx="7" cy="9" r="2" stroke={color} strokeWidth="1.5"/>
          <path d="M2 14L6 10L9 13L13 8L18 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p style={{ fontSize: '13px', fontWeight: 600, color: `${color}CC`, margin: 0, letterSpacing: '0.02em' }}>{label}</p>
      <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>Screenshot to be added</p>
    </div>
  )
}

function Section({ children }) {
  return <div style={{ marginBottom: '52px' }}>{children}</div>
}

/* ── Agent Tab Content ──────────────────────────────────────── */
function AgentContent({ agent }) {
  const c = agent.color
  return (
    <div style={{ animation: 'aaCsFadeIn 0.4s cubic-bezier(0.33, 1, 0.68, 1) both' }}>

      {/* Hero image placeholder */}
      <Section>
        <ImagePlaceholder label={`${agent.label} — UI Screenshot`} height="380px" color={c} />
      </Section>

      {/* Context */}
      <Section>
        <AccentH2 color={c}>Context</AccentH2>
        <p style={T.body}>{agent.context}</p>
      </Section>

      {/* Why */}
      <Section>
        <AccentH2 color={c}>Why do we need {agent.label}?</AccentH2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {agent.why.map((point, i) => (
            <div key={i} style={{
              display: 'flex', gap: '14px', padding: '16px 20px',
              background: '#fff', borderRadius: '14px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              alignItems: 'flex-start',
              fontFamily: "'Nunito', sans-serif",
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: c, flexShrink: 0, marginTop: '1px', minWidth: '20px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#666', margin: 0 }}>{point}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Research and Ideation */}
      <Section>
        <AccentH2 color={c}>Research & Ideation</AccentH2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {agent.research.map((r, i) => (
            <InfoCard key={i} title={r.title} accent={c}>{r.body}</InfoCard>
          ))}
        </div>
        <ImagePlaceholder label="Research Artifacts / Wireframes" height="260px" color={c} />
      </Section>

      {/* Constraints and Limitations */}
      <Section>
        <AccentH2 color={c}>Constraints & Limitations</AccentH2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {agent.constraints.map((con, i) => (
            <div key={i} style={{
              padding: '20px 24px',
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
              borderLeft: `3px solid ${c}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              <h3 style={{ ...T.h3, marginTop: 0, marginBottom: '8px' }}>{con.title}</h3>
              <p style={{ ...T.body, marginBottom: 0 }}>{con.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Guardrails and Principles */}
      <Section>
        <AccentH2 color={c}>Guardrails & Principles</AccentH2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {agent.guardrails.map((g, i) => (
            <GuardrailItem key={i} color={c}>{g}</GuardrailItem>
          ))}
        </div>
      </Section>

      {/* Design Variations */}
      <Section>
        <AccentH2 color={c}>Design Variations</AccentH2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {agent.variations.map((v, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${c}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.01em' }}>{v.title}</h3>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#777', margin: 0 }}>{v.body}</p>
            </div>
          ))}
        </div>
        <ImagePlaceholder label="Design Variations — UI Explorations" height="300px" color={c} />
      </Section>

      {/* Impact and Outcomes */}
      <Section>
        <AccentH2 color={c}>Impact & Outcomes</AccentH2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {agent.impact.map((m, i) => (
            <MetricCard key={i} value={m.value} label={m.label} color={c} />
          ))}
        </div>
      </Section>
    </div>
  )
}

/* ── Agent Tab Bar ──────────────────────────────────────────── */
function AgentTabs({ activeId, onChange }) {
  return (
    <div style={{
      position: 'sticky',
      top: '57px',
      zIndex: 90,
      background: 'rgba(234,232,225,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      padding: '10px 24px',
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        background: 'rgba(0,0,0,0.04)',
        borderRadius: '20px',
        padding: '4px',
      }}>
        {AGENTS.map((agent) => {
          const isActive = activeId === agent.id
          return (
            <button
              key={agent.id}
              onClick={() => onChange(agent.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '16px',
                background: isActive ? '#111' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#fff' : '#888',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.25s ease',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {isActive && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.color, flexShrink: 0 }} />
              )}
              {agent.label}
              {isActive && (
                <span style={{ fontSize: '9px', fontWeight: 600, color: `${agent.color}CC`, background: `${agent.color}22`, borderRadius: '4px', padding: '1px 5px', marginLeft: '2px' }}>
                  {agent.sublabel}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function AIAgentsCasePage({ onBack }) {
  const [activeAgent, setActiveAgent] = useState(AGENTS[0].id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const agent = AGENTS.find((a) => a.id === activeAgent) || AGENTS[0]

  const handleTabChange = (id) => {
    setActiveAgent(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgb(234,232,225)',
      overflowY: 'auto',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* ── Top Bar ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(234,232,225,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        height: '57px',
        boxSizing: 'border-box',
      }}>
        <button
          onClick={onBack}
          className="cs-back-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '999px',
            padding: '8px 18px',
            fontSize: '13px', fontWeight: 600, color: '#333',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            fontFamily: "'Nunito', sans-serif",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Portfolio
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif" }}>Case Study</span>
          <span style={{ width: '1px', height: '12px', background: '#ddd' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#555', fontFamily: "'Nunito', sans-serif" }}>AI Agents for Recruitment</span>
        </div>
      </div>

      {/* ── Page content below fixed top bar ── */}
      <div style={{ paddingTop: '57px' }}>

        {/* ── Hero Section ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #1a1a1a 100%)',
          padding: 'clamp(48px, 6vw, 88px) clamp(24px, 5vw, 64px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            zIndex: 0,
          }} />
          {/* Orbs */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(248,228,160,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,212,248,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', top: '40%', right: '25%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,244,212,0.07) 0%, transparent 70%)', filter: 'blur(20px)' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' }}>
            <span style={{ ...T.kicker, color: 'rgba(255,255,255,0.4)' }}>Case Study</span>
            <h1 style={{ ...T.h1, color: '#fff', marginBottom: '16px' }}>AI Agents for Recruitment</h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '560px', fontFamily: "'Nunito', sans-serif" }}>
              A deep dive into the six specialized AI agents that power autonomous talent acquisition — from intelligent matching to voice screening and orchestrated hiring.
            </p>

            {/* Meta chips */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[
                { label: 'Role', value: 'Staff Product Designer', color: '#F8E4A0' },
                { label: 'Timeline', value: '2022 – Present', color: '#B8D4F8' },
                { label: 'Company', value: 'SenseHQ', color: '#B8F4D4' },
              ].map((m, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)' }}>{m.label}</span>
                  <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.12)' }} />
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Hero image placeholder */}
            <div style={{
              width: '100%',
              height: 'clamp(200px, 30vw, 360px)',
              borderRadius: '20px',
              border: '1.5px dashed rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  <circle cx="7" cy="9" r="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  <path d="M2 14L6 10L9 13L13 8L18 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Hero Image — AI Agents Overview</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>Screenshot to be added</p>
            </div>
          </div>
        </div>

        {/* ── Summary Section ── */}
        <div style={{ background: 'rgb(234,232,225)', padding: 'clamp(40px, 5vw, 64px) clamp(24px, 5vw, 64px)' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <span style={T.kicker}>Project Summary</span>
            <h2 style={{ ...T.h2, marginTop: '4px', fontSize: 'clamp(24px, 3.5vw, 40px)' }}>
              Six Agents. One Mission.
            </h2>
            <p style={{ ...T.body, maxWidth: '660px', fontSize: '15.5px', marginBottom: '36px' }}>
              The AI Agents suite at SenseHQ represents a fundamental shift from workflow automation to autonomous talent acquisition. Each agent is a specialist — designed with a clear scope, transparent reasoning, and a recruiter-in-control philosophy. Together, they form the engine behind SenseHQ's AI Recruiter product.
            </p>

            {/* KPI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {SUMMARY_KPIS.map((kpi, i) => (
                <MetricCard key={i} value={kpi.value} label={kpi.label} color={kpi.color} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Agent Tabs ── */}
        <AgentTabs activeId={activeAgent} onChange={handleTabChange} />

        {/* ── Per-Agent Content ── */}
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(40px, 5vw, 64px) clamp(24px, 5vw, 40px) 80px' }}>
          <AgentContent key={activeAgent} agent={agent} />
        </div>
      </div>

      <style>{`
        @keyframes aaCsFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cs-back-btn:hover {
          background: #111 !important;
          color: #fff !important;
          border-color: #111 !important;
        }
      `}</style>
    </div>
  )
}
