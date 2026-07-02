import { Tabs as BaseTabs, mergeProps } from "@base-ui/react";
import { useState } from "react";

export const Root = BaseTabs.Root;
export const List = BaseTabs.List;
export const Panel = BaseTabs.Panel;
export const Indicator = BaseTabs.Indicator;

export interface TabsTabProps extends BaseTabs.Tab.Props {}

export function Tab(props: TabsTabProps) {
  const [tabFocusSource, setTabFocusSource] = useState<"mouse" | null>(null);

  const mergedProps = mergeProps<typeof Tab>(
    {
      value: props.value,
      onMouseDown: () => {
        setTabFocusSource("mouse");
      },
      onFocus: (event) => {
        if (tabFocusSource !== "mouse") {
          event.currentTarget.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
        setTabFocusSource(null);
      },
      onClick: (event) => {
        event.currentTarget.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      },
      className:
        "flex cursor-pointer items-center text-sm justify-center px-2.5 py-1 font-medium text-foreground/75 bg-surface @hover:(text-foreground bg-foreground/10) active:(text-foreground bg-foreground/15 translate-y-px scale-[0.99]) hover:active:(text-foreground bg-foreground/15 translate-y-px scale-[0.99]) rounded-full select-none focus-visible:(outline-3 outline-offset-2 outline-accent) motion-safe:transition data-[active]:(text-body! bg-foreground!)",
    },
    props,
  );

  return <BaseTabs.Tab {...mergedProps} />;
}

export declare namespace Tab {
  type Props = TabsTabProps;
  type ActivationDirection = BaseTabs.Tab.ActivationDirection;
  type Metadata = BaseTabs.Tab.Metadata;
  type Position = BaseTabs.Tab.Position;
  type Size = BaseTabs.Tab.Size;
  type State = BaseTabs.Tab.State;
  type Value = BaseTabs.Tab.Value;
}
