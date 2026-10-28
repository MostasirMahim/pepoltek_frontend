import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware for Role-Based Routing and Auth Guards
 * 
 * Rules:
 * 1. Logged-in Admin on / redirects to /admin/dashboard
 * 2. Logged-in Recruiter on / redirects to /recruiter/dashboard
 * 3. Logged-in Candidate remains on /
 * 4. Protected workspace routes enforce authentication and role isolation
 * 5. Already logged-in users visiting /login or /register are redirected to their dashboards
 */

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  let userRole = request.cookies.get("user_role")?.value?.toUpperCase();

  let isAuthenticated = false;

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && payload.exp && payload.exp * 1000 < Date.now()) {
      isAuthenticated = false;
    } else {
      isAuthenticated = true;
      const payloadRoles = Array.isArray(payload?.roles)
        ? payload.roles
        : payload?.role
        ? [payload.role]
        : [];
      const primaryPayloadRole = (payload?.role || payloadRoles[0] || "").toUpperCase();

      if (!userRole || userRole === "CANDIDATE") {
        if (primaryPayloadRole && primaryPayloadRole !== "CANDIDATE") {
          userRole = primaryPayloadRole;
        }
      } else if (primaryPayloadRole && primaryPayloadRole !== userRole) {
        userRole = primaryPayloadRole;
      }
    }
  }

  const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
  const VALIDATOR_ROLES = ["TECH_VALIDATOR", "CREDENTIAL_OFFICER"];
  const RECRUITER_ROLES = ["RECRUITER", "BUSINESS_ANALYST"];
  const REFERRER_ROLES = ["REFERRER"];
  const STAFF_ROLES = [
    "SUPER_ADMIN",
    "ADMIN",
    "RECRUITER",
    "TECH_VALIDATOR",
    "BUSINESS_ANALYST",
    "CREDENTIAL_OFFICER",
  ];

  const getDashboardForRole = (role?: string) => {
    const r = (role || "").toUpperCase();
    if (ADMIN_ROLES.includes(r)) return "/admin/dashboard";
    if (VALIDATOR_ROLES.includes(r)) return "/validator/dashboard";
    if (RECRUITER_ROLES.includes(r)) return "/recruiter/dashboard";
    if (REFERRER_ROLES.includes(r)) return "/referrals/dashboard";
    return "/candidate/dashboard";
  };

  // 1. Root Homepage Rule
  if (pathname === "/") {
    if (isAuthenticated) {
      if (VALIDATOR_ROLES.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/validator/dashboard", request.url));
      }
      if (REFERRER_ROLES.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/referrals/dashboard", request.url));
      }
      if (ADMIN_ROLES.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (RECRUITER_ROLES.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/recruiter/dashboard", request.url));
      }
      // Candidate remains on /
    }
    return NextResponse.next();
  }

  // 2. Auth Pages (/login, /register, /recruiter/login, /staff/login)
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/recruiter/login" ||
    pathname === "/staff/login"
  ) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(getDashboardForRole(userRole), request.url));
    }
    return NextResponse.next();
  }

  // 3. Admin Protected Routes (/admin/*)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!ADMIN_ROLES.includes(userRole || "")) {
      return NextResponse.redirect(new URL(getDashboardForRole(userRole), request.url));
    }
    return NextResponse.next();
  }

  // 4. Validator Protected Routes (/validator/*)
  if (pathname.startsWith("/validator")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!VALIDATOR_ROLES.includes(userRole || "") && !ADMIN_ROLES.includes(userRole || "")) {
      return NextResponse.redirect(new URL(getDashboardForRole(userRole), request.url));
    }
    return NextResponse.next();
  }

  // 5. Recruiter and Staff Protected Routes (/recruiter/*)
  if (pathname.startsWith("/recruiter") && pathname !== "/recruiter/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/recruiter/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!STAFF_ROLES.includes(userRole || "")) {
      return NextResponse.redirect(new URL("/candidate/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 6. Candidate Protected Routes (/candidate/*)
  if (pathname.startsWith("/candidate")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Strict Role Guard: Staff, Validators, Admins, and Referrers MUST NOT land on candidate workspace
    if (VALIDATOR_ROLES.includes(userRole || "")) {
      return NextResponse.redirect(new URL("/validator/dashboard", request.url));
    }
    if (ADMIN_ROLES.includes(userRole || "")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (RECRUITER_ROLES.includes(userRole || "")) {
      return NextResponse.redirect(new URL("/recruiter/dashboard", request.url));
    }
    if (REFERRER_ROLES.includes(userRole || "")) {
      return NextResponse.redirect(new URL("/referrals/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 7. Client Protected Routes (/client/*)
  if (pathname.startsWith("/client")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 8. Community Referrals Protected Routes (/referrals/* and /referrer/*)
  if (pathname.startsWith("/referrals") || pathname.startsWith("/referrer")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/staff/:path*",
    "/admin/:path*",
    "/validator/:path*",
    "/recruiter/:path*",
    "/candidate/:path*",
    "/client/:path*",
    "/referrals/:path*",
    "/referrer/:path*",
  ],
};
