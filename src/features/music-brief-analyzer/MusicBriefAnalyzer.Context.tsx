"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  RefObject,
} from "react";
import { useRouter } from "next/navigation";
import { useLabContext } from "@songtradr/massivemusic-labs";
import { postClaudeMessages } from "@/shared/api/claude-client";
import { markdownToHtml, htmlToMarkdown } from "@/shared/utils/markdown";
import { errorText } from "@/shared/statics/error-text";
import { staticText } from "@/shared/statics/static-text";
import {
  BriefAnalysis,
  BriefAnswer,
  BriefRecord,
  MAX_TOKENS,
  buildAnalyzePrompt,
  buildRefinePrompt,
  safeParseAnalysis,
  safeParseRefine,
} from "./MusicBriefAnalyzer.Parts";

type BriefState = {
  id: string | null;
  briefText: string;
  title: string;
  analysis: BriefAnalysis | null;
  currentQuestion: number;
  answers: BriefAnswer[];
  refinedBrief: string;
  finalScore: number | null;
  isEditing: boolean;
  createdAt: string | null;
};

const initialBriefState: BriefState = {
  id: null,
  briefText: "",
  title: "",
  analysis: null,
  currentQuestion: 0,
  answers: [],
  refinedBrief: "",
  finalScore: null,
  isEditing: false,
  createdAt: null,
};

type MusicBriefAnalyzerContextType = {
  brief: BriefState;
  setBrief: (update: Partial<BriefState>) => void;
  briefsTotal: number;
  briefContentRef: RefObject<HTMLDivElement | null>;
  loadBriefById: (id: string) => Promise<void>;
  analyzeBrief: () => Promise<void>;
  handleAnswer: (answer: string) => void;
  handleSaveEdit: () => void;
  handleCopy: () => void;
  startOver: () => void;
};

const MusicBriefAnalyzerContext =
  createContext<MusicBriefAnalyzerContextType | null>(null);

export const useMusicBriefAnalyzer = () => {
  const context = useContext(MusicBriefAnalyzerContext);
  if (!context) {
    throw new Error(
      "useMusicBriefAnalyzer must be used within MusicBriefAnalyzerProvider",
    );
  }
  return context;
};

export const MusicBriefAnalyzerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const { executeHostCommand } = useLabContext();
  const [brief, setBriefState] = useState<BriefState>(initialBriefState);
  const [briefsTotal, setBriefsTotal] = useState(0);
  const briefContentRef = useRef<HTMLDivElement>(null);

  const setBrief = (update: Partial<BriefState>) =>
    setBriefState((prev) => ({ ...prev, ...update }));

  const briefToRecord = (state: BriefState): Partial<BriefRecord> => ({
    briefId: state.id ?? undefined,
    title: state.title || undefined,
    originalBriefText: state.briefText || undefined,
    analysis: state.analysis ?? undefined,
    score: state.analysis?.score,
    answers: state.answers.length ? state.answers : undefined,
    refinedBrief: state.refinedBrief || undefined,
    finalScore: state.finalScore ?? undefined,
    createdAt: state.createdAt ?? undefined,
  });

  const saveBrief = async (id: string, state: BriefState, isNew = false) => {
    try {
      const data = {
        ...briefToRecord(state),
        updatedAt: new Date().toISOString(),
      };
      return await executeHostCommand("DATASTORE", {
        action: "save",
        tableName: "Briefs",
        ...(isNew ? {} : { id }),
        data,
      });
    } catch (e) {
      console.error("saveBrief failed:", e);
      return null;
    }
  };

  const loadBriefById = async (id: string) => {
    try {
      const res = await executeHostCommand("DATASTORE", {
        action: "load",
        tableName: "Briefs",
        id,
      });
      if (!res?.data) return;
      const d = res.data as BriefRecord;
      setBrief({
        id,
        title: d.title ?? "",
        briefText: d.originalBriefText ?? "",
        analysis: (d.analysis as BriefAnalysis) ?? null,
        answers: (d.answers as BriefAnswer[]) ?? [],
        refinedBrief: d.refinedBrief ?? "",
        finalScore: d.finalScore ?? null,
        createdAt: d.createdAt ?? null,
      });
    } catch (e) {
      console.error("loadBriefById failed:", e);
    }
  };

  const refreshBriefsCount = async () => {
    try {
      const res = await executeHostCommand("DATASTORE", {
        action: "count",
        tableName: "Briefs",
      });
      setBriefsTotal(res.total ?? 0);
    } catch (e) {
      console.error("refreshBriefsCount failed:", e);
    }
  };

  const analyzeBrief = async () => {
    router.push("/analyzing");

    const briefText = brief.briefText;
    const createdAt = new Date().toISOString();
    const initialState: BriefState = { ...brief, briefText, createdAt };
    const created = await saveBrief("", initialState, true);
    const id = created?.id ?? null;
    const withId: BriefState = { ...initialState, id };
    setBrief({ id, createdAt });

    try {
      const prompt = buildAnalyzePrompt(briefText);
      const response = await postClaudeMessages(
        [{ role: "user", content: prompt }],
        MAX_TOKENS,
      );
      const analysisData = safeParseAnalysis(response);
      const withAnalysis: BriefState = { ...withId, analysis: analysisData };
      setBrief({ analysis: analysisData });

      if (id) {
        await saveBrief(id, withAnalysis);
      }

      router.push("/analysis");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(errorText.analysisFailed.message.replace("{error}", message));
      router.push("/");
    }
  };

  const handleAnswer = (answer: string) => {
    if (!brief.analysis) return;
    const questionText =
      brief.analysis.questions[brief.currentQuestion].question;
    const existing = brief.answers.findIndex(
      (a) => a.question === questionText,
    );
    const updatedAnswers =
      existing >= 0
        ? brief.answers.map((a, i) =>
            i === existing ? { question: questionText, answer } : a,
          )
        : [...brief.answers, { question: questionText, answer }];
    const updatedState = { ...brief, answers: updatedAnswers };

    if (brief.id) {
      saveBrief(brief.id, updatedState);
    }

    if (brief.currentQuestion < brief.analysis.questions.length - 1) {
      setBrief({
        answers: updatedAnswers,
        currentQuestion: brief.currentQuestion + 1,
      });
    } else {
      setBrief({ answers: updatedAnswers });
      generateRefinedBrief(updatedAnswers);
    }
  };

  const generateRefinedBrief = async (finalAnswers: BriefAnswer[]) => {
    if (!brief.analysis) return;
    const { id, briefText, analysis } = brief;
    router.push("/generating");

    try {
      const prompt = buildRefinePrompt(briefText, analysis, finalAnswers);
      const raw = await postClaudeMessages(
        [{ role: "user", content: prompt }],
        MAX_TOKENS,
      );
      const { title, refinedBrief: refined, score } = safeParseRefine(raw);
      const updated: BriefState = {
        ...brief,
        answers: finalAnswers,
        title,
        refinedBrief: refined,
        finalScore: score,
      };
      setBrief({
        title,
        refinedBrief: refined,
        finalScore: score,
        answers: finalAnswers,
      });

      if (id) {
        await saveBrief(id, updated);
      }

      router.push(id ? `/output?id=${id}` : "/output");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(errorText.generationFailed.message.replace("{error}", message));
      router.push("/questions");
      setBrief({ currentQuestion: analysis.questions.length - 1 });
    }
  };

  useEffect(() => {
    if (brief.isEditing && briefContentRef.current) {
      briefContentRef.current.innerHTML = markdownToHtml(brief.refinedBrief);
    }
  }, [brief.isEditing, brief.refinedBrief]);

  useEffect(() => {
    refreshBriefsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveEdit = () => {
    if (briefContentRef.current) {
      const edited = htmlToMarkdown(briefContentRef.current.innerHTML);
      const updated = { ...brief, refinedBrief: edited, isEditing: false };
      setBrief({ refinedBrief: edited, isEditing: false });
      if (brief.id) {
        saveBrief(brief.id, updated);
      }
    } else {
      setBrief({ isEditing: false });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(brief.refinedBrief);
    alert(staticText.musicBriefAnalyzer.output.copiedAlert);
  };

  const startOver = () => {
    setBriefState(initialBriefState);
    refreshBriefsCount();
    router.push("/");
  };

  return (
    <MusicBriefAnalyzerContext.Provider
      value={{
        brief,
        setBrief,
        briefsTotal,
        briefContentRef,
        loadBriefById,
        analyzeBrief,
        handleAnswer,
        handleSaveEdit,
        handleCopy,
        startOver,
      }}
    >
      {children}
    </MusicBriefAnalyzerContext.Provider>
  );
};
