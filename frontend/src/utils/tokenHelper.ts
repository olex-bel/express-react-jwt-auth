
const TOKEN_KEY = "accessToken"

export function retrieveTokenFromLocalStorage() {
    let token: string | null

    try {
        token = localStorage.getItem(TOKEN_KEY)
    } catch (err) {
        token = null
    }

    return token
}

export function saveTokenToLocalStorage(token : string) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearTokenFromLocalStorage() {
    localStorage.removeItem(TOKEN_KEY);
}