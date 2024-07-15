import React, { useEffect, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  msg: string;
}

const InfoToast: React.FC<Props> = ({ msg }) => {
  const [isToastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (msg !== "") {
      setToastVisible(true);
    }
  }, [msg]);

  return (
    <Toast.Provider swipeDirection="right" duration={3000}>
      <Toast.Root
        className="bg-green-100 border border-green-600 rounded-md shadow-md data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={isToastVisible}
        onOpenChange={setToastVisible}
      >
        <Toast.Title className="px-5 py-2 text-green-600">
          <FontAwesomeIcon className="mr-1" icon={faInfoCircle} />
          {msg}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col [--viewport-padding:_25px] p-[var(--viewport-padding)] gap-2 ax-w-full m-0 z-100 outline-none" />
    </Toast.Provider>
  );
};

export default InfoToast;
