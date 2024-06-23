import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

type Props = {
  message: string | null | undefined;
};

const ErrorMessage: React.FC<Props> = ({ message }) => {
  if (!message) {
    return <></>;
  }

  return (
    <p className="text-red-500 text-sm mt-1">
      <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
      {message}
    </p>
  );
};

export default ErrorMessage;
