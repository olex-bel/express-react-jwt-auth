import { apiSlice } from "../../app/api/apiSlice"

type ResponseDataType = {
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
            invalidatesTags: ["User"],
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }), 
    })
})

export const {
    useLoginMutation,
    useLogoutMutation
} = authApiSlice