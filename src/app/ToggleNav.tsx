import Link from "next/link";

export default function ToggleNav({
  leftHref = "/home",
  rightHref = "/profile/edit",
  leftLabel = "Home",
  rightLabel = "Edit Profile",
}: {
  leftHref?: string;
  rightHref?: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="flex w-full max-w-xs mx-auto rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden text-sm font-medium">
      <Link
        href={leftHref}
        className="flex-1 py-3 text-center transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-200 dark:focus:bg-gray-700"
        style={{ borderRight: "1px solid #e5e7eb" }}
      >
        {leftLabel}
      </Link>
      <Link
        href={rightHref}
        className="flex-1 py-3 text-center transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-200 dark:focus:bg-gray-700"
      >
        {rightLabel}
      </Link>
    </div>
  );
} 