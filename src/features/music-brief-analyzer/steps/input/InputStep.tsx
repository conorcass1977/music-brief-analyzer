"use client";

import { useRouter } from "next/navigation";
import { Button, Heading } from "@songtradr/design-language";
import { useMusicBriefAnalyzer } from "../../MusicBriefAnalyzer.Context";
import {
  text,
  MIN_BRIEF_LENGTH,
  Card,
  HeadingWrapper,
  Warning,
  StyledTextArea,
} from "./InputStep.Parts";

export const InputStep = () => {
  const { brief, setBrief, analyzeBrief, briefsTotal } =
    useMusicBriefAnalyzer();
  const router = useRouter();
  const remaining = MIN_BRIEF_LENGTH - brief.briefText.trim().length;
  const isDisabled = brief.briefText.trim().length < MIN_BRIEF_LENGTH;

  return (
    <Card>
      <HeadingWrapper>
        <Heading variant="h3-strong">{text.heading}</Heading>
      </HeadingWrapper>

      <StyledTextArea
        placeholder={text.placeholder}
        width="100%"
        value={brief.briefText}
        onChange={(e) => setBrief({ briefText: e.target.value })}
      />

      <Button $variant="important" onClick={analyzeBrief} disabled={isDisabled}>
        {text.analyzeButton}
      </Button>

      {isDisabled && brief.briefText.length > 0 && (
        <Warning>
          {text.minCharsWarning.replace("{remaining}", String(remaining))}
        </Warning>
      )}

      {briefsTotal > 0 && (
        <Button $variant="subtle" onClick={() => router.push("/briefs")}>
          {text.viewPastBriefs.replace("{count}", String(briefsTotal))}
        </Button>
      )}
    </Card>
  );
};
