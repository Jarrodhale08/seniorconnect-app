import { create } from 'zustand';

interface SState {
  items: unknown[];
  loading: boolean;
  setItems: (items: unknown[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useSStore = create<SState>((set) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
}));

export default useSStore;
