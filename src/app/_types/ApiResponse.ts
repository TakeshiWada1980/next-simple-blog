// 今後、クライアントサイドでも参照するため src/app/_types に配置

export type Origin = "Client" | "Server";

export const Origin = {
  CLIENT: "Client" as Origin,
  SERVER: "Server" as Origin,
};

export const AppErrorCode = {
  CATEGORY_ALREADY_EXISTS: "2001",
  CATEGORY_NOT_FOUND: "2002",
  POST_NOT_FOUND: "1001",
  INVALID_POST_DATA: "1002",
  UNKNOWN_ERROR: "9999",
};

export interface ErrorDetails {
  origin: Origin;
  appErrorCode: string;
  technicalInfo: string;
}

interface ApiBaseResponse {
  httpStatus: number;
  success: boolean;
  data: unknown;
  error: ErrorDetails | null;
}

export interface ApiSuccessResponse<T> extends ApiBaseResponse {
  success: true;
  data: T;
  error: null;
}

export interface ApiErrorResponse extends ApiBaseResponse {
  success: false;
  data: null;
  error: ErrorDetails;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
