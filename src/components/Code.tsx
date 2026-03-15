import { cx } from "class-variance-authority";
import { useRef, useState } from "react";
import { getTranslator } from "@/i18n";

export type CodeProps = React.ComponentProps<"pre"> & {
  tabindex?: number | undefined;
  "data-language"?: string | undefined;
  copiedDelay?: number;
  currentLocale: string | undefined;
};

export default function Code({
  tabindex,
  className,
  "data-language": language,
  copiedDelay = 1500,
  currentLocale,
  ...props
}: CodeProps) {
  const ref = useRef<HTMLPreElement>(null);
  const t = getTranslator(currentLocale);
  const [copied, setCopied] = useState(false);

  const handleCopyButtonClick = async () => {
    await navigator.clipboard.writeText(ref.current?.innerText ?? "");

    setCopied(true);

    const copiedTimeoutId = window.setTimeout(() => {
      setCopied(false);
    }, copiedDelay);

    return () => {
      clearTimeout(copiedTimeoutId);
    };
  };

  return (
    <div className="not-prose flex flex-col overflow-hidden rounded-lg ring ring-foreground/15">
      <div className="flex items-center justify-between border-b border-foreground/15 p-1">
        <span className="ms-2 font-mono text-sm text-foreground/75">
          {language}
        </span>
        <button
          type="button"
          className="flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-sm text-foreground/75 outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:bg-foreground/5 focus-visible:text-foreground active:bg-foreground/10 active:text-foreground"
          onClick={handleCopyButtonClick}
        >
          <span
            className={
              copied ? "i-lucide:check text-base" : "i-lucide:copy text-base"
            }
          />
          <span>{copied ? t("copied") : t("copy")}</span>
        </button>
      </div>
      <pre
        ref={ref}
        tabIndex={tabindex}
        className={cx(
          [
            "shiki p-3 text-sm",
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
