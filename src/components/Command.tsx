import { Command } from "cmdk";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dialog";
import { cn } from "@/lib/cn";

export const CommandDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog>) => {
  return <Dialog {...props}>{children}</Dialog>;
};

export const CommandDialogContent = ({
  title,
  description,
  children,
  className,
  ...props
}: React.ComponentProps<typeof DialogContent> & {
  title: string;
  description: string;
}) => {
  return (
    <DialogContent
      className={cn(
        "overflow-hidden p-0 max-sm:size-full max-sm:max-w-full max-sm:rounded-none sm:top-1/7 sm:-translate-y-1/7",
        className,
      )}
      {...props}
    >
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <Command
        className={cn("flex size-full flex-col overflow-hidden p-0", className)}
        filter={(value, search, keywords) =>
          value.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          (keywords?.some((word) => word.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? false)
            ? 1
            : 0
        }
        loop
      >
        {children}
      </Command>
    </DialogContent>
  );
};

export const CommandInput = ({
  before,
  after,
  className,
  ...props
}: React.ComponentProps<typeof Command.Input> & { before?: React.ReactNode; after?: React.ReactNode }) => {
  return (
    <div className="relative flex h-9 w-full items-center justify-center rounded-lg bg-stone-200 ring ring-black/15 select-none">
      {before}

      <Command.Input className={cn("size-full p-2 outline-hidden placeholder:text-black/75", className)} {...props} />

      {after}
    </div>
  );
};

export const CommandList = ({ className, ...props }: React.ComponentProps<typeof Command.List>) => {
  return (
    <Command.List
      className={cn(
        "scroll-pt-[calc(1.5rem+1px)] scroll-pb-2 overflow-x-hidden overflow-y-auto outline-none sm:h-80",
        className,
      )}
      {...props}
    />
  );
};

export const CommandEmpty = ({ ...props }: React.ComponentProps<typeof Command.Empty>) => {
  return <Command.Empty className="py-6 text-center text-sm" {...props} />;
};

export const CommandGroup = ({ className, ...props }: React.ComponentProps<typeof Command.Group>) => {
  return (
    <Command.Group
      className={cn(
        "relative isolate pb-2 [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:w-full [&_[cmdk-group-heading]]:bg-stone-100 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-black/75 [&_[cmdk-group-heading]]:select-none [&_[cmdk-group-items]]:px-2 [&_[cmdk-group-items]]:pt-px",
        className,
      )}
      {...props}
    />
  );
};

export const CommandItem = ({ className, ...props }: React.ComponentProps<typeof Command.Item>) => {
  return (
    <Command.Item
      className={cn(
        "flex min-w-0 cursor-pointer items-center justify-start gap-2 truncate rounded-lg px-2 py-1.5 outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-stone-200 data-[selected=true]:ring data-[selected=true]:ring-black/15",
        className,
      )}
      {...props}
    />
  );
};
