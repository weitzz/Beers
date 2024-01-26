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
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="w-full border border-slate-200 bg-slate-100 my-5 flex gap-2 items-center justify-between rounded-lg p-2  hover:border-yellow-400 shadow-md">
      <input
        className=" block bg-slate-100 text-base p-3 rounded-m transition duration-700 focus:outline-none  w-11/12"
        type="text"
        placeholder="Pesquise a sua cerveja"
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <button type="submit">
        <FiSearch size={24} color="#f1c40f" />
      </button>
    </div>
  );
};

export default InputSearch;
