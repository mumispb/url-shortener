import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
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

enableMapSet();

export const useLinks = create<LinksState, [["zustand/immer", never]]>(
  immer((set, get) => ({
    links: new Map(),
    addLink(link) {
      const id = link.id ?? crypto.randomUUID();
      const newLink: Link = { ...link, id } as Link;
      set((state) => {
        state.links.set(id, newLink);
      });
    },
    deleteLink(id) {
      set((state) => {
        state.links.delete(id);
      });
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
