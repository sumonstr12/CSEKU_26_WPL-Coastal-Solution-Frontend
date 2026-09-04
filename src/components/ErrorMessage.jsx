import { CircleAlert } from "lucide-react";
import { classNames } from "@/lib/utils";
export default function ErrorMessage({ message, className }) {
  if (!message) return null;
  return (
    <p
      className={classNames(
        "mt-1.5 flex items-start gap-1.5 text-[12.5px] font-medium text-red-700",
        className,
      )}
      role="alert"
    >
      <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
