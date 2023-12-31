
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

type UserType = {
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

type AuthStateType = {
    user: UserType | null;
    token: string | null;
}

const initialState: AuthStateType = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload

            state.user = user
            state.token = token

            console.log(user, token)
        },
        logOut: (state) => {
            state.user = null
            state.token = null
        }
    }
})

export default authSlice.reducer
export const { setCredentials, logOut } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectToken = (state: RootState) => state.auth.token
export type { UserType };