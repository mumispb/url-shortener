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
  originalUrl: string;
  visits: number;
  createdAt: string;
}

interface LinksState {
  links: Map<string, Link>;
  deleteLink: (slug: string) => void;
  incrementVisits: (slug: string) => void;
}

export interface LinksStateAsync extends LinksState {
  isLoading: boolean;
  loadLinks: () => Promise<void>;
  createLink: (originalUrl: string, slug: string) => Promise<void>;
}

// setup cross-tab broadcast channel
const bc = new BroadcastChannel("visits");

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
          state.links.set(item.slug, item);
        });
        state.isLoading = false;
      });
    },
    async createLink(originalUrl: string, slug: string) {
      set((state) => {
        state.isLoading = true;
      });
      try {
        await createShorten(originalUrl, slug);
        await get().loadLinks();
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
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
    incrementVisits(slug) {
      // broadcast to other tabs
      bc.postMessage(slug);
      // update local state
      const link = get().links.get(slug);
      if (!link) return;
      set((state) => {
        state.links.set(slug, {
          ...link,
          visits: link.visits + 1,
        });
      });
    },
  }))
);

// listen for visits broadcasted from other tabs
bc.onmessage = (event: MessageEvent<string>) => {
  console.log("visits broadcasted", event.data);
  const slug = event.data;
  useLinks.setState((state) => {
    const existing = state.links.get(slug);
    if (existing) {
      state.links.set(slug, {
        ...existing,
        visits: existing.visits + 1,
      });
    }
  });
};
