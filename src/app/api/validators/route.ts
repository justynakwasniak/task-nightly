import { NextResponse } from "next/server";
import { generateMockValidators } from "@/src/lib/validators";

const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60_000;

type RateEntry = {
  count: number;
  timestamp: number;
};

const requestCounts = new Map<string, RateEntry>();

/**
 * Remove expired rate limit entries
 */
function cleanupOldEntries() {
  const now = Date.now();

  for (const [key, entry] of requestCounts.entries()) {
    if (now - entry.timestamp > RATE_WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}

/**
 * Basic in-memory rate limiting (per IP per window)
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowKey = `${ip}-${Math.floor(now / RATE_WINDOW_MS)}`;

  cleanupOldEntries();

  const entry = requestCounts.get(windowKey);

  if (!entry) {
    requestCounts.set(windowKey, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Extract client IP (best-effort)
 */
function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");

  if (!xForwardedFor) return "unknown";

  return xForwardedFor.split(",")[0].trim();
}

/**
 * Common security headers
 */
function buildHeaders(origin: string | null, extra?: Record<string, string>) {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    ...(extra || {}),
  };
}

/**
 * GET /api/validators
 */
export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: `Rate limit exceeded: ${RATE_LIMIT} requests per minute per IP`,
      },
      {
        status: 429,
        headers: buildHeaders(origin, {
          "Retry-After": "60",
        }),
      }
    );
  }

  try {
    const validators = generateMockValidators();

    // Simulated latency
    const delay = Math.random() * 150 + 50;
    await new Promise((resolve) => setTimeout(resolve, delay));

    return NextResponse.json(validators, {
      status: 200,
      headers: buildHeaders(origin, {
        "Cache-Control": "public, max-age=5, stale-while-revalidate=10",
        "Content-Type": "application/json",
        "X-RPC-Source": "IOTA Mock API",
      }),
    });
  } catch (error) {
    console.error("Validator API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to fetch validators",
        message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: buildHeaders(origin, {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Error-Source": "IOTA API",
        }),
      }
    );
  }
}

/**
 * OPTIONS /api/validators (CORS preflight)
 */
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");

  return new NextResponse(null, {
    status: 200,
    headers: {
      ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}