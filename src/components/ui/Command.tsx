import { Command } from "cmdk-base";
import * as Dialog from "./Dialog";

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
      className={[
        "overflow-hidden p-0! max-sm:size-full max-sm:max-w-full max-sm:rounded-none sm:top-16 sm:translate-y-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <Dialog.Header className="sr-only">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>

      <Command
        className={[
          "flex size-full flex-col overflow-hidden p-0 sm:max-h-[calc(100dvh-6rem)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
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
    <div className="relative max-sm:rounded-full max-sm:bg-surface/50 bg-transparent flex h-10 sm:h-9 w-full items-center justify-center select-none max-sm:(border border-foreground/15 backdrop-blur-2xl) @hover:max-sm:bg-surface max-sm:active:!bg-surface max-sm:active:(translate-y-px scale-[0.99])">
      {before}

      <Command.Input
        className={[
          "size-full p-2 outline-hidden placeholder:text-foreground/50",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
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
      className={[
        "scroll-pt-10.5 scroll-pb-10.5 pb-1.5 overflow-x-hidden overflow-y-auto outline-none sm:max-h-91.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export const Empty = ({
  className,
  ...props
}: React.ComponentProps<typeof Command.Empty>) => {
  return (
    <Command.Empty
      className={[
        "flex items-center justify-center text-center px-4 py-8 sm:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      className={[
        "[&_[cmdk-group-heading]]:w-full [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground/75 [&_[cmdk-group-heading]]:select-none [&_[cmdk-group-items]]:px-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      className={[
        "flex min-w-0 cursor-pointer items-center justify-start gap-2 truncate rounded-lg px-2 py-1.5 outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [@media(pointer:fine)]:data-[selected=true]:bg-surface active:bg-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export const Trigger = Dialog.Trigger;
export const Close = Dialog.Close;
