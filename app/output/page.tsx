"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMusicBriefAnalyzer } from "@/features/music-brief-analyzer/MusicBriefAnalyzer.Context";
import { OutputStep } from "@/features/music-brief-analyzer/steps/output/OutputStep";

export default function OutputPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const { brief, loadBriefById } = useMusicBriefAnalyzer();

  useEffect(() => {
    if (id && !brief.refinedBrief) {
      loadBriefById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <OutputStep />;
}
