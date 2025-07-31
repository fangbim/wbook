import { confirmDelete } from "@/helpers/confirmDeleteToast";
import { deleteUserBook } from "@/lib/api/userBooks";
import { useUserBooksStore } from "@/stores/useUserBooksStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useBookActions = () => {
  const { removeBook } = useUserBooksStore();
  const router = useRouter();
  
  const removeFromUserCollection = async (bookId: string) => {
    confirmDelete("Are you sure you want to delete this book?", async () => {
      try {
        await deleteUserBook(bookId);
        removeBook(bookId);
        toast.success("Book successfully removed from collection!");
         router.push("/collection");
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while deleting the book.");
      }
    });
  };

  return { removeFromUserCollection };
};
