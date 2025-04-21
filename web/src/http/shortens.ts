import { api } from "./api";

export interface Shorten {
  id: string;
  originalUrl: string;
  shortenedUrl: string;
  visits: number;
  createdAt: string;
}

export async function createShorten(originalUrl: string) {
  const response = await api.post<{ shortenedUrl: string }>("/shortens", {
    originalUrl,
  });
  return response.data.shortenedUrl;
}

export async function fetchShortens() {
  const response = await api.get<{ shortens: Shorten[]; total: number }>(
    "/shortens"
  );
  return response.data.shortens;
}

export async function deleteShorten(id: string) {
  await api.delete("/shortens", { params: { id } });
}

export async function resolveOriginal(shortenedUrl: string) {
  const response = await api.get<{ originalUrl: string }>(
    `/shortens/${shortenedUrl}`
  );
  return response.data.originalUrl;
}

export async function exportShortens(searchQuery?: string) {
  const response = await api.post<{ reportUrl: string }>(
    "/shortens/exports",
    {},
    {
      params: { searchQuery },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.reportUrl;
}
