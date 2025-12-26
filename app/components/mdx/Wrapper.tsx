import type { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

export function Wrapper({ children }: WrapperProps) {
  return <main className="max-w-2xl mx-auto px-6 py-12">{children}</main>;
}
