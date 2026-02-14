import styled from "styled-components";
import {
  shade0,
  shade300,
  shade700,
  shade900,
  primary01,
  semanticGreen,
} from "@songtradr/design-language";
import { staticText } from "@/shared/statics/static-text";
import { ScoreDisplay } from "@/shared/components/styled";
export { HeaderRow } from "@/shared/components/styled";
import { Card as BaseCard } from "@/shared/components/styled";

// TEXT
export const text = staticText.musicBriefAnalyzer.output;
export const inputText = staticText.musicBriefAnalyzer.input;

// STYLES
export const Card = styled(BaseCard)`
  @media print {
    background: white;
    border: none;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const IconWrapper = styled.div`
  color: ${semanticGreen};

  @media print {
    display: none;
  }
`;

export const PrintScoreDisplay = styled(ScoreDisplay)`
  @media print {
    display: none;
  }
`;

export const BriefContent = styled.div<{ $editing?: boolean }>`
  background: ${shade0};
  color: ${shade900};
  padding: 2rem;
  border: 1px solid ${({ $editing }) => ($editing ? primary01 : shade300)};

  h1,
  h2,
  h3 {
    color: ${shade900};
    margin-top: 1.25em;
    margin-bottom: 0.5em;
    line-height: 1.3;
  }

  h1 {
    font-size: 2em;
    font-weight: 700;
    margin-top: 0;
  }
  h2 {
    font-size: 1.5em;
    font-weight: 700;
  }
  h3 {
    font-size: 1.25em;
    font-weight: 600;
  }

  p {
    color: ${shade700};
    margin-bottom: 1em;
    line-height: 1.7;
  }

  ul,
  ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
    line-height: 1.7;
  }

  li {
    color: ${shade700};
    margin-bottom: 0.5em;
  }

  strong {
    color: ${shade900};
    font-weight: 600;
  }

  &:focus {
    outline: none;
  }

  @media print {
    border: none;
    padding: 0;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  @media print {
    display: none;
  }
`;
