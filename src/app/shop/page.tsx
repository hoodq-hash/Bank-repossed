"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  ArrowRight,
  Search,
  MapPin,
  Loader2,
  AlertCircle,
  Car,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
  Grid,
  List,
  Sliders,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Check,
  Clock,
  Gauge,
  Calendar,
  Settings,
  Heart,
  Share2,
  Star,
  Tag,
  Zap,
  RefreshCw,
  SlidersHorizontal,
  BadgeCheck,
  ShieldCheck,
  Info,
  Plus,
  Fuel,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Car {
  id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  condition: string;
  mileage: number;
  year: number;
  images: string[];
  transmission: string;
  make: string;
  model: string;
  color: string;
  featured?: boolean;
}

interface PriceRange {
  min: number;
  max: number;
  label: string;
  count: number;
}

interface YearRange {
  min: number;
  max: number;
  label: string;
  count: number;
}

interface FilterData {
  priceRanges: PriceRange[];
  makes: {
    name: string;
    displayName: string;
    count: number;
    image: string;
  }[];
  yearRanges: YearRange[];
  conditions: { name: string; count: number }[];
  transmissions: { name: string; count: number }[];
}

function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    make: true,
    price: true,
    year: false,
    condition: false,
    transmission: false,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [] as string[],
    priceRange: null as { min: string; max: string } | null,
    year: null as { min: string; max: string } | null,
    condition: [] as string[],
    transmission: [] as string[],
  });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [isCompact, setIsCompact] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [showCompareBar, setShowCompareBar] = useState(false);
  const [carsToCompare, setCarsToCompare] = useState<Car[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Car[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

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

  // Filter data state
  const [filterData, setFilterData] = useState<FilterData>({
    priceRanges: [
      { min: 0, max: 5000, label: "Under $5,000", count: 0 },
      { min: 5000, max: 10000, label: "$5,000 - $10,000", count: 0 },
      { min: 10000, max: 15000, label: "$10,000 - $15,000", count: 0 },
      { min: 15000, max: 20000, label: "$15,000 - $20,000", count: 0 },
      { min: 20000, max: 30000, label: "$20,000 - $30,000", count: 0 },
      { min: 30000, max: 50000, label: "$30,000 - $50,000", count: 0 },
      { min: 50000, max: 1000000, label: "Over $50,000", count: 0 },
    ],
    makes: [],
    yearRanges: [
      { min: 2020, max: 2025, label: "2020 - 2025", count: 0 },
      { min: 2015, max: 2019, label: "2015 - 2019", count: 0 },
      { min: 2010, max: 2014, label: "2010 - 2014", count: 0 },
      { min: 2005, max: 2009, label: "2005 - 2009", count: 0 },
      { min: 2000, max: 2004, label: "2000 - 2004", count: 0 },
      { min: 1990, max: 1999, label: "1990 - 1999", count: 0 },
      { min: 0, max: 1989, label: "Before 1990", count: 0 },
    ],
    conditions: [],
    transmissions: [],
  });

  // Brand normalization map
  const brandNormalization: Record<string, string> = {
    chevy: "chevrolet",
    mercedes: "mercedes-benz",
    "mercedes benz": "mercedes-benz",
    "range rover": "land rover",
    leon: "seat",
    ram: "ram trucks",
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    document.getElementById("results-heading")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Fetch cars data from backend
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

        // Apply URL parameters if present
        applyUrlParams();
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Failed to load cars. Please try again later.");
        toast.error("Failed to load cars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Apply URL parameters to filters
  const applyUrlParams = () => {
    const brand = searchParams.get("brand");
    const query = searchParams.get("query");
    const min = searchParams.get("min");
    const max = searchParams.get("max");

    if (brand) {
      setSelectedFilters((prev) => ({
        ...prev,
        brands: [brand.toLowerCase()],
      }));
    }

    if (query) {
      setSearchQuery(query);
    }

    if (min && max) {
      setPriceRange({ min, max });
    }
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

  // Process car data to extract filter information
  const processCarData = (carsData: Car[]) => {
    // Extract unique makes and count them
    const makeCount: Record<string, number> = {};
    const conditionCount: Record<string, number> = {};
    const transmissionCount: Record<string, number> = {};
    const priceRangeCounts = Array(filterData.priceRanges.length).fill(0);
    const yearRangeCounts = Array(filterData.yearRanges.length).fill(0);

    carsData.forEach((car) => {
      // Count makes with normalization
      if (car.make) {
        // Normalize the brand name - convert to lowercase and trim
        let make = car.make.trim().toLowerCase();

        // Apply brand normalization if needed
        make = brandNormalization[make] || make;

        makeCount[make] = (makeCount[make] || 0) + 1;
      }

      // Count conditions
      if (car.condition) {
        conditionCount[car.condition] =
          (conditionCount[car.condition] || 0) + 1;
      }

      // Count transmissions
      if (car.transmission) {
        transmissionCount[car.transmission] =
          (transmissionCount[car.transmission] || 0) + 1;
      }

      // Count price ranges
      filterData.priceRanges.forEach((range, index) => {
        if (car.price >= range.min && car.price <= range.max) {
          priceRangeCounts[index]++;
        }
      });

      // Count year ranges
      filterData.yearRanges.forEach((range, index) => {
        if (car.year >= range.min && car.year <= range.max) {
          yearRangeCounts[index]++;
        }
      });
    });

    // Convert makes to array and sort by count
    const makesArray = Object.entries(makeCount).map(([name, count]) => ({
      name: name, // Original name (normalized)
      displayName: formatBrandName(name), // Formatted name for display
      count,
      image: getBrandLogoUrl(name),
    }));
    makesArray.sort((a, b) => b.count - a.count);

    // Get top brands for the filter
    const topBrands = makesArray.slice(0, 16).map((make) => ({
      name: make.name,
      id: make.name.toLowerCase(),
      displayName: make.displayName,
      image: make.image,
      count: make.count,
    }));

    // Update price ranges
    const updatedPriceRanges = filterData.priceRanges.map((range, index) => ({
      ...range,
      count: priceRangeCounts[index],
    }));

    // Update year ranges
    const updatedYearRanges = filterData.yearRanges.map((range, index) => ({
      ...range,
      count: yearRangeCounts[index],
    }));

    // Convert conditions to array
    const conditionsArray = Object.entries(conditionCount).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
    conditionsArray.sort((a, b) => b.count - a.count);

    // Convert transmissions to array
    const transmissionsArray = Object.entries(transmissionCount).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
    transmissionsArray.sort((a, b) => b.count - a.count);

    setPopularBrands(topBrands);

    // Update the rest of your filter data
    setFilterData({
      priceRanges: updatedPriceRanges,
      makes: makesArray,
      yearRanges: updatedYearRanges,
      conditions: conditionsArray,
      transmissions: transmissionsArray,
    });
  };

  // Helper function to get brand logo URL
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
      buick: "https://www.carlogos.org/car-logos/buick-logo.png",
      cadillac: "https://www.carlogos.org/car-logos/cadillac-logo.png",
      chrysler: "https://www.carlogos.org/car-logos/chrysler-logo.png",
      dodge: "https://www.carlogos.org/car-logos/dodge-logo.png",
      gmc: "https://www.carlogos.org/car-logos/gmc-logo.png",
      ram: "https://www.carlogos.org/car-logos/ram-logo.png",
      "ram trucks": "https://www.carlogos.org/car-logos/ram-logo.png",
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
    };

    // Return the logo URL if found, otherwise return a generic car icon
    return (
      brandLogoMap[normalizedName] ||
      `/brands/${normalizedName}.png` ||
      `/brands/generic-car.png`
    );
  };

  // Helper function to convert brand parameter to proper brand name
  const getBrandNameFromParam = (param: string) => {
    // Normalize the brand name
    const normalizedParam = param.toLowerCase().trim();
    const brandId = brandNormalization[normalizedParam] || normalizedParam;

    // Format for display
    return formatBrandName(brandId);
  };

  // Toggle filter section
  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Handle brand selection
  const handleBrandSelect = (brandName: string) => {
    // Normalize the brand name
    const normalizedBrand = brandName.toLowerCase().trim();
    const brandId = brandNormalization[normalizedBrand] || normalizedBrand;

    setSelectedFilters((prev) => {
      // If brand is already selected, remove it
      if (prev.brands.includes(brandId)) {
        return {
          ...prev,
          brands: prev.brands.filter((brand) => brand !== brandId),
        };
      }
      // Otherwise add it
      else {
        return {
          ...prev,
          brands: [...prev.brands, brandId],
        };
      }
    });
  };

  // Filter cars based on selected filters
  const getFilteredCars = () => {
    let filtered = [...cars];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (car) =>
          car.title.toLowerCase().includes(query) ||
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.description?.toLowerCase().includes(query)
      );
    }

    // Filter by brand with normalization
    if (selectedFilters.brands.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFilters.brands.some((brand) => {
          // Normalize the car make for comparison
          const normalizedMake = car.make.trim().toLowerCase();
          const carBrandId =
            brandNormalization[normalizedMake] || normalizedMake;

          return (
            carBrandId === brand ||
            car.title.toLowerCase().includes(brand.toLowerCase())
          );
        })
      );
    }

    // Filter by price range
    if (priceRange.min && priceRange.max) {
      filtered = filtered.filter(
        (car) =>
          car.price >= parseInt(priceRange.min) &&
          car.price <= parseInt(priceRange.max)
      );
    }

    // Filter by condition
    if (selectedFilters.condition.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFilters.condition.includes(car.condition)
      );
    }

    // Filter by transmission
    if (selectedFilters.transmission.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFilters.transmission.includes(car.transmission)
      );
    }

    // Sort the filtered cars
    return sortCars(filtered);
  };

  // Sort cars based on selected sort option
  const sortCars = (carsToSort: Car[]) => {
    switch (sortOption) {
      case "priceAsc":
        return [...carsToSort].sort((a, b) => a.price - b.price);
      case "priceDesc":
        return [...carsToSort].sort((a, b) => b.price - a.price);
      case "yearDesc":
        return [...carsToSort].sort((a, b) => b.year - a.year);
      case "yearAsc":
        return [...carsToSort].sort((a, b) => a.year - b.year);
      case "mileageAsc":
        return [...carsToSort].sort((a, b) => a.mileage - b.mileage);
      case "newest":
      default:
        // Assuming newest listings would be at the beginning of the array
        return carsToSort;
    }
  };

  // Navigate to car detail page
  const navigateToCarDetail = (carId: string) => {
    router.push(`/car/${carId}`);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to page 1 when searching
    setCurrentPage(1);

    // Update URL with search query
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) {
      params.set("query", searchQuery);
    } else {
      params.delete("query");
    }

    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  // Get filtered cars
  const filteredCars = getFilteredCars();

  // Get paginated cars for display
  const getPaginatedCars = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCars.slice(startIndex, startIndex + itemsPerPage);
  };

  const paginatedCars = getPaginatedCars();

  // Handle price range selection
  const handlePriceRangeSelect = (min: number, max: number) => {
    setPriceRange({ min: min.toString(), max: max.toString() });
  };

  // Handle condition selection
  const handleConditionSelect = (condition: string) => {
    setSelectedFilters((prev) => {
      if (prev.condition.includes(condition)) {
        return {
          ...prev,
          condition: prev.condition.filter((c) => c !== condition),
        };
      } else {
        return {
          ...prev,
          condition: [...prev.condition, condition],
        };
      }
    });
  };

  // Handle transmission selection
  const handleTransmissionSelect = (transmission: string) => {
    setSelectedFilters((prev) => {
      if (prev.transmission.includes(transmission)) {
        return {
          ...prev,
          transmission: prev.transmission.filter((t) => t !== transmission),
        };
      } else {
        return {
          ...prev,
          transmission: [...prev.transmission, transmission],
        };
      }
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "N/A";
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      priceRange: null,
      year: null,
      condition: [],
      transmission: [],
    });
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");

    // Update URL to remove query parameters
    window.history.replaceState({}, "", "/shop");
  };

  const handleAddToCompare = (car, e) => {
    e.stopPropagation();
    // Add car to comparison
    setCarsToCompare([...carsToCompare, car]);
    setShowCompareBar(true);

    // Store full car objects in localStorage
    const storedCars = JSON.parse(
      localStorage.getItem("carsToCompareData") || "[]"
    );
    if (!storedCars.some((storedCar) => storedCar.id === car.id)) {
      localStorage.setItem(
        "carsToCompareData",
        JSON.stringify([...storedCars, car])
      );
    }

    // Also keep the IDs for backward compatibility
    const storedCarIds = JSON.parse(
      localStorage.getItem("carsToCompare") || "[]"
    );
    if (!storedCarIds.includes(car.id)) {
      localStorage.setItem(
        "carsToCompare",
        JSON.stringify([...storedCarIds, car.id])
      );
    }

    toast.success("Added to comparison");
  };
  const handleRemoveFromCompare = (carId) => {
    setCarsToCompare(carsToCompare.filter((car) => car.id !== carId));

    // Remove from localStorage (both data and IDs)
    const storedCars = JSON.parse(
      localStorage.getItem("carsToCompareData") || "[]"
    );
    localStorage.setItem(
      "carsToCompareData",
      JSON.stringify(storedCars.filter((car) => car.id !== carId))
    );

    const storedCarIds = JSON.parse(
      localStorage.getItem("carsToCompare") || "[]"
    );
    localStorage.setItem(
      "carsToCompare",
      JSON.stringify(storedCarIds.filter((id) => id !== carId))
    );

    if (carsToCompare.length === 1) {
      setShowCompareBar(false);
    }

    toast.success("Removed from comparison");
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow py-4 md:py-6">
        {/* Page header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 md:py-12 mb-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-4xl font-bold mb-3">
                Find Your Perfect Vehicle
              </h1>
              <p className="text-blue-100 mb-6 text-sm md:text-base">
                Browse our extensive collection of quality vehicles from trusted
                dealers and private sellers
              </p>

              {/* Enhanced search bar */}
              <div className="bg-white rounded-xl shadow-lg p-1 flex flex-col md:flex-row">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-grow flex items-center p-2 md:p-3"
                >
                  <Search
                    size={20}
                    className="text-gray-400 mr-3 flex-shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="Search by make, model, or keywords..."
                    className="w-full py-1 focus:outline-none text-gray-800 placeholder-gray-400"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </form>
                <Button
                  type="submit"
                  onClick={handleSearchSubmit}
                  className="m-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5"
                >
                  Search
                </Button>
              </div>

              {/* Quick links */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/shop?condition=New">
                  <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-white border-none py-1.5 px-3">
                    New Arrivals
                  </Badge>
                </Link>
                <Link href="/shop?min=0&max=10000">
                  <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-white border-none py-1.5 px-3">
                    Under $10,000
                  </Badge>
                </Link>
                <Link href="/shop?transmission=Automatic">
                  <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-white border-none py-1.5 px-3">
                    Automatic
                  </Badge>
                </Link>
                <Link href="/shop?transmission=Manual">
                  <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-white border-none py-1.5 px-3">
                    Manual
                  </Badge>
                </Link>
                <Link href="/shop?condition=Certified">
                  <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-white border-none py-1.5 px-3">
                    Certified Pre-Owned
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">Browse Vehicles</span>
          </div>

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4 flex justify-between items-center">
            <Button
              data-filter-toggle
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm"
            >
              <Filter size={18} />
              Filters{" "}
              {selectedFilters.brands.length +
                selectedFilters.condition.length +
                selectedFilters.transmission.length +
                (priceRange.min && priceRange.max ? 1 : 0) >
                0 &&
                `(${
                  selectedFilters.brands.length +
                  selectedFilters.condition.length +
                  selectedFilters.transmission.length +
                  (priceRange.min && priceRange.max ? 1 : 0)
                })`}
            </Button>
            <div className="flex gap-2">
              <Button
                className={`${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                } px-3 shadow-sm`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </Button>
              <Button
                className={`${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                } px-3 shadow-sm`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </Button>
              <Button
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-3 shadow-sm"
                onClick={() => setShowMobileSort(true)}
              >
                <SlidersHorizontal size={18} />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600 font-medium">
                Loading vehicles...
              </span>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Mobile filter overlay */}
              {showFilters && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setShowFilters(false)}
                />
              )}

              {/* Mobile sort overlay */}
              <AnimatePresence>
                {showMobileSort && (
                  <>
                    <motion.div
                      className="fixed inset-0 bg-black bg-opacity-50 z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowMobileSort(false)}
                    />
                    <motion.div
                      className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-xl shadow-lg"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-gray-900">
                            Sort By
                          </h3>
                          <button
                            onClick={() => setShowMobileSort(false)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: "newest", label: "Newest First" },
                            { id: "priceAsc", label: "Price: Low to High" },
                            { id: "priceDesc", label: "Price: High to Low" },
                            { id: "yearDesc", label: "Year: Newest First" },
                            { id: "yearAsc", label: "Year: Oldest First" },
                            { id: "mileageAsc", label: "Mileage: Low to High" },
                          ].map((option) => (
                            <button
                              key={option.id}
                              className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
                                sortOption === option.id
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "bg-gray-50 text-gray-700"
                              }`}
                              onClick={() => {
                                setSortOption(option.id);
                                setShowMobileSort(false);
                              }}
                            >
                              {option.label}
                              {sortOption === option.id && (
                                <Check size={18} className="text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Sidebar filters */}
              <div
                id="filter-sidebar"
                className={`lg:w-1/4 fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transform ${
                  showFilters ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-300 ease-in-out w-3/4 sm:w-1/2 md:w-2/5 lg:w-1/4 bg-white h-full lg:h-auto overflow-y-auto`}
              >
                <div className="sticky top-0 bg-white p-4 border-b lg:border-b-0 lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200">
                  {/* Mobile filter header */}
                  <div className="flex justify-between items-center mb-4 lg:hidden">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Filter header with clear button */}
                  <div className="hidden lg:flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Filter size={16} className="mr-2 text-blue-500" />
                      Filters
                    </h3>
                    {(selectedFilters.brands.length > 0 ||
                      selectedFilters.condition.length > 0 ||
                      selectedFilters.transmission.length > 0 ||
                      (priceRange.min && priceRange.max) ||
                      searchQuery) && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Selected filters display */}
                  {(selectedFilters.brands.length > 0 ||
                    selectedFilters.condition.length > 0 ||
                    selectedFilters.transmission.length > 0 ||
                    (priceRange.min && priceRange.max) ||
                    searchQuery) && (
                    <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="text-sm text-blue-700 font-medium mb-2 flex items-center">
                        <Check size={14} className="mr-1" />
                        Active Filters
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                          <div className="bg-white text-blue-800 text-xs px-2 py-1 rounded-md flex items-center shadow-sm">
                            <Search size={12} className="mr-1 text-blue-500" />
                            {searchQuery}
                            <button
                              onClick={() => setSearchQuery("")}
                              className="ml-1 hover:text-blue-900"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                        {selectedFilters.brands.map((brand) => {
                          // Get the display name for the brand
                          const displayName = formatBrandName(brand);

                          return (
                            <div
                              key={brand}
                              className="bg-white text-blue-800 text-xs px-2 py-1 rounded-md flex items-center shadow-sm"
                            >
                              {displayName}
                              <button
                                onClick={() => handleBrandSelect(brand)}
                                className="ml-1 hover:text-blue-900"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                        {priceRange.min && priceRange.max && (
                          <div className="bg-white text-blue-800 text-xs px-2 py-1 rounded-md flex items-center shadow-sm">
                            <DollarSign
                              size={12}
                              className="mr-1 text-blue-500"
                            />
                            {formatPrice(parseInt(priceRange.min))} -{" "}
                            {formatPrice(parseInt(priceRange.max))}
                            <button
                              onClick={() =>
                                setPriceRange({ min: "", max: "" })
                              }
                              className="ml-1 hover:text-blue-900"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                        {selectedFilters.condition.map((condition) => (
                          <div
                            key={condition}
                            className="bg-white text-blue-800 text-xs px-2 py-1 rounded-md flex items-center shadow-sm"
                          >
                            <BadgeCheck
                              size={12}
                              className="mr-1 text-blue-500"
                            />
                            {condition}
                            <button
                              onClick={() => handleConditionSelect(condition)}
                              className="ml-1 hover:text-blue-900"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {selectedFilters.transmission.map((transmission) => (
                          <div
                            key={transmission}
                            className="bg-white text-blue-800 text-xs px-2 py-1 rounded-md flex items-center shadow-sm"
                          >
                            <Settings
                              size={12}
                              className="mr-1 text-blue-500"
                            />
                            {transmission}
                            <button
                              onClick={() =>
                                handleTransmissionSelect(transmission)
                              }
                              className="ml-1 hover:text-blue-900"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand filter */}
                  <div className="mb-6">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("make")}
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Car size={16} className="mr-2 text-blue-500" />
                        Brand
                      </h3>
                      {expandedFilters.make ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>

                    {expandedFilters.make && (
                      <>
                        <div className="relative mb-3">
                          <input
                            type="text"
                            placeholder="Find Brand"
                            className="w-full p-2 pl-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <Search
                            className="absolute left-2 top-2 text-gray-400"
                            size={16}
                          />
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-2 mb-4 pr-1">
                          {filterData.makes.map((make, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`make-${index}`}
                                checked={selectedFilters.brands.includes(
                                  make.name
                                )}
                                onChange={() => handleBrandSelect(make.name)}
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`make-${index}`}
                                className="text-sm text-gray-700 flex-grow flex items-center"
                              >
                                <div className="w-5 h-5 mr-2">
                                  <img
                                    src={make.image}
                                    alt={make.displayName}
                                    width={20}
                                    height={20}
                                    className="object-contain w-full h-full"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                </div>
                                {make.displayName}
                              </label>
                              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {make.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Price filter */}
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("price")}
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <DollarSign size={16} className="mr-2 text-blue-500" />
                        Price
                      </h3>
                      {expandedFilters.price ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>

                    {expandedFilters.price && (
                      <>
                        <div className="flex gap-3 mb-4">
                          <div className="w-1/2">
                            <label className="block text-xs text-gray-500 mb-1">
                              Min Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-2 text-gray-500">
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={priceRange.min}
                                onChange={(e) =>
                                  setPriceRange({
                                    ...priceRange,
                                    min: e.target.value.replace(/\D/g, ""),
                                  })
                                }
                                className="w-full p-2 pl-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <label className="block text-xs text-gray-500 mb-1">
                              Max Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-2 text-gray-500">
                                $
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={priceRange.max}
                                onChange={(e) =>
                                  setPriceRange({
                                    ...priceRange,
                                    max: e.target.value.replace(/\D/g, ""),
                                  })
                                }
                                className="w-full p-2 pl-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {filterData.priceRanges.map((range, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="radio"
                                id={`price-${index}`}
                                name="price-range"
                                checked={
                                  priceRange.min === range.min.toString() &&
                                  priceRange.max === range.max.toString()
                                }
                                onChange={() =>
                                  handlePriceRangeSelect(range.min, range.max)
                                }
                                className="mr-2 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`price-${index}`}
                                className="text-sm text-gray-700 flex-grow"
                              >
                                {range.label}
                              </label>
                              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {range.count}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between mb-2">
                          <Button
                            variant="outline"
                            className="text-sm py-1 px-3 h-auto"
                            onClick={() => setPriceRange({ min: "", max: "" })}
                          >
                            Clear
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-sm py-1 px-3 h-auto">
                            Apply
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Year filter */}
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("year")}
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        Year
                      </h3>
                      {expandedFilters.year ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>

                    {expandedFilters.year && (
                      <div className="space-y-2 mb-4">
                        {filterData.yearRanges.map((range, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="radio"
                              id={`year-${index}`}
                              name="year-range"
                              className="mr-2 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`year-${index}`}
                              className="text-sm text-gray-700 flex-grow"
                            >
                              {range.label}
                            </label>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {range.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Condition filter */}
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("condition")}
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <BadgeCheck size={16} className="mr-2 text-blue-500" />
                        Condition
                      </h3>
                      {expandedFilters.condition ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>

                    {expandedFilters.condition && (
                      <div className="space-y-2 mb-4">
                        {filterData.conditions.map((condition, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`condition-${index}`}
                              checked={selectedFilters.condition.includes(
                                condition.name
                              )}
                              onChange={() =>
                                handleConditionSelect(condition.name)
                              }
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`condition-${index}`}
                              className="text-sm text-gray-700 flex-grow"
                            >
                              {condition.name}
                            </label>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {condition.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Transmission filter */}
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("transmission")}
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Settings size={16} className="mr-2 text-blue-500" />
                        Transmission
                      </h3>
                      {expandedFilters.transmission ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>

                    {expandedFilters.transmission && (
                      <div className="space-y-2 mb-4">
                        {filterData.transmissions.map((transmission, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`transmission-${index}`}
                              checked={selectedFilters.transmission.includes(
                                transmission.name
                              )}
                              onChange={() =>
                                handleTransmissionSelect(transmission.name)
                              }
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`transmission-${index}`}
                              className="text-sm text-gray-700 flex-grow"
                            >
                              {transmission.name}
                            </label>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                              {transmission.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile apply button */}
                  <div className="mt-6 lg:hidden">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </Button>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowFilters(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="lg:w-3/4">
                {/* Search and sort - Desktop */}
                <div className="hidden lg:block mb-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Car size={18} className="mr-2 text-blue-500" />
                        Browse Vehicles
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select
                          className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                        >
                          <option value="newest">Newest First</option>
                          <option value="priceAsc">Price: Low to High</option>
                          <option value="priceDesc">Price: High to Low</option>
                          <option value="yearDesc">Year: Newest First</option>
                          <option value="yearAsc">Year: Oldest First</option>
                          <option value="mileageAsc">
                            Mileage: Low to High
                          </option>
                        </select>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className={`${
                                    viewMode === "grid"
                                      ? "bg-blue-600 text-white"
                                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                  } px-3`}
                                  onClick={() => setViewMode("grid")}
                                >
                                  <Grid size={18} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Grid View</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className={`${
                                    viewMode === "list"
                                      ? "bg-blue-600 text-white"
                                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                  } px-3`}
                                  onClick={() => setViewMode("list")}
                                >
                                  <List size={18} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>List View</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className={`bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-3 ${
                                    isCompact
                                      ? "border-blue-500 text-blue-600"
                                      : ""
                                  }`}
                                  onClick={() => setIsCompact(!isCompact)}
                                >
                                  <Sliders size={18} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {isCompact ? "Standard View" : "Compact View"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>

                    {/* Quick brand filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200 overflow-x-auto hide-scrollbar">
                      <div className="flex gap-3 items-center">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          Popular Brands:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {popularBrands.slice(0, 8).map((brand, index) => (
                            <button
                              key={index}
                              onClick={() => handleBrandSelect(brand.name)}
                              className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                selectedFilters.brands.includes(brand.name)
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <img
                                src={brand.image}
                                alt={brand.displayName}
                                width={16}
                                height={16}
                                className="mr-1.5 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                              {brand.displayName}
                              <span className="ml-1.5 text-xs text-gray-500">
                                ({brand.count})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results count and page info */}
                <div className="flex justify-between items-center mb-4">
                  <div id="results-heading" className="text-gray-700">
                    <span className="font-semibold text-gray-900">
                      {filteredCars.length}
                    </span>{" "}
                    vehicles found
                    {selectedFilters.brands.length > 0 && (
                      <span>
                        {" "}
                        for{" "}
                        {selectedFilters.brands
                          .map((brand) => formatBrandName(brand))
                          .join(", ")}
                      </span>
                    )}
                    {priceRange.min && priceRange.max && (
                      <span>
                        {" "}
                        between {formatPrice(parseInt(priceRange.min))} and{" "}
                        {formatPrice(parseInt(priceRange.max))}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of{" "}
                    {Math.ceil(filteredCars.length / itemsPerPage)}
                  </div>
                </div>

                {/* No results */}
                {filteredCars.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                      <Search className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No vehicles found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any vehicles matching your current
                      filters.
                    </p>
                    <Button
                      onClick={clearAllFilters}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {/* Car listings - Grid view */}
                {viewMode === "grid" && filteredCars.length > 0 && (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                      isCompact
                        ? "lg:grid-cols-3 xl:grid-cols-4"
                        : "lg:grid-cols-2 xl:grid-cols-3"
                    } gap-4 mb-8`}
                  >
                    {paginatedCars.map((car) => (
                      <div
                        key={car.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer relative group"
                        onClick={() => navigateToCarDetail(car.id)}
                      >
                        {/* Image container with aspect ratio */}
                        <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                          <img
                            src={car.images[0] || "/placeholder-car.jpg"}
                            alt={car.title}
                            className="object-cover transition-transform group-hover:scale-110 w-full h-full duration-700"
                          />

                          {/* Condition badge */}
                          {car.condition && (
                            <span
                              className={`absolute top-3 left-3 text-xs font-medium text-white px-2 py-1 rounded-md ${getConditionColor(
                                car.condition
                              )}`}
                            >
                              {car.condition}
                            </span>
                          )}

                          {/* Compare button */}
                          <button
                            onClick={(e) => handleAddToCompare(car, e)}
                            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <SlidersHorizontal
                              size={16}
                              className="text-blue-600"
                            />
                          </button>

                          {/* Favorite button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle favorite logic
                            }}
                            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart
                              size={16}
                              className="text-gray-600 hover:text-red-500"
                            />
                          </button>
                        </div>

                        {/* Car info */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {car.year} {formatBrandName(car.make)} {car.model}
                            </h3>
                          </div>

                          <div className="flex items-center mb-3">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(car.price)}
                            </span>
                            {car.msrp && car.msrp > car.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatPrice(car.msrp)}
                              </span>
                            )}
                          </div>

                          {/* Car specs */}
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Gauge size={14} className="mr-1 text-gray-400" />
                              {formatNumber(car.mileage)} mi
                            </div>
                            <div className="flex items-center">
                              <Fuel size={14} className="mr-1 text-gray-400" />
                              {car.fuelType || "Gas"}
                            </div>
                            <div className="flex items-center">
                              <Settings
                                size={14}
                                className="mr-1 text-gray-400"
                              />
                              {car.transmission || "Automatic"}
                            </div>
                            <div className="flex items-center">
                              <MapPin
                                size={14}
                                className="mr-1 text-gray-400"
                              />
                              {car.location || "Local Dealer"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Car listings - List view */}
                {viewMode === "list" && filteredCars.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {paginatedCars.map((car) => (
                      <div
                        key={car.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer relative group flex flex-col sm:flex-row"
                        onClick={() => navigateToCarDetail(car.id)}
                      >
                        {/* Image container */}
                        <div className="relative w-full sm:w-1/3 pb-[60%] sm:pb-0 overflow-hidden bg-gray-100">
                          <img
                            src={car.images[0] || "/placeholder-car.jpg"}
                            alt={car.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Condition badge */}
                          {car.condition && (
                            <span
                              className={`absolute top-3 left-3 text-xs font-medium text-white px-2 py-1 rounded-md ${getConditionColor(
                                car.condition
                              )}`}
                            >
                              {car.condition}
                            </span>
                          )}

                          {/* Compare button */}
                          <button
                            onClick={(e) => handleAddToCompare(car, e)}
                            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <SlidersHorizontal
                              size={16}
                              className="text-blue-600"
                            />
                          </button>
                        </div>

                        {/* Car info */}
                        <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {car.year} {formatBrandName(car.make)}{" "}
                                {car.model}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle favorite logic
                                }}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <Heart size={18} />
                              </button>
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {car.description ||
                                `${car.year} ${formatBrandName(car.make)} ${
                                  car.model
                                } with ${formatNumber(car.mileage)} miles and ${
                                  car.transmission
                                } transmission.`}
                            </p>

                            {/* Car specs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              <div className="flex items-center">
                                <Gauge
                                  size={16}
                                  className="mr-1.5 text-blue-500"
                                />
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Mileage
                                  </div>
                                  <div className="text-sm font-medium">
                                    {formatNumber(car.mileage)} mi
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Fuel
                                  size={16}
                                  className="mr-1.5 text-blue-500"
                                />
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Fuel
                                  </div>
                                  <div className="text-sm font-medium">
                                    {car.fuelType || "Gas"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Settings
                                  size={16}
                                  className="mr-1.5 text-blue-500"
                                />
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Transmission
                                  </div>
                                  <div className="text-sm font-medium">
                                    {car.transmission || "Automatic"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Calendar
                                  size={16}
                                  className="mr-1.5 text-blue-500"
                                />
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Year
                                  </div>
                                  <div className="text-sm font-medium">
                                    {car.year}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <span className="text-xl font-bold text-blue-600">
                                {formatPrice(car.price)}
                              </span>
                              {car.msrp && car.msrp > car.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(car.msrp)}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hidden md:flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCompare(car, e);
                                }}
                              >
                                <SlidersHorizontal size={14} className="mr-1" />
                                Compare
                              </Button>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 hidden md:flex items-center"
                              >
                                <Eye size={14} className="mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {filteredCars.length > 0 && (
                  <div className="flex justify-center mt-8 mb-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="hidden sm:flex items-center"
                      >
                        <ChevronLeft size={16} className="mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="sm:hidden"
                      >
                        <ChevronLeft size={16} />
                      </Button>

                      {/* Page numbers */}
                      <div className="flex space-x-1">
                        {Array.from(
                          {
                            length: Math.min(
                              5,
                              Math.ceil(filteredCars.length / itemsPerPage)
                            ),
                          },
                          (_, i) => {
                            // Calculate the page number to display
                            let pageNum;
                            const totalPages = Math.ceil(
                              filteredCars.length / itemsPerPage
                            );

                            if (totalPages <= 5) {
                              // Show all pages if there are 5 or fewer
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              // Near the start
                              pageNum = i + 1;
                              if (i === 4) pageNum = totalPages;
                            } else if (currentPage >= totalPages - 2) {
                              // Near the end
                              pageNum = totalPages - 4 + i;
                              if (i === 0) pageNum = 1;
                            } else {
                              // In the middle
                              pageNum = currentPage - 2 + i;
                              if (i === 0) pageNum = 1;
                              if (i === 4) pageNum = totalPages;
                            }

                            // Determine if we should show ellipsis
                            const isEllipsis =
                              (i === 1 && pageNum !== 2) ||
                              (i === 3 && pageNum !== totalPages - 1);

                            if (isEllipsis) {
                              return (
                                <span
                                  key={i}
                                  className="flex items-center justify-center w-9 h-9 text-gray-500"
                                >
                                  ...
                                </span>
                              );
                            }

                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="icon"
                                className={`w-9 h-9 ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700"
                                }`}
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(filteredCars.length / itemsPerPage)
                        }
                        className="hidden sm:flex items-center"
                      >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(filteredCars.length / itemsPerPage)
                        }
                        className="sm:hidden"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Compare bar */}
      <AnimatePresence>
        {showCompareBar && carsToCompare.length > 0 && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="container mx-auto px-4 max-w-7xl py-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <SlidersHorizontal size={16} className="mr-2 text-blue-500" />
                  Compare Vehicles ({carsToCompare.length}/3)
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm h-8"
                    onClick={() => setCarsToCompare([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-sm h-8"
                    disabled={carsToCompare.length < 2}
                    onClick={() => router.push("/compare")}
                  >
                    Compare Now
                  </Button>
                  <button
                    onClick={() => setShowCompareBar(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((index) => {
                  const car = carsToCompare[index];

                  if (!car) {
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-400 h-24"
                      >
                        <Plus size={20} className="mr-2" />
                        Add Vehicle
                      </div>
                    );
                  }

                  return (
                    <div
                      key={car.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 relative group"
                    >
                      <button
                        onClick={() => handleRemoveFromCompare(car.id)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                      >
                        <X size={14} className="text-gray-500" />
                      </button>
                      <div className="flex gap-3">
                        <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={car.images[0] || "/placeholder-car.jpg"}
                            alt={car.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {car.year} {formatBrandName(car.make)} {car.model}
                          </h4>
                          <p className="text-blue-600 font-semibold text-sm">
                            {formatPrice(car.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatNumber(car.mileage)} mi • {car.transmission}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}

export default page;
