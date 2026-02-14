import styled from "styled-components";
import { Body, TextArea, shade300 } from "@songtradr/design-language";
import { staticText } from "@/shared/statics/static-text";

export { Card } from "@/shared/components/styled";

// TEXT
export const text = staticText.musicBriefAnalyzer.input;

// CONSTANTS
export const MIN_BRIEF_LENGTH = 50;

// STYLES
export const HeadingWrapper = styled.div`
  text-align: left;
`;

export const Warning = styled(Body).attrs({ variant: "small" })`
  color: ${shade300};
  margin-top: 0.75rem;
  text-align: center;
`;

export const StyledTextArea = styled(TextArea).attrs({
  width: "100%",
})`
  min-height: 15vh;
`;
