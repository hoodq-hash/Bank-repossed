"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Car,
  Info,
  Wrench,
  DollarSign,
  Phone,
  Star,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set active tab based on current route
  useEffect(() => {
    if (pathname === "/" || pathname === "/") {
      setActiveTab("home");
    } else if (pathname === "/shop") {
      setActiveTab("shop");
    } else if (pathname === "/about") {
      setActiveTab("about");
    } else if (pathname === "/contact") {
      setActiveTab("contact");
    } else if (pathname === "/testimonials") {
      setActiveTab("testimonials");
    }
  }, [pathname]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-montserrat">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        {/* Main Navbar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/chariot_logo.png"
                alt="Chariot Auto Sales Logo"
                width={180}
                height={100}
                className="mr-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md transition-colors hover:bg-gray-100 font-medium text-sm flex items-center ${
                activeTab === "home" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <ShoppingBag size={16} className="mr-2" />
              Home
            </Link>
            <Link
              href="/shop"
              className={`px-4 py-2 rounded-md transition-colors hover:bg-gray-100 font-medium text-sm flex items-center ${
                activeTab === "shop" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <Car size={16} className="mr-2" />
              Shop
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-md transition-colors hover:bg-gray-100 font-medium text-sm flex items-center ${
                activeTab === "about" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <Info size={16} className="mr-2" />
              About
            </Link>

            <Link
              href="/testimonials"
              className={`px-4 py-2 rounded-md transition-colors hover:bg-gray-100 font-medium text-sm flex items-center ${
                activeTab === "testimonials" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <Star size={16} className="mr-2" />
              Testimonials
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 rounded-md transition-colors bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center`}
            >
              <Phone size={16} className="mr-2" />
              Contact Us
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
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

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 py-2 bg-white border-t border-gray-200">
            <Link
              href="/"
              className={`block px-4 py-2 text-sm ${
                activeTab === "home"
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ShoppingBag size={16} className="mr-2" />
                Home
              </div>
            </Link>
            <Link
              href="/shop"
              className={`block px-4 py-2 text-sm ${
                activeTab === "shop"
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Car size={16} className="mr-2" />
                Shop
              </div>
            </Link>
            <Link
              href="/about"
              className={`block px-4 py-2 text-sm ${
                activeTab === "about"
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Info size={16} className="mr-2" />
                About Us
              </div>
            </Link>

            <Link
              href="/testimonials"
              className={`block px-4 py-2 text-sm ${
                activeTab === "testimonials"
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Star size={16} className="mr-2" />
                Testimonials
              </div>
            </Link>
            <Link
              href="/contact"
              className={`block px-4 py-2 text-sm ${
                activeTab === "contact"
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                Contact Us
                (309) 359-7057
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
