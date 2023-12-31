import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials, logOut } from "../../features/auth/authSlice"
import type { RootState } from "../../app/store"
import type { BaseQueryFn } from "@reduxjs/toolkit/query/react"

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
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error && "originalStatus" in result.error && result.error.originalStatus === 403) {
        // send refresh token to get new access token 
        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

        if (refreshResult?.data) {
            const data = refreshResult.data as { token : string }
            const state = api.getState() as RootState
            const user = state.auth.user
            // store the new token 
            api.dispatch(setCredentials({ token: data.token, user }))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({})
})