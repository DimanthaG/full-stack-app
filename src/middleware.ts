import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    
    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
      // Ensure admin role for protected routes
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only if user is authenticated
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        return true;
      }
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
}; 