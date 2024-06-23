"use client";
import { motion } from "framer-motion";
import React from "react";

const pageTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Template = ({ children }: { children: React.ReactNode }) => {
  return <motion.div {...pageTransition}>{children}</motion.div>;
};

export default Template;
