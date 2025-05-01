"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Shield,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Share2,
  Heart,
  Calendar,
  Fuel,
  Gauge,
  Loader2,
  Car,
  Settings,
  DollarSign,
  Star,
  BarChart3,
  Zap,
  Tag,
  FileText,
  Copy,
  ExternalLink,
  Bookmark,
  ShieldCheck,
  ThumbsUp,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define car type
type Car = {
  id: string;
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
  downPayment?: number;
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

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const carId = unwrappedParams.id;
  // State for car data
  const [carDetails, setCarDetails] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // State for image gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  const [compareCount, setCompareCount] = useState(0);
  // State for contact information
  const [showContact, setShowContact] = useState(false);

  // State for favorites
  const [isFavorite, setIsFavorite] = useState(false);

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    description: true,
    sellerInfo: true,
    specifications: true,
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState("overview");

  // State for comparison
  const [isInCompare, setIsInCompare] = useState(false);

  // Ref for carousel scrolling
  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const compareList = JSON.parse(
      localStorage.getItem("carsToCompare") || "[]"
    );
    setCompareCount(compareList.length);

    // Listen for changes to localStorage
    const handleStorageChange = () => {
      const updatedList = JSON.parse(
        localStorage.getItem("carsToCompare") || "[]"
      );
      setCompareCount(updatedList.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Check if car is in compare list
  useEffect(() => {
    const compareList = JSON.parse(
      localStorage.getItem("carsToCompare") || "[]"
    );
    setIsInCompare(compareList.includes(carId));
  }, [carId]);

  // Fetch car details and similar cars
  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch car details
        const response = await fetch(`/api/cars/${carId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }
        const data = await response.json();
        setCarDetails(data);

        // Fetch similar cars based on make and model
        const similarResponse = await fetch(
          `/api/cars/similar?make=${data.make}&model=${data.model}&id=${carId}`
        );
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarCars(similarData);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoadingError("Failed to load car details. Please try again later.");
        toast.error("Failed to load car details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  // Format price with currency - updated to be more international
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Navigate to previous image
  const prevImage = () => {
    if (!carDetails?.images) return;

    setActiveImageIndex((prev) =>
      prev === 0 ? carDetails.images.length - 1 : prev - 1
    );
  };

  // Navigate to next image
  const nextImage = () => {
    if (!carDetails?.images) return;

    setActiveImageIndex((prev) =>
      prev === carDetails.images.length - 1 ? 0 : prev + 1
    );
  };

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removed from favorites" : "Added to favorites",
      {
        icon: isFavorite ? "❌" : "❤️",
      }
    );
  };
  // Update the toggleCompare function in the car detail page
  const toggleCompare = () => {
    const compareList = JSON.parse(
      localStorage.getItem("carsToCompare") || "[]"
    );

    // Also get the full car data list for comparison
    const compareDataList = JSON.parse(
      localStorage.getItem("carsToCompareData") || "[]"
    );

    if (isInCompare) {
      // Remove from compare
      const updatedList = compareList.filter((id: string) => id !== carId);
      localStorage.setItem("carsToCompare", JSON.stringify(updatedList));

      // Also remove from the data list
      const updatedDataList = compareDataList.filter(
        (car: any) => car.id !== carId
      );
      localStorage.setItem(
        "carsToCompareData",
        JSON.stringify(updatedDataList)
      );

      setIsInCompare(false);
      toast.success("Removed from comparison");
    } else {
      // Add to compare
      if (compareList.length >= 4) {
        toast.error("You can compare up to 4 vehicles at a time");
        return;
      }

      // Store the ID for simple checks
      localStorage.setItem(
        "carsToCompare",
        JSON.stringify([...compareList, carId])
      );

      // Also store the car data for the comparison page
      // Create a simplified car object with the necessary fields for comparison
      const carForComparison = {
        id: carDetails.id,
        title: carDetails.title,
        make: carDetails.make,
        model: carDetails.model,
        year: carDetails.year,
        price: carDetails.price,
        mileage: carDetails.mileage,
        image:
          carDetails.images && carDetails.images.length > 0
            ? carDetails.images[0]
            : "",
        condition: carDetails.condition,
        transmission: carDetails.transmission,
        fuelType: carDetails.fuelType,
        location: carDetails.location,
        exteriorColor: carDetails.color,
        engine: carDetails.engineSize,
        features: carDetails.features,
        vin: carDetails.registeredState, // Using this field as a placeholder for VIN
      };

      localStorage.setItem(
        "carsToCompareData",
        JSON.stringify([...compareDataList, carForComparison])
      );

      setIsInCompare(true);
      toast.success("Added to comparison", {
        description: "Go to comparison page to view all selected vehicles",
        action: {
          label: "Compare Now",
          onClick: () => router.push("/compare"),
        },
      });
    }
  };

  // Share listing
  const shareListing = () => {
    if (navigator.share && carDetails) {
      navigator
        .share({
          title: carDetails.title,
          text: `Check out this ${carDetails.year} ${carDetails.make} ${
            carDetails.model
          } for ${formatPrice(carDetails.price, carDetails.currency || "$")}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  // Scroll carousel left
  const scrollCarouselLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll carousel right
  const scrollCarouselRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Get condition badge color
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
        return "bg-green-600";
      case "certified pre-owned":
        return "bg-blue-600";
      case "used":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-4 md:py-6 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading car details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If error, show error message
  if (loadingError || !carDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-4 md:py-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {loadingError || "Car not found"}
              </h1>
              <p className="text-gray-600 mb-6">
                We couldn't find the car you're looking for. It may have been
                removed or the link is incorrect.
              </p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Other Cars
              </Button>
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
      {compareCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 transition-transform duration-300">
          <div className="container mx-auto px-4 max-w-7xl py-3 flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 size={20} className="text-blue-600 mr-2" />
              <span className="font-medium">
                {compareCount} {compareCount === 1 ? "vehicle" : "vehicles"}{" "}
                selected
              </span>
              <Badge
                variant="outline"
                className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
              >
                {compareCount}/4
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem("carsToCompare", JSON.stringify([]));
                  localStorage.setItem("carsToCompareData", JSON.stringify([]));
                  setCompareCount(0);
                  setIsInCompare(false);
                  toast.success("Comparison cleared");
                }}
              >
                Clear All
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
                onClick={() => router.push("/compare")}
              >
                Compare Now
              </Button>
            </div>
          </div>
        </div>
      )}
      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb navigation */}
          <div className="mb-4 text-xs md:text-sm text-gray-500 flex flex-wrap items-center">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <Link href="/shop" className="hover:text-blue-600">
              Cars
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <Link
              href={`/shop?brand=${carDetails.make.toLowerCase()}`}
              className="hover:text-blue-600"
            >
              {carDetails.make}
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <Link
              href={`/shop?brand=${carDetails.make.toLowerCase()}&model=${carDetails.model.toLowerCase()}`}
              className="hover:text-blue-600"
            >
              {carDetails.make} {carDetails.model}
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-gray-700">{carDetails.title}</span>
          </div>

          {/* Back button - Mobile only */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
          </div>

          {/* Page header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {carDetails.title}
              </h1>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-gray-700"
                        onClick={toggleFavorite}
                      >
                        <Heart
                          size={18}
                          className={
                            isFavorite ? "fill-red-500 text-red-500" : ""
                          }
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isInCompare ? "default" : "outline"}
                        size="icon"
                        className={
                          isInCompare
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-700"
                        }
                        onClick={toggleCompare}
                      >
                        <BarChart3 size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isInCompare
                          ? "Remove from comparison"
                          : "Add to comparison"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-gray-700"
                        onClick={shareListing}
                      >
                        <Share2 size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this listing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link href="/shop" className="hidden md:block">
                  <Button variant="outline" size="sm" className="text-gray-700">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to results
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center mt-2 text-sm text-gray-600">
              <MapPin size={16} className="text-gray-500 mr-1" />
              <span>{carDetails.location}</span>
              <span className="mx-2">•</span>
              <span>Listed {formatDate(carDetails.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column - Car details */}
            <div className="lg:w-2/3">
              {/* Image gallery - Enhanced */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="relative h-64 sm:h-80 md:h-[400px] lg:h-[500px] bg-gray-100">
                  {carDetails.images && carDetails.images.length > 0 ? (
                    <Image
                      src={carDetails.images[activeImageIndex]}
                      alt={carDetails.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Car size={64} />
                    </div>
                  )}

                  {/* Condition badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge
                      className={`${getConditionColor(
                        carDetails.condition
                      )} text-white px-3 py-1.5 text-xs`}
                    >
                      {carDetails.condition}
                    </Badge>
                  </div>

                  {/* Image navigation buttons - only show if there are images */}
                  {carDetails.images && carDetails.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
                        {activeImageIndex + 1}/{carDetails.images.length}
                      </div>
                    </>
                  )}

                  {/* View all images button - Overlay */}
                  {carDetails.images && carDetails.images.length > 1 && (
                    <button
                      onClick={() => setShowAllImages(true)}
                      className="absolute bottom-4 left-4 bg-black/50 hover:bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center transition-colors"
                    >
                      <Zap size={14} className="mr-1" />
                      View all photos
                    </button>
                  )}
                </div>

                {/* Thumbnail gallery - Enhanced with scrolling */}
                {carDetails.images && carDetails.images.length > 1 && (
                  <div
                    ref={thumbnailsRef}
                    className="p-2 flex overflow-x-auto gap-2 scrollbar-hide bg-gray-50"
                  >
                    {carDetails.images.map((image, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative cursor-pointer transition-all duration-200 ${
                          index === activeImageIndex
                            ? "ring-2 ring-blue-500 opacity-100"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${carDetails.title} - Image ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs for car details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <Tabs
                  defaultValue="overview"
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="px-4 pt-4 border-b border-gray-200">
                    <TabsList className="grid grid-cols-3 h-auto bg-gray-100 p-1">
                      <TabsTrigger
                        value="overview"
                        className="py-2 data-[state=active]:bg-white"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="features"
                        className="py-2 data-[state=active]:bg-white"
                      >
                        Features
                      </TabsTrigger>
                      <TabsTrigger
                        value="specs"
                        className="py-2 data-[state=active]:bg-white"
                      >
                        Specifications
                      </TabsTrigger>
                      {/* <TabsTrigger
                        value="seller"
                        className="py-2 data-[state=active]:bg-white"
                      >
                        Seller
                      </TabsTrigger> */}
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="p-4 md:p-6">
                    {/* Key highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center justify-center">
                        <Calendar size={20} className="text-blue-600 mb-1" />
                        <span className="text-sm text-gray-500">Year</span>
                        <span className="font-semibold">{carDetails.year}</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center justify-center">
                        <Gauge size={20} className="text-blue-600 mb-1" />
                        <span className="text-sm text-gray-500">Mileage</span>
                        <span className="font-semibold">
                          {formatNumber(carDetails.mileage)} mi
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center justify-center">
                        <Settings size={20} className="text-blue-600 mb-1" />
                        <span className="text-sm text-gray-500">
                          Transmission
                        </span>
                        <span className="font-semibold">
                          {carDetails.transmission}
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center justify-center">
                        <Fuel size={20} className="text-blue-600 mb-1" />
                        <span className="text-sm text-gray-500">Fuel Type</span>
                        <span className="font-semibold">
                          {carDetails.fuelType || "Gasoline"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">
                        Description
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {carDetails.description}
                      </p>
                    </div>

                    {/* Basic specs overview */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">
                        Basic Information
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Make</span>
                          <span className="font-medium">{carDetails.make}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Model</span>
                          <span className="font-medium">
                            {carDetails.model}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Year</span>
                          <span className="font-medium">{carDetails.year}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Condition</span>
                          <span className="font-medium">
                            {carDetails.condition}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Mileage</span>
                          <span className="font-medium">
                            {formatNumber(carDetails.mileage)} mi
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Transmission</span>
                          <span className="font-medium">
                            {carDetails.transmission}
                          </span>
                        </div>
                        {carDetails.color && (
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Color</span>
                            <span className="font-medium">
                              {carDetails.color}
                            </span>
                          </div>
                        )}
                        {carDetails.fuelType && (
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Fuel Type</span>
                            <span className="font-medium">
                              {carDetails.fuelType}
                            </span>
                          </div>
                        )}
                        {carDetails.engineSize && (
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Engine Size</span>
                            <span className="font-medium">
                              {carDetails.engineSize}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key features preview */}
                    {carDetails.features && carDetails.features.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h2 className="text-lg font-semibold">
                            Key Features
                          </h2>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600 p-0"
                            onClick={() => setActiveTab("features")}
                          >
                            View all
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {carDetails.features
                            .slice(0, 6)
                            .map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <Check
                                  size={16}
                                  className="text-green-500 mr-2 flex-shrink-0"
                                />
                                <span className="text-sm text-gray-700">
                                  {feature}
                                </span>
                              </div>
                            ))}
                        </div>
                        {carDetails.features.length > 6 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 w-full text-sm"
                            onClick={() => setActiveTab("features")}
                          >
                            Show all {carDetails.features.length} features
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="features" className="p-4 md:p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Vehicle Features
                    </h2>
                    {carDetails.features && carDetails.features.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {carDetails.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-50 p-2 rounded-lg"
                          >
                            <Check
                              size={16}
                              className="text-green-500 mr-2 flex-shrink-0"
                            />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No features listed for this vehicle.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="specs" className="p-4 md:p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Technical Specifications
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-md font-medium mb-2 text-gray-900 flex items-center">
                          <Car size={18} className="mr-2 text-blue-600" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Make</span>
                            <span className="font-medium">
                              {carDetails.make}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Model</span>
                            <span className="font-medium">
                              {carDetails.model}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year</span>
                            <span className="font-medium">
                              {carDetails.year}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Condition</span>
                            <span className="font-medium">
                              {carDetails.condition}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mileage</span>
                            <span className="font-medium">
                              {formatNumber(carDetails.mileage)} mi
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Color</span>
                            <span className="font-medium">
                              {carDetails.color || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-medium mb-2 text-gray-900 flex items-center">
                          <Settings size={18} className="mr-2 text-blue-600" />
                          Engine & Performance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Engine Size</span>
                            <span className="font-medium">
                              {carDetails.engineSize || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Transmission</span>
                            <span className="font-medium">
                              {carDetails.transmission}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fuel Type</span>
                            <span className="font-medium">
                              {carDetails.fuelType || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-medium mb-2 text-gray-900 flex items-center">
                          <FileText size={18} className="mr-2 text-blue-600" />
                          Documentation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          {/* <div className="flex justify-between"> */}
                          {/* <span className="text-gray-600">
                              Registered State
                            </span>
                            <span className="font-medium">
                              {carDetails.registeredState || "N/A"}
                            </span> */}
                          {/* </div> */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Selling Condition
                            </span>
                            <span className="font-medium">
                              {carDetails.sellingCondition || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Bought Condition
                            </span>
                            <span className="font-medium">
                              {carDetails.boughtCondition || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seller" className="p-4 md:p-6">
                    {carDetails.sellerInfo ? (
                      <div>
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                            {carDetails.sellerInfo.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <h3 className="text-lg font-semibold mr-2">
                                {carDetails.sellerInfo.name}
                              </h3>
                              {carDetails.sellerInfo.verified && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                >
                                  <ShieldCheck size={12} />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-500 text-sm mb-2">
                              Member since {carDetails.sellerInfo.memberSince}
                            </p>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <MapPin
                                size={14}
                                className="mr-1.5 text-gray-400"
                              />
                              {carDetails.sellerInfo.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock
                                size={14}
                                className="mr-1.5 text-gray-400"
                              />
                              Response time:{" "}
                              {carDetails.sellerInfo.responseTime}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <Info size={16} className="mr-1.5" />
                            Seller Performance
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">
                                  Response Rate
                                </span>
                                <span className="text-sm font-medium">
                                  {carDetails.sellerInfo.responseRate}
                                </span>
                              </div>
                              <Progress
                                value={parseInt(
                                  carDetails.sellerInfo.responseRate
                                )}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium mb-3">Contact Options</h4>
                          <div className="space-y-3">
                            <Link href={`/order/${carDetails.id}`}>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-6">
                                <MessageCircle size={18} />
                                <span>Message Seller</span>
                              </Button>
                            </Link>

                            {!showContact && carDetails.sellerInfo.phone && (
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setShowContact(true)}
                              >
                                <Phone size={18} className="mr-2" />
                                Show Phone Number
                              </Button>
                            )}

                            {showContact && carDetails.sellerInfo.phone && (
                              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-base">
                                    {carDetails.sellerInfo.phone}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        carDetails.sellerInfo.phone
                                      );
                                      toast.success(
                                        "Phone number copied to clipboard"
                                      );
                                    }}
                                  >
                                    <Copy size={14} />
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Mention you saw this listing on AutoWorld when
                                  calling
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <AlertCircle size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No seller information
                        </h3>
                        <p className="text-gray-500">
                          Seller details are not available for this listing.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Similar cars section - Enhanced Carousel */}
              {similarCars.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Car size={18} className="mr-2 text-blue-500" />
                      Similar Vehicles
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollCarouselLeft}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollCarouselRight}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Carousel container */}
                  <div
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-4 p-4 hide-scrollbar scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {similarCars.map((car) => (
                      <div
                        key={car.id}
                        className="flex-shrink-0 w-[280px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                        onClick={() => router.push(`/car/${car.id}`)}
                      >
                        <div className="relative h-40 w-full">
                          {car.images && car.images.length > 0 ? (
                            <Image
                              src={car.images[0]}
                              alt={car.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                              <Car size={32} />
                            </div>
                          )}
                          {car.condition && (
                            <div className="absolute top-2 left-2">
                              <Badge
                                className={`${getConditionColor(
                                  car.condition
                                )} text-white text-xs`}
                              >
                                {car.condition}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                            {car.title}
                          </h3>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(car.price, car.currency || "$")}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {car.year}
                            </div>
                            <div className="flex items-center">
                              <Gauge size={12} className="mr-1" />
                              {formatNumber(car.mileage)} mi
                            </div>
                            <div className="flex items-center">
                              <Settings size={12} className="mr-1" />
                              {car.transmission}
                            </div>
                            <div className="flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {car.location.split(",")[0]}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs h-8"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 pt-0 text-center">
                    <Link
                      href={`/shop?brand=${carDetails.make.toLowerCase()}&model=${carDetails.model.toLowerCase()}`}
                    >
                      <Button variant="link" className="text-blue-600">
                        View all similar {carDetails.make} {carDetails.model}
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Price and seller info */}
            <div className="lg:w-1/3 space-y-6">
              {/* Price card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
                <div className="p-4 md:p-6">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {formatPrice(
                          carDetails.price,
                          carDetails.currency || "$"
                        )}
                      </h2>
                      {carDetails.downPayment > 0 && (
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-200 bg-blue-50"
                        >
                          Negotiable
                        </Badge>
                      )}
                    </div>

                    {carDetails.downPayment > 0 && (
                      <div className="text-sm text-gray-600 font-medium mt-1 flex items-center">
                        <DollarSign size={14} className="mr-1 text-gray-400" />
                        Down payment:{" "}
                        {formatPrice(
                          carDetails.downPayment,
                          carDetails.currency || "$"
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-3 mb-6">
                    <Link href={`/order/${carDetails.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-6">
                        <MessageCircle size={18} />
                        <span>Message Seller</span>
                      </Button>
                    </Link>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-1"
                        onClick={toggleFavorite}
                      >
                        <Heart
                          size={16}
                          className={
                            isFavorite ? "fill-red-500 text-red-500" : ""
                          }
                        />
                        {isFavorite ? "Saved" : "Save"}
                      </Button>
                      <Button
                        variant={isInCompare ? "default" : "outline"}
                        className={`flex items-center justify-center gap-1 ${
                          isInCompare
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : ""
                        }`}
                        onClick={toggleCompare}
                      >
                        <BarChart3 size={16} />
                        {isInCompare ? "Added to Compare" : "Compare"}
                      </Button>
                    </div>

                    {!showContact && carDetails.sellerInfo?.phone && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowContact(true)}
                      >
                        <Phone size={18} className="mr-2" />
                        Show Phone Number
                      </Button>
                    )}

                    {showContact && carDetails.sellerInfo?.phone && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-base">
                            {carDetails.sellerInfo.phone}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                carDetails.sellerInfo.phone
                              );
                              toast.success("Phone number copied to clipboard");
                            }}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Mention you saw this listing on AutoWorld when calling
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Safety tips */}
                  {/* <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4">
                    <h3 className="text-sm font-medium text-yellow-800 flex items-center mb-2">
                      <AlertCircle size={16} className="mr-1.5" />
                      Safety Tips
                    </h3>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li className="flex items-start">
                        <span className="mr-1.5">•</span>
                        Meet in a safe, public location
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1.5">•</span>
                        Test drive with a friend
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1.5">•</span>
                        Verify vehicle history and documentation
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1.5">•</span>
                        Never wire money or pay in gift cards
                      </li>
                    </ul>
                  </div> */}

                  {/* Listing details */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Listing Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Listed</span>
                        <span>{formatDate(carDetails.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span>{carDetails.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Condition</span>
                        <span>{carDetails.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference ID</span>
                        <span className="font-mono">
                          {carDetails.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Report listing button */}
                
                </div>
              </div>
            </div>
          </div>

          {/* Full-screen image gallery modal */}
          {showAllImages &&
            carDetails.images &&
            carDetails.images.length > 0 && (
              <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
                <div className="flex justify-between items-center p-4 text-white">
                  <h3 className="text-lg font-medium">
                    {carDetails.title} - {activeImageIndex + 1}/
                    {carDetails.images.length}
                  </h3>
                  <button
                    onClick={() => setShowAllImages(false)}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-grow flex items-center justify-center relative">
                  <Image
                    src={carDetails.images[activeImageIndex]}
                    alt={carDetails.title}
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                <div className="p-4 overflow-x-auto whitespace-nowrap bg-black/50">
                  <div className="flex gap-2 justify-center">
                    {carDetails.images.map((image, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative cursor-pointer transition-all duration-200 ${
                          index === activeImageIndex
                            ? "ring-2 ring-blue-500 opacity-100"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${carDetails.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </main>

      <Footer />

      {/* Add CSS for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
