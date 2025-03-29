import { create } from "zustand";

export interface BillingFilterParameters {
  startDate: string;
  endDate: string;
}

export interface Actions {
  updateText(type: "startDate" | "endDate", val: string): void;
  reset: () => void;
}

// define the initial state
const initialState: BillingFilterParameters = {
  startDate: "",
  endDate: "",
};

export const useDashboardParameters = create<BillingFilterParameters & Actions>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  reset: () => {
    set(initialState);
  },
}));


