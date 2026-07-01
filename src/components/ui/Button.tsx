import { Button as BaseButton } from "@base-ui/react";

const variants = {
  default:
    "rounded-full border border-foreground/15 bg-surface/50 px-2 py-1.5 @hover:bg-surface active:!bg-surface",
  ghost:
    "text-current/50 @hover:(bg-foreground/5 text-foreground/75) active:(!bg-foreground/10 text-foreground/75)",
};

interface ButtonProps extends BaseButton.Props {
  variant?: keyof typeof variants;
}

interface ButtonState extends BaseButton.State {}

export function Button({
  variant = "default",
  className,
  ...otherProps
}: ButtonProps) {
  return (
    <BaseButton
      className={[
        "flex items-center justify-center gap-1 w-fit select-none cursor-pointer text-sm leading-none motion-safe:transition focus-visible:(outline-3 outline-offset-2 outline-selection bg-surface) active:(translate-y-px scale-[0.99])",
        variants[variant],
        className,
      ].join(" ")}
      {...otherProps}
    />
  );
}

export declare namespace Button {
  type State = ButtonState;
  type Props = ButtonProps;
}
