"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Heading,
  EditIcon,
  DownloadIcon,
  CheckIcon,
  Divider,
} from "@songtradr/design-language";
import { markdownToHtml } from "@/shared/utils/markdown";
import { useMusicBriefAnalyzer } from "../../MusicBriefAnalyzer.Context";
import {
  text,
  inputText,
  Card,
  HeaderRow,
  HeaderLeft,
  IconWrapper,
  PrintScoreDisplay,
  BriefContent,
  ButtonRow,
} from "./OutputStep.Parts";

export const OutputStep = () => {
  const {
    brief,
    setBrief,
    briefsTotal,
    briefContentRef,
    handleCopy,
    handleSaveEdit,
    startOver,
  } = useMusicBriefAnalyzer();
  const router = useRouter();

  if (!brief.refinedBrief) return null;

  return (
    <Card>
      <HeaderRow>
        <HeaderLeft>
          <IconWrapper>
            <CheckIcon />
          </IconWrapper>
          <Heading variant="h2">
            {brief.isEditing ? text.editingHeading : text.heading}
          </Heading>
        </HeaderLeft>
        {brief.finalScore != null && (
          <PrintScoreDisplay>{brief.finalScore}/10</PrintScoreDisplay>
        )}
      </HeaderRow>

      {brief.isEditing ? (
        <BriefContent
          ref={briefContentRef}
          contentEditable
          suppressContentEditableWarning
          $editing
        />
      ) : (
        <BriefContent
          dangerouslySetInnerHTML={{
            __html: markdownToHtml(brief.refinedBrief),
          }}
        />
      )}

      <ButtonRow>
        {brief.isEditing ? (
          <>
            <Button $variant="important" onClick={handleSaveEdit}>
              {text.saveChanges}
            </Button>
            <Button
              $variant="subtle"
              onClick={() => setBrief({ isEditing: false })}
            >
              {text.cancel}
            </Button>
          </>
        ) : (
          <>
            <Button $variant="important" onClick={handleCopy}>
              {text.copyToClipboard}
            </Button>
            <Button
              $variant="basic"
              onClick={() => setBrief({ isEditing: true })}
            >
              <EditIcon /> {text.editBrief}
            </Button>
            <Button $variant="basic" onClick={() => window.print()}>
              <DownloadIcon /> {text.downloadPdf}
            </Button>
          </>
        )}
      </ButtonRow>

      {!brief.isEditing && (
        <>
          <Divider />
          <Button $variant="primary" onClick={startOver}>
            {text.startOver}
          </Button>
          {briefsTotal > 0 && (
            <Button $variant="subtle" onClick={() => router.push("/briefs")}>
              {inputText.viewPastBriefs.replace("{count}", String(briefsTotal))}
            </Button>
          )}
        </>
      )}
    </Card>
  );
};
