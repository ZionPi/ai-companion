import { useAuth } from "@clerk/clerk-react"
import { Outlet, useNavigate } from "react-router-dom"
import * as React from 'react'

export default function PhatomPage() {
    const { userId, isLoaded } = useAuth()
    const navigate = useNavigate()
 
    React.useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in")
        }
    }, [isLoaded])
 
    if (!isLoaded) return "Loading..."
 
    return (
        <Outlet />
    )
}