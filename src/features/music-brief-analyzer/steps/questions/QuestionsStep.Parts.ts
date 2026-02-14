import styled from "styled-components";
import {
  Body,
  TextArea,
  shade800,
  shade300,
  shade850,
  primary01,
} from "@songtradr/design-language";
import { staticText } from "@/shared/statics/static-text";

export {
  Card,
  HeaderRow,
  ProgressBarTrack,
  ProgressBarFill,
} from "@/shared/components/styled";

// TEXT
export const text = staticText.musicBriefAnalyzer.questions;

// STYLES
export const ContextBox = styled(Body)`
  color: ${shade300};
  background: ${shade850};
  padding: 1rem;
  margin: 1.5rem 0;
`;

export const CategoryBadge = styled(Body).attrs({ variant: "xsmall-strong" })`
  color: ${primary01};
  background: ${shade800};
  padding: 0.25rem 0.75rem;
`;

export const StyledTextArea = styled(TextArea)`
  min-height: 10rem;
`;
