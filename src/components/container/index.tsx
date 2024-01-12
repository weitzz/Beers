import React from 'react'
interface IContainer {
    children: React.ReactNode
}

const Container = ({ children }: IContainer) => {
    return (
        <section className='max-w-screen-xl mx-auto px-3'>
            {children}
        </section>
    )
}

export default Container