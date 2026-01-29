import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Top Section with Logo and Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-12 border-b border-gray-800">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              {/* Replace the placeholder div with your actual logo image */}

              <span className="text-2xl font-bold text-white">
                Chariot Auto Sales
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Your trusted platform for buying quality vehicles. Connecting
              buyers and sellers worldwide since 2016.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <h4 className="text-lg font-medium mb-3">
              Subscribe to our newsletter
            </h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-gray-800 border border-gray-700 text-white w-full md:w-64"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Social Media & Contact Information Combined */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-gray-800">
              Contact Information
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://facebook.com/chariotsautosales"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook size={20} className="mr-3" />
                  <span>Our Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/chariotsautosales"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} className="mr-3" />
                  <span>Our Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/chariotsautosales"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter size={20} className="mr-3" />
                  <span>Our Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle size={20} className="mr-3" />
                  <span>Text us</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:chariotautosales321@gmail.com"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={20} className="mr-3" />
                  <span>chariotautosales321@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours & Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-gray-800">
              Business Hours & Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start pt-4">
                <Clock
                  size={20}
                  className="mr-3 text-gray-400 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-white font-medium">Mon-Fri</p>
                  <p className="text-gray-400">8AM - 6PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock
                  size={20}
                  className="mr-3 text-gray-400 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-white font-medium">Sat</p>
                  <p className="text-gray-400">9AM - 4PM</p>
                </div>
              </li>
              <li className="flex items-start pt-4">
                <MapPin
                  size={20}
                  className="mr-3 text-gray-400 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-white font-medium">Headquarters</p>
                  <p className="text-gray-400">
                    562 State St, Clearfield, UT 84015, United States
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Payment Methods and Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">
                © 2025 Chariot Auto Sales. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
