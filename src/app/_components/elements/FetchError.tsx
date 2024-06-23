"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGhost } from "@fortawesome/free-solid-svg-icons";

type Props = {
  apiEndpoint: string;
  error: { message: string };
};

const FetchError: React.FC<Props> = ({ apiEndpoint, error }) => (
  <div className="text-stone-400 my-5">
    <h1 className="text-xl">
      <FontAwesomeIcon icon={faGhost} className="mr-2" />
      ERROR
      <FontAwesomeIcon icon={faGhost} className="ml-2" />
    </h1>
    <p className="mt-2">
      Failed to fetch from the API endpoint <br />
      ... '{apiEndpoint}'<br />
      Error: '<span className="font-bold">{error.message}</span>' occurred.
    </p>
  </div>
);

export default FetchError;
