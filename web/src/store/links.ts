import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import {
  createShorten,
  fetchShortens,
  deleteShorten as deleteShortenApi,
} from "../http/shortens";

export interface Link {
  id: string;
  slug: string;
  shortUrl: string;
  originalUrl: string;
  accessCount: number;
}

interface LinksState {
  links: Map<string, Link>;
  addLink: (link: Omit<Link, "id"> & { id?: string }) => void;
  deleteLink: (slug: string) => void;
  incrementAccessCount: (slug: string) => void;
}

export interface LinksStateAsync extends LinksState {
  isLoading: boolean;
  loadLinks: () => Promise<void>;
  createLink: (originalUrl: string, slug: string) => Promise<void>;
}

enableMapSet();

export const useLinks = create<LinksStateAsync, [["zustand/immer", never]]>(
  immer((set, get) => ({
    links: new Map(),
    isLoading: false,
    async loadLinks() {
      set((state) => {
        state.isLoading = true;
      });
      const list = await fetchShortens();
      set((state) => {
        state.links.clear();
        list.forEach((item) => {
          const slug = item.shortenedUrl.split("/").pop() ?? item.id;
          state.links.set(slug, {
            id: item.id,
            slug,
            shortUrl: item.shortenedUrl,
            originalUrl: item.originalUrl,
            accessCount: item.visits,
          });
        });
        state.isLoading = false;
      });
    },
    async createLink(originalUrl: string, slug: string) {
      set((state) => {
        state.isLoading = true;
      });
      try {
        // attempt to create
        await createShorten(originalUrl, slug);
        // refresh list
        await get().loadLinks();
      } catch (err) {
        console.error(err);
        // propagate error for caller to handle
        throw err;
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    addLink(link) {
      const id = link.id ?? crypto.randomUUID();
      const slug = link.slug ?? link.shortUrl.split("/").pop() ?? id;
      const newLink: Link = { ...link, id, slug } as Link;
      set((state) => {
        state.links.set(slug, newLink);
      });
    },
    async deleteLink(slug) {
      // optimistic update
      set((state) => {
        state.links.delete(slug);
      });
      try {
        await deleteShortenApi(slug);
      } catch (err) {
        console.error(err);
        // rollback? for now ignore
      }
    },
    incrementAccessCount(slug) {
      const link = get().links.get(slug);
      if (!link) return;
      set((state) => {
        const existing = state.links.get(slug);
        if (existing) {
          state.links.set(slug, {
            ...existing,
            accessCount: existing.accessCount + 1,
          });
        }
      });
    },
  }))
);
