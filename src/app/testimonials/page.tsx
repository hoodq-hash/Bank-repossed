"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Calendar,
  Car,
  ThumbsUp,
  Share2,
  Flag,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
    "I couldn't be happier with my experience at Chariot Auto Sales. The staff was friendly, knowledgeable, and made the car buying process so smooth. I'll definitely be recommending them to friends and family!",
    "After visiting several dealerships, I found Chariot's to be the most transparent and pressure-free. They took the time to understand my needs and helped me find the perfect vehicle within my budget.",
    "The service department at Chariot's is exceptional. My car was fixed right the first time, and they even provided a courtesy vehicle while mine was in the shop. Top-notch customer service!",
    "Financing was a breeze at Chariot Auto Sales. Lisa in the finance department worked miracles to get me approved with a great rate despite my less-than-perfect credit history.",
    "I was nervous about buying my first car, but the team at Chariot's made it stress-free. They explained everything clearly and never made me feel pressured or rushed.",
    "The selection at Chariot's is impressive. They had exactly what I was looking for, and the vehicle was in pristine condition. The 200-point inspection they do really shows in the quality.",
    "Trading in my old vehicle was quick and painless. They gave me a fair offer and handled all the paperwork efficiently. I was driving my new car home the same day!",
    "I've been a customer of Chariot's for over 10 years now, and I wouldn't go anywhere else. They remember me by name and always provide exceptional service.",
    "The follow-up service after my purchase was impressive. Chariot's called to check how I was enjoying my new vehicle and reminded me about my first service appointment. That's customer care!",
    "I appreciate how Chariot Auto Sales embraces technology. Their online inventory was accurate, and I could do most of the paperwork digitally before arriving at the dealership.",
    "The entire staff at Chariot's is knowledgeable about their inventory. When I had specific questions about the hybrid system in my new car, they had answers ready.",
    "I had a unique situation with my financing needs, and Chariot's went above and beyond to find a solution that worked for me. I couldn't be more grateful.",
    "The no-haggle pricing at Chariot Auto Sales was refreshing. The price was fair from the start, which made the whole experience more pleasant.",
    "I was impressed by how clean and well-maintained all the vehicles at Chariot's were. It shows they take pride in their inventory and respect their customers.",
    "Chariot Auto Sales made buying a car with my family enjoyable. They had a comfortable waiting area for my children and were patient as we made our decision.",
    "The warranty coverage offered at Chariot's gave me peace of mind with my purchase. They clearly explained all the details and made sure I understood what was covered.",
    "I've had my vehicle serviced at Chariot's for years, and they always provide honest assessments and fair pricing. I trust them completely with my car.",
    "When my car unexpectedly broke down, Chariot's service department got me in right away and had me back on the road quickly. Their emergency service is outstanding.",
    "I purchased a certified pre-owned vehicle from Chariot's , and it has been as reliable as a new car. Their certification process is clearly thorough.",
    "The sales consultant at Chariot's listened to my needs instead of trying to upsell me. I ended up with exactly the right vehicle for my lifestyle.",
    "Chariot Auto Sales has the best selection of electric vehicles in the area. Their staff is knowledgeable about EV technology and charging options.",
    "I appreciated that Chariot Auto Sales offers a 3-day return policy. It gave me confidence in my purchase knowing I could bring it back if I wasn't completely satisfied.",
    "The detailing service at Chariot's is exceptional. My car looks better than when I first bought it! They pay attention to every detail.",
    "Chariot Auto Sales made the paperwork process painless. Everything was prepared in advance, and they explained each document clearly.",
    "I was impressed by the thorough test drive experience at Chariot's . They encouraged me to take different routes to really get a feel for the vehicle.",
    "When I needed parts for my older model vehicle, Chariot's parts department went the extra mile to locate exactly what I needed. Great service!",
    "The courtesy shuttle service at Chariot's saved me so much time when my car was in for service. The driver was prompt and friendly too.",
    "I've purchased three vehicles from Chariot's over the years, and each experience has been consistently excellent. They've earned a customer for life.",
    "The staff at Chariot Auto Sales remembers their customers. When I came in for service, they recalled details about my purchase from years ago.",
    "Chariot Auto Sales has fair prices on their vehicles, but what really sets them apart is the exceptional customer service after the sale.",
    "I appreciate how Chariot's embraces new technology but still provides that personal touch that makes car buying a positive experience.",
    "The team at Chariot's helped me find the perfect family vehicle that met all our needs and still fit our budget. We couldn't be happier!",
    "Chariot Auto Sales has a great selection of pre-owned luxury vehicles that look and drive like new. I got a premium car at a great price.",
    "When my vehicle needed an unexpected repair, Chariot's service department explained the issue clearly and provided options that fit my budget.",
    "I was dreading buying a new car until I visited Chariot's . They made it enjoyable and stress-free from start to finish.",
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
              author: "chariot ",
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
    const storedTestimonials = localStorage.getItem("chariots-testimonials");
    if (storedTestimonials) {
      setTestimonials(JSON.parse(storedTestimonials));
    } else {
      const initialTestimonials = generateInitialTestimonials();
      setTestimonials(initialTestimonials);
      localStorage.setItem(
        "chariots-testimonials",
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
      "chariots-testimonials",
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
      "chariots-testimonials",
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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/10 to-transparent"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-400 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="max-w-3xl">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">
                Customer Testimonials
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hear From Our Satisfied Customers
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Discover why our customers love Chariot Auto Sales. Read their
                stories and experiences with our vehicles, service, and team.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowAddForm(true)}
                >
                  Share Your Experience
                  <MessageSquare size={16} className="ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  View Our Inventory
                  <Car size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-12 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {testimonials.length}+
                </div>
                <div className="text-slate-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">4.8</div>
                <div className="text-slate-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
                <div className="text-slate-600">Verified Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">28+</div>
                <div className="text-slate-600">Years of Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search Section */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Customer Reviews ({filteredTestimonials.length})
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search reviews..."
                    className="pl-10 border-slate-300 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-slate-300">
                      <Filter size={16} className="mr-2" />
                      Sort By:{" "}
                      {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("highest")}>
                      Highest Rated
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("lowest")}>
                      Lowest Rated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-slate-700 mb-2 block">Rating</Label>
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
                          className="ml-2 font-normal flex items-center"
                        >
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-yellow-400 fill-current"
                            />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-slate-300"
                            />
                          ))}
                          <span className="ml-2">
                            {rating} {rating === 1 ? "Star" : "Stars"}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-slate-700 mb-2 block">
                    Vehicle Type
                  </Label>
                  <Select
                    value={vehicleTypeFilter || ""}
                    onValueChange={(value) =>
                      setVehicleTypeFilter(value || null)
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="All Vehicle Types" />
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
                  <Label className="text-slate-700 mb-2 block">
                    Service Type
                  </Label>
                  <Select
                    value={serviceTypeFilter || ""}
                    onValueChange={(value) =>
                      setServiceTypeFilter(value || null)
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="All Service Types" />
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
                  <Label className="text-slate-700 mb-2 block">
                    Additional Filters
                  </Label>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="verified"
                      checked={verifiedFilter}
                      onCheckedChange={(checked) =>
                        setVerifiedFilter(!!checked)
                      }
                    />
                    <Label htmlFor="verified" className="font-normal">
                      Verified Purchases Only
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-slate-300"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials List */}
        <section className="bg-slate-50 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No Testimonials Found
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  We couldn't find any testimonials matching your current
                  filters. Try adjusting your search criteria or clear filters
                  to see all testimonials.
                </p>
                <Button
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredTestimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-bold text-slate-900">
                                {testimonial.author}
                              </h3>
                              {testimonial.verified && (
                                <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle2 size={12} className="mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              {Array.from({ length: testimonial.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className="text-yellow-400 fill-current"
                                  />
                                )
                              )}
                              {Array.from({
                                length: 5 - testimonial.rating,
                              }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className="text-slate-300"
                                />
                              ))}
                              <span className="ml-2 text-sm text-slate-500">
                                {new Date(
                                  testimonial.date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            {testimonial.vehicleType}
                          </Badge>
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                            {testimonial.serviceType}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium text-slate-900 mb-2">
                          {testimonial.title}
                        </h4>
                        <p className="text-slate-600">{testimonial.content}</p>
                        <div className="text-sm text-slate-500 mt-2">
                          Vehicle: {testimonial.vehicle}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center space-x-4">
                          <button
                            className="flex items-center text-sm text-slate-600 hover:text-blue-600"
                            onClick={() => handleMarkHelpful(testimonial.id)}
                          >
                            <ThumbsUp size={14} className="mr-1" />
                            Helpful ({testimonial.helpful})
                          </button>
                          <button className="flex items-center text-sm text-slate-600 hover:text-blue-600">
                            <Share2 size={14} className="mr-1" />
                            Share
                          </button>
                          <button className="flex items-center text-sm text-slate-600 hover:text-red-600">
                            <Flag size={14} className="mr-1" />
                            Report
                          </button>
                        </div>
                      </div>

                      {testimonial.response && (
                        <div className="mt-4 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium text-slate-900">
                                  {testimonial.response.author}
                                </h4>
                                <span className="text-sm text-slate-500 ml-2">
                                  {testimonial.response.role}
                                </span>
                              </div>
                              <div className="text-sm text-slate-500 mb-2">
                                {new Date(
                                  testimonial.response.date
                                ).toLocaleDateString()}
                              </div>
                              <p className="text-slate-600">
                                {testimonial.response.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Add Testimonial Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
              <DialogDescription>
                Tell us about your experience with Chariot Auto Sales. Your
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
                        className="text-slate-700 mb-1.5 block"
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
                        className="border-slate-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-slate-700 mb-1.5 block"
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
                        className="border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-700 mb-1.5 block">
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
                                ? "text-yellow-400 fill-current"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-slate-600">
                        {newTestimonial.rating} of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="title"
                      className="text-slate-700 mb-1.5 block"
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
                      className="border-slate-300"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="content"
                      className="text-slate-700 mb-1.5 block"
                    >
                      Your Review <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={newTestimonial.content}
                      onChange={handleFormChange}
                      placeholder="Tell us about your experience with Chariot Auto Sales"
                      required
                      className="border-slate-300 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="vehicle"
                      className="text-slate-700 mb-1.5 block"
                    >
                      Vehicle Purchased/Serviced
                    </Label>
                    <Input
                      id="vehicle"
                      name="vehicle"
                      value={newTestimonial.vehicle}
                      onChange={handleFormChange}
                      placeholder="e.g., 2022 Honda Accord"
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="vehicleType"
                        className="text-slate-700 mb-1.5 block"
                      >
                        Vehicle Type
                      </Label>
                      <Select
                        value={newTestimonial.vehicleType}
                        onValueChange={(value) =>
                          handleSelectChange("vehicleType", value)
                        }
                      >
                        <SelectTrigger className="border-slate-300">
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
                        className="text-slate-700 mb-1.5 block"
                      >
                        Service Type
                      </Label>
                      <Select
                        value={newTestimonial.serviceType}
                        onValueChange={(value) =>
                          handleSelectChange("serviceType", value)
                        }
                      >
                        <SelectTrigger className="border-slate-300">
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
                      className="font-normal text-sm text-slate-600"
                    >
                      I confirm this is a genuine review based on my own
                      experience. I understand that Chariot Auto Sales may
                      publish this review on their website and other marketing
                      materials.
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Review
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Experience the Chariot's Difference?
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Join our family of satisfied customers. Visit us today to find
                  your perfect vehicle or schedule a service appointment.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white hover:bg-gray-100 text-blue-700">
                    Browse Inventory
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-black hover:bg-white/10"
                    onClick={() => setShowAddForm(true)}
                  >
                    Share Your Story
                    <MessageSquare size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Happy Customers at Chariot Auto Sales"
                    width={600}
                    height={350}
                    className="w-full h-auto object-cover"
                  />
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
