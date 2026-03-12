import type { ReactNode } from "react";

import ThemeRegistry from "./ThemeRegistry";

type CheatsheetLayoutProps = {
  children: ReactNode;
};

export default function CheatsheetLayout({ children }: CheatsheetLayoutProps) {
  return <ThemeRegistry>{children}</ThemeRegistry>;
}
