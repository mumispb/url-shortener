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
  shortUrl: string;
  originalUrl: string;
  accessCount: number;
}

interface LinksState {
  links: Map<string, Link>;
  addLink: (link: Omit<Link, "id"> & { id?: string }) => void;
  deleteLink: (id: string) => void;
  incrementAccessCount: (id: string) => void;
}

export interface LinksStateAsync extends LinksState {
  isLoading: boolean;
  loadLinks: () => Promise<void>;
  createLink: (originalUrl: string) => Promise<void>;
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
          state.links.set(item.id, {
            id: item.id,
            shortUrl: item.shortenedUrl,
            originalUrl: item.originalUrl,
            accessCount: item.visits,
          });
        });
        state.isLoading = false;
      });
    },
    async createLink(originalUrl: string) {
      set((state) => {
        state.isLoading = true;
      });
      const shortenedUrl = await createShorten(originalUrl);
      // After creation, refresh list
      await get().loadLinks();
      set((state) => {
        state.isLoading = false;
      });
    },
    addLink(link) {
      const id = link.id ?? crypto.randomUUID();
      const newLink: Link = { ...link, id } as Link;
      set((state) => {
        state.links.set(id, newLink);
      });
    },
    async deleteLink(id) {
      // optimistic update
      set((state) => {
        state.links.delete(id);
      });
      try {
        await deleteShortenApi(id);
      } catch (err) {
        console.error(err);
        // rollback? for now ignore
      }
    },
    incrementAccessCount(id) {
      const link = get().links.get(id);
      if (!link) return;
      set((state) => {
        const existing = state.links.get(id);
        if (existing) {
          state.links.set(id, {
            ...existing,
            accessCount: existing.accessCount + 1,
          });
        }
      });
    },
  }))
);
