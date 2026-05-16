import { Button as BaseButton } from "@base-ui/react";
import { type VariantProps, cva } from "class-variance-authority";

const buttonStyles = cva(
  [
    "flex items-center justify-center gap-1 w-fit select-none cursor-pointer text-sm leading-none",
    "motion-safe:transition",
    "focus-visible:(outline-3 outline-offset-2 outline-selection bg-surface)",
    "active:(translate-y-px scale-[0.99])",
  ],
  {
    variants: {
      variant: {
        default:
          "rounded-full border border-foreground/15 bg-surface/50 px-2 py-1.5 @hover:bg-surface active:!bg-surface",
        ghost:
          "text-current/50 @hover:(bg-foreground/5 text-foreground/75) active:(!bg-foreground/10 text-foreground/75)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ButtonProps
  extends BaseButton.Props,
    VariantProps<typeof buttonStyles> {}
interface ButtonState extends BaseButton.State {}

export function Button({ variant, className, ...otherProps }: ButtonProps) {
  return (
    <BaseButton
      className={buttonStyles({ variant, className })}
      {...otherProps}
    />
  );
}

export declare namespace Button {
  type State = ButtonState;
  type Props = ButtonProps;
}
