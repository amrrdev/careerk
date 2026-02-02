export interface HttpExceptionResponse {
  message?: string;
  error?: string;
  details?: unknown;
  statusCode?: number;
}
