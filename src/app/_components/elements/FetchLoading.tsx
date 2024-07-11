"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// https://www.tailwindcss-animated.com/configurator.html
import cn from "classnames";

type Props = {
  msg: string;
  className?: string;
};

const FetchLoading: React.FC<Props> = ({ msg, className }) => (
  <div className={cn("text-stone-400 my-5", className)}>
    <FontAwesomeIcon
      icon={faSpinner}
      className="animate-spin animate-duration-[2000ms] mr-2"
    />
    {msg}
  </div>
);

export default FetchLoading;
