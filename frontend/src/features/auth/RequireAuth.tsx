
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken } from "./authSlice"


export default function RequireAuth() {
    const token = useSelector(selectToken)
    const location = useLocation()

    return (
        token
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}