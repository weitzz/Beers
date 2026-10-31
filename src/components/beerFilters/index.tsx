"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FILTER_KEYS = ["abv", "ibu", "favorites", "sort"];

const FILTER_LABELS: Record<string, Record<string, string>> = {
  abv: { low: "ABV: até 5%", medium: "ABV: 5–8%", high: "ABV: acima de 8%" },
  ibu: { low: "IBU: suave", medium: "IBU: médio", high: "IBU: intenso" },
  favorites: { "1": "Só favoritas" },
  sort: {
    name: "Ordem: nome",
    abv_asc: "Ordem: menor ABV",
    abv_desc: "Ordem: maior ABV",
    ibu_asc: "Ordem: menor IBU",
    ibu_desc: "Ordem: maior IBU",
  },
};

const BeerFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeFilters = FILTER_KEYS.flatMap((key) => {
    const value = searchParams.get(key);
    const label = value ? FILTER_LABELS[key]?.[value] : undefined;
    return label ? [{ key, value: value!, label }] : [];
  });

  return (
    <section
      aria-label="Filtros de cervejas"
      className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-slate-700">
          Teor alcoólico (ABV)
          <select
            className="ui-input"
            value={searchParams.get("abv") ?? ""}
            onChange={(event) => updateFilters("abv", event.target.value)}
          >
            <option value="">Qualquer teor</option>
            <option value="low">Até 5%</option>
            <option value="medium">De 5% a 8%</option>
            <option value="high">Acima de 8%</option>
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-slate-700">
          Amargor (IBU)
          <select
            className="ui-input"
            value={searchParams.get("ibu") ?? ""}
            onChange={(event) => updateFilters("ibu", event.target.value)}
          >
            <option value="">Qualquer amargor</option>
            <option value="low">Suave (até 20)</option>
            <option value="medium">Médio (21 a 50)</option>
            <option value="high">Intenso (acima de 50)</option>
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-slate-700">
          Ordenar por
          <select
            className="ui-input"
            value={searchParams.get("sort") ?? ""}
            onChange={(event) => updateFilters("sort", event.target.value)}
          >
            <option value="">Padrão</option>
            <option value="name">Nome (A–Z)</option>
            <option value="abv_asc">Menor teor alcoólico</option>
            <option value="abv_desc">Maior teor alcoólico</option>
            <option value="ibu_asc">Menor amargor</option>
            <option value="ibu_desc">Maior amargor</option>
          </select>
        </label>

        <label className="flex min-h-11 min-w-0 items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:ring-offset-2">
          <input
            type="checkbox"
            checked={searchParams.get("favorites") === "1"}
            onChange={(event) =>
              updateFilters("favorites", event.target.checked ? "1" : "")
            }
            className="h-5 w-5 shrink-0 accent-yellow-500"
          />
          Só favoritas
        </label>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {activeFilters.map(({ key, value, label }) => (
            <button
              type="button"
              key={key}
              onClick={() => updateFilters(key, "")}
              aria-label={`Remover filtro: ${label}`}
              className="min-h-11 break-words rounded-full bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
            >
              {label} <span aria-hidden="true">×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 rounded px-3 py-2 text-sm font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </section>
  );
};

export default BeerFilters;
