export interface JobFilterParameters {
  startDate: string;
  endDate: string;
  search: string;
}

export interface Actions {
  updateText(type: "startDate" | "endDate" | "search", val: string): void;
  reset: () => void;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface IBidForm {
  price: number;
}


