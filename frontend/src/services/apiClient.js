const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(
  /\/$/,
  "",
);

async function readJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("El servidor devolvió una respuesta inválida.");
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await readJson(response);

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "No fue posible completar la operación.");
  }

  return data;
}

export function formatMoney(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(Number(value || 0));
}
