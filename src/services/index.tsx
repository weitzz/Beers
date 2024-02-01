"use server";

import { IBeer } from "@/types/beerTypes";
import { notFound } from "next/navigation";

export const getAll = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}`, {
      next: { revalidate: 320 },
    });

    if (!res.ok) {
      throw new Error("Nenhuma cerveja encontrada");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Erro ao carregar api");
  }
};

export const getRandomApi = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/random`, {
      next: { revalidate: 320 },
    });

    if (!res.ok) {
      throw new Error("Nenhuma cerveja encontrada");
    }
    const data: IBeer[] = await res.json();

    if (data.length === 0) {
      throw new Error("Nenhuma cerveja encontrada");
    }
    return data[0];
  } catch (err) {
    throw new Error("Erro ao carregar api");
  }
};

export const getDataName = async (name: string) => {
  try {
    const res = await fetch(`${process.env.API_URL}?beer_name=${name}`);
    if (!res.ok) {
      throw new Error("Nenhuma cerveja encontrada");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getId = async (id: string) => {
  try {
    const res = await fetch(`${process.env.API_URL}/${id}`, {
      next: { revalidate: 320 },
    });

    if (!res.ok) {
      throw new Error("Nenhuma cerveja encontrada");
    }
    const data: IBeer[] = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
//https://api.punkapi.com/v2/beers?page=1&per_page=7
