"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
const Filters = (props: any) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchValues = Array.from(searchParams.entries());
  const params = new URLSearchParams(searchParams);

  return (
    <>
      <label
        htmlFor="countries"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Ingredientes
      </label>
      <select
        id="countries"
        className="ui-input"
      >
        <option selected></option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
      </select>
    </>
  );
};

export default Filters;
