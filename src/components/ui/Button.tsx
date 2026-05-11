import { Button as BaseButton } from "@base-ui/react";
import { type VariantProps, cva } from "class-variance-authority";

const buttonStyles = cva("", {
  variants: {
    variant: {
      default:
        "flex select-none w-fit cursor-pointer items-center justify-center gap-1 rounded-full border border-foreground/15 bg-surface/50 px-2 py-1.5 text-sm leading-none motion-safe:transition outline-none @hover:bg-surface focus-visible:bg-surface active:(translate-y-px scale-[0.99] !bg-surface)",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

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
