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
  lastDoc: any;
  firstDoc: any;
  data: T[];
}


export interface IBidForm {
  price: number;
}



export interface IJobPost {
  biddingType: string | null;
  budget: number;
  category: string;
  commitment: string;
  datePosted: string; // or Date if parsed
  description: string;
  hasBidding: boolean;
  id: string;
  imageUrls: string[];
  isActive: boolean;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  numberOfPositions: number | null;
  postedByUserId: string;
  title: string;
  urgency: string;
  videoUrl: string | null;
  voiceUrl: string | null;
}
