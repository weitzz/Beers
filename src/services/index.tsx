"use server";

import { IBeer } from "@/types/beerTypes";

const API_URL = (
  process.env.API_URL || "https://punkapi.dev/api/v3/beers"
).replace(/\/+$/, "");
const API_BASE = new URL(API_URL);
const API_ROOT = `${API_BASE.origin}${API_BASE.pathname.replace(/\/beers$/, "")}`;
const API_PAGE_SIZE = 80;

type ApiBeer = Omit<IBeer, "image_url"> & { image_url?: string };

const normalizeBeer = (beer: ApiBeer): IBeer => {
  const imageUrl = beer.image_url || (beer.image
    ? `${API_ROOT}/images/${encodeURIComponent(beer.image)}`
    : "/beer.png");
  return { ...beer, image_url: imageUrl };
};

const fetchBeerPage = async (
  page: number,
  beerName?: string,
  ids?: number[],
) => {
  const url = new URL(API_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(API_PAGE_SIZE));
  if (beerName) url.searchParams.set("beer_name", beerName);
  if (ids?.length) url.searchParams.set("ids", ids.join(","));

  const response = await fetch(url, { next: { revalidate: 320 } });
  if (!response.ok) throw new Error(`PunkAPI respondeu com status ${response.status}`);

  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error("Formato inesperado na resposta da PunkAPI");
  return (data as ApiBeer[]).map(normalizeBeer);
};

const fetchSingleBeer = async (url: string): Promise<IBeer> => {
  const response = await fetch(url, { next: { revalidate: 320 } });
  if (!response.ok) throw new Error(`PunkAPI respondeu com status ${response.status}`);

  const data: unknown = await response.json();
  const beer = Array.isArray(data) ? data[0] : data;
  if (!beer || typeof beer !== "object") throw new Error("Nenhuma cerveja encontrada");
  return normalizeBeer(beer as ApiBeer);
};

export const getAll = async (): Promise<IBeer[]> => {
  const beers: IBeer[] = [];
  let page = 1;

  while (true) {
    const currentPage = await fetchBeerPage(page);
    beers.push(...currentPage);
    if (currentPage.length < API_PAGE_SIZE) return beers;
    page += 1;
  }
};

export const getRandomApi = async (): Promise<IBeer> => {
  return fetchSingleBeer(`${API_URL}/random`);
};

export const getDataName = async (name: string): Promise<IBeer[]> => {
  if (!name.trim()) return [];
  const normalizedQuery = name.trim().replace(/\s+/g, "_").toLowerCase();
  const searchResults = await fetchBeerPage(1, normalizedQuery);
  if (searchResults.length > 0) return searchResults;

  // Keep name search usable if the API's beer_name filter returns no match.
  const normalizeText = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const query = normalizeText(name.trim());
  const allBeers = await getAll();
  return allBeers.filter((beer) => normalizeText(beer.name).includes(query));
};

export const getByIds = async (ids: number[]): Promise<IBeer[]> => {
  if (ids.length === 0) return [];
  const batches: number[][] = [];
  for (let index = 0; index < ids.length; index += API_PAGE_SIZE) {
    batches.push(ids.slice(index, index + API_PAGE_SIZE));
  }
  const results = await Promise.all(
    batches.map((batch) => fetchBeerPage(1, undefined, batch)),
  );
  return results.flat();
};

export const getId = async (id: string): Promise<IBeer[]> => {
  const beer = await fetchSingleBeer(`${API_URL}/${encodeURIComponent(id)}`);
  return [beer];
};
