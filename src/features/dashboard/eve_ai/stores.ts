import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



export interface IEve {
  conversationId: string;
  user: string;
}
export interface Actions {
  updateText(type: "conversationId" | "user", val: string | string[]): void;
  reset: () => void;
}

export const useEveStore = create(
  persist<IEve & Actions>(
    (set, _get) => ({
      conversationId: "",
      user: "",
      updateText(type, val) {
        set(() => ({ [type]: val }));
      },

      reset: () => {
        set({
          conversationId: "",
          user: "",
        });
      },
    }),
    {
      name: "eve",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
