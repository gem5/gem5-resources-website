import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function Test() {
    const [name, setName] = useState("Loading...")
    useEffect(() => {
        fetch('/api/hello').then(res => res.json()).then(data => {
            setName(data.name)
        })
    }, [])
    return (
        <div>
            <h1>{name}</h1>
            <h1><Link href="/">Home</Link></h1>
        </div>
    )
}
