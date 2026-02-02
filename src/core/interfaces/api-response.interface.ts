export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  meta: {
    timestamp: string;
    path: string;
    method: string;
  };
}
