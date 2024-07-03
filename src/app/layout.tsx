// 参考：https://stackoverflow.com/questions/56334381/why-my-font-awesome-icons-are-being-displayed-big-at-first-and-then-updated-to-t
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

import "./globals.css";
import type { Metadata } from "next";
import PageContainer from "@/app/_components/PageContainer";

import { M_PLUS_Rounded_1c } from "next/font/google";
const BaseFont = M_PLUS_Rounded_1c({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next Simple Blog",
  description: "This blog is an exercise in learning Next.js.",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="ja">
      <body className={BaseFont.className}>
        <PageContainer>{children}</PageContainer>
      </body>
    </html>
  );
};

export default RootLayout;
