"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "../forms/button";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

const PaginationControls = ({
  hasNextPage,
  hasPrevPage,
  totalPages,
}: PaginationControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "8";

  const navigateToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    params.set("per_page", per_page);
    router.push(`/beer?${params.toString()}`);
  };

  return (
    <nav aria-label="Paginacao das cervejas" className="flex items-center justify-center gap-3 py-10">
      <Button
        variant="secondary"
        disabled={!hasPrevPage}
        onClick={() => {
          navigateToPage(Number(page) - 1);
        }}
      >
        Anterior
      </Button>

      <div className="min-w-16 text-center text-sm font-medium text-slate-600" aria-live="polite">
        {page} <span className="text-slate-400">/</span> {totalPages}
      </div>

      <Button
        variant="secondary"
        disabled={!hasNextPage}
        onClick={() => {
          navigateToPage(Number(page) + 1);
        }}
      >
        Proxima
      </Button>
    </nav>
  );
};

export default PaginationControls;
