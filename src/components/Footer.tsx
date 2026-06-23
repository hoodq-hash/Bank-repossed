"use client";

import React from "react";
import Image from "next/image";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { useSitePhone } from "@/components/SitePhoneProvider";

export default function Footer() {
  const { phone } = useSitePhone();
  return (
    <footer className="mt-auto border-t border-stone-300 bg-[#f4f1ea] text-stone-900">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-stone-300 pb-12 md:grid-cols-12 md:gap-10 md:pb-14">
          <div className="md:col-span-5">
            <Link href="/" className="relative mb-5 block h-12 w-[200px]" aria-label="Bank Repossessed Cars home">
              <Image
                src="/bklogo.png"
                alt="Bank Repossessed Cars"
                fill
                className="object-contain object-left"
                sizes="200px"
              />
            </Link>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
              Bank Repossessed Cars
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600">
              Lender-recovered vehicles at straightforward prices. Browse repo
              inventory online and buy with confidence.
            </p>
          </div>

          <div className="md:col-span-7">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Subscribe to our newsletter
            </h4>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="min-h-12 flex-1 border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-[#f4f1ea]"
              />
              <button
                type="button"
                className="min-h-12 border border-stone-300 bg-emerald-600 px-8 text-sm font-bold text-white transition-colors hover:bg-emerald-500"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="border-b border-stone-300 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Contact information
            </h3>
            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href="/contact"
                  className="inline-flex items-center border border-transparent px-1 py-1 text-sm font-semibold text-stone-800 underline decoration-2 underline-offset-4 hover:border-stone-300 hover:no-underline"
                >
                  <MessageCircle size={18} className="mr-2 shrink-0 text-stone-600" />
                  Text us
                </a>
              </li>
              <li>
                <a
                  href={phone.href}
                  className="inline-flex items-center border border-transparent px-1 py-1 text-sm font-semibold text-stone-800 underline decoration-2 underline-offset-4 hover:border-stone-300 hover:no-underline"
                >
                  <Phone size={18} className="mr-2 shrink-0 text-stone-600" />
                  {phone.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-start border border-transparent px-1 py-1 text-sm font-semibold text-stone-800 underline decoration-2 underline-offset-4 hover:border-stone-300 hover:no-underline"
                >
                  <Mail size={18} className="mr-2 mt-0.5 shrink-0 text-stone-600" />
                  <span className="break-all font-mono text-xs font-normal sm:text-sm">
                    {SITE.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="border-b border-stone-300 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Business hours &amp; contact
            </h3>
            <ul className="mt-6 space-y-5">
              <li className="flex gap-3">
                <Clock size={20} className="mt-0.5 shrink-0 text-emerald-700" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Mon–Fri
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-stone-900">
                      8AM – 6PM
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Sat
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-stone-900">
                      9AM – 4PM
                    </p>
                  </div>
                </div>
              </li>
              <li className="flex gap-3 border-t border-stone-300 pt-5">
                <MapPin size={20} className="mt-0.5 shrink-0 text-emerald-700" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Headquarters
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    {SITE.headquarters.full}
                  </p>
                  <a
                    href={SITE.headquarters.mapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4"
                  >
                    Directions
                  </a>
                  <a
                    href={phone.href}
                    className="mt-2 block font-mono text-sm font-semibold text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800"
                  >
                    {phone.display}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-300 pt-8">
          <p className="text-center font-mono text-xs text-stone-500 md:text-left">
            © 2026 {SITE.name}.{" "}
            <a
              href={SITE.url}
              className="font-semibold text-stone-700 underline decoration-1 underline-offset-2 hover:text-emerald-800"
            >
              {SITE.domain}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
