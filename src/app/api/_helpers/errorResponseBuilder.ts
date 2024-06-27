import {
  ApiResponse,
  ApiErrorResponse,
  ErrorDetails,
  Origin,
} from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";

class ErrorResponseBuilder {
  private response: ApiErrorResponse;
  private readonly defaultErrorDetails: ErrorDetails;

  constructor() {
    this.defaultErrorDetails = {
      origin: Origin.SERVER,
      appErrorCode: "",
      technicalInfo: "",
    };
    this.response = {
      httpStatus: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      data: null,
      error: this.defaultErrorDetails,
    };
  }

  setHttpStatus(httpStatus: number): this {
    this.response.httpStatus = httpStatus;
    return this;
  }

  setOrigin(errorType: Origin): this {
    this.response.error.origin = errorType;
    return this;
  }

  setAppErrorCode(appErrorCode: string): this {
    this.response.error.appErrorCode = appErrorCode;
    return this;
  }

  setTechnicalInfo(technicalInfo: string): this {
    this.response.error.technicalInfo = technicalInfo;
    return this;
  }

  build(): ApiErrorResponse {
    return this.response;
  }
}

export default ErrorResponseBuilder;
