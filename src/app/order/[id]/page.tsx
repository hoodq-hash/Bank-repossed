"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  MessageCircle,
  Phone,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Car,
  Info,
  Mail,
  User,
  Home,
  AlertCircle,
  FileText,
  Check,
  CreditCard,
  KeyRound,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/site";

// Define car type
type Car = {
  id: string | number;
  title: string;
  price: number;
  location: string;
  condition: string;
  mileage: number;
  year: number;
  images: string[];
  transmission: string;
  make: string;
  model: string;
  color: string;
  currency: string;
  fuelType: string;
  description: string;
  createdAt: string;
  engineSize?: string;
  registeredState?: string;
  sellingCondition?: string;
  boughtCondition?: string;
  features?: string[];
  sellerInfo?: {
    name: string;
    verified: boolean;
    memberSince: string;
    responseRate: string;
    responseTime: string;
    phone: string;
    location: string;
  };
};

// Dynamically get currency symbol for different regions
const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "$":
      return "USD";
    case "€":
      return "EUR";
    case "£":
      return "GBP";
    case "¥":
      return "JPY";
    case "₩":
      return "KRW";
    case "₹":
      return "INR";
    case "A$":
      return "AUD";
    case "C$":
      return "CAD";
    default:
      return "USD";
  }
};

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: carId } = React.use(params);

  // State for car data
  const [carDetails, setCarDetails] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    preferredContact: "email",
    agreeToTerms: false,
    requestTestDrive: false,
    requestInspection: false,
    requestFinancing: false,
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStep, setFormStep] = useState(1); // Track multi-step form progress

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      setLoadingError(null);

      try {
        // Fetch car details from API
        const response = await fetch(`/api/cars/${carId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }

        const data = await response.json();
        setCarDetails(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoadingError("Failed to load car details. Please try again later.");

        // Fallback to mock data if API fails
        // This is just for demo purposes
        // const mockCarDetails: Car = {
        //   id: carId,
        //   title: "Volkswagen Jetta 2007 Gold",
        //   price: 12500,
        //   currency: "$",
        //   location: "San Francisco, CA",
        //   condition: "Used",
        //   transmission: "Manual",
        //   year: 2007,
        //   make: "Volkswagen",
        //   model: "Jetta",
        //   color: "Gold",
        //   engineSize: "2000",
        //   fuelType: "Petrol",
        //   mileage: 42300,
        //   images: ["/cars/volkswagen-jetta-gold.jpg"],
        //   description:
        //     "Well maintained Volkswagen Jetta in excellent condition.",
        //   createdAt: new Date().toISOString(),
        //   sellerInfo: {
        //     name: "AutoWorld Dealer",
        //     verified: true,
        //     memberSince: "2019",
        //     responseRate: "95%",
        //     responseTime: "Within 2 hours",
        //     phone: "+1 (555) 123-4567",
        //     location: "San Francisco, CA",
        //   },
        // };

        // setCarDetails(mockCarDetails);
        // toast.error("Using demo data - couldn't connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    const currencyCode = getCurrencySymbol(currency);

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace(currencyCode, currency);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Validate form step 1
  const validateFormStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.preferredContact === "phone" && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required for phone contact preference";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate form step 2
  const validateFormStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateFormStep1()) {
      setFormStep(2);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setFormStep(1);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateFormStep2()) {
      if (!carDetails) return;
      setIsSubmitting(true);

      // Prepare email content
      const subject = `Inquiry about ${carDetails.year} ${carDetails.make} ${carDetails.model} (ID: ${carId})`;
      const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
Client's Preferred Contact Method: ${formData.preferredContact}

Additional Requests:
${formData.requestFinancing ? "- Financing Information Requested\n" : ""}

Message:
${formData.message}


This message was sent from ${SITE.url}.
`;

      // Encode email parameters
      const mailtoLink = `mailto:${SITE.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      // Open email client
      window.open(mailtoLink, "_blank");

      // Simulate API call for UI feedback
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success("Your message has been prepared in your email client!");
      }, 1000);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f1ea] text-stone-900 antialiased">
        <Navbar />
        <main className="flex flex-grow items-center justify-center py-8 md:py-12">
          <div className="flex flex-col items-center justify-center gap-4 border border-stone-300 bg-white px-10 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600">
              Loading listing
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if no car details
  if (!carDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f1ea] text-stone-900 antialiased">
        <Navbar />
        <main className="flex-grow py-4 md:py-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="border border-stone-300 bg-white p-6 text-center md:p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-stone-300 bg-red-50">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-stone-900 mb-2">
                Car Not Found
              </h1>
              <p className="text-stone-600 mb-6">
                {loadingError || "We couldn't find the car you're looking for."}
              </p>
              <Link href="/shop">
                <Button className="rounded-none border border-stone-300 bg-emerald-600 font-bold uppercase tracking-wider text-white hover:bg-emerald-500">
                  Browse Other Cars
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f1ea] text-stone-900 antialiased">
      <Navbar />

      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb navigation */}
          <div className="mb-4 flex flex-wrap items-center text-xs font-mono font-semibold uppercase tracking-wider text-stone-600 md:text-sm">
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>
            <span className="mx-2 text-stone-400">/</span>
            <Link href="/shop" className="hover:text-emerald-700">
              Cars
            </Link>
            <span className="mx-2 text-stone-400">/</span>
            <Link href={`/car/${carId}`} className="hover:text-emerald-700">
              {carDetails.make} {carDetails.model}
            </Link>
            <span className="mx-2 text-stone-400">/</span>
            <span className="text-stone-900">Contact Seller</span>
          </div>

          {/* Back button */}
          <Link
            href={`/car/${carId}`}
            className="group mb-6 inline-flex items-center border border-stone-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-900 transition hover:bg-stone-900 hover:text-[#f4f1ea]"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="ml-1">Back to car details</span>
          </Link>

          {isSubmitted ? (
            // Success message after form submission
            <div className="mx-auto max-w-2xl border border-stone-300 bg-white p-6 text-center md:p-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-stone-300 bg-emerald-50">
                <CheckCircle2 size={40} className="text-emerald-700" />
              </div>
              <h1 className="mb-3 text-2xl font-bold text-stone-900">
                Message Sent Successfully!
              </h1>
              <p className="mx-auto mb-8 max-w-md text-stone-600">
                Your message has been sent to{" "}
                <span className="font-medium">
                  {carDetails.sellerInfo?.name || "the seller"}
                </span>
                .
                {carDetails.sellerInfo?.responseTime &&
                  ` They typically respond ${carDetails.sellerInfo.responseTime.toLowerCase()}.`}
              </p>

              <div className="mx-auto mb-6 max-w-md border border-stone-300 bg-stone-100 p-4 text-left">
                <h3 className="mb-2 flex items-center font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">
                  <Info size={16} className="mr-1.5 text-emerald-700" />
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-stone-800">
                  <li className="flex items-start">
                    <Check size={14} className="mr-2 mt-1 shrink-0 text-emerald-600" />
                    <span>The seller will review your inquiry</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={14} className="mr-2 mt-1 shrink-0 text-emerald-600" />
                    <span>
                      They&apos;ll contact you via your preferred method (
                      {formData.preferredContact})
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check size={14} className="mr-2 mt-1 shrink-0 text-emerald-600" />
                    <span>You can discuss details, arrange viewings</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href={`/car/${carId}`}>
                  <Button
                    variant="outline"
                    className="w-full rounded-none border border-stone-300 bg-white font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-100 sm:w-auto"
                  >
                    Return to Car Details
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button className="w-full rounded-none border border-stone-300 bg-emerald-600 font-bold uppercase tracking-wider text-white hover:bg-emerald-500 sm:w-auto">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Contact form */}
              <div className="lg:w-2/3">
                <div className="mb-6 overflow-hidden border border-stone-300 bg-white">
                  <div className="border-b border-stone-300 bg-white px-4 py-5 md:px-6 md:py-6">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600">
                      Inquiry · Step {formStep} of 2
                    </p>
                    <h1 className="mt-2 text-xl font-bold text-stone-900 md:text-2xl">
                      {formStep === 1
                        ? "Contact seller"
                        : "Additional information"}
                    </h1>
                    <p className="mt-2 text-sm text-stone-600">
                      {formStep === 1
                        ? `Send a message about this ${carDetails.year} ${carDetails.make} ${carDetails.model}`
                        : "Complete your inquiry with a message and preferences"}
                    </p>
                  </div>

                  {/* Form progress indicator */}
                  <div className="border-b border-stone-300 bg-stone-100 px-4 py-4 md:px-6">
                    <div className="mb-4 flex items-center gap-0 border border-stone-300 bg-white p-1">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center border border-stone-300 text-xs font-bold ${
                          formStep >= 1
                            ? "bg-stone-900 text-[#f4f1ea]"
                            : "bg-white text-stone-500"
                        }`}
                      >
                        1
                      </div>
                      <div
                        className={`mx-1 h-1 flex-1 ${
                          formStep >= 2 ? "bg-emerald-600" : "bg-stone-300"
                        }`}
                      />
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center border border-stone-300 text-xs font-bold ${
                          formStep >= 2
                            ? "bg-stone-900 text-[#f4f1ea]"
                            : "bg-white text-stone-500"
                        }`}
                      >
                        2
                      </div>
                    </div>

                    <div className="flex justify-between font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-600">
                      <span>Your information</span>
                      <span>Message & preferences</span>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <form onSubmit={handleSubmit}>
                      {formStep === 1 ? (
                        // Step 1: Contact Information
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="mb-1 flex items-center font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-600"
                            >
                              <User
                                size={14}
                                className="mr-1.5 text-stone-500"
                              />
                              Your Name{" "}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`h-11 rounded-none border-2 bg-white ${
                                formErrors.name
                                  ? "border-red-600"
                                  : "border-stone-300"
                              } focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1`}
                              placeholder="Enter your full name"
                            />
                            {formErrors.name && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="mb-1 flex items-center font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-600"
                            >
                              <Mail
                                size={14}
                                className="mr-1.5 text-stone-500"
                              />
                              Email Address{" "}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`h-11 rounded-none border-2 bg-white ${
                                formErrors.email
                                  ? "border-red-600"
                                  : "border-stone-300"
                              } focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1`}
                              placeholder="your.email@example.com"
                            />
                            {formErrors.email && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.email}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="phone"
                              className="mb-1 flex items-center font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-600"
                            >
                              <Phone
                                size={14}
                                className="mr-1.5 text-stone-500"
                              />
                              Phone Number
                              {formData.preferredContact === "phone" && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`h-11 rounded-none border-2 bg-white ${
                                formErrors.phone
                                  ? "border-red-600"
                                  : "border-stone-300"
                              } focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1`}
                              placeholder="(123) 456-7890"
                            />
                            {formErrors.phone && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.phone}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="address"
                              className="mb-1 flex items-center font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-600"
                            >
                              <Home
                                size={14}
                                className="mr-1.5 text-stone-500"
                              />
                              Address
                            </label>
                            <Input
                              id="address"
                              name="address"
                              type="text"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Street address, city, state, zip code"
                              className={`h-11 rounded-none border-2 bg-white ${
                                formErrors.address
                                  ? "border-red-600"
                                  : "border-stone-300"
                              } focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1`}
                            />
                            {formErrors.address && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.address}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="mb-2 flex items-center font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-600">
                              <MessageCircle
                                size={14}
                                className="mr-1.5 text-stone-500"
                              />
                              Preferred contact
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <div
                                className={`flex cursor-pointer items-center border-2 p-3 transition-colors ${
                                  formData.preferredContact === "email"
                                    ? "border-stone-300 bg-stone-900 text-[#f4f1ea]"
                                    : "border-stone-200 bg-white hover:border-stone-500"
                                }`}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    preferredContact: "email",
                                  }))
                                }
                              >
                                <input
                                  type="radio"
                                  id="email-contact"
                                  name="preferredContact"
                                  value="email"
                                  checked={
                                    formData.preferredContact === "email"
                                  }
                                  onChange={() => {}}
                                  className="h-4 w-4 border-stone-300 text-emerald-600 focus:ring-emerald-600"
                                />
                                <label
                                  htmlFor="email-contact"
                                  className={`ml-2 flex cursor-pointer items-center text-sm ${
                                    formData.preferredContact === "email"
                                      ? "text-[#f4f1ea]"
                                      : "text-stone-800"
                                  }`}
                                >
                                  <Mail size={14} className="mr-1.5" />
                                  Email
                                </label>
                              </div>
                              <div
                                className={`flex cursor-pointer items-center border-2 p-3 transition-colors ${
                                  formData.preferredContact === "phone"
                                    ? "border-stone-300 bg-stone-900 text-[#f4f1ea]"
                                    : "border-stone-200 bg-white hover:border-stone-500"
                                }`}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    preferredContact: "phone",
                                  }))
                                }
                              >
                                <input
                                  type="radio"
                                  id="phone-contact"
                                  name="preferredContact"
                                  value="phone"
                                  checked={
                                    formData.preferredContact === "phone"
                                  }
                                  onChange={() => {}}
                                  className="h-4 w-4 border-stone-300 text-emerald-600 focus:ring-emerald-600"
                                />
                                <label
                                  htmlFor="phone-contact"
                                  className={`ml-2 flex cursor-pointer items-center text-sm ${
                                    formData.preferredContact === "phone"
                                      ? "text-[#f4f1ea]"
                                      : "text-stone-800"
                                  }`}
                                >
                                  <Phone size={14} className="mr-1.5" />
                                  Phone
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button
                              type="button"
                              onClick={handleNextStep}
                              className="w-full rounded-none border border-stone-300 bg-emerald-600 py-6 font-bold uppercase tracking-wider text-white hover:bg-emerald-500"
                            >
                              <span className="flex items-center justify-center">
                                Continue to Message{" "}
                                <ArrowRight size={18} className="ml-2" />
                              </span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Step 2: Message and Preferences
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="message"
                              className="mb-1 flex items-center font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-600"
                            >
                              <FileText
                                size={14}
                                className="mr-1.5 text-stone-500"
                              />
                              Message{" "}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows={5}
                              placeholder={`I'm interested in this ${carDetails.year} ${carDetails.make} ${carDetails.model}. Is it still available?`}
                              className={`min-h-[120px] rounded-none border-2 bg-white px-3 py-2 ${
                                formErrors.message
                                  ? "border-red-600"
                                  : "border-stone-300"
                              } focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1`}
                            />
                            {formErrors.message && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.message}
                              </p>
                            )}
                          </div>

                          <div className="border border-stone-300 bg-stone-100 p-4 rounded-none">
                            <h3 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-700">
                              Additional requests
                            </h3>
                            <div className="space-y-3">
                              {/* <div className="flex items-start">
                                <Checkbox
                                  id="requestTestDrive"
                                  checked={formData.requestTestDrive}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(
                                      "requestTestDrive",
                                      checked as boolean
                                    )
                                  }
                                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label
                                  htmlFor="requestTestDrive"
                                  className="ml-2 text-sm text-stone-700 flex items-start"
                                >
                                  <KeyRound
                                    size={14}
                                    className="mr-1.5 mt-0.5 text-stone-500"
                                  />
                                  <span>
                                    I would like to schedule a test drive
                                  </span>
                                </label>
                              </div>

                              <div className="flex items-start">
                                <Checkbox
                                  id="requestInspection"
                                  checked={formData.requestInspection}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(
                                      "requestInspection",
                                      checked as boolean
                                    )
                                  }
                                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label
                                  htmlFor="requestInspection"
                                  className="ml-2 text-sm text-stone-700 flex items-start"
                                >
                                  <Settings
                                    size={14}
                                    className="mr-1.5 mt-0.5 text-stone-500"
                                  />
                                  <span>
                                    I would like to arrange a vehicle inspection
                                  </span>
                                </label>
                              </div> */}

                              <div className="flex items-start">
                                <Checkbox
                                  id="requestFinancing"
                                  checked={formData.requestFinancing}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(
                                      "requestFinancing",
                                      checked as boolean
                                    )
                                  }
                                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label
                                  htmlFor="requestFinancing"
                                  className="ml-2 text-sm text-stone-700 flex items-start"
                                >
                                  <CreditCard
                                    size={14}
                                    className="mr-1.5 mt-0.5 text-stone-500"
                                  />
                                  <span>
                                    I would like information about financing
                                    options
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="border-t-2 border-stone-200 pt-4">
                            <div className="flex items-start">
                              <Checkbox
                                id="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(
                                    "agreeToTerms",
                                    checked as boolean
                                  )
                                }
                                className={`mt-0.5 text-emerald-600 focus:ring-emerald-500 ${
                                  formErrors.agreeToTerms
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              <label
                                htmlFor="agreeToTerms"
                                className="ml-2 text-sm text-stone-700"
                              >
                                I agree to the{" "}
                                <Link
                                  href="/terms"
                                  className="text-emerald-600 hover:underline"
                                >
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                  href="/privacy"
                                  className="text-emerald-600 hover:underline"
                                >
                                  Privacy Policy
                                </Link>
                              </label>
                            </div>
                            {formErrors.agreeToTerms && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.agreeToTerms}
                              </p>
                            )}
                          </div>

                          <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePreviousStep}
                              className="rounded-none border border-stone-300 bg-white py-6 font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-100 sm:flex-1"
                            >
                              <ChevronLeft size={18} className="mr-2" />
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="rounded-none border border-stone-300 bg-emerald-600 py-6 font-bold uppercase tracking-wider text-white hover:bg-emerald-500 sm:flex-1"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <span className="flex items-center">
                                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                  Sending...
                                </span>
                              ) : (
                                <span className="flex items-center justify-center">
                                  Send Message{" "}
                                  <ArrowRight size={18} className="ml-2" />
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Safety tips card */}
                {/* <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden mb-6">
                  <div className="p-4 md:p-6 border-b border-stone-200">
                    <h2 className="font-semibold text-stone-900 flex items-center">
                      <Shield size={18} className="mr-2 text-emerald-600" />
                      Safety Tips When Buying a Vehicle
                    </h2>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                          <MapPin size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-stone-900 text-sm mb-1">
                            Meet in safe locations
                          </h3>
                          <p className="text-stone-600 text-sm">
                            Always meet in public, well-lit areas such as
                            shopping centers or police stations.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                          <FileText size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-stone-900 text-sm mb-1">
                            Verify documentation
                          </h3>
                          <p className="text-stone-600 text-sm">
                            Check all vehicle documents including title, service
                            history, and VIN.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                          <KeyRound size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-stone-900 text-sm mb-1">
                            Test drive safely
                          </h3>
                          <p className="text-stone-600 text-sm">
                            Bring a friend along for test drives and ensure
                            proper insurance coverage.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                          <CreditCard size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-stone-900 text-sm mb-1">
                            Secure payments
                          </h3>
                          <p className="text-stone-600 text-sm">
                            Never wire money or use gift cards. Use secure
                            payment methods or cashier's checks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Right column - Car summary and seller info */}
              <div className="lg:w-1/3">
                {/* Car summary card */}
                <div className="sticky top-4 mb-6 overflow-hidden border border-stone-300 bg-white">
                  <div className="border-b border-stone-300 bg-stone-100 px-4 py-4 md:px-6">
                    <h2 className="flex items-center font-mono text-[10px] font-bold uppercase tracking-wider text-stone-700">
                      <Car size={18} className="mr-2 text-emerald-700" />
                      Vehicle details
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="relative mb-3 h-48 overflow-hidden border border-stone-300 bg-stone-100">
                      {carDetails.images && carDetails.images.length > 0 ? (
                        <Image
                          src={carDetails.images[0]}
                          alt={carDetails.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 320px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-400">
                          <Car size={32} />
                        </div>
                      )}

                      {/* Condition badge */}
                      <div className="absolute left-3 top-3">
                        <Badge className="rounded-none border border-stone-300 bg-emerald-600 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:bg-emerald-500">
                          {carDetails.condition}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="mb-1 text-lg font-semibold text-stone-900">
                      {carDetails.title}
                    </h3>
                    <p className="mb-3 text-xl font-bold text-emerald-700">
                      {formatPrice(carDetails.price, carDetails.currency)}
                    </p>

                    <Separator className="my-3 bg-stone-900" />

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-500">Year</span>
                        <span className="font-medium flex items-center">
                          <Calendar
                            size={14}
                            className="mr-1.5 text-stone-400"
                          />
                          {carDetails.year}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-500">Mileage</span>
                        <span className="font-medium flex items-center">
                          <Gauge size={14} className="mr-1.5 text-stone-400" />
                          {formatNumber(carDetails.mileage)} mi
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-500">Fuel Type</span>
                        <span className="font-medium flex items-center">
                          <Fuel size={14} className="mr-1.5 text-stone-400" />
                          {carDetails.fuelType}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-500">
                          Transmission
                        </span>
                        <span className="font-medium flex items-center">
                          <Settings
                            size={14}
                            className="mr-1.5 text-stone-400"
                          />
                          {carDetails.transmission}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-stone-600 mb-3">
                      <MapPin size={14} className="mr-1.5 text-stone-400" />
                      <span>{carDetails.location}</span>
                    </div>

                    <Link
                      href={`/car/${carId}`}
                      className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900 underline decoration-emerald-600 decoration-2 underline-offset-4 hover:text-emerald-800"
                    >
                      View full details
                      <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Seller info card - only show if available */}
                {carDetails.sellerInfo && (
                  <div className="sticky top-[calc(4rem+350px)] overflow-hidden border border-stone-300 bg-white">
                    <div className="border-b border-stone-300 bg-stone-100 px-4 py-4 md:px-6">
                      <h2 className="flex items-center font-mono text-[10px] font-bold uppercase tracking-wider text-stone-700">
                        <User size={18} className="mr-2 text-emerald-700" />
                        Seller information
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="mb-4 flex items-center">
                        <div className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center border border-stone-300 bg-emerald-50 text-lg font-semibold text-emerald-800">
                          {carDetails.sellerInfo.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-stone-900">
                              {carDetails.sellerInfo.name}
                            </p>
                            {carDetails.sellerInfo.verified && (
                              <Badge
                                variant="outline"
                                className="ml-2 rounded-none border border-stone-300 bg-white font-mono text-[9px] font-bold uppercase tracking-wider text-stone-900"
                              >
                                <Shield size={12} className="mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-stone-500">
                            Member since {carDetails.sellerInfo.memberSince}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center border border-stone-300 bg-white p-2 rounded-none">
                          <Clock size={16} className="mr-2 text-stone-500" />
                          <div>
                            <span className="text-stone-600 block">
                              Response time
                            </span>
                            <span className="font-medium">
                              {carDetails.sellerInfo.responseTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center border border-stone-300 bg-white p-2 rounded-none">
                          <MapPin size={16} className="mr-2 text-stone-500" />
                          <div>
                            <span className="text-stone-600 block">
                              Location
                            </span>
                            <span className="font-medium">
                              {carDetails.sellerInfo.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center border border-stone-300 bg-white p-2 rounded-none">
                          <MessageCircle
                            size={16}
                            className="mr-2 text-stone-500"
                          />
                          <div>
                            <span className="text-stone-600 block">
                              Response rate
                            </span>
                            <span className="font-medium">
                              {carDetails.sellerInfo.responseRate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
