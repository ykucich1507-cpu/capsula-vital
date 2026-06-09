const BASE_URL = "https://app.dropi.ar/api";

export interface DropiConfig {
  token: string;
}

export interface DropiProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  category: string;
  variants?: DropiVariant[];
}

export interface DropiVariant {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface DropiOrder {
  id: number;
  status: string;
  created_at: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: DropiOrderItem[];
  total: number;
  tracking_number?: string;
  tracking_url?: string;
}

export interface DropiOrderItem {
  product_id: number;
  product_name: string;
  variant_id?: number;
  variant_name?: string;
  quantity: number;
  unit_price: number;
}

export interface DropiOrderRequest {
  product_id: number;
  variant_id?: number;
  quantity: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
}

export class DropiClient {
  private token: string;

  constructor(config: DropiConfig) {
    this.token = config.token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Dropi API error ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }

  // Products
  async listProducts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
  }): Promise<{ data: DropiProduct[]; total: number; page: number }> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    return this.request(`/products?${qs}`);
  }

  async getProduct(id: number): Promise<DropiProduct> {
    return this.request(`/products/${id}`);
  }

  async getProductStock(id: number): Promise<{ id: number; stock: number; variants?: { id: number; stock: number }[] }> {
    return this.request(`/products/${id}/stock`);
  }

  // Orders
  async createOrder(order: DropiOrderRequest): Promise<DropiOrder> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });
  }

  async getOrder(id: number): Promise<DropiOrder> {
    return this.request(`/orders/${id}`);
  }

  async listOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    from?: string;
    to?: string;
  }): Promise<{ data: DropiOrder[]; total: number; page: number }> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    if (params?.status) qs.set("status", params.status);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    return this.request(`/orders?${qs}`);
  }

  async cancelOrder(id: number, reason?: string): Promise<{ success: boolean }> {
    return this.request(`/orders/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async getOrderTracking(id: number): Promise<{ tracking_number?: string; tracking_url?: string; status: string; events: { date: string; description: string }[] }> {
    return this.request(`/orders/${id}/tracking`);
  }

  // Account
  async getBalance(): Promise<{ balance: number; currency: string; pending: number }> {
    return this.request("/account/balance");
  }

  async getProfile(): Promise<{ id: number; name: string; email: string; store_name: string }> {
    return this.request("/account/profile");
  }
}
