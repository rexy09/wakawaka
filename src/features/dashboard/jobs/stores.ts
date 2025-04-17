import { create } from "zustand";
import { Actions, JobFilterParameters } from "./types";

// define the initial state
const initialState: JobFilterParameters = {
  startDate: "",
  endDate: "",
  search: "",
};

export const useJobParameters = create<JobFilterParameters & Actions>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  reset: () => {
    set(initialState);
  },
}));
