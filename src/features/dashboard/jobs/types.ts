import { Timestamp } from "firebase/firestore";
import { CurrencyData } from "../profile/data";

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
  category: string | { sw: string; pt: string; en: string; fr: string; es: string };
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
  datePosted: string | Timestamp; // or Date if parsed
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
  userDateJoined: Timestamp | string | null; // or Date if parsed
  videoUrl: string | null;
  voiceUrl: string | null;
  workLocation: string;
}
export interface IJobCategory {
  name: string;
}
export interface ICategory {
  en: string;
  sw: string;
  pt: string;
  fr: string;
  es: string;
}
export interface ICommitmentType {
  type: string;
}
export interface IWorkLocations {
  location: string;
}
export interface IUrgencyLevels {
  level: string;
}

export interface IJobForm {
  biddingType: string;
  budgetType: string;
  budget: number;
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
  currency: CurrencyData | undefined;
  numberOfPositions: number;
  title: string;
  urgency: string;
  workLocation: string;
}

export interface IJobApplication {
  applicantName: string;
  attachments: any[];
  avatarURL: string;
  coverLetter: string | null;
  dateAdded: string | Timestamp;
  dateApplied: string;
  dateUpdated: string;
  feedback: string | null;
  id: string;
  isProduction: boolean;
  jobId: string;
  lastUpdated: string;
  resumeUrl: string | null;
  status: string | "accepted" | "approved" | "pending" | "rejected";
  uid: string;
}

export interface ISavedJob {
  id: string;
  jobId: string;
  userId: string;
  jobDetails: IJobPost;
  dateAdded: string;
  dateUpdated: string;
}

export interface IJobApplicationWithPost {
  application: IJobApplication;
  job: IJobPost;
}


export interface IHiredApplication {
  amount: number;
  applicantName: string;
  applicantUid: string;
  applicationId: string;
  approvalNotes: string | null;
  approvedAt: string; // ISO datetime
  approvedBy: string;
  bidId: string;
  completedAt: string; // ISO datetime
  completedBy: string;
  completionNotes: string | null;
  coverLetter: string | null;
  dateHired: string | Timestamp; // ISO datetime
  lastUpdated: string; // ISO datetime
  message: string;
  rating: number;
  resumeUrl: string;
  status: string | "approved" | "pending" | "rejected"; // inferred statuses
}

export interface IJobBid {
  amount: number;
  avatarUrl: string;
  bidderId: string;
  bidderName: string;
  dateAdded: string | Timestamp; 
  dateBid: Date; 
  dateUpdated: string;
  id: string;
  isProduction: boolean;
  jobId: string;
  lastUpdated: string;
  message: string;
  status: string;
}

export interface IExecution {
  status: string;
  execution_name: string;
  completedAt: string;
  createdAt: string;
  percentage: number;
  execution_id: string;
}
export interface ISmartHireStatus {
  execution: IExecution | null;
}

export interface IAIRecruiter {
  risk_score: number;
  employability_score: number;
  short_reason: string;
}

// Applicant details
export interface IApplicant {
  id: string;
  applicantName: string;
  avatarURL: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  ai_recruiter: IAIRecruiter;
  jobId: string;
  job_id: string;
  uid: string;
  sequence_number: number;
  status: string;
  dateAdded: string;
  dateApplied: string;
  dateUpdated: string;
  lastUpdated: string;
  posted_at: string;
  execution_id: string;
  feedback: string | null;
  isProduction: boolean;
  attachments: string[];
}