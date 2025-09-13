import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dialog";
import { cn } from "@/lib/cn";
import { Command } from "cmdk";

export const CommandDialog = ({
  title,
  description,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title: string;
  description: string;
}) => {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {children}
    </Dialog>
  );
};

export const CommandDialogContent = ({ children, className, ...props }: React.ComponentProps<typeof DialogContent>) => {
  return (
    <DialogContent className={cn("top-1/7 -translate-y-1/7 overflow-hidden p-0", className)} {...props}>
      <Command
        className={cn("flex h-full w-full flex-col overflow-hidden rounded-md", className)}
        filter={(value, search) => (value.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ? 1 : 0)}
        loop
      >
        {children}
      </Command>
    </DialogContent>
  );
};

export const CommandInput = ({ className, ...props }: React.ComponentProps<typeof Command.Input>) => {
  return (
    <Command.Input
      className={cn(
        "m-2 flex rounded-lg bg-stone-200 px-2 py-1.5 ring ring-black/15 outline-hidden placeholder:text-black/75 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};

export const CommandList = ({ className, ...props }: React.ComponentProps<typeof Command.List>) => {
  return (
    <Command.List
      className={cn("h-80 scroll-py-2 overflow-x-hidden overflow-y-auto outline-none", className)}
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
        "p-2 [&_[cmdk-group-heading]]:mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:opacity-75",
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
        "flex min-w-0 cursor-pointer items-center gap-2 truncate rounded-lg px-2 py-1.5 outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-stone-200 data-[selected=true]:ring data-[selected=true]:ring-black/15",
        className,
      )}
      {...props}
    />
  );
};
