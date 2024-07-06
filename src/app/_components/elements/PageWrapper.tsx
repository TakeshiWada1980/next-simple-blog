import React, { ReactNode } from "react";
import PageTitleHeader from "@/app/_components/elements/PageTitleHeader";

type Props = {
  pageTitle: string;
  children: ReactNode;
};

const PageWrapper: React.FC<Props> = (props) => {
  const { pageTitle: title, children } = props;
  return (
    <article>
      <PageTitleHeader>{title}</PageTitleHeader>
      {children}
    </article>
  );
};

export default PageWrapper;
