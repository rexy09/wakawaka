import { create } from "zustand";
import { Actions, ReportFilterParameters } from "./types";

// define the initial state
const initialState: ReportFilterParameters = {
  startDate: "",
  endDate: "",
};

export const useReportParameters = create<ReportFilterParameters & Actions>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  reset: () => {
    set(initialState);
  },
}));
