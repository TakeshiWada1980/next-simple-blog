"use client";

import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className="bg-slate-800 text-white px-3 sm:px-0">
      <nav className="container mx-auto flex justify-between items-center md:w-2/3 xl:w-1/2">
        <Link href="/" className="py-3 font-bold">
          Blog
        </Link>
        <Link href="/contact" className="py-3 font-bold">
          <FontAwesomeIcon className="mr-2" icon={faEnvelope} />
          お問い合わせ
        </Link>
      </nav>
    </header>
  );
};

export default Header;
