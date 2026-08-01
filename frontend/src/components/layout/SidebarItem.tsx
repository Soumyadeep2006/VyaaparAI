import { NavLink } from "react-router-dom";
import clsx from "clsx";
import type { ComponentType } from "react";

interface SidebarItemProps {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export default function SidebarItem({
  name,
  href,
  icon: Icon,
}: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        clsx(
          "group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-white shadow-md"
            : "text-text-primary hover:bg-surface-2 hover:text-primary"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={clsx(
              "h-5 w-5 transition-colors duration-200",
              isActive
                ? "text-white"
                : "text-text-secondary group-hover:text-primary"
            )}
          />

          <span>{name}</span>
        </>
      )}
    </NavLink>
  );
}
