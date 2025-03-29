import { create } from "zustand";
import { Actions, TrackingFilterParameters } from "./types";

// define the initial state
const initialState: TrackingFilterParameters = {
  startDate: "",
  endDate: "",
  state: "",
  search: "",
};

export const useDashboardParameters = create<TrackingFilterParameters & Actions>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  reset: () => {
    set(initialState);
  },
}));
