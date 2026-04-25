import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      // Focus trap
      setTimeout(() => {
        const focusable = panelRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement;
        focusable?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-xl p-6 m-4",
          "transform opacity-100 scale-100 transition-all duration-200",
          sizes[size],
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            {description && (
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:bg-bg-muted p-1.5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
