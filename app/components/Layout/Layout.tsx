import type { ReactNode } from "react";
import "./styles.scss";

interface SectionProps {
  className?: string;
  children: ReactNode;
}

interface ContainerProps {
  children: ReactNode;
}

export function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`kto-layout-section ${className}`}>{children}</section>
  );
}

export function Container({ children }: ContainerProps) {
  return <div className="kto-layout-container">{children}</div>;
}
