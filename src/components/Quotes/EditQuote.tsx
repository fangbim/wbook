// components/EditQuoteModal.tsx
import { Modal, Textarea, TextInput, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface EditQuoteModalProps {
  opened: boolean;
  onClose: () => void;
  quoteId: string | null;
  initialContent: string;
  initialPage: number;
  onUpdateQuote: (quote: { id: string; content: string; page: number }) => void;
}

export default function EditQuote({
  opened,
  onClose,
  quoteId,
  initialContent,
  initialPage,
  onUpdateQuote,
}: EditQuoteModalProps) {
  const [content, setContent] = useState("");
  const [page, setPage] = useState<number | undefined>();

  useEffect(() => {
    if (opened) {
      setContent(initialContent);
      setPage(initialPage);
    }
  }, [opened, initialContent, initialPage]);

  const handleUpdate = () => {
    if (!quoteId || !content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    onUpdateQuote({
      id: quoteId,
      content: content.trim(),
      page: page !== undefined ? page : 0,
    });

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Quote"
      centered
      radius="md"
    >
      <div className="space-y-4">
        <Textarea
          label="Quote"
          placeholder="Edit the quote content..."
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          required
          autosize
          minRows={4}
        />
        <TextInput
          label="Page Number"
          placeholder="e.g., 42"
          value={page}
          onChange={(e) => setPage(e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined)}
          type="number"
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleUpdate}>
            Update Quote
          </Button>
        </div>
      </div>
    </Modal>
  );
}
