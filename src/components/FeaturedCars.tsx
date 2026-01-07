"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Shield,
  Clock,
  Award,
  CreditCard,
  Search,
  MapPin,
  Loader2,
  AlertCircle,
  Car,
  Star,
  Check,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Gauge,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Car {
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
  area?: string;
  featured?: boolean;
}

export default function FeaturedCars() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const brandsContainerRef = useRef<HTMLDivElement>(null);

  // State for cars data
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularBrands, setPopularBrands] = useState<
    {
      name: string;
      id: string;
      displayName: string;
      image: string;
      count: number;
    }[]
  >([]);

  // Brand normalization map - for consistent brand naming
  const brandNormalization: Record<string, string> = {
    chevy: "chevrolet",
    mercedes: "mercedes-benz",
    "mercedes benz": "mercedes-benz",
    "range rover": "land rover",
    leon: "seat",
    ram: "ram trucks",
  };

  // Helper function to format brand names properly for display
  const formatBrandName = (name: string): string => {
    // Special cases for acronyms and specific brands that should be uppercase
    const acronyms = ["bmw", "gmc", "kia", "ram"];
    if (acronyms.includes(name.toLowerCase())) {
      return name.toUpperCase();
    }

    // Handle hyphenated names like 'mercedes-benz'
    if (name.includes("-")) {
      return name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-");
    }

    // Default case: capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Fetch cars data from backend - using the same approach as in shop page
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();
        setCars(data);

        // Process the data to extract filter information
        processCarData(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Failed to load cars. Please refresh the page.");
        toast.error("Failed to load featured cars.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Process car data to extract filter information - similar to shop page
  const processCarData = (carsData: Car[]) => {
    // Extract unique makes and count them
    const makeCount: Record<string, number> = {};

    carsData.forEach((car) => {
      // Count makes with normalization
      if (car.make) {
        // Normalize the brand name - convert to lowercase and trim
        let make = car.make.trim().toLowerCase();

        // Apply brand normalization if needed
        make = brandNormalization[make] || make;

        makeCount[make] = (makeCount[make] || 0) + 1;
      }
    });

    // Convert makes to array and sort by count
    const makesArray = Object.entries(makeCount).map(([name, count]) => ({
      name: name, // Original name (normalized)
      id: name.toLowerCase(), // ID for filtering (always lowercase)
      displayName: formatBrandName(name), // Formatted name for display
      count,
      image: getBrandLogoUrl(name),
    }));
    makesArray.sort((a, b) => b.count - a.count);

    // Get all brands for the filter
    setPopularBrands(makesArray);
  };

  // Navigate to shop page with selected brand filter
  const navigateToShopWithBrand = (brandId: string) => {
    router.push(`/shop?brand=${brandId}`);
  };

  // Navigate to shop page with selected price filter
  const navigateToShopWithPrice = (min: string, max: string) => {
    router.push(`/shop?min=${min}&max=${max}`);
  };

  // Format price with currency
  const formatPrice = (price: number, currency: string = "$") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("$", currency);
  };

  // Format mileage with commas
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage) + " mi";
  };

  // Get featured cars from all cars
  const getFeaturedCars = () => {
    // First try to get cars marked as featured
    const featured = cars.filter((car) => car.featured === true);

    // If no cars are explicitly marked as featured, return the first 6 cars
    if (featured.length === 0) {
      return cars.slice(0, 6);
    }

    // Otherwise return the featured cars (max 6)
    return featured.slice(0, 6);
  };

  // Get featured cars
  const featuredCars = getFeaturedCars();

  // Filter cars based on selected brand and price
  const filteredCars = featuredCars.filter((car) => {
    // Normalize the car make for comparison
    const normalizedMake = car.make.trim().toLowerCase();
    const brandToCompare = brandNormalization[normalizedMake] || normalizedMake;

    if (selectedBrand && brandToCompare !== selectedBrand) return false;

    const price = car.price;

    if (priceFilter === "under5k" && price >= 5000) return false;
    if (priceFilter === "5to10k" && (price < 5000 || price > 10000))
      return false;
    if (priceFilter === "10to15k" && (price < 10000 || price > 15000))
      return false;
    if (priceFilter === "15to20k" && (price < 15000 || price > 20000))
      return false;
    if (priceFilter === "over20k" && price <= 20000) return false;

    return true;
  });

  // Get brand logo URL - using the same approach as in your shop page
  const getBrandLogoUrl = (brandName: string): string => {
    // Normalize brand name
    const normalizedName = brandName.toLowerCase().trim();
    // Map of common car brands to their logo URLs
    const brandLogoMap: Record<string, string> = {
      toyota: "https://www.carlogos.org/car-logos/toyota-logo.png",
      honda: "https://www.carlogos.org/car-logos/honda-logo.png",
      ford: "https://www.carlogos.org/car-logos/ford-logo.png",
      chevrolet: "https://www.carlogos.org/car-logos/chevrolet-logo.png",
      chevy: "https://www.carlogos.org/car-logos/chevrolet-logo.png",
      bmw: "https://www.carlogos.org/car-logos/bmw-logo.png",
      mercedes: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
      "mercedes-benz":
        "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
      audi: "https://www.carlogos.org/car-logos/audi-logo.png",
      nissan: "https://www.carlogos.org/car-logos/nissan-logo.png",
      hyundai: "https://www.carlogos.org/car-logos/hyundai-logo.png",
      kia: "https://www.carlogos.org/car-logos/kia-logo.png",
      volkswagen: "https://www.carlogos.org/car-logos/volkswagen-logo.png",
      subaru: "https://www.carlogos.org/car-logos/subaru-logo.png",
      mazda: "https://www.carlogos.org/car-logos/mazda-logo.png",
      lexus: "https://www.carlogos.org/car-logos/lexus-logo.png",
      jeep: "https://www.carlogos.org/car-logos/jeep-logo.png",
      tesla: "https://www.carlogos.org/car-logos/tesla-logo.png",
      volvo: "https://www.carlogos.org/car-logos/volvo-logo.png",
      acura: "https://www.carlogos.org/car-logos/acura-logo.png",
      infiniti: "https://www.carlogos.org/car-logos/infiniti-logo.png",
      mitsubishi: "https://www.carlogos.org/car-logos/mitsubishi-logo.png",
      rangerover: "https://www.carlogos.org/car-logos/rangerover-logo.png",
      buick: "https://www.carlogos.org/car-logos/buick-logo.png",
      cadillac: "https://www.carlogos.org/car-logos/cadillac-logo.png",
      chrysler: "https://www.carlogos.org/car-logos/chrysler-logo.png",
      dodge: "https://www.carlogos.org/car-logos/dodge-logo.png",
      gmc: "https://www.carlogos.org/car-logos/gmc-logo.png",
      ram: "https://www.carlogos.org/car-logos/ram-logo.png",
      porsche: "https://www.carlogos.org/car-logos/porsche-logo.png",
      jaguar: "https://www.carlogos.org/car-logos/jaguar-logo.png",
      "land rover": "https://www.carlogos.org/car-logos/land-rover-logo.png",
      mini: "https://www.carlogos.org/car-logos/mini-logo.png",
      fiat: "https://www.carlogos.org/car-logos/fiat-logo.png",
      "alfa romeo": "https://www.carlogos.org/car-logos/alfa-romeo-logo.png",
      maserati: "https://www.carlogos.org/car-logos/maserati-logo.png",
      bentley: "https://www.carlogos.org/car-logos/bentley-logo.png",
      "rolls-royce": "https://www.carlogos.org/car-logos/rolls-royce-logo.png",
      "aston martin":
        "https://www.carlogos.org/car-logos/aston-martin-logo.png",
      lamborghini: "https://www.carlogos.org/car-logos/lamborghini-logo.png",
      ferrari: "https://www.carlogos.org/car-logos/ferrari-logo.png",
      bugatti: "https://www.carlogos.org/car-logos/bugatti-logo.png",
      seat: "https://www.carlogos.org/car-logos/seat-logo.png",
      "ram trucks": "https://www.carlogos.org/car-logos/ram-logo.png",
    };

    // Return the logo URL if found, otherwise return a generic car icon
    return (
      brandLogoMap[normalizedName] ||
      `/brands/${normalizedName}.png` ||
      `/brands/generic-car.png`
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrand(null);
    setPriceFilter("all");
  };

  // Scroll the brands container
  const scrollBrands = (direction: "left" | "right") => {
    if (brandsContainerRef.current) {
      const container = brandsContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Get color for condition badge
  const getConditionColor = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("new")) return "bg-green-500";
    if (conditionLower.includes("excellent")) return "bg-teal-500";
    if (conditionLower.includes("good")) return "bg-blue-500";
    if (conditionLower.includes("fair")) return "bg-yellow-500";
    if (conditionLower.includes("poor")) return "bg-red-500";
    return "bg-blue-500"; // default
  };

  return (
    <>
      {/* Premium Car Marketplace Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Premium Car Marketplace
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Discover a curated selection of quality vehicles from trusted
              dealers and private sellers across the country.
            </p>
          </div>

          {/* Brand Logos - Improved design with horizontal scroll */}
          <div className="mb-10 md:mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Browse by Brand
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => scrollBrands("left")}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => scrollBrands("right")}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-6 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="relative">
                <div
                  ref={brandsContainerRef}
                  className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {popularBrands.map((brand, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-24 md:w-32 snap-start mx-2 first:ml-0"
                    >
                      <button
                        onClick={() => {
                          if (selectedBrand === brand.id) {
                            setSelectedBrand(null);
                          } else {
                            setSelectedBrand(brand.id);
                            // Navigate to shop page with this brand filter
                            navigateToShopWithBrand(brand.id);
                          }
                        }}
                        className={`flex flex-col items-center justify-center w-full transition-all ${
                          selectedBrand === brand.id
                            ? "scale-105"
                            : "hover:scale-105"
                        }`}
                      >
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center p-3 mb-2 ${
                            selectedBrand === brand.id
                              ? "bg-blue-50 border-2 border-blue-200 shadow-md"
                              : "bg-white border border-gray-200 shadow-sm hover:shadow"
                          }`}
                        >
                          <img
                            src={brand.image}
                            alt={brand.displayName}
                            width={80}
                            height={80}
                            className="object-contain max-w-full max-h-full"
                            onError={(e) => {
                              // If image fails to load, show text fallback
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement("div");
                                fallback.className =
                                  "w-full h-full flex items-center justify-center text-gray-600 font-bold text-xl";
                                fallback.textContent = brand.displayName
                                  .charAt(0)
                                  .toUpperCase();
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs md:text-sm text-center font-bold  text-gray-700">
                          {brand.displayName}
                        </p>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Gradient fades at edges for better UX */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
              </div>
            )}

            {/* View all brands button */}
            <div className="mt-4 text-center">
              <Link href="/shop">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  View All Brands
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Enhanced Price Range Filter */}
          <div className="mb-8 md:mb-12 bg-white p-5 md:p-8 shadow-md rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center">
                <DollarSign size={18} className="mr-2 text-blue-500" />
                Filter by Price Range
              </h3>
              {priceFilter !== "all" && (
                <button
                  onClick={() => setPriceFilter("all")}
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  Reset
                  <X size={14} className="ml-1" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <button
                onClick={() => {
                  setPriceFilter("all");
                  router.push("/shop");
                }}
                className={`relative overflow-hidden group transition-all rounded-lg ${
                  priceFilter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="p-3 md:p-4 flex flex-col items-center justify-center relative z-10">
                  <span className="font-semibold text-sm md:text-base mb-1">
                    All Prices
                  </span>
                  <span className="text-xs opacity-80">No limit</span>
                </div>
                {priceFilter === "all" && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-30"></div>
                )}
              </button>

              <button
                onClick={() => {
                  setPriceFilter("under5k");
                  navigateToShopWithPrice("0", "5000");
                }}
                className={`relative overflow-hidden group transition-all rounded-lg ${
                  priceFilter === "under5k"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="p-3 md:p-4 flex flex-col items-center justify-center relative z-10">
                  <span className="font-semibold text-sm md:text-base mb-1">
                    Under $5K
                  </span>
                  <span className="text-xs opacity-80">Budget friendly</span>
                </div>
                {priceFilter === "under5k" && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-30"></div>
                )}
              </button>

              <button
                onClick={() => {
                  setPriceFilter("5to10k");
                  navigateToShopWithPrice("5000", "10000");
                }}
                className={`relative overflow-hidden group transition-all rounded-lg ${
                  priceFilter === "5to10k"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="p-3 md:p-4 flex flex-col items-center justify-center relative z-10">
                  <span className="font-semibold text-sm md:text-base mb-1">
                    $5K - $10K
                  </span>
                  <span className="text-xs opacity-80">Great value</span>
                </div>
                {priceFilter === "5to10k" && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-30"></div>
                )}
              </button>

              <button
                onClick={() => {
                  setPriceFilter("10to15k");
                  navigateToShopWithPrice("10000", "15000");
                }}
                className={`relative overflow-hidden group transition-all rounded-lg ${
                  priceFilter === "10to15k"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="p-3 md:p-4 flex flex-col items-center justify-center relative z-10">
                  <span className="font-semibold text-sm md:text-base mb-1">
                    $10K - $15K
                  </span>
                  <span className="text-xs opacity-80">Popular range</span>
                </div>
                {priceFilter === "10to15k" && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-30"></div>
                )}
              </button>

              <button
                onClick={() => {
                  setPriceFilter("15to20k");
                  navigateToShopWithPrice("15000", "20000");
                }}
                className={`relative overflow-hidden group transition-all rounded-lg ${
                  priceFilter === "15to20k"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="p-3 md:p-4 flex flex-col items-center justify-center relative z-10">
                  <span className="font-semibold text-sm md:text-base mb-1">
                    $15K - $20K
                  </span>
                  <span className="text-xs opacity-80">Mid-range</span>
                </div>
                {priceFilter === "15to20k" && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-30"></div>
                )}
              </button>

              <button
                onClick={() => {
                  setPriceFilter("over20k");
                  navigateToShopWithPrice("20000", "1000000");
                }}
                className={`relative overflow-hidden group transition-all rounded-lg ${
                  priceFilter === "over20k"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="p-3 md:p-4 flex flex-col items-center justify-center relative z-10">
                  <span className="font-semibold text-sm md:text-base mb-1">
                    Over $20K
                  </span>
                  <span className="text-xs opacity-80">Premium</span>
                </div>
                {priceFilter === "over20k" && (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-30"></div>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedBrand || priceFilter !== "all") && (
            <div className="flex items-center mb-6 flex-wrap bg-blue-50 p-4 rounded-xl border border-blue-100">
              <span className="text-sm text-gray-600 mr-3 font-medium flex items-center">
                <Filter size={16} className="mr-1 text-blue-500" />
                Active filters:
              </span>
              {selectedBrand && (
                <div className="bg-white border border-blue-200 rounded-full px-3 py-1.5 text-sm flex items-center mr-2 mb-2 shadow-sm">
                  <span className="text-blue-700 mr-1">Brand:</span>
                  <span className="font-medium text-gray-900">
                    {popularBrands.find((b) => b.id === selectedBrand)
                      ?.displayName || selectedBrand}
                  </span>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {priceFilter !== "all" && (
                <div className="bg-white border border-blue-200 rounded-full px-3 py-1.5 text-sm flex items-center mr-2 mb-2 shadow-sm">
                  <span className="text-blue-700 mr-1">Price:</span>
                  <span className="font-medium text-gray-900">
                    {priceFilter === "under5k" && "Under $5K"}
                    {priceFilter === "5to10k" && "$5K - $10K"}
                    {priceFilter === "10to15k" && "$10K - $15K"}
                    {priceFilter === "15to20k" && "$15K - $20K"}
                    {priceFilter === "over20k" && "Over $20K"}
                  </span>
                  <button
                    onClick={() => setPriceFilter("all")}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-2 mb-2 flex items-center"
              >
                Clear all
                <X size={14} className="ml-1" />
              </button>
            </div>
          )}

          {/* Car Listings */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Loading featured cars...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 mb-2">{error}</p>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {filteredCars.map((car) => (
                <Link
                  href={`/car/${car.id}`}
                  key={car.id}
                  className="block h-full group"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all h-full border border-gray-100 cursor-pointer relative"
                  >
                    {/* Car Image with Gradient Overlay */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                      {car.images && car.images.length > 0 ? (
                        <>
                          <img
                            src={car.images[0]}
                            alt={`${car.make} ${car.model} ${car.year}`}
                            
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform group-hover:scale-110 w-full h-full duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          <Car size={48} />
                        </div>
                      )}

                      {/* Featured Badge - if car is featured */}
                      {car.featured && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center">
                          <Star size={12} className="mr-1" fill="white" />
                          Featured
                        </div>
                      )}

                      {/* Price Tag */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                        {formatPrice(car.price, car.currency)}
                      </div>

                      {/* Brand Badge */}
                      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-lg">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <img
                            src={getBrandLogoUrl(car.make)}
                            alt={car.make}
                            width={40}
                            height={40}
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement("div");
                                fallback.className =
                                  "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold";
                                fallback.textContent = car.make
                                  .charAt(0)
                                  .toUpperCase();
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Condition Badge */}
                      <div
                        className={`absolute bottom-4 right-4 ${getConditionColor(
                          car.condition
                        )} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}
                      >
                        {car.condition}
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      {/* Car Title */}
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {formatBrandName(car.make)} {car.model} {car.year}
                      </h3>

                      {/* Car Details */}
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin size={16} className="mr-1 text-blue-500" />
                        {car.location} {car.area ? `, ${car.area}` : ""}
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2 text-blue-600">
                            <Gauge size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Mileage</p>
                            <p className="font-medium">
                              {formatMileage(car.mileage)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2 text-blue-600">
                            <Car size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Transmission
                            </p>
                            <p className="font-medium">{car.transmission}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2 text-blue-600">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Year</p>
                            <p className="font-medium">{car.year}</p>
                          </div>
                        </div>
                        {car.color && (
                          <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2 text-blue-600">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{
                                  backgroundColor: car.color.toLowerCase(),
                                }}
                              ></div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Color</p>
                              <p className="font-medium">{car.color}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View Details Button */}
                      {/* <div className="mt-2">
                        <div className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg font-medium text-sm flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all">
                          View Details
                          <ArrowRight
                            size={16}
                            className="ml-2 transition-transform group-hover:translate-x-1"
                          />
                        </div>
                      </div> */}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!isLoading && !error && filteredCars.length === 0 && (
            <div className="text-center py-10 md:py-16 bg-white mt-6 border border-gray-200 rounded-xl shadow-sm">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
                No cars match your criteria
              </h3>
              <p className="text-gray-500 mb-6 text-sm md:text-base max-w-md mx-auto">
                Try adjusting your filters or browse all available cars in our
                inventory
              </p>
              <Button
                onClick={() => {
                  setSelectedBrand(null);
                  setPriceFilter("all");
                  router.push("/shop");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
              >
                Clear Filters & Browse All
              </Button>
            </div>
          )}

          {/* View All Button */}
          {!isLoading && !error && filteredCars.length > 0 && (
            <div className="text-center mt-10 md:mt-14">
              <Link href="/shop">
                <Button className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium inline-flex items-center text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all">
                  Browse All Cars
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
