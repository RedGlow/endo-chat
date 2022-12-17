import create from "zustand";

export interface IntentiallyOpenedChats {
  names: Set<string>;
  addName(name: string): void;
}

const useIntentionallyOpenedChats = create<IntentiallyOpenedChats>((set) => ({
  names: new Set(),
  addName: (name: string) => {
    set((state) => ({
      ...state,
      names: state.names.add(name),
    }));
  },
}));

export default useIntentionallyOpenedChats;
