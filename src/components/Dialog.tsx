import { Close, Content, Description, Overlay, Portal, Root, Title, Trigger } from "@radix-ui/react-dialog";

import { cn } from "@/lib/cn";

export const Dialog = ({ ...props }: React.ComponentProps<typeof Root>) => {
  return <Root {...props} />;
};

export const DialogTrigger = ({ ...props }: React.ComponentProps<typeof Trigger>) => {
  return <Trigger {...props} />;
};

export const DialogPortal = ({ ...props }: React.ComponentProps<typeof Portal>) => {
  return <Portal {...props} />;
};

export const DialogClose = ({ ...props }: React.ComponentProps<typeof Close>) => {
  return <Close {...props} />;
};

export const DialogOverlay = ({ className, ...props }: React.ComponentProps<typeof Overlay>) => {
  return (
    <Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 max-sm:hidden sm:data-[state=closed]:animate-out sm:data-[state=open]:animate-in",
        className,
      )}
      {...props}
    />
  );
};

export const DialogContent = ({ className, children, ...props }: React.ComponentProps<typeof Content>) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <Content
        className={cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl bg-stone-100 p-6 shadow data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-4 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-4 sm:max-w-lg sm:border sm:border-black/15 sm:data-[state=closed]:animate-out sm:data-[state=open]:animate-in",
          className,
        )}
        {...props}
      >
        {children}
      </Content>
    </DialogPortal>
  );
};

export const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />;
};

export const DialogFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
};

export const DialogTitle = ({ className, ...props }: React.ComponentProps<typeof Title>) => {
  return <Title className={cn("text-lg leading-none font-semibold", className)} {...props} />;
};

export const DialogDescription = ({ className, ...props }: React.ComponentProps<typeof Description>) => {
  return <Description className={cn("text-sm opacity-75", className)} {...props} />;
};
