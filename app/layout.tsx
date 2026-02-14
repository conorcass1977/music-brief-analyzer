import "./globals.css";
import { StyledComponentsRegistry } from "./registry";
import { Providers } from "./providers";
import { MusicBriefAnalyzerShell } from "@/features/music-brief-analyzer/MusicBriefAnalyzer.Shell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <MusicBriefAnalyzerShell>{children}</MusicBriefAnalyzerShell>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
