import { type VariantProps, cva } from "class-variance-authority";

const styles = cva(
  [
    "inline-flex items-center text-current/75 decoration-current/15 outline-none select-none",
    "motion-safe:(transition duration-300 ease-in-out)",
    "@hover:(text-current decoration-current/50)",
    "focus-visible:(text-current decoration-current/50)",
    "active:(text-current! decoration-current/75!)",
    "data-[current=true]:(text-current! decoration-current/75!)",
  ],
  {
    variants: {
      underline: {
        true: "underline underline-offset-3",
      },
    },
    defaultVariants: {
      underline: true,
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof styles> {}

export default function Link({
  underline,
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <a className={styles({ underline, className })} {...props}>
      {children}
    </a>
  );
}
