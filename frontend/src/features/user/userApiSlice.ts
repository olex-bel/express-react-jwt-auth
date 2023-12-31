import { apiSlice } from "../../app/api/apiSlice"
import type { UserType } from "../auth/authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<UserType, void>({
            query: () => "users/me",
        }),
        register: builder.mutation({
            query: userData => ({
                url: "/users/register",
                method: "POST",
                body: { ...userData }
            })
        }),
    })
})

export const {
    useGetUserQuery,
    useRegisterMutation
} = authApiSlice