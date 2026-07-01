export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: boolean;
}

export default function Link({
  underline = true,
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      className={[
        "inline-flex items-center text-current/75 decoration-current/15 outline-none select-none",
        "motion-safe:(transition duration-300 ease-in-out)",
        "@hover:(text-current decoration-current/50)",
        "focus-visible:(text-current decoration-current/50)",
        "active:(text-current! decoration-current/75!)",
        "data-[current=true]:(text-current! decoration-current/75!)",
        underline && "underline underline-offset-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </a>
  );
}
