const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || "";
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || "";

interface ShopifyRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

async function shopifyFetch<T>({
  endpoint,
  method = "GET",
  body,
  params,
}: ShopifyRequestOptions): Promise<T> {
  const url = new URL(
    `https://${SHOPIFY_STORE_URL}/admin/api/2024-01/${endpoint}.json`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function getOrders(params?: {
  status?: string;
  limit?: number;
  since_id?: string;
  created_at_min?: string;
  created_at_max?: string;
}) {
  return shopifyFetch({
    endpoint: "orders",
    params: {
      status: params?.status || "any",
      limit: String(params?.limit || 50),
      ...(params?.since_id && { since_id: params.since_id }),
      ...(params?.created_at_min && {
        created_at_min: params.created_at_min,
      }),
      ...(params?.created_at_max && {
        created_at_max: params.created_at_max,
      }),
    },
  });
}

export async function getOrder(orderId: string) {
  return shopifyFetch({ endpoint: `orders/${orderId}` });
}

export async function getCustomers(params?: {
  limit?: number;
  since_id?: string;
}) {
  return shopifyFetch({
    endpoint: "customers",
    params: {
      limit: String(params?.limit || 50),
      ...(params?.since_id && { since_id: params.since_id }),
    },
  });
}

export async function getProducts(params?: {
  limit?: number;
  collection_id?: string;
}) {
  return shopifyFetch({
    endpoint: "products",
    params: {
      limit: String(params?.limit || 50),
      ...(params?.collection_id && {
        collection_id: params.collection_id,
      }),
    },
  });
}

export async function getOrdersCount(params?: {
  status?: string;
  created_at_min?: string;
  created_at_max?: string;
}) {
  return shopifyFetch({
    endpoint: "orders/count",
    params: {
      status: params?.status || "any",
      ...(params?.created_at_min && {
        created_at_min: params.created_at_min,
      }),
      ...(params?.created_at_max && {
        created_at_max: params.created_at_max,
      }),
    },
  });
}

export async function getRevenue(params?: {
  created_at_min?: string;
  created_at_max?: string;
}): Promise<{ total: number; count: number; average: number }> {
  const orders = (await getOrders({
    status: "any",
    created_at_min: params?.created_at_min,
    created_at_max: params?.created_at_max,
    limit: 250,
  })) as { orders: Array<{ total_price: string }> };

  const total = orders.orders.reduce(
    (sum: number, order: { total_price: string }) =>
      sum + parseFloat(order.total_price),
    0
  );
  const count = orders.orders.length;
  const average = count > 0 ? total / count : 0;

  return { total, count, average };
}

export const shopifyClient = {
  getOrders,
  getOrder,
  getCustomers,
  getProducts,
  getOrdersCount,
  getRevenue,
};
