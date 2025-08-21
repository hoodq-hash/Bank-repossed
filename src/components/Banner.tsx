"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Car } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative text-white py-16 md:py-24 overflow-hidden font-montserrat min-h-[600px] md:min-h-[700px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Luxury car background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Enhanced gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-blue-900/60"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Enhanced Headline with Urgency */}
          <div className="mb-4">
            <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 LIMITED TIME OFFER - 0% DOWN PAYMENT AVAILABLE
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Drive Your <span className="text-yellow-400">Dreams</span> Home
            Today
          </h1>

          <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-lg leading-relaxed">
            Skip the dealership hassle. Get quality, pre-owned vehicles with
            instant approval and same-day pickup.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="text-yellow-400" size={20} />
              <span className="text-sm font-medium">
                100% Verified Vehicles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-400" size={20} />
              <span className="text-sm font-medium">Same Day Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="text-yellow-400" size={20} />
              <span className="text-sm font-medium">Free Test Drive</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all flex items-center group min-w-[200px]">
                Browse Cars Now
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 rounded-lg text-lg transition-all min-w-[200px]"
              >
                Get Pre-Approved
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm opacity-80">
              <span className="font-semibold text-yellow-400">500+</span> happy
              customers •
              <span className="font-semibold text-yellow-400"> 4.9/5</span>{" "}
              rating •
              <span className="font-semibold text-yellow-400"> 24/7</span>{" "}
              support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
