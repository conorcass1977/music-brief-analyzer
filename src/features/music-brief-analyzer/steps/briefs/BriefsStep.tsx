"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Heading,
  Body,
  DeleteIcon,
  Modal,
  ModalHead,
  ModalClose,
  ModalWrapper,
  ModalFoot,
} from "@songtradr/design-language";
import {
  useLabContext,
  LabDatastoreSearchItem,
} from "@songtradr/massivemusic-labs";
import {
  text,
  Card,
  Table,
  Th,
  Tr,
  Td,
  ScoreTd,
  DateTd,
  EmptyState,
  HeaderRow,
  DeleteButton,
} from "./BriefsStep.Parts";

export const BriefsStep = () => {
  const router = useRouter();
  const { executeHostCommand } = useLabContext();
  const [briefs, setBriefs] = useState<LabDatastoreSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const pendingDeleteId = useRef<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await executeHostCommand("DATASTORE", {
          action: "search",
          tableName: "Briefs",
          limit: 100,
        });
        const items = res.items ?? [];
        items.sort((a, b) =>
          ((b.data.updatedAt as string) ?? "").localeCompare(
            (a.data.updatedAt as string) ?? "",
          ),
        );
        setBriefs(items);
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (iso?: unknown) => {
    if (typeof iso !== "string") return "—";
    return new Date(iso).toLocaleDateString();
  };

  const openDeleteModal = (id: string) => {
    pendingDeleteId.current = id;
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    pendingDeleteId.current = null;
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId.current;
    if (!id) return;
    try {
      await executeHostCommand("DATASTORE", {
        action: "delete",
        tableName: "Briefs",
        id,
      });
      setBriefs((prev) => prev.filter((b) => b.id !== id));
    } catch {
      // Ignore
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) return null;

  return (
    <>
      <Card>
        <HeaderRow>
          <Heading variant="h2">{text.heading}</Heading>
          <Button $variant="subtle" onClick={() => router.push("/")}>
            {text.backButton}
          </Button>
        </HeaderRow>

        {briefs.length === 0 ? (
          <EmptyState>
            <Body>{text.emptyState}</Body>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>{text.titleColumn}</Th>
                <Th>{text.scoreColumn}</Th>
                <Th>{text.dateColumn}</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((brief) => (
                <Tr
                  key={brief.id}
                  onClick={() => router.push(`/output?id=${brief.id}`)}
                >
                  <Td>{(brief.data.title as string) || "Untitled Brief"}</Td>
                  <ScoreTd>
                    {brief.data.score != null && brief.data.finalScore != null
                      ? `${brief.data.score}/10 → ${brief.data.finalScore}/10`
                      : (brief.data.finalScore ?? brief.data.score) != null
                        ? `${brief.data.finalScore ?? brief.data.score}/10`
                        : "—"}
                  </ScoreTd>
                  <DateTd>{formatDate(brief.data.createdAt)}</DateTd>
                  <Td>
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(brief.id);
                      }}
                    >
                      <DeleteIcon />
                    </DeleteButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        open={showDeleteModal}
        onOpenChange={(open: boolean) => !open && closeDeleteModal()}
      >
        <ModalWrapper>
          <ModalClose />
          <ModalHead
            title="Delete Brief"
            description="Are you sure you want to delete this brief? This action cannot be undone."
          />
          <ModalFoot>
            <Button $variant="subtle" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button $variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFoot>
        </ModalWrapper>
      </Modal>
    </>
  );
};
