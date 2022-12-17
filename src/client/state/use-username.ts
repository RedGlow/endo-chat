import create from "zustand";

export interface IUsername {
  username: string;
  setUsername(username: string): void;
}

const useUsername = create<IUsername>((set) => ({
  username: "",
  setUsername: (username: string) =>
    set((state) => ({
      ...state,
      username,
    })),
}));

export default useUsername;
