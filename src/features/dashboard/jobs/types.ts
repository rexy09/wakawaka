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
  avatarUrl: string;
  biddingType: string | null;
  budget: number;
  category: string;
  commitment: string;
  country: {
    code: string;
    name: string;
  };
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  datePosted: string; // or Date if parsed
  description: string;
  fullName: string;
  hasBidding: boolean;
  id: string;
  imageUrls: string[];
  isActive: boolean;
  isProduction: boolean;
  isUserVerified: boolean;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  maxBudget: number;
  numberOfPositions: number;
  numberOfPostedJobsByUser: number;
  postedByUserId: string;
  title: string | null;
  urgency: string;
  userDateJoined: string; // or Date if parsed
  videoUrl: string | null;
  voiceUrl: string | null;
  workLocation: string;
}
export interface IJobCategory {
  name: string;
}
export interface ICommitmentType {
  type: string;
}
export interface IUrgencyLevels {
  level: string;
}

export interface IJobForm {
  biddingType: string;
  budgetType: string;
  budget: number;
  maxBudget: number;
  category: string;
  commitment: string;
  description: string;
  hasBidding: boolean;
  imageUrls: string[];
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  numberOfPositions: number;
  title: string;
  urgency: string;
}

