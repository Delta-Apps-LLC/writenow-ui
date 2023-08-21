import jwt_decode from "jwt-decode";

export const API = "https://api.joinwritenow.com"
// export const API = 'https://phillips-blink-running-cons.trycloudflare.com'

export function retrieveToken() {
    return localStorage.getItem("accessToken")
}

export function decodeToken(token) {
    const decoded = jwt_decode(token);
    return decoded; //.user_id
}

export function setToken(token) {
    localStorage.setItem("accessToken", token);
}

export function deleteToken() {
    localStorage.removeItem("accessToken");
}