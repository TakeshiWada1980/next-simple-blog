import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./FetchLoading.css";

type Props = {
  msg: string;
};

const FetchLoading: React.FC<Props> = ({ msg }) => (
  <div className="text-stone-400 my-5">
    <FontAwesomeIcon icon={faSpinner} className="spin mr-2" />
    {msg}
  </div>
);

export default FetchLoading;
