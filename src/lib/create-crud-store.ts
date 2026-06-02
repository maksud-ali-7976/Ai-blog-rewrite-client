import { create } from 'zustand';

export interface CrudState<T> {
  list: T[];
  total: number;
  pages: number;
  page: number;
  size: number;
  loading: boolean;
  error: string | null;
}

export interface CrudActions<T> {
  setPage: (page: number, size: number) => void;
  getAll: () => void;
  create: (item: Partial<T>) => Promise<void>;
  update: (id: string, item: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

let idCounter = 100;
export function generateId() {
  return String(++idCounter);
}

export function createCrudStore<T extends { id: string }>(initialData: T[]) {
  return create<CrudState<T> & CrudActions<T>>((set, get) => ({
    list: initialData,
    total: initialData.length,
    pages: Math.ceil(initialData.length / 10),
    page: 0,
    size: 10,
    loading: false,
    error: null,

    setPage: (page, size) => {
      set({ page, size, pages: Math.ceil(get().list.length / size) });
    },

    getAll: () => {
      set({ loading: true });
      setTimeout(() => {
        const { list, size } = get();
        set({ loading: false, total: list.length, pages: Math.ceil(list.length / size) });
      }, 300);
    },

    create: async (item) => {
      set({ loading: true });
      await new Promise((r) => setTimeout(r, 300));
      const newItem = { ...item, id: generateId() } as T;
      const list = [...get().list, newItem];
      set({ list, loading: false, total: list.length, pages: Math.ceil(list.length / get().size) });
    },

    update: async (id, item) => {
      set({ loading: true });
      await new Promise((r) => setTimeout(r, 300));
      const list = get().list.map((i) => (i.id === id ? { ...i, ...item } : i));
      set({ list, loading: false });
    },

    remove: async (id) => {
      set({ loading: true });
      await new Promise((r) => setTimeout(r, 300));
      const list = get().list.filter((i) => i.id !== id);
      set({ list, loading: false, total: list.length, pages: Math.ceil(list.length / get().size) });
    },
  }));
}
