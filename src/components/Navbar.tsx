"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Car,
  Info,
  Phone,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", key: "home", label: "Home", icon: ShoppingBag },
  { href: "/shop", key: "shop", label: "Inventory", icon: Car },
  { href: "/about", key: "about", label: "About", icon: Info },
  { href: "/testimonials", key: "testimonials", label: "Reviews", icon: Star },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (pathname === "/" || pathname === "/") setActiveTab("home");
    else if (pathname === "/shop") setActiveTab("shop");
    else if (pathname === "/about") setActiveTab("about");
    else if (pathname === "/contact") setActiveTab("contact");
    else if (pathname === "/testimonials") setActiveTab("testimonials");
    else setActiveTab("");
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase =
    "flex items-center gap-2 rounded-none border border-stone-300 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-stone-300 bg-[#f4f1ea] transition-[box-shadow,background-color] duration-200 ${
        scrolled ? "shadow-[0_6px_24px_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 outline-none ring-emerald-600/0 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea]"
          aria-label="Bank Repossessed Cars home"
        >
          <span className="relative block h-14 w-[160px] shrink-0 sm:h-16 sm:w-[180px]">
            <Image
              src="/bklogo.png"
              alt="Bank Repossessed Cars"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 160px, 180px"
              priority
            />
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main"
        >
          {navItems.map(({ href, key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <Link
                key={key}
                href={href}
                className={`${linkBase} ${
                  isActive
                    ? "bg-stone-900 text-[#f4f1ea]"
                    : "bg-white text-stone-900 hover:bg-stone-200"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="ml-1 flex items-center gap-2 rounded-none border border-stone-300 bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_0_rgba(28,25,23,0.15)] transition hover:bg-emerald-500"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            Contact
          </Link>
        </nav>

        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="rounded-none border border-stone-300 bg-white p-2.5 text-stone-900 transition hover:bg-stone-200"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-stone-300 bg-[#f4f1ea] px-3 py-3 lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 border border-stone-300 bg-white p-2">
            {navItems.map(({ href, key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`flex w-full items-center gap-3 border border-stone-300 px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-stone-900 text-[#f4f1ea]"
                      : "bg-white text-stone-900 hover:bg-stone-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="mt-1 flex w-full items-center justify-center gap-2 border border-stone-300 bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="h-4 w-4" />
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
