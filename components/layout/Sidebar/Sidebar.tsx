import Link from "next/link";
import clsx from "clsx";
import {
  LayoutDashboard,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import SidebarClient from "./SidebarClient";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: <LayoutDashboard className="size-5" /> },
  { href: "/profile", label: "Profil", icon: <User className="size-5" /> },
  { href: "/company", label: "Société", icon: <Building2 className="size-5" /> },
];

const linkBase = clsx(
  "relative flex items-center gap-3 px-3 h-10 outline-none rounded-none transition-colors"
);

type SidebarProps = {
  signOutAction: () => Promise<void>;
};

export default function Sidebar({ signOutAction }: SidebarProps) {
  return (
    <aside
      id="kitrack-sidebar"
      suppressHydrationWarning
      role="navigation"
      aria-label="Navigation principale"
      data-collapsed="false"
      className={clsx(
        "sticky top-0 h-dvh border-r flex flex-col",
        "transition-[width] duration-200 ease-in-out",
        "w-64 data-[collapsed=true]:w-16",
        "bg-[var(--surface-0)] text-[var(--text-secondary)] border-[var(--border-default)]"
      )}
    >
      {/* Branding */}
      <div className="flex items-center h-14 px-4 border-b border-[var(--border-default)]">
        <Link
          href="/dashboard"
          data-no-active
          className="flex items-center gap-2.5 rounded-lg px-1 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-kitrack-blue)]"
        >
          <span className="flex items-center justify-center size-6 rounded bg-[var(--color-kitrack-blue)] text-white text-xs font-bold shrink-0">
            K
          </span>
          <span className="sidebar-label font-semibold text-[var(--text-primary)] truncate tracking-wide">
            KITRACK
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="p-2 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                title={item.label}
                data-sidebar-link
                className={linkBase}
              >
                <span className="shrink-0 size-5" aria-hidden>{item.icon}</span>
                <span className="sidebar-label truncate font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-[var(--border-default)]">
        <form action={signOutAction} data-no-active>
          <button
            type="submit"
            title="Déconnexion"
            className="w-full sidebar-logout relative flex items-center gap-3 px-3 h-10 outline-none rounded-none text-left"
          >
            <span className="shrink-0 size-5" aria-hidden><LogOut className="size-5" /></span>
            <span className="sidebar-label truncate font-medium">Déconnexion</span>
          </button>
        </form>

        <button
          id="sidebar-toggle"
          type="button"
          aria-label="Réduire / agrandir le menu"
          title="Alt+S"
          className="w-full h-10 flex items-center justify-center rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-kitrack-blue)]"
        >
          <span className="show-when-expanded inline-flex items-center">
            <ChevronLeft className="size-5" aria-hidden />
          </span>
          <span className="show-when-collapsed hidden items-center">
            <ChevronRight className="size-5" aria-hidden />
          </span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
#kitrack-sidebar a[data-sidebar-link] { color: var(--text-secondary); text-decoration: none; }
#kitrack-sidebar a[data-sidebar-link]:hover { background-color: var(--surface-2); }
#kitrack-sidebar a[data-active="true"],
#kitrack-sidebar a[aria-current="page"] {
  background-color: var(--surface-2);
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
}
#kitrack-sidebar a[data-active="true"]::before,
#kitrack-sidebar a[aria-current="page"]::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background-color: var(--focus-ring);
}
#kitrack-sidebar .sidebar-logout { color: var(--color-kitrack-orangeDark); }
#kitrack-sidebar .sidebar-logout:hover { background-color: var(--surface-2); }
#kitrack-sidebar[data-collapsed="true"] .sidebar-label { display: none; }
#kitrack-sidebar .show-when-collapsed { display: none; }
#kitrack-sidebar[data-collapsed="true"] .show-when-collapsed { display: inline-flex; }
#kitrack-sidebar[data-collapsed="true"] .show-when-expanded { display: none; }
      ` }} />

      <SidebarClient />
    </aside>
  );
}
