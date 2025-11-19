import { create } from "zustand";
import { ICategory } from "./types";
export interface JobFilterParameters {
  startDate: string;
  endDate: string;
  search: string;
  location: string;
  category: ICategory;
  urgency: string;
  commitment: string;
}

export interface Actions {
  updateText(
    type:
      | "startDate"
      | "endDate"
      | "search"
      | "location"
      | "category"
      | "urgency"
      | "commitment",
    val: string | ICategory
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
  category: { en: "", fr: "", pt: "", es: "", sw: "" },
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
