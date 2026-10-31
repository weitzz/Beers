"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch } from "react-icons/fi";

const InputSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch.flush();
      }}
      className="my-6 flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-100"
      role="search"
    >
      <input
        className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-yellow-600 focus-visible:ring-offset-2"
        type="search"
        name="query"
        aria-label="Pesquisar cervejas"
        placeholder="Pesquise a sua cerveja"
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <button className="ui-button ui-button-primary h-11 w-11 shrink-0 px-0" type="submit" aria-label="Pesquisar">
        <FiSearch size={20} />
      </button>
    </form>
  );
};

export default InputSearch;
