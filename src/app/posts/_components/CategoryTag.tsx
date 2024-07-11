"use client";

import React from "react";

type Props = {
  name: string;
};

const CategoryTag: React.FC<Props> = (props: Props) => {
  const { name } = props;
  return (
    <div className="px-2 py-1 text-sm  text-slate-700 border border-slate-800 rounded">
      {name}
    </div>
  );
};

export default CategoryTag;
