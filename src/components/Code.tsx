import { useRef, useState } from "react";
import { useTranslations } from "@i18n";

export type CodeProps = React.ComponentProps<"pre"> & {
  "data-language"?: string;
  copiedDelay?: number;
  currentLocale: string | undefined;
};

export default function Code({ "data-language": language, copiedDelay = 1500, currentLocale, ...props }: CodeProps) {
  const ref = useRef<HTMLPreElement>(null);
  const t = useTranslations(currentLocale);
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
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
          <span>{copied ? t("copied") : t("copy")}</span>
        </button>
      </div>
      <pre ref={ref} className="p-3 text-sm" {...props} />
    </div>
  );
}
