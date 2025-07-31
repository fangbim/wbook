import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";

// Define the structure of a new quote
interface NewQuote {
  content: string;
  page: string;
}

// Define the props for the AddQuoteModal component
interface AddQuoteModalProps {
  opened: boolean;
  onClose: () => void;
  onAddQuote: (quote: NewQuote) => void;
}

/**
 * A modal component for adding a new quote.
 * It contains a form with fields for the quote content and page number.
 */
export default function AddQuote({
  opened,
  onClose,
  onAddQuote,
}: AddQuoteModalProps) {
  // State for the new quote form fields
  const [newQuoteContent, setNewQuoteContent] = useState("");
  const [newQuotePage, setNewQuotePage] = useState("");

  /**
   * Handles the submission of the new quote.
   * It performs validation, calls the onAddQuote prop, and resets the form.
   */
  const handleSaveQuote = () => {
    // Basic validation
    if (!newQuoteContent.trim()) {
      toast("Please enter a quote!", {
        icon: "⚠️",
      });
      return;
    }

    onAddQuote({
      content: newQuoteContent,
      page: newQuotePage || "N/A", // Handle empty page number
    });

    // Reset form fields
    setNewQuoteContent("");
    setNewQuotePage("");
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add a New Quote"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      radius="md"
    >
      <div className="space-y-4">
        <Textarea
          label="Quote"
          placeholder="Enter the quote here..."
          value={newQuoteContent}
          onChange={(event) => setNewQuoteContent(event.currentTarget.value)}
          required
          minRows={4}
          autosize
        />
        <TextInput
          label="Page Number"
          placeholder="e.g., 42"
          value={newQuotePage}
          onChange={(event) => setNewQuotePage(event.currentTarget.value)}
          type="number"
        />
        <div className="flex justify-end pt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveQuote}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Save Quote
          </Button>
        </div>
      </div>
    </Modal>
  );
}
