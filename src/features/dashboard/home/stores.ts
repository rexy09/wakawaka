import { create } from "zustand";

export interface DashboardFilterParameters {
  startDate: string;
  endDate: string;
  search: string;
  state: string;
}

export interface Actions {
  updateText(
    type: "startDate" | "endDate" | "state" | "search",
    val: string
  ): void;
  reset: () => void;
}

// define the initial state
const initialState: DashboardFilterParameters = {
  startDate: "",
  endDate: "",
  state: "",
  search: "",
};

export const useDashboardParameters = create<
  DashboardFilterParameters & Actions
>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  reset: () => {
    set(initialState);
  },
}));
