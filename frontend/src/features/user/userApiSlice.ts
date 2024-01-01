import { apiSlice } from "../../app/api/apiSlice"

type UserType = {
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}




export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<UserType, void>({
            query: () => "users/me",
            transformResponse: (response: { data: { user: UserType} } ) => {
                console.log(response.data.user)
                return response.data.user
            },
            providesTags: ["User"],
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
} = userApiSlice