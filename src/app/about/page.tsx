"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  ShieldCheck,
  Handshake,
  ChevronRight,
  Phone,
  Mail,
  Star,
  ArrowRight,
  Calendar,
  TrendingUp,
  Building,
  Car,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const milestones = [
  {
    year: 1995,
    title: "Company founded",
    description:
      "Marcus Cole opened the first Bank Repossessed Cars remarketing desk with a small team focused on transparent repo sales.",
    icon: <Building className="h-5 w-5" />,
  },
  {
    year: 2002,
    title: "Second location",
    description:
      "We doubled inventory and service capacity while keeping published pricing and condition reports at the center of the experience.",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    year: 2008,
    title: "Service center",
    description:
      "Launched a dedicated service center for inspections, reconditioning, and customer maintenance.",
    icon: <Car className="h-5 w-5" />,
  },
  {
    year: 2015,
    title: "Online inventory",
    description:
      "Full digital inventory with search, filters, and consistent listing data for remote buyers.",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    year: 2020,
    title: "25th anniversary",
    description:
      "Celebrated 25 years of service with our 10,000th vehicle sold and expansion to a third facility.",
    icon: <Award className="h-5 w-5" />,
  },
  {
    year: 2023,
    title: "EV & hybrid focus",
    description:
      "Dedicated hybrid and electric listings with specialist support on charging and ownership costs.",
    icon: <Heart className="h-5 w-5" />,
  },
];

const values = [
  {
    title: "Transparency",
    description:
      "Published pricing, documented condition, and no surprise fees at the last step.",
    icon: <ShieldCheck className="h-6 w-6 text-emerald-700" />,
  },
  {
    title: "Quality",
    description:
      "Every vehicle is reviewed with a thorough inspection checklist before it is listed.",
    icon: <Award className="h-6 w-6 text-emerald-700" />,
  },
  {
    title: "Customer focus",
    description:
      "We prioritize clarity and support so you can decide on your timeline—not ours.",
    icon: <Users className="h-6 w-6 text-emerald-700" />,
  },
  {
    title: "Integrity",
    description:
      "Straight answers on history, lenders, and transport options—every time.",
    icon: <Handshake className="h-6 w-6 text-emerald-700" />,
  },
];

const faqs = [
  {
    question: "What makes Bank Repossessed Cars different from other dealerships?",
    answer:
      "We focus on lender-recovered inventory with clear listings: condition, pricing, and paperwork without dealership games. You can browse online, compare, and reach out when you are ready.",
  },
  {
    question: "Do you offer financing options?",
    answer:
      "Yes. We work with multiple lenders and our finance team helps you compare options for your situation.",
  },
  {
    question: "What warranty coverage comes with your vehicles?",
    answer:
      "Coverage varies by unit. We explain what is included before you sign, and extended options are available on many vehicles.",
  },
  {
    question: "Can I trade in my current vehicle?",
    answer:
      "Yes. We accept trade-ins and can apply value toward your purchase with transparent appraisal notes.",
  },
  {
    question: "Do you sell electric and hybrid vehicles?",
    answer:
      "Yes. Our inventory includes hybrids and EVs, and we can walk you through charging and ownership basics.",
  },
];

function SectionIntro({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
        {kicker}
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight text-stone-900 md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-stone-600 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea] text-stone-900 antialiased">
      <Navbar />

      <main className="flex-grow">
        <section className="border-b border-stone-300 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
              <div className="md:col-span-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  About us
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  Repo inventory, listed with clarity
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600 md:text-base">
                  Since 1995 we have built Bank Repossessed Cars around honest
                  listings and lender-recovered stock—so you always know what
                  you are buying before you commit.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end">
                <Link href="/shop">
                  <Button className="h-12 w-full rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500 sm:w-auto">
                    Our inventory
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-none border border-stone-300 bg-transparent px-8 font-bold text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea] sm:w-auto"
                  >
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-0 z-30 border-b border-stone-300 bg-[#f4f1ea]">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <Tabs
              defaultValue="story"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="overflow-x-auto">
                <TabsList className="h-auto w-full min-w-max justify-start gap-0 rounded-none border-0 bg-transparent p-0">
                  {(
                    [
                      ["story", "Our story"],
                      ["mission", "Mission & values"],
                      ["faq", "FAQ"],
                    ] as const
                  ).map(([value, label]) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="rounded-none border-b border-transparent px-4 py-4 text-xs font-bold uppercase tracking-wider text-stone-600 data-[state=active]:border-stone-300 data-[state=active]:bg-white data-[state=active]:text-stone-900 sm:px-6"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="story" className="mt-0 border-0 p-0">
                <section className="border-b border-stone-300 bg-white py-14 md:py-20">
                  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                      <div>
                        <SectionIntro
                          kicker="Our story"
                          title="From a small remarketing desk to three facilities"
                          subtitle="Growth never replaced the basics: clear condition notes, published pricing, and respectful support."
                        />
                        <div className="space-y-4 text-sm leading-relaxed text-stone-600 md:text-base">
                          <p>
                            Bank Repossessed Cars began when founder Marcus Cole
                            saw an opportunity to bring lender repossessions to
                            retail buyers with less friction—without opaque
                            auctions or surprise fees.
                          </p>
                          <p>
                            Word spread. By 2002 we had expanded to a second
                            location and a team focused on documentation and
                            buyer education.
                          </p>
                          <p>
                            Today we operate three facilities with sales,
                            service, and financing support—still guided by the same
                            principles.
                          </p>
                        </div>
                      </div>
                      <div className="border border-stone-300 bg-stone-200">
                        <Image
                          src="https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                          alt="Bank Repossessed Cars showroom"
                          width={720}
                          height={480}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border-b border-stone-300 py-14 md:py-20">
                  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <SectionIntro
                      kicker="Milestones"
                      title="A straight line through three decades"
                      subtitle="Key moments that shaped how we list, inspect, and deliver repo inventory."
                    />
                    <ol className="relative mt-12 border-l border-stone-300 pl-8 md:pl-12">
                      {milestones.map((milestone, index) => (
                        <li
                          key={milestone.year}
                          className="relative border-b border-stone-300 py-8 last:border-b-0"
                        >
                          <span className="absolute -left-[9px] top-9 flex h-4 w-4 items-center justify-center rounded-full border border-stone-300 bg-[#f4f1ea] md:top-10" />
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="border border-stone-300 bg-white p-5 md:p-6"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="flex h-10 w-10 items-center justify-center border border-stone-300 bg-emerald-500 text-white">
                                {milestone.icon}
                              </span>
                              <span className="font-mono text-xl font-bold text-stone-900">
                                {milestone.year}
                              </span>
                            </div>
                            <h3 className="mt-3 text-lg font-bold text-stone-900">
                              {milestone.title}
                            </h3>
                            <p className="mt-2 text-sm text-stone-600 md:text-base">
                              {milestone.description}
                            </p>
                          </motion.div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="mission" className="mt-0 p-0">
                <section className="border-b border-stone-300 bg-white py-14 md:py-20">
                  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                      <div className="order-2 lg:order-1">
                        <SectionIntro
                          kicker="Mission"
                          title="Transforming the car buying experience"
                        />
                        <blockquote className="border-l-4 border-emerald-600 pl-4 text-lg font-medium italic leading-relaxed text-stone-800">
                          Our mission is to provide exceptional vehicles and
                          service while creating a transparent, pressure-free
                          environment where customers can make confident
                          decisions.
                        </blockquote>
                        <div className="mt-6 space-y-4 text-sm text-stone-600 md:text-base">
                          <p>
                            We eliminate guesswork with consistent listing data
                            and staff who answer lender and transport questions in
                            plain language.
                          </p>
                          <p>
                            Relationships matter: we want you to feel supported
                            after the sale, not forgotten.
                          </p>
                        </div>
                      </div>
                      <div className="order-1 border border-stone-300 bg-stone-200 lg:order-2">
                        <Image
                          src="https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                          alt="Our mission"
                          width={720}
                          height={480}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border-b border-stone-300 py-14 md:py-20">
                  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <SectionIntro
                      kicker="Values"
                      title="What we optimize for every day"
                      subtitle="Principles that show up in listings, inspections, and how we answer the phone."
                    />
                    <div className="mt-10 grid gap-px border border-stone-300 bg-stone-300 sm:grid-cols-2 lg:grid-cols-4">
                      {values.map((value) => (
                        <div
                          key={value.title}
                          className="bg-[#f4f1ea] p-6 transition-colors hover:bg-amber-100/50"
                        >
                          <div className="flex h-12 w-12 items-center justify-center border border-stone-300 bg-white">
                            {value.icon}
                          </div>
                          <h3 className="mt-4 text-base font-bold text-stone-900">
                            {value.title}
                          </h3>
                          <p className="mt-2 text-sm text-stone-600">
                            {value.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="border-b border-stone-300 bg-white py-14 md:py-20">
                  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                      <div className="border border-stone-300 bg-stone-200">
                        <Image
                          src="/images/community.jpg"
                          alt="Community involvement"
                          width={720}
                          height={480}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                      <div>
                        <SectionIntro
                          kicker="Community"
                          title="Giving back where we operate"
                          subtitle="Local drives, youth programs, and education initiatives—we reinvest alongside the customers who trust us."
                        />
                        <div className="space-y-4 text-sm text-stone-600 md:text-base">
                          <p>
                            Our annual &ldquo;Drive for a Cause&rdquo; campaign has
                            raised significant funds for local charities, and our
                            team volunteers year-round.
                          </p>
                          <p>
                            We sponsor youth sports, community events, and
                            schools because long-term relationships start outside
                            the showroom too.
                          </p>
                        </div>
                        <Link href="/contact" className="mt-8 inline-block">
                          <Button className="rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500">
                            Learn about initiatives
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border-b border-stone-300 py-14 md:py-20">
                  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <SectionIntro
                      kicker="Testimonials"
                      title="What customers say"
                      subtitle="A few snapshots—read the full reviews page for more."
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                      {[
                        {
                          quote:
                            "No pressure, just helpful guidance and honest answers. I'll be back.",
                          who: "Jennifer R.",
                          since: "Customer since 2018",
                        },
                        {
                          quote:
                            "Quality vehicles and knowledgeable staff—service has been exceptional.",
                          who: "Robert T.",
                          since: "Customer since 2020",
                        },
                        {
                          quote:
                            "Financing was respectful and professional from start to finish.",
                          who: "Marcus D.",
                          since: "Customer since 2022",
                        },
                      ].map((t) => (
                        <blockquote
                          key={t.who}
                          className="border border-stone-300 bg-white p-5"
                        >
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                className="fill-emerald-600 text-emerald-600"
                              />
                            ))}
                          </div>
                          <p className="mt-3 text-sm italic leading-relaxed text-stone-700">
                            &ldquo;{t.quote}&rdquo;
                          </p>
                          <footer className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                            <cite className="not-italic text-stone-900">
                              {t.who}
                            </cite>
                            <span className="mt-1 block font-normal normal-case text-stone-600">
                              {t.since}
                            </span>
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                    <div className="mt-8 text-center">
                      <Link href="/testimonials">
                        <Button
                          variant="outline"
                          className="rounded-none border border-stone-300 px-8 font-bold text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea]"
                        >
                          More reviews
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="faq" className="mt-0 p-0">
                <section className="border-b border-stone-300 bg-white py-14 md:py-20">
                  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                    <SectionIntro
                      kicker="FAQ"
                      title="Answers before you visit"
                      subtitle="Still stuck? Call or email—we respond quickly during business hours."
                    />
                    <div className="mx-auto mt-10 max-w-3xl border border-stone-300 bg-[#f4f1ea] px-4 py-2">
                      <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border-stone-300"
                          >
                            <AccordionTrigger className="py-4 text-left text-sm font-bold text-stone-900 hover:no-underline md:text-base">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 text-sm leading-relaxed text-stone-600">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                    <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
                      <Link href="/contact">
                        <Button className="rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500">
                          <Phone size={16} className="mr-2" />
                          Contact us
                        </Button>
                      </Link>
                      <a href="mailto:bankrepossessedcars@gmail.com">
                        <Button
                          variant="outline"
                          className="rounded-none border border-stone-300 px-8 font-bold text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea]"
                        >
                          <Mail size={16} className="mr-2" />
                          Email support
                        </Button>
                      </a>
                    </div>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-[#f4f1ea] py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  Next step
                </p>
                <h2 className="mt-3 text-2xl font-bold text-stone-900 md:text-3xl">
                  Ready to browse repo inventory?
                </h2>
                <p className="mt-4 text-sm text-stone-600 md:text-base">
                  Start online—filters and listing detail are built to save you
                  time.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/shop">
                    <Button className="rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500">
                      Browse inventory
                    </Button>
                  </Link>
                  <Link href="/testimonials">
                    <Button
                      variant="outline"
                      className="rounded-none border border-stone-300 font-bold"
                    >
                      Read reviews
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="border border-stone-300 bg-stone-200">
                <Image
                  src="/images/showroom.jpg"
                  alt="Bank Repossessed Cars showroom"
                  width={640}
                  height={380}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
