import styled from "styled-components";
import {
  shade800,
  shade900,
  semanticGreen,
  semanticAmber,
} from "@songtradr/design-language";
import { staticText } from "@/shared/statics/static-text";

export {
  Card,
  HeaderRow,
  ScoreDisplay,
  ProgressBarTrack,
  ProgressBarFill,
} from "@/shared/components/styled";

// TEXT
export const text = staticText.musicBriefAnalyzer.analysis;

// STYLES
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ListItem = styled.div<{ $variant: "success" | "warning" }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "success"
        ? `color-mix(in srgb, ${semanticGreen} 70%, transparent)`
        : `color-mix(in srgb, ${semanticAmber} 70%, transparent)`};
  background: ${({ $variant }) =>
    $variant === "success"
      ? `color-mix(in srgb, ${semanticGreen} 60%, transparent)`
      : `color-mix(in srgb, ${semanticAmber} 60%, transparent)`};
`;

export const ListIcon = styled.span<{ $variant: "success" | "warning" }>`
  color: ${({ $variant }) =>
    $variant === "success" ? semanticGreen : semanticAmber};
  font-size: 1.25rem;
  flex-shrink: 0;
`;

export const CalloutBox = styled.div`
  background: ${shade800};
  border: 1px solid ${shade900};
  padding: 1.5rem;
`;
