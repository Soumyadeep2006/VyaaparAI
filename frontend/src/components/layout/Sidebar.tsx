import { navigation } from "../../constants/navigation";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-surface shadow-sm lg:flex">

      {/* Logo */}

      <div className="flex h-20 items-center border-b border-border px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow">
            V
          </div>

          <div>
            <h1 className="text-xl font-bold text-primary">
              VyaparAI
            </h1>

            <p className="text-xs text-text-secondary">
              Business Operating System
            </p>
          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">

        {navigation.map((item) => (
          <SidebarItem
            key={item.href}
            name={item.name}
            href={item.href}
            icon={item.icon}
          />
        ))}

      </nav>

      {/* Assistant */}

      <div className="border-t border-border p-5">

        <div className="rounded-xl bg-surface-2 p-4">

          <h3 className="font-semibold text-text-primary">
            VyaparAI Assistant
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            Ask anything about your business.
          </p>

        </div>

      </div>

    </aside>
  );
}