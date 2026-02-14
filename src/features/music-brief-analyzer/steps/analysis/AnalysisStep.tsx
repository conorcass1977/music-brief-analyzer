"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Heading,
  Body,
  CheckIcon,
  DismissIcon,
  ChevronIcon,
} from "@songtradr/design-language";
import { useMusicBriefAnalyzer } from "../../MusicBriefAnalyzer.Context";
import {
  text,
  Card,
  HeaderRow,
  ScoreDisplay,
  ProgressBarTrack,
  ProgressBarFill,
  Section,
  SectionHeader,
  ListItem,
  ListIcon,
  CalloutBox,
} from "./AnalysisStep.Parts";

export const AnalysisStep = () => {
  const { brief } = useMusicBriefAnalyzer();
  const router = useRouter();

  if (!brief.analysis) return null;

  return (
    <Card>
      <HeaderRow $marginBottom="0">
        <Heading variant="h2">{text.heading}</Heading>
        <ScoreDisplay>{brief.analysis.score}/10</ScoreDisplay>
      </HeaderRow>

      <ProgressBarTrack>
        <ProgressBarFill $width={(brief.analysis.score / 10) * 100} />
      </ProgressBarTrack>

      {brief.analysis.strengths.length > 0 && (
        <Section>
          <SectionHeader>
            <CheckIcon />
            <Heading variant="h3-normal">{text.strengthsHeading}</Heading>
          </SectionHeader>
          {brief.analysis.strengths.map((strength, i) => (
            <ListItem key={i} $variant="success">
              <ListIcon $variant="success">✓</ListIcon>
              <Body>{strength}</Body>
            </ListItem>
          ))}
        </Section>
      )}

      {brief.analysis.gaps.length > 0 && (
        <Section>
          <SectionHeader>
            <DismissIcon />
            <Heading variant="h3-normal">{text.gapsHeading}</Heading>
          </SectionHeader>
          {brief.analysis.gaps.map((gap, i) => (
            <ListItem key={i} $variant="warning">
              <ListIcon $variant="warning">⚠</ListIcon>
              <Body>{gap}</Body>
            </ListItem>
          ))}
        </Section>
      )}

      <Section>
        <SectionHeader>
          <ChevronIcon orientation={"right"} />
          <Heading variant="h3-normal">{text.whatsNext}</Heading>
        </SectionHeader>
        <CalloutBox>
          <Body>
            <strong>{text.levelUpMessage}</strong>{" "}
            {text.levelUpDetail.replace(
              "{count}",
              String(brief.analysis.questions.length),
            )}
          </Body>
        </CalloutBox>
      </Section>

      <Button $variant="important" onClick={() => router.push("/questions")}>
        {text.startQuestions}
      </Button>
    </Card>
  );
};
