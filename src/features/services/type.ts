export interface ApiResponse {
  success: boolean;
  message: string;
  totalCount?: number;
  data: any;
}
