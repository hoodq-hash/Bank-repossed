"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Landmark, Car } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative min-h-[600px] overflow-hidden py-16 text-white md:min-h-[700px] md:py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Quality pre-owned vehicle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-emerald-950/65" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-emerald-600/95 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ring-1 ring-emerald-400/40">
              <Landmark className="h-4 w-4 shrink-0" />
              Bank &amp; lender repossessions — priced to move
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Real savings on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
              repossessed
            </span>{" "}
            vehicles
          </h1>

          <p className="text-lg md:text-2xl mb-8 text-slate-200 max-w-lg leading-relaxed">
            Skip traditional dealer markups. Shop transparent listings from
            recovered collateral—inspected, titled, and ready for a new owner.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="text-emerald-400 shrink-0" size={20} />
              <span className="text-sm font-medium">Disclosure-first listings</span>
            </div>
            <div className="flex items-center gap-2">
              <Landmark className="text-emerald-400 shrink-0" size={20} />
              <span className="text-sm font-medium">Institutional sourcing</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="text-emerald-400 shrink-0" size={20} />
              <span className="text-sm font-medium">Cars, trucks &amp; SUVs</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all flex items-center group min-w-[200px]">
                Browse repo inventory
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white/70 text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-lg text-lg transition-all min-w-[200px] bg-transparent"
              >
                Ask about a vehicle
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-emerald-300">New listings</span>{" "}
              added regularly ·
              <span className="font-semibold text-emerald-300"> Nationwide</span>{" "}
              pickup &amp; transport options ·
              <span className="font-semibold text-emerald-300"> Support</span> when
              you need it
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
