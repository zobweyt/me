import { ScrollArea } from "@base-ui/react";
import { useRef } from "react";

export type CodeProps = React.ComponentProps<"pre"> & {
  tabindex?: number | undefined;
};

export default function Code({ tabindex, className, ...props }: CodeProps) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <div className="not-prose rounded-xl border border-foreground/5 bg-body motion-safe:transition has-focus-visible:(outline-3 outline-offset-2 outline-selection)">
      <ScrollArea.Root className="w-full h-full rounded-[inherit]">
        <ScrollArea.Viewport
          render={<pre ref={ref} {...props} />}
          tabIndex={tabindex}
          className="p-4 text-sm rounded-inherit outline-none bg-body! [&_span]:bg-body! dark:text-[var(--shiki-dark)]! dark:[&_span]:text-[var(--shiki-dark)]!"
        />
      </ScrollArea.Root>
    </div>
  );
}
