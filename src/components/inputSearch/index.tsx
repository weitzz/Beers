"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import Input from '../forms/input';


const InputSearch = () => {
    const [search, setSearch] = useState('')
    const router = useRouter()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (search === "") return

        router.push(`/beer/search/${search}`)

    }
    return (
        <form onSubmit={handleSearch} className='w-full border border-slate-200 bg-slate-100 my-5 flex gap-2 items-center justify-between rounded-lg p-2  hover:border-yellow-400 shadow-md'>
            <input
                className=" block bg-slate-100 text-base p-3 rounded-m transition duration-700 focus:outline-none  w-11/12"
                type="text"
                placeholder='Pesquise a sua cerveja' value={search} onChange={(e) => setSearch(e.target.value)} />

            <button type='submit'><FiSearch size={24} color="#f1c40f" /></button>
        </form>
    )
}

export default InputSearch