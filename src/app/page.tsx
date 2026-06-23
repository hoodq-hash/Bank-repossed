"use client";

import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Car,
  Shield,
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Headphones,
  CreditCard,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import FeaturedCars from "@/components/FeaturedCars";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";
import { useSitePhone } from "@/components/SitePhoneProvider";

const HERO_IMAGE = "/photo-1652992253402-15729d9b97fc.avif";

export default function Home() {
  const { phone } = useSitePhone();
  // Stats with animations
  const stats = [
    { value: "26,000+", label: "cars sold", icon: <Car size={24} /> },
    {
      value: "1,500+",
      label: "cars inspected monthly",
      icon: <Shield size={24} />,
    },
    {
      value: "Houston",
      label: "Texas headquarters",
      icon: <MapPin size={24} />,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Michael Johnson",
      role: "Business Owner",
      quote:
        "Bank Repossessed Cars made buying my new truck straightforward. Their team was professional and I found exactly what I was looking for at a strong price.",
      rating: 5,
      image: "/images/testimonial1.jpg",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Teacher",
      quote:
        "As a first-time car buyer, I was nervous about the process. The staff at Bank Repossessed Cars guided me through everything and I couldn't be happier with my purchase!",
      rating: 5,
      image: "/images/testimonial2.jpg",
    },
    {
      id: 3,
      name: "David ",
      role: "Sales Executive",
      quote:
        "I've purchased three vehicles from Bank Repossessed Cars over the years. Their selection, pricing, and customer service keep me coming back every time.",
      rating: 5,
      image: "/images/testimonial3.jpg",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 antialiased">
      <Navbar />

      <main className="flex-1">
        <section className="relative min-h-[22rem] overflow-hidden border-b border-stone-800 text-white sm:min-h-[26rem] md:min-h-[30rem]">
          <Image
            src={HERO_IMAGE}
            alt="Metallic red sports car in a dark studio"
            fill
            className="object-cover object-left"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-emerald-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
                Bank repossessed{" "}
                <span className="text-emerald-400">cars</span>
              </h1>
              <p className="mt-4 text-base text-stone-200 sm:text-lg">
                Browse inventory online, then get in touch when you find the
                right vehicle.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop">
                  <Button className="h-11 w-full rounded-md bg-emerald-500 px-6 font-semibold text-stone-950 hover:bg-emerald-400 sm:w-auto">
                    Browse inventory
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-md border-white/50 bg-black/20 px-6 font-semibold text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto"
                  >
                    Contact
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FeaturedCars />

        <section className="border-t border-stone-300 bg-amber-50/40 py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-12 lg:px-8 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                Process
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-stone-900 md:text-3xl">
                From search to keys—three straight steps.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-600 md:text-base">
                Browse online, compare vehicles, and complete your purchase with
                clear paperwork—no dealership games.
              </p>
            </div>
            <ol className="space-y-0 border-l border-stone-300 lg:col-span-8">
              {[
                {
                  n: "01",
                  title: "Browse inventory",
                  body: "Use filters to narrow by make, price, and location until the shortlist feels right.",
                  href: "/shop",
                  link: "Start browsing",
                },
                {
                  n: "02",
                  title: "Compare & choose",
                  body: "Stack vehicles side by side and pick the one that fits your budget and lifestyle.",
                  href: "/compare",
                  link: "Open compare",
                },
                {
                  n: "03",
                  title: "Close the deal",
                  body: "Financing or cash—finalize with transparent fees and support through pickup or delivery.",
                  href: "/contact",
                  link: "Get in touch",
                },
              ].map((step) => (
                <li
                  key={step.n}
                  className="relative border-b border-stone-300/80 py-8 pl-8 last:border-b-0 md:pl-12"
                >
                  <span className="absolute -left-[9px] top-9 flex h-4 w-4 items-center justify-center rounded-full border border-stone-300 bg-amber-50 md:top-10" />
                  <span className="font-mono text-sm text-stone-500">
                    {step.n}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-stone-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-stone-600">{step.body}</p>
                  <Link
                    href={step.href}
                    className="mt-4 inline-flex items-center text-sm font-bold text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800"
                  >
                    {step.link}
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-stone-800 bg-stone-900 py-16 text-stone-100 md:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400/90">
                  Why us
                </p>
                <h2 className="mt-3 text-2xl font-bold md:text-4xl">
                  Built for repo buyers
                </h2>
                <p className="mt-4 text-stone-400">
                  We focus on clarity and condition—so you always know what you are
                  getting before you commit.
                </p>
              </div>
              <Link href="/about">
                <span className="inline-flex items-center text-sm font-bold text-emerald-400 hover:text-emerald-300">
                  About our company
                  <ArrowRight size={16} className="ml-2" />
                </span>
              </Link>
            </div>

            <div className="mt-12 grid gap-10 border-t border-stone-700 pt-12 md:grid-cols-3">
              {[
                {
                  icon: <Shield size={22} />,
                  title: "Quality checks",
                  text: "Every vehicle is reviewed with a thorough inspection checklist before it is listed.",
                },
                {
                  icon: <CreditCard size={22} />,
                  title: "Straightforward pricing",
                  text: "Published prices and fees—no surprise add-ons at the last step.",
                },
                {
                  icon: <Headphones size={22} />,
                  title: "Real people, real answers",
                  text: "Our team helps with paperwork, transport options, and lender questions.",
                },
              ].map((item) => (
                <div key={item.title} className="max-w-sm">
                  <div className="text-emerald-400">{item.icon}</div>
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 grid grid-cols-1 divide-y divide-stone-700 border border-stone-700 md:grid-cols-3 md:divide-x md:divide-y-0">
              {stats.map((stat, index) => (
                <div key={index} className="px-6 py-8 text-center md:py-10">
                  <p className="font-mono text-3xl font-bold text-emerald-400 md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-stone-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
                Reviews
              </p>
              <h2 className="mt-3 text-2xl font-bold text-stone-900 md:text-3xl">
                What buyers say
              </h2>
              <p className="mt-3 text-stone-600">
                Real experiences from people who purchased through our listings.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.id}
                  className="border-l-4 border-emerald-500 pl-6 md:pl-8"
                >
                  <p className="text-lg italic leading-relaxed text-stone-800 md:text-xl">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
                    <cite className="not-italic font-semibold text-stone-900">
                      {testimonial.name}
                    </cite>
                    <span aria-hidden>·</span>
                    <span>{testimonial.role}</span>
                    <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Verified purchase
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/testimonials">
                <Button
                  variant="outline"
                  className="rounded-none border border-stone-300 px-8 font-bold text-stone-900 hover:bg-stone-900 hover:text-white"
                >
                  More stories
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-stone-300 bg-[#f4f1ea] py-14 text-stone-900 md:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-12 border-b border-stone-300 pb-12 lg:grid-cols-2 lg:gap-16 lg:pb-14">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  Get started
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                  Shop repo inventory with confidence
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-600 md:text-base">
                  Visit us or browse online—we will help you find the right
                  vehicle for your budget and timeline.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href="/shop">
                    <Button className="h-12 rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500">
                      Browse vehicles
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="h-12 rounded-none border border-stone-300 bg-transparent px-8 font-bold text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea]"
                    >
                      <Phone size={18} className="mr-2" />
                      Contact us
                    </Button>
                  </Link>
                </div>

                <p className="mt-10 max-w-md border-l-4 border-emerald-600 pl-4 text-sm text-stone-600">
                  <span className="font-mono font-bold text-stone-900">
                    2,500+
                  </span>{" "}
                  buyers helped this year
                </p>
              </div>

              <div className="grid gap-px border border-stone-300 bg-stone-300 sm:grid-cols-2">
                <div className="bg-[#f4f1ea] p-5 sm:p-6">
                  <div className="flex items-center gap-3 border-b border-stone-300 pb-3">
                    <MapPin size={20} className="shrink-0 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                      Visit us
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {SITE.headquarters.full}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4"
                  >
                    Directions
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>

                <div className="bg-[#f4f1ea] p-5 sm:p-6">
                  <div className="flex items-center gap-3 border-b border-stone-300 pb-3">
                    <Clock size={20} className="shrink-0 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                      Hours
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    Mon–Fri: 8am–6pm
                    <br />
                    Sat: 9am–4pm
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4"
                  >
                    Full schedule
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>

                <div className="bg-[#f4f1ea] p-5 sm:p-6">
                  <div className="flex items-center gap-3 border-b border-stone-300 pb-3">
                    <Phone size={20} className="shrink-0 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                      Call us
                    </h3>
                  </div>
                  <p className="mt-3 font-mono text-sm text-stone-800">
                    {phone.display}
                  </p>
                  <a
                    href={phone.href}
                    className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4"
                  >
                    Call now
                    <ArrowRight size={14} className="ml-1" />
                  </a>
                </div>

                <div className="bg-[#f4f1ea] p-5 sm:p-6">
                  <div className="flex items-center gap-3 border-b border-stone-300 pb-3">
                    <Mail size={20} className="shrink-0 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                      Email
                    </h3>
                  </div>
                  <p className="mt-3 break-all font-mono text-sm text-stone-800">
                    {SITE.email}
                  </p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4"
                  >
                    Send email
                    <ArrowRight size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border border-dashed border-stone-300 bg-white/70 px-5 py-5 md:flex-row md:items-start md:gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-stone-300 bg-emerald-500 text-stone-950">
                <Zap size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Quick replies
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  We aim to respond within two hours during business hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
