"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Search,
  FileText,
  Handshake,
  Car,
  Shield,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Check,
  Phone,
  ChevronRight,
  Filter,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Zap,
  Heart,
  Share2,
  ChevronDown,
  PlayCircle,
  MessageSquare,
  Headphones,
  Award,
  TrendingUp,
  Users,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import FeaturedCars from "@/components/FeaturedCars";
import Footer from "@/components/Footer";

export default function Home() {
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchType, setSearchType] = useState("buy");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Stats with animations
  const stats = [
    { value: "26,000+", label: "cars sold", icon: <Car size={24} /> },
    {
      value: "1,500+",
      label: "cars inspected monthly",
      icon: <Shield size={24} />,
    },
    { value: "70+", label: "locations worldwide", icon: <MapPin size={24} /> },
  ];

  // Featured vehicles data
  const featuredVehicles = [
    {
      id: 1,
      title: "2022 Toyota Camry XSE",
      price: "$28,995",
      mileage: "12,450",
      image: "/images/camry.jpg",
      features: ["Leather Seats", "Sunroof", "Navigation", "Backup Camera"],
      category: "sedan",
      year: 2022,
      fuelType: "Hybrid",
    },
    {
      id: 2,
      title: "2021 Honda Accord Sport",
      price: "$26,500",
      mileage: "18,320",
      image: "/images/accord.jpg",
      features: ["Apple CarPlay", "Bluetooth", "Alloy Wheels", "Lane Assist"],
      category: "sedan",
      year: 2021,
      fuelType: "Gasoline",
    },
    {
      id: 3,
      title: "2023 Ford F-150 XLT",
      price: "$42,995",
      mileage: "8,750",
      image: "/images/f150.jpg",
      features: ["4x4", "Tow Package", "Crew Cab", "Touchscreen Display"],
      category: "truck",
      year: 2023,
      fuelType: "Diesel",
    },
    {
      id: 4,
      title: "2022 Tesla Model 3",
      price: "$39,995",
      mileage: "10,120",
      image: "/images/tesla.jpg",
      features: ["Autopilot", "Glass Roof", "Premium Sound", "Supercharging"],
      category: "electric",
      year: 2022,
      fuelType: "Electric",
    },
    {
      id: 5,
      title: "2021 Jeep Wrangler Rubicon",
      price: "$38,750",
      mileage: "15,680",
      image: "/images/jeep.jpg",
      features: ["4x4", "Removable Top", "Off-road Package", "Navigation"],
      category: "suv",
      year: 2021,
      fuelType: "Gasoline",
    },
    {
      id: 6,
      title: "2023 BMW X5 xDrive40i",
      price: "$62,500",
      mileage: "5,230",
      image: "/images/bmw.jpg",
      features: ["Leather Interior", "Panoramic Roof", "Premium Audio", "AWD"],
      category: "luxury",
      year: 2023,
      fuelType: "Hybrid",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Michael Johnson",
      role: "Business Owner",
      quote:
        "Chariot Auto Sales made buying my new truck so easy. Their team was professional and found exactly what I was looking for at a great price.",
      rating: 5,
      image: "/images/testimonial1.jpg",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Teacher",
      quote:
        "As a first-time car buyer, I was nervous about the process. The staff at Chariot's guided me through everything and I couldn't be happier with my purchase!",
      rating: 5,
      image: "/images/testimonial2.jpg",
    },
    {
      id: 3,
      name: "David ",
      role: "Sales Executive",
      quote:
        "I've purchased three vehicles from Chariot's over the years. Their selection, pricing, and customer service keep me coming back every time.",
      rating: 5,
      image: "/images/testimonial3.jpg",
    },
  ];

  // Brands
  const brands = [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Mercedes",
    "Audi",
    "Chevrolet",
    "Nissan",
    "Hyundai",
    "Kia",
    "Tesla",
    "Lexus",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section - Completely Redesigned */}
        <section className="relative text-white overflow-hidden min-h-[700px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              // src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
              src="/img.jpg"
              alt="Luxury car background"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Enhanced gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-blue-900/60"></div>
          </div>
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent"></div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 items-center">
              <div className="max-w-2xl">
                <div
                  className={`transition-all duration-1000 transform ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    Drive Your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      Dreams
                    </span>{" "}
                    Home Today
                  </h1>
                  <p className="text-md md:text-2xl text-slate-300 mb-8 max-w-xl leading-relaxed">
                    Skip the dealership hassle. Get quality, pre-owned vehicles
                    with instant approval and same-day pickup / Delivery.
                  </p>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Shield className="text-yellow-400" size={20} />
                      <span className="text-sm font-medium text-white">
                        100% Verified Vehicles
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-yellow-400" size={20} />
                      <span className="text-sm font-medium text-white">
                        Same Day Delivery
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/shop">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all flex items-center group min-w-[200px]">
                        Browse Cars Now
                        <ArrowRight
                          size={20}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </Button>
                    </Link>
                  </div>

                  {/* Social Proof */}
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-sm opacity-80">
                      <span className="font-semibold text-yellow-400">
                        500+
                      </span>{" "}
                      happy customers •
                      <span className="font-semibold text-yellow-400">
                        {" "}
                        4.9/5
                      </span>{" "}
                      rating •
                      <span className="font-semibold text-yellow-400">
                        {" "}
                        24/7
                      </span>{" "}
                      support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curved bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              className="fill-[#f8fafc]"
            >
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Brand Logos Section */}
        {/* <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-slate-600">
                Trusted by top automotive brands worldwide
              </h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  <span className="text-xl font-bold text-slate-500">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <FeaturedCars />

        {/* How It Works - Modern Approach */}
        <section className="py-20 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100 rounded-full opacity-70"></div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Badge className="bg-blue-100 text-blue-700 mb-3">
                Simplified Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                How Chariot Auto Sales Works
              </h2>
              <p className="text-lg text-slate-600">
                We've streamlined the car buying process to make it easy,
                transparent, and enjoyable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-blue-200 -z-10 transform -translate-y-1/2"></div>

              <div className="bg-white rounded-xl p-6 shadow-md relative">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-6">
                  1
                </div>
                <div className="pt-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Search size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Browse Our Inventory
                  </h3>
                  <p className="text-slate-600">
                    Search our extensive inventory with advanced filters to find
                    your perfect vehicle match based on your preferences.
                  </p>
                  <Link
                    href="/shop"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Start browsing
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md relative md:mt-12">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-6">
                  2
                </div>
                <div className="pt-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Check size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Find you vehicle
                  </h3>
                  <p className="text-slate-600">
                    Compare and select the vehicle that best suits your needs
                    and preferences.
                  </p>
                  <Link
                    href="/test-drive"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    check varities
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md relative md:mt-24">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-6">
                  3
                </div>
                <div className="pt-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <Handshake size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Complete Your Purchase
                  </h3>
                  <p className="text-slate-600">
                    Finalize your purchase with flexible financing options and
                    drive away in your new vehicle.
                  </p>
                  <Link
                    href="/financing"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Financing options
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats and Benefits - Visual Approach */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-blue-100 text-blue-700 mb-3">
                  Why Choose Us
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  The Chariot Auto Sales Advantage
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  We're revolutionizing the car buying experience with
                  transparency, quality, and customer satisfaction at the core
                  of everything we do.
                </p>

                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Shield size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Quality Assurance
                      </h3>
                      <p className="text-slate-600">
                        Every vehicle undergoes a comprehensive 200+ point
                        inspection before sale.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <CreditCard size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Transparent Pricing
                      </h3>
                      <p className="text-slate-600">
                        Fair market pricing with no hidden fees or surprise
                        charges.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Headphones size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Dedicated Support
                      </h3>
                      <p className="text-slate-600">
                        Our team of experts is available to assist you every
                        step of the way.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/about">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                      Learn More About Us
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${
                      index === 0
                        ? "from-blue-50 to-blue-100 col-span-2"
                        : index === 1
                        ? "from-slate-50 to-slate-100"
                        : "from-cyan-50 to-cyan-100"
                    } p-6 rounded-xl border ${
                      index === 0
                        ? "border-blue-200"
                        : index === 1
                        ? "border-slate-200"
                        : "border-cyan-200"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                        index === 0
                          ? "bg-blue-600 text-white"
                          : index === 1
                          ? "bg-slate-700 text-white"
                          : "bg-cyan-600 text-white"
                      }`}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-600 text-lg capitalize">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Modern Card Design */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-700 mb-3">
                Customer Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Real experiences from real customers who found their perfect
                vehicle with us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`bg-white rounded-xl p-6 shadow-md border border-slate-100 relative ${
                    index === 1 ? "md:-mt-8" : index === 2 ? "md:-mt-4" : ""
                  }`}
                >
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <MessageSquare size={16} />
                  </div>

                  <div className="flex items-center mb-6">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-500 text-sm">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <svg
                      className="absolute -top-4 -left-2 text-blue-100 w-8 h-8 transform -scale-x-100"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z"></path>
                    </svg>
                    <p className="text-slate-700 mb-6 pl-6">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                      Verified Purchase
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/testimonials">
                <Button
                  variant="outline"
                  className="border-slate-300 hover:border-slate-400 text-slate-800"
                >
                  Read More Customer Stories
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Modern Design */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/10 to-transparent"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-400 rounded-full opacity-10 blur-3xl"></div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">
                  Ready to Get Started?
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Find Your Dream Car Today
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-lg">
                  Visit our showroom or browse our inventory online to discover
                  the perfect vehicle for your lifestyle and budget.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/shop">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-medium rounded-lg">
                      Browse Inventory
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-medium rounded-lg"
                    >
                      <Phone size={18} className="mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-300 overflow-hidden"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-slate-300">
                    <span className="font-bold text-white">2,500+</span> happy
                    customers this year
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <h3 className="font-bold">Visit Us</h3>
                    </div>
                    <p className="text-slate-300 text-sm">
                      123 Auto Drive, Cartown, CT 12345
                    </p>
                    <Link
                      href="/contact"
                      className="mt-2 inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Get directions
                      <ArrowUpRight size={14} className="ml-1" />
                    </Link>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                        <Clock size={20} className="text-white" />
                      </div>
                      <h3 className="font-bold">Hours</h3>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Mon-Sat: 9am-7pm
                      <br />
                      Sunday: 11am-5pm
                    </p>
                    <Link
                      href="/contact"
                      className="mt-2 inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Full schedule
                      <ArrowUpRight size={14} className="ml-1" />
                    </Link>
                  </div>


                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                        <MessageSquare size={20} className="text-white" />
                      </div>
                      <h3 className="font-bold">Email</h3>
                    </div>
                    <p className="text-slate-300 text-sm">
                      chariotautosales321@gmail.com
                      <br />
                      chariotautosales321@gmail.com
                    </p>
                    <a
                      href="mailto:chariotautosales321@gmail.com"
                      className="mt-2 inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Send email
                      <ArrowUpRight size={14} className="ml-1" />
                    </a>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/20">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center mr-4">
                      <Zap size={24} className="text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        Quick Response Guarantee
                      </h3>
                      <p className="text-slate-300 text-sm">
                        We respond to all inquiries within 2 hours during
                        business hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
