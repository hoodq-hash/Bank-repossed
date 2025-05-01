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

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();

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
        const response = await fetch(`/api/cars/${params.id}`);

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
        const mockCarDetails: Car = {
          id: params.id,
          title: "Volkswagen Jetta 2007 Gold",
          price: 12500,
          currency: "$",
          location: "San Francisco, CA",
          condition: "Used",
          transmission: "Manual",
          year: 2007,
          make: "Volkswagen",
          model: "Jetta",
          color: "Gold",
          engineSize: "2000",
          fuelType: "Petrol",
          mileage: 42300,
          images: ["/cars/volkswagen-jetta-gold.jpg"],
          description:
            "Well maintained Volkswagen Jetta in excellent condition.",
          createdAt: new Date().toISOString(),
          sellerInfo: {
            name: "AutoWorld Dealer",
            verified: true,
            memberSince: "2019",
            responseRate: "95%",
            responseTime: "Within 2 hours",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
          },
        };

        setCarDetails(mockCarDetails);
        toast.error("Using demo data - couldn't connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [params.id]);

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
      setIsSubmitting(true);

      // Prepare email content
      const subject = `Inquiry about ${carDetails.year} ${carDetails.make} ${carDetails.model} (ID: ${params.id})`;
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


This message was sent from Chariot's auto website.
`;

      // Encode email parameters
      const mailtoLink = `mailto:chariotautosales@gmail.com?subject=${encodeURIComponent(
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
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-4 md:py-6 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading car details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if no car details
  if (!carDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-4 md:py-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Car Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                {loadingError || "We couldn't find the car you're looking for."}
              </p>
              <Link href="/shop">
                <Button className="bg-blue-600 hover:bg-blue-700">
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb navigation */}
          <div className="mb-4 text-xs md:text-sm text-gray-500 flex flex-wrap items-center">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-blue-600">
              Cars
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/car/${params.id}`} className="hover:text-blue-600">
              {carDetails.make} {carDetails.model}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Contact Seller</span>
          </div>

          {/* Back button */}
          <Link
            href={`/car/${params.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="ml-1">Back to car details</span>
          </Link>

          {isSubmitted ? (
            // Success message after form submission
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Message Sent Successfully!
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your message has been sent to{" "}
                <span className="font-medium">
                  {carDetails.sellerInfo?.name || "the seller"}
                </span>
                .
                {carDetails.sellerInfo?.responseTime &&
                  ` They typically respond ${carDetails.sellerInfo.responseTime.toLowerCase()}.`}
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Info size={16} className="mr-1.5" />
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <Check size={14} className="mr-2 mt-1 text-blue-600" />
                    <span>The seller will review your inquiry</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={14} className="mr-2 mt-1 text-blue-600" />
                    <span>
                      They'll contact you via your preferred method (
                      {formData.preferredContact})
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check size={14} className="mr-2 mt-1 text-blue-600" />
                    <span>
                      You can discuss details, arrange viewings 
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/car/${params.id}`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Return to Car Details
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Contact form */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6">
                    <h1 className="text-xl md:text-2xl font-bold mb-2">
                      {formStep === 1
                        ? "Contact Seller"
                        : "Additional Information"}
                    </h1>
                    <p className="opacity-90">
                      {formStep === 1
                        ? `Send a message about this ${carDetails.year} ${carDetails.make} ${carDetails.model}`
                        : "Complete your inquiry with a message and preferences"}
                    </p>
                  </div>

                  {/* Form progress indicator */}
                  <div className="px-4 md:px-6 pt-4">
                    <div className="flex items-center mb-6">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          formStep >= 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        1
                      </div>
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          formStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          formStep >= 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        2
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-6">
                      <span>Your Information</span>
                      <span>Message & Preferences</span>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 pt-0">
                    <form onSubmit={handleSubmit}>
                      {formStep === 1 ? (
                        // Step 1: Contact Information
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                            >
                              <User
                                size={14}
                                className="mr-1.5 text-gray-500"
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
                              className={`${
                                formErrors.name ? "border-red-500" : ""
                              } focus:border-blue-500 focus:ring-blue-500`}
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
                              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                            >
                              <Mail
                                size={14}
                                className="mr-1.5 text-gray-500"
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
                              className={`${
                                formErrors.email ? "border-red-500" : ""
                              } focus:border-blue-500 focus:ring-blue-500`}
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
                              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                            >
                              <Phone
                                size={14}
                                className="mr-1.5 text-gray-500"
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
                              className={`${
                                formErrors.phone ? "border-red-500" : ""
                              } focus:border-blue-500 focus:ring-blue-500`}
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
                              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                            >
                              <Home
                                size={14}
                                className="mr-1.5 text-gray-500"
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
                              className={`${
                                formErrors.address ? "border-red-500" : ""
                              } focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {formErrors.address && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.address}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <MessageCircle
                                size={14}
                                className="mr-1.5 text-gray-500"
                              />
                              Preferred Contact Method
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <div
                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                  formData.preferredContact === "email"
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
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
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor="email-contact"
                                  className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center"
                                >
                                  <Mail size={14} className="mr-1.5" />
                                  Email
                                </label>
                              </div>
                              <div
                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                  formData.preferredContact === "phone"
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
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
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor="phone-contact"
                                  className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center"
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
                              className="w-full bg-blue-600 hover:bg-blue-700 py-6"
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
                              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                            >
                              <FileText
                                size={14}
                                className="mr-1.5 text-gray-500"
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
                              className={`${
                                formErrors.message ? "border-red-500" : ""
                              } focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {formErrors.message && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {formErrors.message}
                              </p>
                            )}
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-800 mb-3">
                              Additional Requests
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
                                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor="requestTestDrive"
                                  className="ml-2 text-sm text-gray-700 flex items-start"
                                >
                                  <KeyRound
                                    size={14}
                                    className="mr-1.5 mt-0.5 text-gray-500"
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
                                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor="requestInspection"
                                  className="ml-2 text-sm text-gray-700 flex items-start"
                                >
                                  <Settings
                                    size={14}
                                    className="mr-1.5 mt-0.5 text-gray-500"
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
                                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor="requestFinancing"
                                  className="ml-2 text-sm text-gray-700 flex items-start"
                                >
                                  <CreditCard
                                    size={14}
                                    className="mr-1.5 mt-0.5 text-gray-500"
                                  />
                                  <span>
                                    I would like information about financing
                                    options
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-200">
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
                                className={`mt-0.5 text-blue-600 focus:ring-blue-500 ${
                                  formErrors.agreeToTerms
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              <label
                                htmlFor="agreeToTerms"
                                className="ml-2 text-sm text-gray-700"
                              >
                                I agree to the{" "}
                                <Link
                                  href="/terms"
                                  className="text-blue-600 hover:underline"
                                >
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                  href="/privacy"
                                  className="text-blue-600 hover:underline"
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
                              className="py-6 sm:flex-1"
                            >
                              <ChevronLeft size={18} className="mr-2" />
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 py-6 sm:flex-1"
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
                {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                  <div className="p-4 md:p-6 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900 flex items-center">
                      <Shield size={18} className="mr-2 text-blue-600" />
                      Safety Tips When Buying a Vehicle
                    </h2>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <MapPin size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm mb-1">
                            Meet in safe locations
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Always meet in public, well-lit areas such as
                            shopping centers or police stations.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm mb-1">
                            Verify documentation
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Check all vehicle documents including title, service
                            history, and VIN.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <KeyRound size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm mb-1">
                            Test drive safely
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Bring a friend along for test drives and ensure
                            proper insurance coverage.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <CreditCard size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm mb-1">
                            Secure payments
                          </h3>
                          <p className="text-gray-600 text-sm">
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 sticky top-4">
                  <div className="p-4 md:p-6 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900 flex items-center">
                      <Car size={18} className="mr-2 text-blue-600" />
                      Vehicle Details
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="relative h-48 rounded-md overflow-hidden mb-3 group">
                      {carDetails.images && carDetails.images.length > 0 ? (
                        <>
                          <Image
                            src={carDetails.images[0]}
                            alt={carDetails.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <Car size={32} />
                        </div>
                      )}

                      {/* Condition badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                          {carDetails.condition}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="font-medium text-lg mb-1">
                      {carDetails.title}
                    </h3>
                    <p className="text-xl font-bold text-blue-600 mb-3">
                      {formatPrice(carDetails.price, carDetails.currency)}
                    </p>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Year</span>
                        <span className="font-medium flex items-center">
                          <Calendar
                            size={14}
                            className="mr-1.5 text-gray-400"
                          />
                          {carDetails.year}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Mileage</span>
                        <span className="font-medium flex items-center">
                          <Gauge size={14} className="mr-1.5 text-gray-400" />
                          {formatNumber(carDetails.mileage)} mi
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Fuel Type</span>
                        <span className="font-medium flex items-center">
                          <Fuel size={14} className="mr-1.5 text-gray-400" />
                          {carDetails.fuelType}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          Transmission
                        </span>
                        <span className="font-medium flex items-center">
                          <Settings
                            size={14}
                            className="mr-1.5 text-gray-400"
                          />
                          {carDetails.transmission}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin size={14} className="mr-1.5 text-gray-400" />
                      <span>{carDetails.location}</span>
                    </div>

                    <Link
                      href={`/car/${params.id}`}
                      className="text-blue-600 text-sm hover:underline flex items-center"
                    >
                      View full details
                      <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Seller info card - only show if available */}
                {carDetails.sellerInfo && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-[calc(4rem+350px)]">
                    <div className="p-4 md:p-6 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-900 flex items-center">
                        <User size={18} className="mr-2 text-blue-600" />
                        Seller Information
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg font-semibold">
                          {carDetails.sellerInfo.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">
                              {carDetails.sellerInfo.name}
                            </p>
                            {carDetails.sellerInfo.verified && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-green-50 text-green-700 border-green-200"
                              >
                                <Shield size={12} className="mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Member since {carDetails.sellerInfo.memberSince}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <Clock size={16} className="mr-2 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">
                              Response time
                            </span>
                            <span className="font-medium">
                              {carDetails.sellerInfo.responseTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <MapPin size={16} className="mr-2 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">
                              Location
                            </span>
                            <span className="font-medium">
                              {carDetails.sellerInfo.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <MessageCircle
                            size={16}
                            className="mr-2 text-gray-500"
                          />
                          <div>
                            <span className="text-gray-600 block">
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
