import styled from "styled-components";
import {
  Heading,
  shade700,
  shade800,
  shade900,
  primary01,
} from "@songtradr/design-language";

export const Card = styled.div`
  background: ${shade900};
  border: 1px solid ${shade800};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LoadingCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid ${shade800};
  padding: 3rem;
  text-align: center;
`;

export const HeaderRow = styled.div<{ $marginBottom?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ $marginBottom }) => $marginBottom ?? "1.5rem"};
`;

export const ProgressBarTrack = styled.div<{ $height?: string }>`
  width: 100%;
  background: ${shade700};
  height: ${({ $height }) => $height ?? "0.25rem"};
  margin-bottom: 1.5rem;
`;

export const ProgressBarFill = styled.div<{
  $width: number;
  $height?: string;
}>`
  background: ${primary01};
  height: ${({ $height }) => $height ?? "0.25rem"};
  width: ${({ $width }) => $width}%;
  transition: width 0.5s ease-out;
`;

export const SplashWrapper = styled.div`
  height: 0rem;
  margin: 5rem 0 2rem;

  &.pulsate {
    animation: pulsate 1.5s ease-in-out infinite;
  }

  @keyframes pulsate {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.08);
    }
  }
`;

export const ScoreDisplay = styled(Heading)`
  color: ${primary01};
`;
