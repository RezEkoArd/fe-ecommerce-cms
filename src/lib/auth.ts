import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "access_token";

export type AccessTokenPayload = {
    user_id: string;
    role: "admin" | "customer";
    exp: number;
    iat: number;
}

export function setAccessToken(token: string) {
    setCookie(ACCESS_TOKEN_KEY, token, {
        maxAge: 60 * 15,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
}

export function getAccessToken(): string | undefined {
    const token = getCookie(ACCESS_TOKEN_KEY);
    return typeof token == "string" ? token : undefined;
}

export function clearAccessToken() {
    deleteCookie(ACCESS_TOKEN_KEY, {path: "/"});
}

export function decodeAccessToken(
    token: string,
): AccessTokenPayload | undefined{
    try{
        return jwtDecode<AccessTokenPayload>(token);
    }catch {
        return undefined;
    }
}

export function isTokenExpired(payload: AccessTokenPayload):boolean {
    return payload.exp * 1000 <= Date.now();
}

export function getSession() {
    const token = getAccessToken();
    if (!token) return undefined;

    const payload = decodeAccessToken(token);
    if (!payload || isTokenExpired(payload)) return undefined

    return {token, userId: payload.user_id, role: payload.role };
}