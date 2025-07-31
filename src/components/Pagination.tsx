import { Pagination } from "@mantine/core";

// components/Pagination.tsx
interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function CustomePagination({ total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-4">

      <Pagination total={totalPages} onChange={onPageChange} color="#2C2C2C" size="lg" radius="md" />
    </div>
  );
}
