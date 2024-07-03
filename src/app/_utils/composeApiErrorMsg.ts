import { ApiErrorResponse } from "@/app/_types/ApiResponse";
import { AxiosError } from "axios";

const composeApiErrorMsg = (error: AxiosError<ApiErrorResponse>): string => {
  const resBody = error.response?.data;
  if (resBody) {
    let msg = "";
    msg += `[${error.response?.status}] ${error.response?.statusText}<br>`;
    msg += `(AppErrorCode: ${resBody.error.appErrorCode})<br>`;
    msg += resBody.error.technicalInfo;
    return msg;
  }
  return error.message; // Axiosによるエラーメッセージ
};

export default composeApiErrorMsg;
