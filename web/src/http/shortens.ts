import { api } from "./api";

export interface Shorten {
  id: string;
  originalUrl: string;
  shortenedUrl: string;
  visits: number;
  createdAt: string;
}

export async function createShorten(originalUrl: string, slug: string) {
  const response = await api.post<{ shortenedUrl: string }>("/shortens", {
    originalUrl,
    slug,
  });
  return response.data.shortenedUrl;
}

export async function fetchShortens() {
  const response = await api.get<{ shortens: Shorten[]; total: number }>(
    "/shortens"
  );
  return response.data.shortens;
}

export async function deleteShorten(slug: string) {
  await api.delete("/shortens", { params: { slug } });
}

export async function resolveOriginal(slug: string) {
  const response = await api.get<{ originalUrl: string }>(`/shortens/${slug}`);
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
