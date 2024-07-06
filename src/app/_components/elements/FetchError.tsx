"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGhost } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "isomorphic-dompurify";
import cn from "classnames";

type Props = {
  apiEndpoint: string;
  message: string;
  className?: string;
};

const FetchError: React.FC<Props> = ({ apiEndpoint, message, className }) => {
  const sanitizedMsg: string = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ["br"],
  });
  return (
    <div className={cn("text-stone-400 my-5", className)}>
      <h1 className="text-xl">
        <FontAwesomeIcon icon={faGhost} className="mr-2" />
        ERROR
        <FontAwesomeIcon icon={faGhost} className="ml-2" />
      </h1>
      <p className="mt-2">
        Failed to fetch from the API endpoint ... '{apiEndpoint}'
      </p>
      <section
        className="font-bold mt-2"
        dangerouslySetInnerHTML={{ __html: sanitizedMsg }}
      />
    </div>
  );
};

export default FetchError;
