"use client";

import React from "react";

type Props = {
  name: string;
};

const CategoryTag: React.FC<Props> = ({ name }: Props) => {
  return (
    <div className="px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded">
      {name}
    </div>
  );
};

export default CategoryTag;
