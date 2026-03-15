import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";
import { cx } from "class-variance-authority";

export const Dialog = ({ ...props }: React.ComponentProps<typeof Root>) => {
  return <Root {...props} />;
};

export const DialogTrigger = ({
  ...props
}: React.ComponentProps<typeof Trigger>) => {
  return <Trigger {...props} />;
};

export const DialogPortal = ({
  ...props
}: React.ComponentProps<typeof Portal>) => {
  return <Portal {...props} />;
};

export const DialogClose = ({
  ...props
}: React.ComponentProps<typeof Close>) => {
  return <Close {...props} />;
};

export const DialogOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof Overlay>) => {
  return (
    <Overlay
      className={cx(
        "fixed inset-0 z-50 bg-black opacity-50 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 max-sm:hidden sm:data-[state=closed]:animate-out sm:data-[state=open]:animate-in",
        className,
      )}
      {...props}
    />
  );
};

export const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Content>) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <Content
        className={cx(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl bg-body p-6 shadow-xl data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-6 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-4 sm:max-w-lg sm:border sm:border-foreground/15 sm:data-[state=closed]:animate-out sm:data-[state=open]:animate-in",
          className,
        )}
        {...props}
      >
        {children}
      </Content>
    </DialogPortal>
  );
};

export const DialogHeader = ({
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

export const DialogFooter = ({
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

export const DialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof Title>) => {
  return (
    <Title
      className={cx("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
};

export const DialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof Description>) => {
  return (
    <Description className={cx("text-sm opacity-75", className)} {...props} />
  );
};
