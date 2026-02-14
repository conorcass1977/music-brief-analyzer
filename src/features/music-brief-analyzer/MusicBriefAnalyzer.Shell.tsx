"use client";

import { ReactNode } from "react";
import {
  text,
  PageWrapper,
  ContentWrapper,
  PageHeader,
  TitleRow,
  Title,
  Subtitle,
} from "./MusicBriefAnalyzer.Parts";

type Props = {
  children: ReactNode;
};

export const MusicBriefAnalyzerShell = ({ children }: Props) => (
  <PageWrapper>
    <ContentWrapper>
      <PageHeader>
        <TitleRow>
          <Title>{text.title}</Title>
        </TitleRow>
        <Subtitle>{text.subtitle}</Subtitle>
      </PageHeader>
      {children}
    </ContentWrapper>
  </PageWrapper>
);
