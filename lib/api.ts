const API = process.env.NEXT_PUBLIC_API_URL || "https://fortuna-api-production.up.railway.app"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Something went wrong")
  return data
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(email: string, password: string) {
  const data = await request("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem("token", data.token)
  localStorage.setItem("user_id", data.user_id)
  return data
}

export async function login(email: string, password: string) {
  const data = await request("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem("token", data.token)
  localStorage.setItem("user_id", data.user_id)
  return data
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user_id")
}

// ── User ──────────────────────────────────────────────────────────────────────

export async function getMe() {
  return request("/api/users/me")
}

// ── Bot ───────────────────────────────────────────────────────────────────────

export async function startBot() {
  return request("/api/bot/start", { method: "POST" })
}

export async function stopBot() {
  return request("/api/bot/stop", { method: "POST" })
}

export async function updateCapital(capital_amount: number) {
  return request("/api/bot/config", {
    method: "PUT",
    body: JSON.stringify({ capital_amount }),
  })
}

export async function getBotStatus() {
  return request("/api/bot/status")
}

// ── Exchange ──────────────────────────────────────────────────────────────────

export async function connectExchange(api_key: string, api_secret: string, passphrase: string) {
  return request("/api/exchange/connect", {
    method: "POST",
    body: JSON.stringify({ api_key, api_secret, passphrase }),
  })
}

export async function getExchangeStatus() {
  return request("/api/exchange/status")
}

// ── Trades ────────────────────────────────────────────────────────────────────

export async function getTrades() {
  return request("/api/trades")
}

export async function getTradeSummary() {
  return request("/api/trades/summary")
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  return request("/api/admin/stats")
}

export async function getAdminUsers() {
  return request("/api/admin/users")
}

export async function grantAccess(user_id: string) {
  return request(`/api/admin/users/${user_id}/grant-access`, { method: "POST" })
}

export async function grantAccessByEmail(email: string) {
  return request("/api/admin/grant-by-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function revokeAccess(user_id: string) {
  return request(`/api/admin/users/${user_id}/revoke-access`, { method: "POST" })
}
