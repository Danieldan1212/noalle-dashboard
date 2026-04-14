const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";
const META_PAGE_ID = process.env.META_PAGE_ID || "";
const META_IG_USER_ID = process.env.META_IG_USER_ID || "";
const GRAPH_API_BASE = "https://graph.facebook.com/v19.0";

interface MetaRequestOptions {
  endpoint: string;
  method?: "GET" | "POST";
  params?: Record<string, string>;
  body?: Record<string, unknown>;
}

async function metaFetch<T>({
  endpoint,
  method = "GET",
  params,
  body,
}: MetaRequestOptions): Promise<T> {
  const url = new URL(`${GRAPH_API_BASE}/${endpoint}`);
  url.searchParams.set("access_token", META_ACCESS_TOKEN);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Meta API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  return response.json() as Promise<T>;
}

// NOTE: Posting is done through Meta Business Suite (free, no API needed).
// This file only handles READING analytics data from Meta's APIs.

export async function getInstagramInsights(params?: {
  metric?: string;
  period?: string;
}) {
  return metaFetch({
    endpoint: `${META_IG_USER_ID}/insights`,
    params: {
      metric:
        params?.metric ||
        "impressions,reach,profile_views,follower_count",
      period: params?.period || "day",
    },
  });
}

export async function getInstagramMedia(params?: { limit?: number }) {
  return metaFetch({
    endpoint: `${META_IG_USER_ID}/media`,
    params: {
      fields:
        "id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count",
      limit: String(params?.limit || 25),
    },
  });
}

export async function getFacebookPageInsights(params?: {
  metric?: string;
  period?: string;
}) {
  return metaFetch({
    endpoint: `${META_PAGE_ID}/insights`,
    params: {
      metric:
        params?.metric ||
        "page_impressions,page_engaged_users,page_fans",
      period: params?.period || "day",
    },
  });
}

export async function getInstagramMediaInsights(mediaId: string) {
  return metaFetch({
    endpoint: `${mediaId}/insights`,
    params: {
      metric: "impressions,reach,engagement,saved",
    },
  });
}

export const metaClient = {
  getInstagramInsights,
  getInstagramMedia,
  getFacebookPageInsights,
  getInstagramMediaInsights,
};
