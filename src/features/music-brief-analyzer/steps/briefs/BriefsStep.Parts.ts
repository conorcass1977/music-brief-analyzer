import styled from "styled-components";
import {
  shade0,
  shade300,
  shade700,
  shade800,
  shade900,
  primary01,
  semanticRed01,
} from "@songtradr/design-language";
import { staticText } from "@/shared/statics/static-text";

export { Card } from "@/shared/components/styled";

// TEXT
export const text = staticText.musicBriefAnalyzer.briefs;

// STYLES
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  color: ${shade300};
  border-bottom: 1px solid ${shade800};
  font-weight: 600;
  font-size: 0.85rem;
`;

export const Tr = styled.tr`
  cursor: pointer;
  &:hover {
    background: ${shade800};
  }
`;

export const Td = styled.td`
  padding: 0.75rem 1rem;
  color: ${shade0};
  border-bottom: 1px solid ${shade900};
  font-size: 0.9rem;
`;

export const ScoreTd = styled(Td)`
  color: ${primary01};
  font-weight: 600;
`;

export const DateTd = styled(Td)`
  color: ${shade700};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${shade300};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${shade300};
  padding: 0.25rem;
  display: flex;
  align-items: center;

  &:hover {
    color: ${semanticRed01};
  }
`;
