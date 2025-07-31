// components/toasts/confirmDeleteToast.tsx
import { toast } from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

export function confirmDelete(message: string, onConfirm: () => void) {
  toast.custom((t) => (
    <div className="w-[340px] p-5 bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 text-red-600 rounded-full">
          <FiTrash2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-gray-900 text-sm font-medium">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                toast.dismiss(t.id);
              }}
              className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ));
}
