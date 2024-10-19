import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Public routes không yêu cầu xác thực
const PUBLIC_ROUTES = ["/api/:path*", "/ws/:path*"];

export default authMiddleware({
  publicRoutes: PUBLIC_ROUTES,
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Bỏ qua static files và _next
    "/",                      // Áp dụng middleware cho root
    "/(api|trpc)(.*)",         // Áp dụng cho API routes
  ],
};

// Thêm CORS headers cho preflight request trong middleware
export function middleware(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
      status: 204,
    });
  }
}
