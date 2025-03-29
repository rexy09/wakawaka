import { create } from "zustand";
import { Actions, BidFilterParameters } from "./types";

// define the initial state
const initialState: BidFilterParameters = {
  startDate: "",
  endDate: "",
};

export const useDashboardParameters = create<BidFilterParameters & Actions>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  reset: () => {
    set(initialState);
  },
}));
