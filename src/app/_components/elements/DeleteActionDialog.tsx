"use client";

import React, { useState } from "react";
import cn from "classnames";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ApiResponse } from "@/app/_types/ApiResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faTriangleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const buttonStyle = cn(
  "border rounded-md px-2 py-1 ml-1 text-sm bg-red-400 text-white tracking-wider",
  "flex flex-nowrap whitespace-nowrap outline-none justify-center items-center gap-2",
  "hover:bg-red-600"
);

const cancelButtonStyle = cn(
  "px-3 py-1 rounded-lg",
  "text-white bg-slate-400",
  "hover:bg-slate-600",
  "focus:bg-slate-600",
  "outline-2 outline-offset-2 outline-slate-400"
);
const deleteButtonStyle = cn(
  "px-3 py-1 rounded-lg tracking-widest",
  "text-white bg-red-400",
  "hover:bg-red-600",
  "focus:bg-red-600",
  "outline-2 outline-offset-2 outline-slate-400"
);

type Props = {
  className?: string;
  endpoint: string;
  title: string;
  description: string;
  handleDeleteAction: ({ isDone }: { isDone: boolean }) => void;
  deleteApiCaller: (
    url: string,
    headers?: undefined
  ) => Promise<ApiResponse<null>>;
};

const DeleteActionDialog: React.FC<Props> = (props) => {
  const {
    endpoint,
    title,
    description,
    handleDeleteAction,
    deleteApiCaller,
    className,
  } = props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const handleDeleteClick = async () => {
    setIsBusy(true);
    const res = await deleteApiCaller(endpoint);
    console.log("■" + JSON.stringify(res.data));
    handleDeleteAction({ isDone: true });
    setIsBusy(false);
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog.Trigger asChild>
        <button
          className={cn(buttonStyle, className)}
          onClick={() => setIsDialogOpen(true)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
          削除
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-slate-900 opacity-50  fixed inset-0 cursor-not-allowed z-20" />
        <AlertDialog.Content className="fixed z-30 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none">
          <AlertDialog.Title className="text-red-500 text-lg m-0 font-bold">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-red-500 mr-1"
            />
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-4 mb-5 leading-normal">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-4">
            <AlertDialog.Cancel asChild>
              <button
                onClick={() => handleDeleteAction({ isDone: false })}
                className={cancelButtonStyle}
              >
                キャンセル
              </button>
            </AlertDialog.Cancel>
            <button onClick={handleDeleteClick} className={deleteButtonStyle}>
              {isBusy ? (
                <div>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin animate-duration-[2000ms] mr-2"
                  />
                  削除中...
                </div>
              ) : (
                <div>削除</div>
              )}
            </button>
            {/* <AlertDialog.Action asChild><button>削除</button></AlertDialog.Action> */}
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteActionDialog;
