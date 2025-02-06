import { toast } from "@/hooks/use-toast";

export function showDestructiveToast({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  toast({
    variant: "destructive",
    title: title,
    description: description,
    className: "bg-black border border-red-500 text-red-500",
    duration: 2500,
  });
}

export function showSuccessToast({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  toast({
    title: title,
    description: description,
    className: "bg-black border border-tec-yellow text-tec-yellow",
    duration: 2500,
  });
}
