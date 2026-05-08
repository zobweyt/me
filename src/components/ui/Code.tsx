import { ScrollArea } from "@base-ui/react";
import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { TextMorph } from "torph/react";
import { useWebHaptics } from "web-haptics/react";
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
  const haptics = useWebHaptics();

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
      haptics.trigger("success");

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
    <div className="not-prose flex flex-col overflow-hidden rounded-xl border border-foreground/5">
      <div className="flex items-center justify-between border-b w-full bg-surface/50 flex-1 py-1 border-foreground/5 text-foreground/50 px-1">
        <span className="text-sm ps-3">
          {(props as { "data-language": string })["data-language"]}
        </span>
        <button
          type="button"
          className={cx(
            "flex items-center select-none justify-center motion-safe:transition-all text-sm cursor-pointer motion-safe:duration-150 justify-center gap-0.5 rounded-lg p-1 outline-none",
            "@hover:bg-foreground/5 focus-visible:bg-foreground/5 active:!bg-foreground/10",
            "focus-visible:text-foreground/75 @hover:text-foreground/75 active:text-foreground/75",
            copied && "!text-success",
          )}
          onClick={handleCopyButtonClick}
          aria-label={copied ? t("copied") : t("copy")}
        >
          <span className="relative text-lg block size-5">
            <span
              className={cx(
                "i-f7:doc-on-clipboard absolute inset-0 motion-safe:transition-transform motion-safe:duration-250",
                copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
              )}
            />
            <span
              className={cx(
                "i-f7:checkmark absolute inset-0 motion-safe:transition-transform motion-safe:duration-250",
                copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )}
            />
          </span>
          <TextMorph locale={currentLocale}>
            {copied ? t("copied") : t("copy")}
          </TextMorph>
        </button>
      </div>
      <ScrollArea.Root className="bg-body">
        <ScrollArea.Viewport
          render={<pre ref={ref} {...props} />}
          tabIndex={tabindex}
          className={cx(
            [
              "p-4 text-sm focus-visible:outline-foreground/25!",
              "bg-body! [&_span]:bg-body! rounded-b-xl! outline-transparent! outline outline-2 -outline-offset-2 focus-visible:outline-selection! rounded-t-0!",
              "dark:text-[var(--shiki-dark)]! dark:[&_span]:text-[var(--shiki-dark)]!",
            ],
            className,
          )}
        />
      </ScrollArea.Root>
    </div>
  );
}
