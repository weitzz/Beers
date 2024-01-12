"use server"

import { IBeer } from "@/types/beerTypes";
import { notFound } from "next/navigation";

export const getAll = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}`, {
            next: { revalidate: 320 }
        })

        if (!res.ok) {
            throw new Error('Nenhuma cerveja encontrada')
        }
        const data: IBeer[] = await res.json();
        return data

    } catch (err) {
        throw new Error('Erro ao carregar api')
    }
}


export const getRandomApi = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/random`, {
            next: { revalidate: 320 }
        })

        if (!res.ok) {
            throw new Error('Nenhuma cerveja encontrada')
        }
        const data: IBeer[] = await res.json();

        if (data.length === 0) {
            throw new Error('Nenhuma cerveja encontrada');
        }
        return data[0]

    } catch (err) {
        throw new Error('Erro ao carregar api')
    }
}

export const getDataName = async (name: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}?beer_name=${name}`)
        if (!res.ok) {
            throw new Error('Nenhuma cerveja encontrada')
        }
        const data: IBeer[] = await res.json();
        return data

    } catch (err) {
        console.log(err)

    }
}


export const getId = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/${id}`, {
            next: { revalidate: 320 }
        })

        if (!res.ok) {
            throw new Error('Nenhuma cerveja encontrada')
        }
        const data: IBeer[] = await res.json();
        return data

    } catch (err) {
        console.log(err)
    }
}

export const fetchData = async (page: number) => {
    try {
        const perPage = 24;
        const res = await fetch(`${process.env.NEXT_API_URL}?page=${page}&per_page=${perPage}`, {
            next: { revalidate: 320 }
        })

        if (!res.ok) {
            throw new Error('Nenhuma cerveja encontrada')
        }
        const data: IBeer[] = await res.json();
        return data

    } catch (err) {
        throw new Error('Erro ao carregar api')
    }
}