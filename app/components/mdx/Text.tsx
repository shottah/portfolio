import type { HTMLAttributes, ReactNode } from "react";

interface TextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function Paragraph({ children }: TextProps) {
  return <p className="mb-1">{children}</p>;
}

export function Strong({ children }: TextProps) {
  return <strong className="font-semibold">{children}</strong>;
}

export function Emphasis({ children }: TextProps) {
  return <em className="italic">{children}</em>;
}
