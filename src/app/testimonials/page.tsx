"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Search,
  Filter,
  MessageSquare,
  User,
  Car,
  ThumbsUp,
  Share2,
  Flag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Vehicle types for testimonial categories
const vehicleTypes = [
  "Sedan",
  "SUV",
  "Truck",
  "Sports Car",
  "Luxury",
  "Electric",
  "Hybrid",
  "Minivan",
  "Compact",
  "Convertible",
];

// Service types for testimonial categories
const serviceTypes = [
  "Sales",
  "Financing",
  "Service & Repair",
  "Parts",
  "Trade-In",
  "Detailing",
];

// Generate initial testimonials
const generateInitialTestimonials = () => {
  const names = [
    "Michael Johnson",
    "Sarah Williams",
    "David Brown",
    "Jennifer Davis",
    "Robert Miller",
    "Lisa Garcia",
    "James Wilson",
    "Patricia Martinez",
    "John Taylor",
    "Elizabeth Anderson",
    "Thomas Jackson",
    "Margaret White",
    "Richard Harris",
    "Susan Martin",
    "Charles ",
    "Jessica Robinson",
    "Joseph Lewis",
    "Nancy Walker",
    "Christopher Allen",
    "Karen Young",
    "Daniel King",
    "Betty Scott",
    "Matthew Green",
    "Dorothy Baker",
    "Anthony Hill",
    "Sandra Adams",
    "Mark Nelson",
    "Ashley Mitchell",
    "Donald Roberts",
    "Kimberly Carter",
    "Steven Phillips",
    "Emily Evans",
    "Paul Turner",
    "Donna Collins",
    "Andrew Campbell",
    "Rebecca Edwards",
    "Joshua Stewart",
    "Kathleen Morris",
    "Kenneth Cook",
    "Carol Morgan",
  ];

  const vehicleModels = [
    "Accord",
    "Civic",
    "CR-V",
    "Camry",
    "Corolla",
    "RAV4",
    "F-150",
    "Silverado",
    "Mustang",
    "Wrangler",
    "Cherokee",
    "Explorer",
    "Escape",
    "Equinox",
    "Tahoe",
    "Suburban",
    "Altima",
    "Rogue",
    "Pathfinder",
    "Outback",
    "Forester",
    "Legacy",
    "Sonata",
    "Elantra",
    "Santa Fe",
    "Tucson",
    "Sorento",
    "Sportage",
    "Telluride",
    "Model 3",
    "Model Y",
    "Bolt",
    "Leaf",
    "Prius",
    "Highlander",
    "4Runner",
  ];

  const testimonialContents = [
    "I couldn't be happier with my experience at Bank Repossessed Cars. The staff was friendly, knowledgeable, and made the car buying process so smooth. I'll definitely be recommending them to friends and family!",
    "After visiting several dealerships, I found Bank Repossessed Cars to be the most transparent and pressure-free. They took the time to understand my needs and helped me find the perfect vehicle within my budget.",
    "The service department at Bank Repossessed Cars is exceptional. My car was fixed right the first time, and they even provided a courtesy vehicle while mine was in the shop. Top-notch customer service!",
    "Financing was a breeze at Bank Repossessed Cars. Lisa in the finance department worked miracles to get me approved with a great rate despite my less-than-perfect credit history.",
    "I was nervous about buying my first car, but the team at Bank Repossessed Cars made it stress-free. They explained everything clearly and never made me feel pressured or rushed.",
    "The selection at Bank Repossessed Cars is impressive. They had exactly what I was looking for, and the vehicle was in pristine condition. The 200-point inspection they do really shows in the quality.",
    "Trading in my old vehicle was quick and painless. They gave me a fair offer and handled all the paperwork efficiently. I was driving my new car home the same day!",
    "I've been a customer of Bank Repossessed Cars for over 10 years now, and I wouldn't go anywhere else. They remember me by name and always provide exceptional service.",
    "The follow-up service after my purchase was impressive. Bank Repossessed Cars called to check how I was enjoying my new vehicle and reminded me about my first service appointment. That's customer care!",
    "I appreciate how Bank Repossessed Cars embraces technology. Their online inventory was accurate, and I could do most of the paperwork digitally before arriving at the dealership.",
    "The entire staff at Bank Repossessed Cars is knowledgeable about their inventory. When I had specific questions about the hybrid system in my new car, they had answers ready.",
    "I had a unique situation with my financing needs, and Bank Repossessed Cars went above and beyond to find a solution that worked for me. I couldn't be more grateful.",
    "The no-haggle pricing at Bank Repossessed Cars was refreshing. The price was fair from the start, which made the whole experience more pleasant.",
    "I was impressed by how clean and well-maintained all the vehicles at Bank Repossessed Cars were. It shows they take pride in their inventory and respect their customers.",
    "Bank Repossessed Cars made buying a car with my family enjoyable. They had a comfortable waiting area for my children and were patient as we made our decision.",
    "The warranty coverage offered at Bank Repossessed Cars gave me peace of mind with my purchase. They clearly explained all the details and made sure I understood what was covered.",
    "I've had my vehicle serviced at Bank Repossessed Cars for years, and they always provide honest assessments and fair pricing. I trust them completely with my car.",
    "When my car unexpectedly broke down, Bank Repossessed Cars service department got me in right away and had me back on the road quickly. Their emergency service is outstanding.",
    "I purchased a certified pre-owned vehicle from Bank Repossessed Cars , and it has been as reliable as a new car. Their certification process is clearly thorough.",
    "The sales consultant at Bank Repossessed Cars listened to my needs instead of trying to upsell me. I ended up with exactly the right vehicle for my lifestyle.",
    "Bank Repossessed Cars has the best selection of electric vehicles in the area. Their staff is knowledgeable about EV technology and charging options.",
    "I appreciated that Bank Repossessed Cars offers a 3-day return policy. It gave me confidence in my purchase knowing I could bring it back if I wasn't completely satisfied.",
    "The detailing service at Bank Repossessed Cars is exceptional. My car looks better than when I first bought it! They pay attention to every detail.",
    "Bank Repossessed Cars made the paperwork process painless. Everything was prepared in advance, and they explained each document clearly.",
    "I was impressed by the thorough test drive experience at Bank Repossessed Cars . They encouraged me to take different routes to really get a feel for the vehicle.",
    "When I needed parts for my older model vehicle, Bank Repossessed Cars parts department went the extra mile to locate exactly what I needed. Great service!",
    "The courtesy shuttle service at Bank Repossessed Cars saved me so much time when my car was in for service. The driver was prompt and friendly too.",
    "I've purchased three vehicles from Bank Repossessed Cars over the years, and each experience has been consistently excellent. They've earned a customer for life.",
    "The staff at Bank Repossessed Cars remembers their customers. When I came in for service, they recalled details about my purchase from years ago.",
    "Bank Repossessed Cars has fair prices on their vehicles, but what really sets them apart is the exceptional customer service after the sale.",
    "I appreciate how Bank Repossessed Cars embraces new technology but still provides that personal touch that makes car buying a positive experience.",
    "The team at Bank Repossessed Cars helped me find the perfect family vehicle that met all our needs and still fit our budget. We couldn't be happier!",
    "Bank Repossessed Cars has a great selection of pre-owned luxury vehicles that look and drive like new. I got a premium car at a great price.",
    "When my vehicle needed an unexpected repair, Bank Repossessed Cars service department explained the issue clearly and provided options that fit my budget.",
    "I was dreading buying a new car until I visited Bank Repossessed Cars . They made it enjoyable and stress-free from start to finish.",
  ];

  return Array.from({ length: 35 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    const randomStars = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
    const randomVehicleType =
      vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    const randomServiceType =
      serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomVehicle =
      vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
    const randomYear = 2015 + Math.floor(Math.random() * 9); // 2015-2023
    const randomContent =
      testimonialContents[
        Math.floor(Math.random() * testimonialContents.length)
      ];
    const verified = Math.random() > 0.2; // 80% chance of being verified

    return {
      id: `testimonial-${i + 1}`,
      author: randomName,
      rating: randomStars,
      date: date.toISOString(),
      title: `${
        randomStars === 5 ? "Excellent" : "Great"
      } experience with my ${randomYear} ${randomVehicle}`,
      content: randomContent,
      vehicle: `${randomYear} ${randomVehicle}`,
      vehicleType: randomVehicleType,
      serviceType: randomServiceType,
      verified: verified,
      helpful: Math.floor(Math.random() * 20),
      image: `/images/testimonials/avatar-${(i % 12) + 1}.jpg`,
      response:
        Math.random() > 0.7
          ? {
              author: "Bank Repossessed Cars ",
              role: "Owner",
              date: new Date(
                new Date(date).getTime() + 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              content:
                "Thank you so much for your kind words! We're thrilled that you had such a positive experience with us. Our team works hard to provide excellent service, and it's rewarding to hear that we succeeded in your case. We look forward to serving you again in the future!",
            }
          : null,
    };
  });
};

// Testimonial type definition
interface Testimonial {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  vehicle: string;
  vehicleType: string;
  serviceType: string;
  verified: boolean;
  helpful: number;
  image: string;
  response: {
    author: string;
    role: string;
    date: string;
    content: string;
  } | null;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<
    Testimonial[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string | null>(
    null
  );
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string | null>(
    null
  );
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({
    author: "",
    email: "",
    rating: 5,
    title: "",
    content: "",
    vehicle: "",
    vehicleType: "",
    serviceType: "",
    agreeToTerms: false,
  });

  // Load testimonials from localStorage or initialize with default data
  useEffect(() => {
    const storedTestimonials = localStorage.getItem("bank-repo-testimonials");
    if (storedTestimonials) {
      setTestimonials(JSON.parse(storedTestimonials));
    } else {
      const initialTestimonials = generateInitialTestimonials();
      setTestimonials(initialTestimonials);
      localStorage.setItem(
        "bank-repo-testimonials",
        JSON.stringify(initialTestimonials)
      );
    }
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let filtered = [...testimonials];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.author.toLowerCase().includes(term) ||
          t.title.toLowerCase().includes(term) ||
          t.content.toLowerCase().includes(term) ||
          t.vehicle.toLowerCase().includes(term)
      );
    }

    // Apply rating filter
    if (ratingFilter !== null) {
      filtered = filtered.filter((t) => t.rating === ratingFilter);
    }

    // Apply vehicle type filter
    if (vehicleTypeFilter) {
      filtered = filtered.filter((t) => t.vehicleType === vehicleTypeFilter);
    }

    // Apply service type filter
    if (serviceTypeFilter) {
      filtered = filtered.filter((t) => t.serviceType === serviceTypeFilter);
    }

    // Apply verified filter
    if (verifiedFilter) {
      filtered = filtered.filter((t) => t.verified);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        filtered = filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highest":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered = filtered.sort((a, b) => a.rating - b.rating);
        break;
    }

    setFilteredTestimonials(filtered);
  }, [
    testimonials,
    searchTerm,
    ratingFilter,
    vehicleTypeFilter,
    serviceTypeFilter,
    verifiedFilter,
    sortBy,
  ]);

  // Handle new testimonial form changes
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewTestimonial((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle rating selection
  const handleRatingChange = (rating: number) => {
    setNewTestimonial((prev) => ({ ...prev, rating }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  // Handle testimonial submission
  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTestimonial.agreeToTerms) {
      setFormStatus({
        submitted: true,
        success: false,
        message:
          "Please agree to the terms and conditions to submit your testimonial.",
      });
      return;
    }

    // Create new testimonial object
    const newTestimonialObj: Testimonial = {
      id: `testimonial-${Date.now()}`,
      author: newTestimonial.author,
      rating: newTestimonial.rating,
      date: new Date().toISOString(),
      title: newTestimonial.title,
      content: newTestimonial.content,
      vehicle: newTestimonial.vehicle,
      vehicleType: newTestimonial.vehicleType,
      serviceType: newTestimonial.serviceType,
      verified: false, // New testimonials start as unverified
      helpful: 0,
      image: `/images/testimonials/avatar-${
        Math.floor(Math.random() * 12) + 1
      }.jpg`,
      response: null,
    };

    // Add to testimonials array
    const updatedTestimonials = [newTestimonialObj, ...testimonials];
    setTestimonials(updatedTestimonials);

    // Save to localStorage
    localStorage.setItem(
      "bank-repo-testimonials",
      JSON.stringify(updatedTestimonials)
    );

    // Show success message
    setFormStatus({
      submitted: true,
      success: true,
      message:
        "Thank you for sharing your experience! Your testimonial has been submitted and will be reviewed shortly.",
    });

    // Reset form
    setNewTestimonial({
      author: "",
      email: "",
      rating: 5,
      title: "",
      content: "",
      vehicle: "",
      vehicleType: "",
      serviceType: "",
      agreeToTerms: false,
    });

    // Close form after delay
    setTimeout(() => {
      setShowAddForm(false);
      setFormStatus(null);
    }, 3000);
  };

  // Handle marking a testimonial as helpful
  const handleMarkHelpful = (id: string) => {
    const updatedTestimonials = testimonials.map((testimonial) => {
      if (testimonial.id === id) {
        return { ...testimonial, helpful: testimonial.helpful + 1 };
      }
      return testimonial;
    });

    setTestimonials(updatedTestimonials);
    localStorage.setItem(
      "bank-repo-testimonials",
      JSON.stringify(updatedTestimonials)
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setRatingFilter(null);
    setVehicleTypeFilter(null);
    setServiceTypeFilter(null);
    setVerifiedFilter(false);
    setSortBy("newest");
  };

  // Handle rating filter change
  const handleRatingFilterChange = (value: string) => {
    const rating = parseInt(value);
    setRatingFilter(rating === ratingFilter ? null : rating);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea] text-stone-900 antialiased">
      <Navbar />

      <main className="flex-grow">
        <section className="border-b border-stone-300 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
              <div className="md:col-span-8">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  Reviews
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  What buyers say about Bank Repossessed Cars
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
                  Real experiences from sales, financing, and service—filter by
                  rating, vehicle type, or verified purchases.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:col-span-4 md:justify-end">
                <Button
                  type="button"
                  className="h-12 rounded-none border border-stone-300 bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-500"
                  onClick={() => setShowAddForm(true)}
                >
                  Share your experience
                  <MessageSquare size={16} className="ml-2" />
                </Button>
                <Link href="/shop">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-none border border-stone-300 bg-transparent px-6 font-bold text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea] sm:w-auto"
                  >
                    View inventory
                    <Car size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-white py-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-px border border-stone-300 bg-stone-300 md:grid-cols-4">
              <div className="bg-[#f4f1ea] px-4 py-6 text-center md:px-6">
                <div className="font-mono text-2xl font-bold text-stone-900 md:text-3xl">
                  {testimonials.length}+
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-600">
                  Stories shared
                </div>
              </div>
              <div className="bg-[#f4f1ea] px-4 py-6 text-center md:px-6">
                <div className="font-mono text-2xl font-bold text-stone-900 md:text-3xl">
                  4.8
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-600">
                  Avg. rating
                </div>
              </div>
              <div className="bg-[#f4f1ea] px-4 py-6 text-center md:px-6">
                <div className="font-mono text-2xl font-bold text-stone-900 md:text-3xl">
                  92%
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-600">
                  Verified
                </div>
              </div>
              <div className="bg-[#f4f1ea] px-4 py-6 text-center md:px-6">
                <div className="font-mono text-2xl font-bold text-stone-900 md:text-3xl">
                  28+
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-600">
                  Years serving buyers
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-white py-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                Customer reviews{" "}
                <span className="font-mono text-2xl text-stone-900">
                  ({filteredTestimonials.length})
                </span>
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search reviews…"
                    className="w-full rounded-none border border-stone-300 bg-white pl-10 sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none border border-stone-300 font-bold"
                    >
                      <Filter size={16} className="mr-2" />
                      Sort:{" "}
                      {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-none border border-stone-300">
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest first
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Oldest first
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("highest")}>
                      Highest rated
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("lowest")}>
                      Lowest rated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="border border-stone-300 bg-[#f4f1ea] p-5 md:p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div>
                  <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600">
                    Rating
                  </Label>
                  <RadioGroup
                    value={ratingFilter?.toString() || ""}
                    onValueChange={handleRatingFilterChange}
                    className="space-y-2"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`rating-${rating}`}
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="ml-2 flex items-center font-normal"
                        >
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="fill-emerald-600 text-emerald-600"
                            />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-stone-300"
                            />
                          ))}
                          <span className="ml-2 text-stone-700">
                            {rating} {rating === 1 ? "star" : "stars"}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600">
                    Vehicle type
                  </Label>
                  <Select
                    value={vehicleTypeFilter ?? "all"}
                    onValueChange={(value) =>
                      setVehicleTypeFilter(
                        !value || value === "all" ? null : value
                      )
                    }
                  >
                    <SelectTrigger className="rounded-none border border-stone-300 bg-white">
                      <SelectValue placeholder="All vehicle types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicle Types</SelectItem>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600">
                    Service type
                  </Label>
                  <Select
                    value={serviceTypeFilter ?? "all"}
                    onValueChange={(value) =>
                      setServiceTypeFilter(
                        !value || value === "all" ? null : value
                      )
                    }
                  >
                    <SelectTrigger className="rounded-none border border-stone-300 bg-white">
                      <SelectValue placeholder="All service types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Service Types</SelectItem>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600">
                    More filters
                  </Label>
                  <div className="mb-4 flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={verifiedFilter}
                      onCheckedChange={(checked) =>
                        setVerifiedFilter(!!checked)
                      }
                    />
                    <Label htmlFor="verified" className="font-normal text-sm">
                      Verified purchases only
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-none border border-stone-300 font-bold"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 py-12">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            {filteredTestimonials.length === 0 ? (
              <div className="border border-stone-300 bg-white px-6 py-16 text-center">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  No matches
                </p>
                <h3 className="mt-3 text-xl font-bold text-stone-900">
                  No testimonials found
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-stone-600">
                  We couldn&apos;t find any testimonials matching your filters.
                  Try clearing filters or broadening your search.
                </p>
                <Button
                  type="button"
                  className="mt-8 rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTestimonials.map((testimonial) => (
                  <motion.article
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    viewport={{ once: true }}
                    className="border border-stone-300 bg-white"
                  >
                    <div className="p-6">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-stone-900">
                              {testimonial.author}
                            </h3>
                            {testimonial.verified && (
                              <span className="inline-flex items-center border border-stone-300 bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-950">
                                <CheckCircle2 size={12} className="mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {Array.from({ length: testimonial.rating }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className="fill-emerald-600 text-emerald-600"
                                />
                              )
                            )}
                            {Array.from({
                              length: 5 - testimonial.rating,
                            }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="text-stone-300"
                              />
                            ))}
                            <span className="font-mono text-xs text-stone-500">
                              {new Date(
                                testimonial.date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="border border-stone-300 bg-[#f4f1ea] px-2 py-1 text-xs font-bold uppercase tracking-wider text-stone-800">
                            {testimonial.vehicleType}
                          </span>
                          <span className="border border-stone-300 bg-white px-2 py-1 text-xs font-bold uppercase tracking-wider text-stone-700">
                            {testimonial.serviceType}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 border-l-4 border-emerald-600 pl-4">
                        <h4 className="font-bold text-stone-900">
                          {testimonial.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600 md:text-base">
                          {testimonial.content}
                        </p>
                        <p className="mt-2 font-mono text-xs text-stone-500">
                          Vehicle: {testimonial.vehicle}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-4 border-t-2 border-stone-200 pt-4">
                        <button
                          type="button"
                          className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-700 underline decoration-2 underline-offset-4 hover:text-emerald-800"
                          onClick={() => handleMarkHelpful(testimonial.id)}
                        >
                          <ThumbsUp size={14} className="mr-1" />
                          Helpful ({testimonial.helpful})
                        </button>
                        <button
                          type="button"
                          className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-700 underline decoration-2 underline-offset-4 hover:text-emerald-800"
                        >
                          <Share2 size={14} className="mr-1" />
                          Share
                        </button>
                        <button
                          type="button"
                          className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-700 underline decoration-2 underline-offset-4 hover:text-red-700"
                        >
                          <Flag size={14} className="mr-1" />
                          Report
                        </button>
                      </div>

                      {testimonial.response && (
                        <div className="mt-6 border border-dashed border-stone-300 bg-[#f4f1ea] p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-stone-300 bg-white">
                              <User className="h-5 w-5 text-emerald-700" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-baseline gap-2">
                                <h4 className="font-bold text-stone-900">
                                  {testimonial.response.author}
                                </h4>
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                  {testimonial.response.role}
                                </span>
                              </div>
                              <div className="mt-1 font-mono text-xs text-stone-500">
                                {new Date(
                                  testimonial.response.date
                                ).toLocaleDateString()}
                              </div>
                              <p className="mt-2 text-sm text-stone-600">
                                {testimonial.response.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Add Testimonial Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none border border-stone-300 bg-[#f4f1ea] sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
              <DialogDescription>
                Tell us about your experience with Bank Repossessed Cars. Your
                feedback helps us improve and helps other customers make
                informed decisions.
              </DialogDescription>
            </DialogHeader>

            {formStatus?.submitted ? (
              <div className="py-6">
                <Alert
                  className={
                    formStatus.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }
                >
                  <div className="flex items-start">
                    {formStatus.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="ml-3">
                      <AlertTitle
                        className={
                          formStatus.success ? "text-green-800" : "text-red-800"
                        }
                      >
                        {formStatus.success
                          ? "Testimonial Submitted Successfully"
                          : "Error Submitting Testimonial"}
                      </AlertTitle>
                      <AlertDescription
                        className={
                          formStatus.success ? "text-green-700" : "text-red-700"
                        }
                      >
                        {formStatus.message}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              </div>
            ) : (
              <form onSubmit={handleSubmitTestimonial}>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="author"
                        className="text-stone-700 mb-1.5 block"
                      >
                        Your Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="author"
                        name="author"
                        value={newTestimonial.author}
                        onChange={handleFormChange}
                        placeholder="Enter your name"
                        required
                        className="rounded-none border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-stone-700 mb-1.5 block"
                      >
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newTestimonial.email}
                        onChange={handleFormChange}
                        placeholder="Enter your email"
                        required
                        className="rounded-none border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-stone-700 mb-1.5 block">
                      Rating <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(rating)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={`${
                              rating <= newTestimonial.rating
                                ? "text-emerald-400 fill-current"
                                : "text-stone-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-stone-600">
                        {newTestimonial.rating} of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="title"
                      className="text-stone-700 mb-1.5 block"
                    >
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={newTestimonial.title}
                      onChange={handleFormChange}
                      placeholder="Summarize your experience"
                      required
                      className="rounded-none border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="content"
                      className="text-stone-700 mb-1.5 block"
                    >
                      Your Review <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={newTestimonial.content}
                      onChange={handleFormChange}
                      placeholder="Tell us about your experience with Bank Repossessed Cars"
                      required
                      className="min-h-[120px] rounded-none border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="vehicle"
                      className="text-stone-700 mb-1.5 block"
                    >
                      Vehicle Purchased/Serviced
                    </Label>
                    <Input
                      id="vehicle"
                      name="vehicle"
                      value={newTestimonial.vehicle}
                      onChange={handleFormChange}
                      placeholder="e.g., 2022 Honda Accord"
                      className="rounded-none border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="vehicleType"
                        className="text-stone-700 mb-1.5 block"
                      >
                        Vehicle Type
                      </Label>
                      <Select
                        value={newTestimonial.vehicleType}
                        onValueChange={(value) =>
                          handleSelectChange("vehicleType", value)
                        }
                      >
                        <SelectTrigger className="rounded-none border border-stone-300 bg-white">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="serviceType"
                        className="text-stone-700 mb-1.5 block"
                      >
                        Service Type
                      </Label>
                      <Select
                        value={newTestimonial.serviceType}
                        onValueChange={(value) =>
                          handleSelectChange("serviceType", value)
                        }
                      >
                        <SelectTrigger className="rounded-none border border-stone-300 bg-white">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={newTestimonial.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("agreeToTerms", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="font-normal text-sm text-stone-600"
                    >
                      I confirm this is a genuine review based on my own
                      experience. I understand that Bank Repossessed Cars may
                      publish this review on their website and other marketing
                      materials.
                    </Label>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none border border-stone-300 font-bold"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                  >
                    Submit review
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <section className="border-t border-stone-300 bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  Next step
                </p>
                <h2 className="mt-3 text-2xl font-bold text-stone-900 md:text-3xl">
                  Ready to shop repo inventory?
                </h2>
                <p className="mt-4 text-sm text-stone-600 md:text-base">
                  Browse listings with the same transparency our reviewers
                  describe—then reach out when you are ready.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/shop">
                    <Button className="rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500">
                      Browse inventory
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none border border-stone-300 font-bold"
                    onClick={() => setShowAddForm(true)}
                  >
                    Share your story
                    <MessageSquare size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
              <div className="border border-stone-300 bg-stone-200">
                <Image
                  src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Happy customers at Bank Repossessed Cars"
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
