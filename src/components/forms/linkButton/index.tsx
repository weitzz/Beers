import Link from 'next/link'
import React from 'react'

interface LinkButtonProps {
    children: string
    href: string
}

const LinkButton = ({ children, href }: LinkButtonProps) => {
    return (
        <Link href={href} className='text-base cursor-pointer border-0 rounded-md bg-yellow-500 text-yellow-800 px-3 py-2 '>{children}</Link>
    )
}

export default LinkButton