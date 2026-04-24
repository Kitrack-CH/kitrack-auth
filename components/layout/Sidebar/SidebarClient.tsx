"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SidebarClient() {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.getElementById("kitrack-sidebar");
    if (!el) return;

    const setAriaExpanded = (collapsed: boolean) => {
      el.setAttribute("aria-expanded", collapsed ? "false" : "true");
    };

    try {
      const saved = localStorage.getItem("sidebar:collapsed");
      if (saved === "true" || saved === "false") {
        el.setAttribute("data-collapsed", saved);
        setAriaExpanded(saved === "true");
      } else {
        if (window.matchMedia("(max-width: 767px)").matches) {
          el.setAttribute("data-collapsed", "true");
          setAriaExpanded(true);
        } else {
          const collapsed = el.getAttribute("data-collapsed") === "true";
          el.setAttribute("data-collapsed", collapsed ? "true" : "false");
          setAriaExpanded(collapsed);
        }
      }
    } catch { /* no-op */ }

    const markActive = () => {
      const links = document.querySelectorAll<HTMLAnchorElement>("[data-sidebar-link]");
      const normalize = (u: string) => {
        try {
          const url = new URL(u, window.location.origin);
          return (url.pathname || "/").replace(/\/$/, "") || "/";
        } catch { return (u || "/").replace(/\/$/, "") || "/"; }
      };
      const current = normalize(window.location.href);
      links.forEach((a) => {
        if (a.closest("[data-no-active]")) return;
        let linkPath = normalize(a.href);
        if (linkPath === "") linkPath = "/";
        const active = current === linkPath || (linkPath !== "/" && current.startsWith(linkPath));
        a.setAttribute("data-active", active ? "true" : "false");
        if (active) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    };

    const setCollapsed = (val: boolean) => {
      el.setAttribute("data-collapsed", val ? "true" : "false");
      setAriaExpanded(val);
      try { localStorage.setItem("sidebar:collapsed", val ? "true" : "false"); } catch { /* no-op */ }
      markActive();
    };

    const toggle = () => setCollapsed(el.getAttribute("data-collapsed") === "true" ? false : true);

    const onClick = (ev: MouseEvent) => {
      const btn = (ev.target as Element | null)?.closest("#sidebar-toggle");
      if (btn) { ev.preventDefault(); toggle(); }
    };
    document.addEventListener("click", onClick);

    const onKey = (ev: KeyboardEvent) => {
      if ((ev.altKey && (ev.key === "s" || ev.key === "S")) || ev.key === "/") {
        const t = ev.target as Element | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || (t as HTMLElement).isContentEditable)) return;
        ev.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);

    markActive();

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [pathname]);

  return null;
}
