import { type ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
        <div className="bg-text-primary text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-sm">
          {content}
        </div>
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-text-primary"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
