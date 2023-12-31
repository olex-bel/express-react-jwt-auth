import { apiSlice } from "../../app/api/apiSlice";
import type { UserType } from "./authSlice";

type ResponseDataType = {
    user: UserType; 
    token: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: "/auth/login",
                method: "POST",
                body: { ...credentials }
            }),
            transformResponse: (response: { data : ResponseDataType } ) => response.data,
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }), 
    })
})

export const {
    useLoginMutation,
    useLogoutMutation
} = authApiSlice