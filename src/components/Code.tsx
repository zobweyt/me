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
    <div className="not-prose flex flex-col overflow-hidden rounded-lg ring ring-black/15">
      <div className="flex items-center justify-between border-b border-black/15 p-1">
        <span className="ms-2 font-mono text-sm text-black/75">{language}</span>
        <button
          type="button"
          className="flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-sm text-black/75 outline-none hover:bg-black/5 hover:text-black focus-visible:bg-black/5 focus-visible:text-black active:bg-black/10 active:text-black"
          onClick={handleCopyButtonClick}
        >
          {copied ? <IconLucideCheck className="size-4 shrink-0" /> : <IconLucideCopy className="size-4 shrink-0" />}
          <span>{copied ? t("copied") : t("copy")}</span>
        </button>
      </div>
      <pre ref={ref} tabIndex={tabindex} className="p-3 text-sm" {...props} />
    </div>
  );
}
