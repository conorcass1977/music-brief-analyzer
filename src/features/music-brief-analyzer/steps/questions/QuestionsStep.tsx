"use client";

import { Button, Heading } from "@songtradr/design-language";
import { useMusicBriefAnalyzer } from "../../MusicBriefAnalyzer.Context";
import {
  text,
  Card,
  HeaderRow,
  ProgressBarTrack,
  ProgressBarFill,
  ContextBox,
  CategoryBadge,
  StyledTextArea,
} from "./QuestionsStep.Parts";

export const QuestionsStep = () => {
  const { brief, setBrief, handleAnswer } = useMusicBriefAnalyzer();

  if (!brief.analysis) return null;

  const question = brief.analysis.questions[brief.currentQuestion];
  const currentAnswer =
    brief.answers.find((a) => a.question === question.question)?.answer ?? "";
  const isLast = brief.currentQuestion >= brief.analysis.questions.length - 1;

  return (
    <Card>
      <HeaderRow $marginBottom="1rem">
        <Heading variant="h2">
          {text.questionLabel
            .replace("{current}", String(brief.currentQuestion + 1))
            .replace("{total}", String(brief.analysis.questions.length))}
        </Heading>
        <CategoryBadge>{question.category}</CategoryBadge>
      </HeaderRow>

      <ProgressBarTrack $height="0.2rem">
        <ProgressBarFill
          $width={
            ((brief.currentQuestion + 1) / brief.analysis.questions.length) *
            100
          }
          $height="0.2rem"
        />
      </ProgressBarTrack>

      <>
        <Heading variant="h3-normal">{question.question}</Heading>
        <ContextBox>{question.context}</ContextBox>

        <StyledTextArea
          placeholder={text.placeholder}
          value={currentAnswer}
          onChange={(e) => {
            const value = e.target.value;
            const idx = brief.answers.findIndex(
              (a) => a.question === question.question,
            );
            const updated =
              idx >= 0
                ? brief.answers.map((a, i) =>
                    i === idx
                      ? { question: question.question, answer: value }
                      : a,
                  )
                : [
                    ...brief.answers,
                    { question: question.question, answer: value },
                  ];
            setBrief({ answers: updated });
          }}
          autoFocus
          width="100%"
        />
      </>

      <Button
        $variant="important"
        onClick={() => handleAnswer(currentAnswer)}
        disabled={!currentAnswer.trim()}
      >
        {isLast ? text.generateRefinedBrief : text.nextQuestion}
      </Button>
    </Card>
  );
};
