"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import Link from "next/link";

interface Props {
  title: string;
  href: string;
  icon: IconDefinition;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const linkStyle = cn(
  "px-0 py-2 md:px-3 mt-1",
  "text-md",
  "hover:bg-slate-200",
  "rounded",
  "flex items-center",
  "group"
);
const iconStyle = cn(
  "mr1 md:mr-2",
  "w-8",
  "text-2xl text-slate-400",
  "group-hover:animate-wiggle group-hover:animate-infinite",
  "group-hover:animate-duration-[800ms] group-hover:animate-ease-in-out"
);

const AdminMenuLink: React.FC<Props> = (props) => {
  const { title, href, icon, setIsOpen } = props;
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <Link href={href} className={linkStyle} onClick={closeMenu}>
      <FontAwesomeIcon className={iconStyle} icon={icon} />
      {title}
    </Link>
  );
};

export default AdminMenuLink;
