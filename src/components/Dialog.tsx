import { Dialog as Base } from "@base-ui/react/dialog";
import { cx } from "class-variance-authority";

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
      <Base.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-50 transition-all duration-150 z-50 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
      <Base.Popup
        className={cx(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl bg-body p-6 shadow-xl sm:max-w-lg sm:border sm:border-foreground/15 transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          className,
        )}
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
      className={cx("flex flex-col gap-2 text-center sm:text-left", className)}
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
      className={cx(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
};

export const Title = ({ className, ...props }: Base.Title.Props) => {
  return (
    <Base.Title
      className={cx("text-lg leading-none font-semibold", className)}
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
      className={cx("text-sm opacity-75", className)}
      {...props}
    />
  );
};
