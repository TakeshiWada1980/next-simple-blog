"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// https://www.tailwindcss-animated.com/configurator.html

type Props = {
  msg: string;
};

const FetchLoading: React.FC<Props> = ({ msg }) => (
  <div className="text-stone-400 my-5">
    <FontAwesomeIcon
      icon={faSpinner}
      className="animate-spin animate-duration-[2000ms] mr-2"
    />
    {msg}
  </div>
);

export default FetchLoading;
