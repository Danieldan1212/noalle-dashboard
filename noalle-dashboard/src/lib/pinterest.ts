const PINTEREST_ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN || "";
const PINTEREST_BOARD_ID = process.env.PINTEREST_BOARD_ID || "";
const API_BASE = "https://api.pinterest.com/v5";

interface PinterestRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

async function pinterestFetch<T>({
  endpoint,
  method = "GET",
  body,
  params,
}: PinterestRequestOptions): Promise<T> {
  const url = new URL(`${API_BASE}/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINTEREST_ACCESS_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Pinterest API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  return response.json() as Promise<T>;
}

export async function createPin(params: {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  altText?: string;
}) {
  return pinterestFetch({
    endpoint: "pins",
    method: "POST",
    body: {
      board_id: PINTEREST_BOARD_ID,
      title: params.title,
      description: params.description,
      media_source: {
        source_type: "image_url",
        url: params.imageUrl,
      },
      link: params.link,
      alt_text: params.altText || params.title,
    },
  });
}

export async function getPins(params?: {
  bookmark?: string;
  page_size?: number;
}) {
  return pinterestFetch({
    endpoint: `boards/${PINTEREST_BOARD_ID}/pins`,
    params: {
      page_size: String(params?.page_size || 25),
      ...(params?.bookmark && { bookmark: params.bookmark }),
    },
  });
}

export async function getPinAnalytics(
  pinId: string,
  params?: {
    start_date?: string;
    end_date?: string;
    metric_types?: string;
  }
) {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return pinterestFetch({
    endpoint: `pins/${pinId}/analytics`,
    params: {
      start_date: params?.start_date || thirtyDaysAgo,
      end_date: params?.end_date || today,
      metric_types:
        params?.metric_types || "IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK",
    },
  });
}

export async function getUserAnalytics(params?: {
  start_date?: string;
  end_date?: string;
  metric_types?: string;
}) {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return pinterestFetch({
    endpoint: "user_account/analytics",
    params: {
      start_date: params?.start_date || thirtyDaysAgo,
      end_date: params?.end_date || today,
      metric_types:
        params?.metric_types || "IMPRESSION,ENGAGEMENT,PIN_CLICK,SAVE",
    },
  });
}

export async function getBoards() {
  return pinterestFetch({ endpoint: "boards" });
}

export const pinterestClient = {
  createPin,
  getPins,
  getPinAnalytics,
  getUserAnalytics,
  getBoards,
};
