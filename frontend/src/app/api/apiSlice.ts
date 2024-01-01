
import { Mutex } from 'async-mutex'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setToken, logOut } from "../../features/auth/authSlice"
import { saveTokenToLocalStorage, clearTokenFromLocalStorage } from "../../utils/tokenHelper"
import type { RootState } from "../../app/store"
import type { BaseQueryFn } from "@reduxjs/toolkit/query/react"

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ENPOINT_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth : BaseQueryFn = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()

    let result = await baseQuery(args, api, extraOptions)

    if (result?.error && "status" in result.error && result.error.status === 403) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()

            try {
                const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

                if (refreshResult?.data) {
                    const fetchData = refreshResult.data as { data: {token : string} }
                    const data = fetchData.data
                    api.dispatch(setToken({ token: data.token }))
                    saveTokenToLocalStorage(data.token)
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch(logOut())
                    clearTokenFromLocalStorage()
                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: ["User"],
})