import styled from "styled-components";
import {
  Heading,
  Body,
  shade950,
  shade300,
  shade0,
} from "@songtradr/design-language";
import { staticText } from "@/shared/statics/static-text";

// TEXT
export const text = staticText.musicBriefAnalyzer;

// TYPES
export type AnalysisQuestionCategory =
  | "emotional"
  | "musical"
  | "practical"
  | "audience";

export type AnalysisQuestion = {
  question: string;
  context: string;
  category: AnalysisQuestionCategory;
};

export type BriefAnalysis = {
  score: number;
  strengths: string[];
  gaps: string[];
  questions: AnalysisQuestion[];
};

export type BriefAnswer = {
  question: string;
  answer: string;
};

export type RefineResult = {
  title: string;
  refinedBrief: string;
  score: number;
};

export type BriefRecord = {
  briefId: string;
  title?: string;
  originalBriefText?: string;
  analysis?: BriefAnalysis;
  score?: number;
  finalScore?: number;
  answers?: BriefAnswer[];
  refinedBrief?: string;
  createdAt?: string;
  updatedAt?: string;
};

// CONSTANTS
export const MAX_TOKENS = 4000;

// FUNCTIONS
export const buildAnalyzePrompt = (briefText: string): string => {
  return `You are an expert music supervisor analyzing a music brief. 

Score this brief out of 10 using this framework:

ESSENTIAL (6 points possible):
- Clear emotional direction (2 pts) - How should viewer feel?
- Visual/narrative context (2 pts) - What's happening on screen?
- Music's role (2 pts) - Hero or supportive? Under VO?

STRONG (3 points possible):
- Specific musical characteristics (1 pt) - Tempo, instrumentation, vocals
- Reference tracks with context (1 pt) - Not just "I like this" but WHY
- Practical details (1 pt) - Stems needed? Multiple cuts? Budget range?

EXCELLENT (1 point possible):
- Target audience insights (0.5 pts)
- Cultural/sonic strategy (0.5 pts)

Analyze this brief and return a JSON object with this structure:
{
  "score": <number out of 10>,
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "questions": [
    {"question": "...", "context": "why we're asking", "category": "emotional|musical|practical|audience"},
    ...3-5 questions total
  ]
}

Brief to analyze:
${briefText}

Return ONLY the JSON object, no other text.`;
};

export const buildRefinePrompt = (
  briefText: string,
  analysis: BriefAnalysis,
  answers: BriefAnswer[],
): string => {
  const qaPairs = answers
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n\n");

  return `You are an expert music supervisor. Create a refined, professional music brief.

Original brief:
${briefText}

Questions asked and answers:
${qaPairs}

Create a refined brief in this style (use clear sections, be specific, include all relevant details):

# Music Brief: [Project Name]

## Project Context
[What's happening visually/narratively]

## Emotional Direction
[How should the viewer feel? What's the emotional journey?]

## Musical Characteristics
- Tempo: [BPM range or descriptive]
- Instrumentation: [Specific instruments or sound palette]
- Vocals: [Male/Female/None/Instrumental]
- Genre/Style: [Specific but not limiting]

## Reference Tracks
[Track name - Artist]
- Why this reference: [What specifically do you like?]

## Practical Requirements
- Duration: [Length needed]
- Role of music: [Hero/supportive, under VO, etc.]
- Stems needed: [Yes/No]
- Other technical needs: [Any special requirements]

## Target Audience
[Who are we reaching and why does it matter?]

## Additional Context
[Budget range, territory, usage rights, deadlines, etc.]

Now re-score this refined brief out of 10 using the same scoring framework as the original analysis.

Return your response as a JSON object with this structure:
{
  "title": "<short descriptive title for this brief, 3-7 words>",
  "refinedBrief": "<the full refined brief in markdown format>",
  "score": <number out of 10>
}

Write the brief in a professional, clear tone. Be specific but not restrictive. Give the music supervisor enough to work with while leaving room for creative discovery.

Return ONLY the JSON object, no other text.`;
};

export const safeParseAnalysis = (raw: string): BriefAnalysis => {
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as BriefAnalysis;
};

export const safeParseRefine = (raw: string): RefineResult => {
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as RefineResult;
};

// STYLES
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${shade950};
  padding: 3rem 1.5rem;
`;

export const ContentWrapper = styled.div`
  max-width: 60rem;
  margin: 0 auto;
  position: relative;
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  @media print {
    margin-bottom: 1.5rem;
  }
`;

export const TitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media print {
    display: none;
  }
`;

export const Title = styled(Heading)`
  color: ${shade0};
`;

export const Subtitle = styled(Body)`
  color: ${shade300};
  max-width: 40rem;
  margin: 0 auto;

  @media print {
    display: none;
  }
`;
