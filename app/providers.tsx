"use client";

import {
  DesignLanguageStyles,
  ThemeProvider,
} from "@songtradr/design-language";
import { LabProvider } from "@songtradr/massivemusic-labs";
import { MusicBriefAnalyzerProvider } from "@/features/music-brief-analyzer/MusicBriefAnalyzer.Context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DesignLanguageStyles />
      <LabProvider bridgeKey="ct9yprVimicf3OEsyJEETV28ep4CdZkq">
        <MusicBriefAnalyzerProvider>{children}</MusicBriefAnalyzerProvider>
      </LabProvider>
    </ThemeProvider>
  );
}
