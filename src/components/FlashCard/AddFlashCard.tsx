import { Flashcard } from "@/schemas/flashcard";
import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useState } from "react";

// Define the structure of a new quote

// Define the props for the AddQuoteModal component
interface AddFlasCardModalProps {
  opened: boolean;
  onClose: () => void;
  onAddFlashCard: (quote: Flashcard) => void;
}

/**
 * A modal component for adding a new quote.
 * It contains a form with fields for the quote content and page number.
 */
export default function AddFlashCard({
  opened,
  onClose,
  onAddFlashCard,
}: AddFlasCardModalProps) {
  // State for the new quote form fields
  const [newFrontContent, setnewFrontContent] = useState("");
  const [newBackContent, setnewBackContent] = useState("");

  /**
   * Handles the submission of the new quote.
   * It performs validation, calls the onAddQuote prop, and resets the form.
   */
  const handleSaveQuote = () => {
    // Basic validation
    if (!newFrontContent.trim() && !newBackContent.trim()) {
      // In a real app, you might use Mantine's notification system
      alert("Please enter a quote.");
      return;
    }

    // Pass the new quote data to the parent component
    onAddFlashCard({
      front: newFrontContent,
      back: newBackContent,
    });

    // Reset form fields
    setnewFrontContent("");
    setnewBackContent("");

    // The parent component will close the modal
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add a New Flashcard"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      radius="md"
    >
      <div className="space-y-4">
        <TextInput
          label="Frontside"
          placeholder="what is the Single Responsibility Principle?"
          value={newFrontContent}
          required
          onChange={(event) => setnewFrontContent(event.currentTarget.value)}
          type="text"
        />
        <Textarea
          label="Backside"
          placeholder="A class should have only one reason to change, meaning it should have only one job or responsibility."
          value={newBackContent}
          onChange={(event) => setnewBackContent(event.currentTarget.value)}
          required
          minRows={4}
          autosize
        />
        <div className="flex justify-end pt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveQuote}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Save Flashcard
          </Button>
        </div>
      </div>
    </Modal>
  );
}
