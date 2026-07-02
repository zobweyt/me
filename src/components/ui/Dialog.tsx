import { Dialog as Base } from "@base-ui/react/dialog";

export const Root = ({ ...props }: Base.Root.Props) => {
  return <Base.Root {...props} />;
};

export const Trigger = ({ ...props }: Base.Trigger.Props) => {
  return <Base.Trigger {...props} />;
};

export const Close = ({ ...props }: Base.Close.Props) => {
  return <Base.Close {...props} />;
};

export const Popup = ({ className, children, ...props }: Base.Popup.Props) => {
  return (
    <Base.Portal>
      <Base.Backdrop className="fixed inset-0 min-h-dvh backdrop-blur-[1px] bg-black/25 dark:bg-black/50 motion-safe:transition-[background-color,backdrop-filter] motion-safe:duration-150 z-50 data-[ending-style]:backdrop-blur-[0px] data-[ending-style]:bg-black/0! data-[starting-style]:backdrop-blur-[0px] data-[starting-style]:bg-black/0! supports-[-webkit-touch-callout:none]:absolute max-sm:hidden" />
      <Base.Popup
        className={[
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl sm:bg-body/85 sm:dark:bg-body/65 max-sm:bg-body sm:backdrop-blur-xl p-6 shadow-xl sm:max-w-lg sm:border sm:border-foreground/5 motion-safe:transition-all motion-safe:duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 max-sm:duration-0",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </Base.Popup>
    </Base.Portal>
  );
};

export const Header = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={["flex flex-col gap-2 text-center sm:text-left", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export const Footer = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={[
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export const Title = ({ className, ...props }: Base.Title.Props) => {
  return (
    <Base.Title
      className={["text-lg leading-none font-semibold", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export const Description = ({
  className,
  ...props
}: Base.Description.Props) => {
  return (
    <Base.Description
      className={["text-sm opacity-75", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
};
