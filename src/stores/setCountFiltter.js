import { create } from "zustand";

const setCountFiltter = create((set) => ({
  isTogled: false,
  toggle: () => set((state) => ({ isTogled: !state.isTogled })),
}));

export default setCountFiltter;
