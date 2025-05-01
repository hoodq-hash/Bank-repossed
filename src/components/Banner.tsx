"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative text-white py-10 md:py-16 overflow-hidden font-montserrat h-[400px] md:h-[450px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Luxury car background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/50"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-xl">
          {/* Simplified Content */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect <span className="text-yellow-300">Drive</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-md">
            Quality vehicles, verified and ready for the road ahead.
          </p>

          <Link href="/shop">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg text-base shadow-lg hover:shadow-xl transition-all flex items-center group">
              View All Cars
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
