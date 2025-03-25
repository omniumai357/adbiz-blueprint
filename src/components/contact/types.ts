
import { ReactNode } from "react";

export interface ContactMethod {
  id: string;
  icon: ReactNode;
  label: string;
  prompt: string;
  action: string;
  href: string;
  priority: number;
}
