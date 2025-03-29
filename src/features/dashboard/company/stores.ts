import { create } from "zustand";
export interface CompanyFilterParameters {
  startDate: string;
  endDate: string;
  plate_no: string;
}

export interface Actions {
  updateText(type: "startDate" | "endDate" | "plate_no", val: string): void;
  reset: () => void;
}

// define the initial state
const initialState: CompanyFilterParameters = {
  startDate: "",
  endDate: "",
  plate_no: "",
};

export const useCompanyParameters = create<CompanyFilterParameters & Actions>((set) => ({
  ...initialState,

  updateText(type, val) {
    set(() => ({ [type]: val }));
  },
  reset: () => {
    set(initialState);
  },
}));
