import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = process.env.GOLD_API_KEY || "";

// In-memory cache (resets when server restarts, but that's fine —
// we only fetch once per day, and if server restarts it fetches again once)
let dailyCache: { date: string; data: any } | null = null;

function getToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export async function GET() {
  const today = getToday();

  // Check in-memory cache first (fastest, zero API calls)
  if (dailyCache && dailyCache.date === today) {
    return NextResponse.json({
      ...dailyCache.data,
      loading: false,
      cached: true,
      cachedDate: today,
    });
  }

  // Cache is stale or doesn't exist — fetch from API (only 1 call per day!)
  try {
    const headers = {
      "x-access-token": API_KEY,
      "Content-Type": "application/json",
    };

    const goldRes = await fetch("https://www.goldapi.io/api/XAU/INR", {
      headers,
      cache: "no-store",
    });

    if (!goldRes.ok) {
      const errBody = await goldRes.text();
      console.error("GoldAPI gold error:", goldRes.status, errBody);

      // If we have stale cache from a previous day, return it
      if (dailyCache) {
        return NextResponse.json({
          ...dailyCache.data,
          loading: false,
          cached: true,
          cachedDate: dailyCache.date,
          stale: true,
        });
      }

      return NextResponse.json({
        loading: true,
        message: "Live gold rates will load soon. Please try again later.",
        updated: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      });
    }

    const goldData = await goldRes.json();

    await new Promise((r) => setTimeout(r, 200));

    const silverRes = await fetch("https://www.goldapi.io/api/XAG/INR", {
      headers,
      cache: "no-store",
    });

    if (!silverRes.ok) {
      const errBody = await silverRes.text();
      console.error("GoldAPI silver error:", silverRes.status, errBody);

      if (dailyCache) {
        return NextResponse.json({
          ...dailyCache.data,
          loading: false,
          cached: true,
          cachedDate: dailyCache.date,
          stale: true,
        });
      }

      return NextResponse.json({
        loading: true,
        message: "Live gold rates will load soon. Please try again later.",
        updated: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      });
    }

    const silverData = await silverRes.json();

    // Convert price per troy ounce -> price per 10g
    const gold24k = Math.round((goldData.price / 31.1035) * 10);
    const silver = Math.round((silverData.price / 31.1035) * 1000);

    const rateData = {
      gold24k,
      gold22k: Math.round(gold24k * 0.916),
      roseGold: Math.round(gold24k * 0.95),
      silver,
      change24k: Number((goldData.chp || 0).toFixed(2)),
      changeSilver: Number((silverData.chp || 0).toFixed(2)),
      updated: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      unit: { gold: "per 10 grams", silver: "per kg" },
    };

    // Cache in memory
    dailyCache = { date: today, data: rateData };

    return NextResponse.json({
      ...rateData,
      loading: false,
      cached: false,
      cachedDate: today,
    });
  } catch (error) {
    console.error("Gold rate API error:", error);

    if (dailyCache) {
      return NextResponse.json({
        ...dailyCache.data,
        loading: false,
        cached: true,
        cachedDate: dailyCache.date,
        stale: true,
      });
    }

    return NextResponse.json({
      loading: true,
      message: "Live gold rates will load soon. Please try again later.",
      updated: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });
  }
}
