import { ApiSuccessResponse } from "@/app/_types/ApiResponse";
import { StatusCodes } from "@/app/_utils/extendedStatusCodes";

// API成功レスポンスのビルダークラス
class SuccessResponseBuilder<T> {
  private response: ApiSuccessResponse<T>;

  constructor(data: T) {
    this.response = {
      httpStatus: StatusCodes.OK,
      success: true,
      data: data,
      error: null,
    };
  }

  setHttpStatus(httpStatus: number): this {
    this.response.httpStatus = httpStatus;
    return this;
  }

  build(): ApiSuccessResponse<T> {
    return this.response;
  }
}

export default SuccessResponseBuilder;
