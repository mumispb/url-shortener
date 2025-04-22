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

// cross-tab sync: prefer BroadcastChannel, fallback to localStorage events
let bc: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  bc = new BroadcastChannel("visits");
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
      const link = get().links.get(slug);

      set((state) => {
        if (link) {
          const newMap = new Map(state.links);
          newMap.set(slug, { ...link, visits: link.visits + 1 });
          state.links = newMap;
        }
      });

      try {
        if (bc) {
          bc.postMessage(slug);
        } else if (typeof window !== "undefined") {
          localStorage.setItem("visit-event", `${slug}|${Date.now()}`);
        }
      } catch {}
    },
  }))
);

// wire up cross-tab listeners
if (typeof window !== "undefined") {
  if (bc) {
    bc.onmessage = (event: MessageEvent<string>) => {
      const slug = event.data;
      useLinks.setState((state) => {
        const existing = state.links.get(slug);
        if (existing) {
          const newMap = new Map(state.links);
          newMap.set(slug, { ...existing, visits: existing.visits + 1 });
          state.links = newMap;
        }
      });
    };
  }
  // listen for storage fallback
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === "visit-event" && e.newValue) {
      const [slug] = e.newValue.split("|");
      useLinks.setState((state) => {
        const existing = state.links.get(slug);
        if (existing) {
          const newMap = new Map(state.links);
          newMap.set(slug, { ...existing, visits: existing.visits + 1 });
          state.links = newMap;
        }
      });
    }
  });
}
