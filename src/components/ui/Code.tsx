import { ScrollArea } from "@base-ui/react";
import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { getTranslator } from "@/lib/i18n";
import { Button } from "./Button";

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
    <ScrollArea.Root className="not-prose rounded-xl relative bg-body border border-foreground/5">
      <Button
        className={cx(
          "bg-inherit backdrop-blur-xl absolute top-1.5 right-1.5 z-1 rounded-md p-1",
          copied && "!text-success",
        )}
        variant="ghost"
        onClick={handleCopyButtonClick}
        aria-label={copied ? t("copied") : t("copy")}
      >
        <span className="relative text-lg block size-5">
          <span
            className={cx(
              "i-f7:doc-on-clipboard absolute inset-0 motion-safe:transition-all motion-safe:duration-250",
              copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
            )}
          />
          <span
            className={cx(
              "i-f7:checkmark absolute inset-0 motion-safe:transition-all motion-safe:duration-250",
              copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
          />
        </span>
      </Button>
      <ScrollArea.Viewport
        render={<pre ref={ref} {...props} />}
        tabIndex={tabindex}
        className={cx(
          [
            "p-4 text-sm bg-body! focus-visible:outline-foreground/25!",
            "bg-body! [&_span]:bg-body! rounded-inherit outline-transparent! outline outline-3! -outline-offset-3 focus-visible:outline-selection!",
            "dark:text-[var(--shiki-dark)]! dark:[&_span]:text-[var(--shiki-dark)]!",
          ],
          className,
        )}
      />
    </ScrollArea.Root>
  );
}
