
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { retrieveTokenFromLocalStorage } from "../../utils/tokenHelper";

type AuthStateType = {
    token: string | null;
}

const initialState: AuthStateType = {
    token: retrieveTokenFromLocalStorage(),
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken: (state, action) => {
            const { token } = action.payload

            state.token = token           
        },
        logOut: (state) => {
            state.token = null
        }
    }
})

export default authSlice.reducer
export const { setToken, logOut } = authSlice.actions;
export const selectToken = (state: RootState) => state.auth.token