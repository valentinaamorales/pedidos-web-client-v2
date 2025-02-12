'use client'

import { useParams } from "next/navigation"

export default function Order() {
    const {orderId} = useParams()

    return (
        <div>
            <h1>Order with id {orderId}</h1>
        </div>
    )
}