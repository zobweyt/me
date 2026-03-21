import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { getTranslator } from "@/lib/i18n";

export type CodeProps = React.ComponentProps<"pre"> & {
  tabindex?: number | undefined;
  copiedDelay?: number;
  currentLocale: string | undefined;
};

export default function Code({
  tabindex,
  className,
  copiedDelay = 1000,
  currentLocale,
  ...props
}: CodeProps) {
  const ref = useRef<HTMLPreElement>(null);
  const copiedTimeoutRef = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);
  const t = getTranslator(currentLocale);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");

      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }

      setCopied(true);

      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copiedTimeoutRef.current = null;
      }, copiedDelay);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="not-prose relative flex flex-col overflow-hidden rounded-xl">
      <button
        type="button"
        className={cx(
          "flex items-center transition-all backdrop-blur-xl cursor-pointer absolute right-1 top-1 duration-150 justify-center gap-1 rounded-lg p-1.5 text-xl text-foreground/50 outline-none bg-surface",
          "hover:bg-foreground/10 focus-visible:bg-foreground/10 active:bg-foreground/15",
          "hover:text-foreground focus-visible:text-foreground active:text-foreground",
          copied && "text-success!",
        )}
        onClick={handleCopyButtonClick}
        aria-label={copied ? t("copied") : t("copy")}
      >
        <span className="relative block size-5">
          <span
            className={cx(
              "i-f7:doc-on-clipboard absolute inset-0 duration-250",
              copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
            )}
          />
          <span
            className={cx(
              "i-f7:checkmark absolute inset-0 duration-250",
              copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
          />
        </span>
      </button>
      <pre
        ref={ref}
        tabIndex={tabindex}
        className={cx(
          [
            "p-4 text-sm focus-visible:outline-foreground/25! rounded-inherit",
            "bg-surface! [&_span]:bg-surface!",
            "dark:text-[var(--shiki-dark)]! dark:[&_span]:text-[var(--shiki-dark)]!",
          ],
          className,
        )}
        {...props}
      />
    </div>
  );
}
