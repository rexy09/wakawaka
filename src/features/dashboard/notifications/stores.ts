import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface INotificationCount {
  count: string;
  readCount: number;
  refresh: number;
  isRead: boolean | undefined;
}
export interface Actions {
  updateText(
    type: "count" | "refresh" | "isRead" | "readCount",
    val: string | undefined | boolean | number
  ): void;
  reset: () => void;
  inc: () => void;
}

export const useNotificationStore = create(
  persist<INotificationCount & Actions>(
    (set, _get) => ({
      count: "0",
      readCount: 0,
      refresh: 0,
      isRead: undefined,

      updateText(type, val) {
        set(() => ({ [type]: val }));
      },
      inc: () => set((state) => ({ refresh: state.refresh + 1 })),

      reset: () => {
        set({
          count: "0",
          readCount: 0,
          refresh: 0,
          isRead: undefined,
        });
      },
    }),
    {
      name: "notifications",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
