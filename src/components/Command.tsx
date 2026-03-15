import { cx } from "class-variance-authority";
import { Command } from "cmdk-base";
import * as Dialog from "@/components/Dialog";

export const Root = ({
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Root>) => {
  return <Dialog.Root {...props}>{children}</Dialog.Root>;
};

export const Popup = ({
  title,
  description,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Popup> & {
  title: string;
  description: string;
}) => {
  return (
    <Dialog.Popup
      className={cx(
        "overflow-hidden p-0! max-sm:size-full max-sm:max-w-full max-sm:rounded-none sm:top-16 sm:translate-y-0",
        className,
      )}
      {...props}
    >
      <Dialog.Header className="sr-only">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>

      <Command
        className={cx(
          "flex size-full flex-col overflow-hidden p-0 sm:max-h-[calc(100dvh-6rem)]",
          className,
        )}
        filter={(value, search, keywords) =>
          value.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          (keywords?.some((word) =>
            word.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
          ) ??
            false)
            ? 1
            : 0
        }
        loop
      >
        {children}
      </Command>
    </Dialog.Popup>
  );
};

export const Input = ({
  before,
  after,
  className,
  ...props
}: React.ComponentProps<typeof Command.Input> & {
  before?: React.ReactNode;
  after?: React.ReactNode;
}) => {
  return (
    <div className="relative flex h-9 w-full items-center justify-center rounded-lg select-none">
      {before}

      <Command.Input
        className={cx(
          "size-full p-2 outline-hidden placeholder:text-foreground/50",
          className,
        )}
        {...props}
      />

      {after}
    </div>
  );
};

export const List = ({
  className,
  ...props
}: React.ComponentProps<typeof Command.List>) => {
  return (
    <Command.List
      className={cx(
        "scroll-pt-10 scroll-pb-1.5 overflow-x-hidden overflow-y-auto pb-1.5 outline-none sm:max-h-92.25",
        className,
      )}
      {...props}
    />
  );
};

export const Empty = ({
  ...props
}: React.ComponentProps<typeof Command.Empty>) => {
  return (
    <Command.Empty
      className="flex h-18.25 items-end justify-center pb-1.5 text-current/75"
      {...props}
    />
  );
};

export const Group = ({
  className,
  ...props
}: React.ComponentProps<typeof Command.Group>) => {
  return (
    <Command.Group
      className={cx(
        "relative isolate [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:w-full [&_[cmdk-group-heading]]:bg-body [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground/75 [&_[cmdk-group-heading]]:select-none [&_[cmdk-group-items]]:px-3 [&_[cmdk-group-items]]:pt-px",
        className,
      )}
      {...props}
    />
  );
};

export const Item = ({
  className,
  ...props
}: React.ComponentProps<typeof Command.Item>) => {
  return (
    <Command.Item
      className={cx(
        "flex min-w-0 cursor-pointer items-center justify-start gap-2 truncate rounded-lg px-2 py-1.5 outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-surface",
        className,
      )}
      {...props}
    />
  );
};

export const Trigger = Dialog.Trigger;
export const Close = Dialog.Close;
