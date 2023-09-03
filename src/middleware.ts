import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/token";
import { getErrorResponse } from "./lib/helpers";

interface AuthenticatedRequest extends NextRequest {
    user: {
        id: number;
    };
}

let redirectToLogin = false;

export async function middleware(req: NextRequest) {
    let token: string | undefined;

    if (req.cookies.has("token")) {
        token = req.cookies.get("token")?.value;
    } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
        token = req.headers.get("Authorization")?.substring(7);
    }

    if (req.nextUrl.pathname.startsWith("/user/login") && (!token || redirectToLogin))
        return;

    if (
        !token &&
        (
            req.nextUrl.pathname.startsWith("/api/fetch") ||
            req.nextUrl.pathname.startsWith("/api/notification") ||
            req.nextUrl.pathname.startsWith("/api/reports") ||
            req.nextUrl.pathname.startsWith("/api/synchronisation") ||
            req.nextUrl.pathname.startsWith("/api/users") ||
            req.nextUrl.pathname.startsWith("/api/vulnerability") ||
            req.nextUrl.pathname.startsWith("/api/auth/logout")
        )
    ) {
        return getErrorResponse(
            401,
            "You are not logged in. Please provide a token to gain access."
        );
    }

    const response = NextResponse.next();

    try {
        if (token) {
            const { sub } = await verifyJWT<{ sub: number }>(token);
            response.headers.set("X-USER-ID", sub.toString());
            (req as AuthenticatedRequest).user = { id: sub };
        }
    } catch (error) {
        redirectToLogin = true;
        if (req.nextUrl.pathname.startsWith("/api")) {
            return getErrorResponse(401, "Token is invalid or user doesn't exists");
        }

        return NextResponse.redirect(
            new URL(`/user/login?${new URLSearchParams({ error: "badauth" })}`, req.url)
        );
    }

    const authUser = (req as AuthenticatedRequest).user;

    if (!authUser) {
        return NextResponse.redirect(
            new URL(
                `/user/login?${new URLSearchParams({
                    error: "badauth",
                    forceLogin: "true",
                })}`,
                req.url
            )
        );
    }

    if (req.url.includes("/user/login") && authUser) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/",
        "/report",
        "/api/fetch/:path*",
        "/api/notification/:path*",
        "/api/reports/:path*",
        "/api/synchronisation/:path*",
        "/api/users/:path*",
        "/api/vulnerability/:path*",
        "/api/auth/logout",
        "/api/vulnerability/:path*"
    ],
};