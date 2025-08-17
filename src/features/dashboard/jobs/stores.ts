import { create } from "zustand";
export interface JobFilterParameters {
  startDate: string;
  endDate: string;
  search: string;
  location: string;
  category: string;
  urgency: string;
  commitment: string;
}

export interface Actions {
  updateText(
    type: "startDate" | "endDate" | "search" | "location" | "category" | "urgency" | "commitment",
    val: string
  ): void;
  // updateArray(type: "jobTypes", val: string[]): void;
  reset: () => void;
}

// define the initial state
const initialState: JobFilterParameters = {
  startDate: "",
  endDate: "",
  search: "",
  location: "",
  category: "",
  urgency: "",
  commitment: "",
};

export const useJobParameters = create<JobFilterParameters & Actions>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  // updateArray(type, val) {
  //   set(() => ({ [type]: val }));
  // },
  reset: () => {
    set(initialState);
  },
}));
