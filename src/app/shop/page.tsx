"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  Search,
  MapPin,
  Loader2,
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
  Gauge,
  Calendar,
  Settings,
  Heart,
  RefreshCw,
  SlidersHorizontal,
  BadgeCheck,
  Plus,
  Fuel,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  fuelType?: string;
  msrp?: number;
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

  const handleAddToCompare = (car: Car, e: React.MouseEvent) => {
    e.stopPropagation();
    if (carsToCompare.length >= 3) {
      toast.error("You can compare up to three vehicles at a time.");
      return;
    }
    if (carsToCompare.some((c) => c.id === car.id)) {
      toast.info("Already in comparison");
      return;
    }
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
  const handleRemoveFromCompare = (carId: string) => {
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
    if (conditionLower.includes("good")) return "bg-emerald-500";
    if (conditionLower.includes("fair")) return "bg-lime-600";
    if (conditionLower.includes("poor")) return "bg-red-500";
    return "bg-emerald-500"; // default
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea] text-stone-900 antialiased">
      <Navbar />

      <main className="flex-grow py-0 md:py-0">
        <div className="border-b border-stone-300 bg-[#f4f1ea] py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
              <div className="md:col-span-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  Inventory
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                  Shop repo vehicles
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600 md:text-base">
                  Browse lender-recovered inventory with clear filters—compare
                  price, mileage, and condition before you reach out.
                </p>
              </div>
              <div className="md:col-span-5">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col gap-2 border border-stone-300 bg-white p-2 sm:flex-row sm:items-stretch"
                >
                  <div className="flex min-h-12 flex-1 items-center gap-2 px-2">
                    <Search
                      size={20}
                      className="shrink-0 text-stone-400"
                      aria-hidden
                    />
                    <input
                      type="text"
                      placeholder="Search make, model, keywords…"
                      className="min-h-11 w-full bg-transparent py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button
                    type="submit"
                    onClick={handleSearchSubmit}
                    className="h-12 shrink-0 rounded-none border border-stone-300 bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-500"
                  >
                    Search
                  </Button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/shop?min=0&max=10000"
                    className="border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea]"
                  >
                    Under $10K
                  </Link>
                  <Link
                    href="/shop"
                    className="border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea]"
                  >
                    All inventory
                  </Link>
                  <Link
                    href="/compare"
                    className="border border-dashed border-stone-400 bg-transparent px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:border-stone-300"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center border-b border-stone-300 pb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
            <Link
              href="/"
              className="text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800"
            >
              Home
            </Link>
            <span className="mx-2 text-stone-400" aria-hidden>
              /
            </span>
            <span className="text-stone-600">Browse vehicles</span>
          </div>

          <div className="mb-5 flex items-center justify-between lg:hidden">
            <Button
              data-filter-toggle
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="rounded-none border border-stone-300 bg-white font-bold text-stone-900 hover:bg-stone-200"
            >
              <Filter size={18} className="mr-2" />
              Filters
              {selectedFilters.brands.length +
                selectedFilters.condition.length +
                selectedFilters.transmission.length +
                (priceRange.min && priceRange.max ? 1 : 0) >
                0 &&
                ` (${
                  selectedFilters.brands.length +
                  selectedFilters.condition.length +
                  selectedFilters.transmission.length +
                  (priceRange.min && priceRange.max ? 1 : 0)
                })`}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                className={`rounded-none border border-stone-300 px-3 ${
                  viewMode === "grid"
                    ? "bg-stone-900 text-[#f4f1ea]"
                    : "bg-white text-stone-900 hover:bg-stone-200"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </Button>
              <Button
                type="button"
                className={`rounded-none border border-stone-300 px-3 ${
                  viewMode === "list"
                    ? "bg-stone-900 text-[#f4f1ea]"
                    : "bg-white text-stone-900 hover:bg-stone-200"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </Button>
              <Button
                type="button"
                className="rounded-none border border-stone-300 bg-white px-3 text-stone-900 hover:bg-stone-200"
                onClick={() => setShowMobileSort(true)}
              >
                <SlidersHorizontal size={18} />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[16rem] items-center justify-center gap-3 border border-stone-300 bg-white">
              <Loader2 className="h-9 w-9 animate-spin text-stone-900" />
              <span className="font-medium text-stone-600">
                Loading vehicles…
              </span>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Mobile filter overlay */}
              {showFilters && (
                <div
                  className="fixed inset-0 z-40 bg-stone-900/60 lg:hidden"
                  onClick={() => setShowFilters(false)}
                  aria-hidden
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
                      className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-300 bg-[#f4f1ea] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
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
                        <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                            Sort by
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowMobileSort(false)}
                            className="border border-stone-300 p-1.5 hover:bg-white"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <div className="mt-4 space-y-2">
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
                              type="button"
                              className={`flex w-full items-center justify-between border border-stone-300 px-3 py-3 text-left text-sm font-semibold ${
                                sortOption === option.id
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white text-stone-900 hover:bg-amber-100/60"
                              }`}
                              onClick={() => {
                                setSortOption(option.id);
                                setShowMobileSort(false);
                              }}
                            >
                              {option.label}
                              {sortOption === option.id && (
                                <Check size={18} className="shrink-0" />
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
                className={`fixed inset-y-0 left-0 z-50 h-full w-[85%] max-w-sm overflow-y-auto border-r border-stone-300 bg-[#f4f1ea] transition-transform duration-300 ease-in-out sm:w-3/5 lg:static lg:z-auto lg:h-auto lg:w-1/4 lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:border-r-0 ${
                  showFilters ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
              >
                <div className="sticky top-0 z-10 border-b border-stone-300 bg-[#f4f1ea] p-4 lg:border lg:border-stone-300 lg:bg-white">
                  <div className="mb-4 flex items-center justify-between lg:hidden">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                      Filters
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="border border-stone-300 p-1.5 hover:bg-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mb-4 hidden items-center justify-between lg:flex">
                    <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                      <Filter size={16} className="mr-2 text-emerald-700" />
                      Filters
                    </h3>
                    {(selectedFilters.brands.length > 0 ||
                      selectedFilters.condition.length > 0 ||
                      selectedFilters.transmission.length > 0 ||
                      (priceRange.min && priceRange.max) ||
                      searchQuery) && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4"
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
                    <div className="mb-4 border border-dashed border-stone-300 bg-white/80 px-3 py-3">
                      <div className="mb-2 flex items-center text-xs font-bold uppercase tracking-wider text-stone-500">
                        <Check size={14} className="mr-1.5 text-stone-900" />
                        Active
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                          <div className="flex items-center border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-900">
                            <Search size={12} className="mr-1 text-stone-500" />
                            {searchQuery}
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="ml-1 text-stone-500 hover:text-stone-900"
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
                              className="flex items-center border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-900"
                            >
                              {displayName}
                              <button
                                type="button"
                                onClick={() => handleBrandSelect(brand)}
                                className="ml-1 text-stone-500 hover:text-stone-900"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                        {priceRange.min && priceRange.max && (
                          <div className="flex items-center border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-900">
                            <DollarSign
                              size={12}
                              className="mr-1 text-stone-500"
                            />
                            {formatPrice(parseInt(priceRange.min))} -{" "}
                            {formatPrice(parseInt(priceRange.max))}
                            <button
                              type="button"
                              onClick={() =>
                                setPriceRange({ min: "", max: "" })
                              }
                              className="ml-1 text-stone-500 hover:text-stone-900"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                        {selectedFilters.condition.map((condition) => (
                          <div
                            key={condition}
                            className="flex items-center border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-900"
                          >
                            <BadgeCheck
                              size={12}
                              className="mr-1 text-stone-500"
                            />
                            {condition}
                            <button
                              type="button"
                              onClick={() => handleConditionSelect(condition)}
                              className="ml-1 text-stone-500 hover:text-stone-900"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {selectedFilters.transmission.map((transmission) => (
                          <div
                            key={transmission}
                            className="flex items-center border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-900"
                          >
                            <Settings
                              size={12}
                              className="mr-1 text-stone-500"
                            />
                            {transmission}
                            <button
                              type="button"
                              onClick={() =>
                                handleTransmissionSelect(transmission)
                              }
                              className="ml-1 text-stone-500 hover:text-stone-900"
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
                      className="mb-3 flex cursor-pointer items-center justify-between"
                      onClick={() => toggleFilter("make")}
                    >
                      <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                        <Car size={16} className="mr-2 text-emerald-700" />
                        Brand
                      </h3>
                      {expandedFilters.make ? (
                        <ChevronUp size={18} className="text-stone-500" />
                      ) : (
                        <ChevronDown size={18} className="text-stone-500" />
                      )}
                    </div>

                    {expandedFilters.make && (
                      <>
                        <div className="relative mb-3">
                          <input
                            type="text"
                            placeholder="Find brand"
                            className="w-full border border-stone-300 bg-white p-2 pl-8 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
                          />
                          <Search
                            className="absolute left-2 top-2.5 text-stone-400"
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
                                className="mr-2 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <label
                                htmlFor={`make-${index}`}
                                className="text-sm text-stone-700 flex-grow flex items-center"
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
                              <span className="border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600">
                                {make.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Price filter */}
                  <div className="border-t border-stone-300 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("price")}
                    >
                      <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                        <DollarSign size={16} className="mr-2 text-emerald-700" />
                        Price
                      </h3>
                      {expandedFilters.price ? (
                        <ChevronUp size={18} className="text-stone-500" />
                      ) : (
                        <ChevronDown size={18} className="text-stone-500" />
                      )}
                    </div>

                    {expandedFilters.price && (
                      <>
                        <div className="flex gap-3 mb-4">
                          <div className="w-1/2">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">
                              Min Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-2 text-stone-500">
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
                                className="w-full border border-stone-300 bg-white p-2 pl-6 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">
                              Max Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-2 text-stone-500">
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
                                className="w-full border border-stone-300 bg-white p-2 pl-6 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
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
                                className="mr-2 h-4 w-4 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <label
                                htmlFor={`price-${index}`}
                                className="text-sm text-stone-700 flex-grow"
                              >
                                {range.label}
                              </label>
                              <span className="border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600">
                                {range.count}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mb-2 flex justify-between gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 rounded-none border border-stone-300 px-3 text-xs font-bold"
                            onClick={() => setPriceRange({ min: "", max: "" })}
                          >
                            Clear
                          </Button>
                          <Button
                            type="button"
                            className="h-9 rounded-none border border-stone-300 bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-500"
                          >
                            Apply
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Year filter */}
                  <div className="border-t border-stone-300 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("year")}
                    >
                      <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                        <Calendar size={16} className="mr-2 text-emerald-700" />
                        Year
                      </h3>
                      {expandedFilters.year ? (
                        <ChevronUp size={18} className="text-stone-500" />
                      ) : (
                        <ChevronDown size={18} className="text-stone-500" />
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
                              className="mr-2 h-4 w-4 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label
                              htmlFor={`year-${index}`}
                              className="text-sm text-stone-700 flex-grow"
                            >
                              {range.label}
                            </label>
                            <span className="border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600">
                              {range.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Condition filter */}
                  <div className="border-t border-stone-300 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("condition")}
                    >
                      <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                        <BadgeCheck size={16} className="mr-2 text-emerald-700" />
                        Condition
                      </h3>
                      {expandedFilters.condition ? (
                        <ChevronUp size={18} className="text-stone-500" />
                      ) : (
                        <ChevronDown size={18} className="text-stone-500" />
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
                              className="mr-2 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label
                              htmlFor={`condition-${index}`}
                              className="text-sm text-stone-700 flex-grow"
                            >
                              {condition.name}
                            </label>
                            <span className="border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600">
                              {condition.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Transmission filter */}
                  <div className="border-t border-stone-300 pt-4 pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer mb-3"
                      onClick={() => toggleFilter("transmission")}
                    >
                      <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                        <Settings size={16} className="mr-2 text-emerald-700" />
                        Transmission
                      </h3>
                      {expandedFilters.transmission ? (
                        <ChevronUp size={18} className="text-stone-500" />
                      ) : (
                        <ChevronDown size={18} className="text-stone-500" />
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
                              className="mr-2 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label
                              htmlFor={`transmission-${index}`}
                              className="text-sm text-stone-700 flex-grow"
                            >
                              {transmission.name}
                            </label>
                            <span className="border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600">
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
                        type="button"
                        variant="outline"
                        className="w-full rounded-none border border-stone-300 font-bold text-stone-900 hover:bg-stone-200"
                        onClick={clearAllFilters}
                      >
                        Clear all
                      </Button>
                      <Button
                        type="button"
                        className="w-full rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                        onClick={() => setShowFilters(false)}
                      >
                        Apply filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="lg:w-3/4">
                {/* Search and sort - Desktop */}
                <div className="hidden lg:mb-6 lg:block">
                  <div className="overflow-hidden border border-stone-300 bg-white">
                    <div className="flex items-center justify-between border-b border-stone-300 p-4">
                      <h2 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                        <Car size={18} className="mr-2 text-emerald-700" />
                        Browse vehicles
                      </h2>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          Sort
                        </span>
                        <select
                          className="border border-stone-300 bg-[#f4f1ea] p-2 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                                  type="button"
                                  className={`rounded-none border border-stone-300 px-3 ${
                                    viewMode === "grid"
                                      ? "bg-stone-900 text-[#f4f1ea]"
                                      : "bg-white text-stone-900 hover:bg-stone-200"
                                  }`}
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
                                  type="button"
                                  className={`rounded-none border border-stone-300 px-3 ${
                                    viewMode === "list"
                                      ? "bg-stone-900 text-[#f4f1ea]"
                                      : "bg-white text-stone-900 hover:bg-stone-200"
                                  }`}
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
                                  type="button"
                                  className={`rounded-none border border-stone-300 bg-white px-3 text-stone-900 hover:bg-stone-200 ${
                                    isCompact
                                      ? "ring-2 ring-emerald-600 ring-offset-2"
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

                    <div className="hide-scrollbar overflow-x-auto border-b border-stone-300 bg-[#f4f1ea] p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-stone-500">
                          Popular brands
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {popularBrands.slice(0, 8).map((brand, index) => (
                            <button
                              type="button"
                              key={index}
                              onClick={() => handleBrandSelect(brand.name)}
                              className={`flex items-center border border-stone-300 px-3 py-1.5 text-xs font-bold transition-colors ${
                                selectedFilters.brands.includes(brand.name)
                                  ? "bg-stone-900 text-[#f4f1ea]"
                                  : "bg-white text-stone-900 hover:bg-amber-100/60"
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
                              <span className="ml-1.5 font-mono text-[10px] font-normal opacity-80">
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
                <div className="mb-4 flex items-center justify-between border-b border-stone-300 pb-3">
                  <div id="results-heading" className="text-sm text-stone-600">
                    <span className="font-mono font-bold text-stone-900">
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
                  <div className="font-mono text-xs text-stone-500">
                    Page {currentPage} of{" "}
                    {Math.ceil(filteredCars.length / itemsPerPage)}
                  </div>
                </div>

                {/* No results */}
                {filteredCars.length === 0 && (
                  <div className="border border-stone-300 bg-white px-6 py-12 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                      No matches
                    </p>
                    <h3 className="mt-3 text-xl font-bold text-stone-900">
                      No vehicles found
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm text-stone-600">
                      We couldn&apos;t find any vehicles matching your current
                      filters.
                    </p>
                    <Button
                      type="button"
                      onClick={clearAllFilters}
                      className="mt-8 rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500"
                    >
                      Clear all filters
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
                        className="group relative cursor-pointer overflow-hidden border border-stone-300 bg-[#f4f1ea] transition-colors hover:bg-amber-100/50"
                        onClick={() => navigateToCarDetail(car.id)}
                      >
                        {/* Image container with aspect ratio */}
                        <div className="relative aspect-[16/10] overflow-hidden border-b border-stone-300 bg-stone-200">
                          <img
                            src={car.images[0] || "/placeholder-car.jpg"}
                            alt={car.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />

                          {/* Condition badge */}
                          {car.condition && (
                            <span
                              className={`absolute left-3 top-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${getConditionColor(
                                car.condition
                              )}`}
                            >
                              {car.condition}
                            </span>
                          )}

                          {/* Compare button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCompare(car, e)}
                            className="absolute right-3 top-3 border border-stone-300 bg-white/95 p-1.5 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                          >
                            <SlidersHorizontal
                              size={16}
                              className="text-stone-900"
                            />
                          </button>

                          {/* Favorite button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle favorite logic
                            }}
                            className="absolute bottom-3 right-3 border border-stone-300 bg-white/95 p-1.5 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                          >
                            <Heart
                              size={16}
                              className="text-stone-700 hover:text-red-600"
                            />
                          </button>
                        </div>

                        {/* Car info */}
                        <div className="p-4">
                          <div className="mb-1 flex items-center justify-between">
                            <h3 className="truncate font-bold text-stone-900">
                              {car.year} {formatBrandName(car.make)} {car.model}
                            </h3>
                          </div>

                          <div className="mb-3 flex items-center">
                            <span className="font-mono text-lg font-bold text-stone-900">
                              {formatPrice(car.price)}
                            </span>
                            {car.msrp && car.msrp > car.price && (
                              <span className="ml-2 text-sm text-stone-500 line-through">
                                {formatPrice(car.msrp)}
                              </span>
                            )}
                          </div>

                          {/* Car specs */}
                          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                            <div className="flex items-center">
                              <Gauge size={14} className="mr-1 text-stone-400" />
                              {formatNumber(car.mileage)} mi
                            </div>
                            <div className="flex items-center">
                              <Fuel size={14} className="mr-1 text-stone-400" />
                              {car.fuelType || "Gas"}
                            </div>
                            <div className="flex items-center">
                              <Settings
                                size={14}
                                className="mr-1 text-stone-400"
                              />
                              {car.transmission || "Automatic"}
                            </div>
                            <div className="flex items-center">
                              <MapPin
                                size={14}
                                className="mr-1 text-stone-400"
                              />
                              {car.location || SITE.listingLocationDefault}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Car listings - List view */}
                {viewMode === "list" && filteredCars.length > 0 && (
                  <div className="mb-8 space-y-0 divide-y divide-stone-300 border-y border-stone-300">
                    {paginatedCars.map((car) => (
                      <div
                        key={car.id}
                        className="group flex cursor-pointer flex-col bg-[#f4f1ea] transition-colors hover:bg-amber-100/50 sm:flex-row"
                        onClick={() => navigateToCarDetail(car.id)}
                      >
                        <div className="relative h-52 w-full shrink-0 overflow-hidden border-b border-stone-300 bg-stone-200 sm:h-auto sm:min-h-[240px] sm:w-2/5 sm:border-b-0 sm:border-r sm:border-stone-300">
                          <img
                            src={car.images[0] || "/placeholder-car.jpg"}
                            alt={car.title}
                            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                          />

                          {car.condition && (
                            <span
                              className={`absolute left-3 top-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${getConditionColor(
                                car.condition
                              )}`}
                            >
                              {car.condition}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleAddToCompare(car, e)}
                            className="absolute right-3 top-3 border border-stone-300 bg-white/95 p-1.5 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                          >
                            <SlidersHorizontal
                              size={16}
                              className="text-stone-900"
                            />
                          </button>
                        </div>

                        <div className="flex flex-grow flex-col justify-between p-4 sm:p-6">
                          <div>
                            <div className="mb-1 flex items-start justify-between gap-3">
                              <h3 className="text-lg font-bold text-stone-900">
                                {car.year} {formatBrandName(car.make)}{" "}
                                {car.model}
                              </h3>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="shrink-0 border border-transparent p-1 text-stone-500 hover:text-red-600"
                              >
                                <Heart size={18} />
                              </button>
                            </div>

                            <p className="mb-3 line-clamp-2 text-sm text-stone-600">
                              {car.description ||
                                `${car.year} ${formatBrandName(car.make)} ${
                                  car.model
                                } with ${formatNumber(car.mileage)} miles and ${
                                  car.transmission
                                } transmission.`}
                            </p>

                            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                              <div className="border border-stone-300 bg-white px-3 py-2">
                                <div className="font-mono text-[10px] uppercase text-stone-500">
                                  Mileage
                                </div>
                                <div className="mt-1 flex items-center text-sm font-semibold text-stone-900">
                                  <Gauge
                                    size={16}
                                    className="mr-1.5 text-emerald-700"
                                  />
                                  {formatNumber(car.mileage)} mi
                                </div>
                              </div>
                              <div className="border border-stone-300 bg-white px-3 py-2">
                                <div className="font-mono text-[10px] uppercase text-stone-500">
                                  Fuel
                                </div>
                                <div className="mt-1 flex items-center text-sm font-semibold text-stone-900">
                                  <Fuel
                                    size={16}
                                    className="mr-1.5 text-emerald-700"
                                  />
                                  {car.fuelType || "Gas"}
                                </div>
                              </div>
                              <div className="border border-stone-300 bg-white px-3 py-2">
                                <div className="font-mono text-[10px] uppercase text-stone-500">
                                  Transmission
                                </div>
                                <div className="mt-1 flex items-center text-sm font-semibold text-stone-900">
                                  <Settings
                                    size={16}
                                    className="mr-1.5 text-emerald-700"
                                  />
                                  {car.transmission || "Automatic"}
                                </div>
                              </div>
                              <div className="border border-stone-300 bg-white px-3 py-2">
                                <div className="font-mono text-[10px] uppercase text-stone-500">
                                  Year
                                </div>
                                <div className="mt-1 flex items-center text-sm font-semibold text-stone-900">
                                  <Calendar
                                    size={16}
                                    className="mr-1.5 text-emerald-700"
                                  />
                                  {car.year}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                              <span className="font-mono text-xl font-bold text-stone-900">
                                {formatPrice(car.price)}
                              </span>
                              {car.msrp && car.msrp > car.price && (
                                <span className="ml-2 text-sm text-stone-500 line-through">
                                  {formatPrice(car.msrp)}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="hidden rounded-none border border-stone-300 md:flex"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCompare(car, e);
                                }}
                              >
                                <SlidersHorizontal size={14} className="mr-1" />
                                Compare
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="hidden rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500 md:flex"
                              >
                                <Eye size={14} className="mr-1" />
                                View details
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
                  <div className="mb-4 mt-8 flex justify-center border-t border-stone-300 pt-8">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="hidden rounded-none border border-stone-300 sm:flex"
                      >
                        <ChevronLeft size={16} className="mr-1" />
                        Previous
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-none border border-stone-300 sm:hidden"
                      >
                        <ChevronLeft size={16} />
                      </Button>

                      {/* Page numbers */}
                      <div className="flex gap-1">
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
                                  className="flex h-9 w-9 items-center justify-center font-mono text-stone-500"
                                >
                                  …
                                </span>
                              );
                            }

                            return (
                              <Button
                                key={i}
                                type="button"
                                variant="outline"
                                size="icon"
                                className={`h-9 w-9 rounded-none border border-stone-300 font-mono font-bold ${
                                  currentPage === pageNum
                                    ? "bg-stone-900 text-[#f4f1ea] hover:bg-stone-800 hover:text-[#f4f1ea]"
                                    : "bg-white text-stone-900 hover:bg-stone-200"
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
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(filteredCars.length / itemsPerPage)
                        }
                        className="hidden rounded-none border border-stone-300 sm:flex"
                      >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(filteredCars.length / itemsPerPage)
                        }
                        className="rounded-none border border-stone-300 sm:hidden"
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
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-300 bg-[#f4f1ea] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 pb-3">
                <h3 className="flex items-center text-sm font-bold uppercase tracking-wider text-stone-900">
                  <SlidersHorizontal size={16} className="mr-2 text-emerald-700" />
                  Compare ({carsToCompare.length}/3)
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-none border border-stone-300 text-xs font-bold"
                    onClick={() => setCarsToCompare([])}
                  >
                    Clear all
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 rounded-none border border-stone-300 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                    disabled={carsToCompare.length < 2}
                    onClick={() => router.push("/compare")}
                  >
                    Compare now
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowCompareBar(false)}
                    className="border border-stone-300 p-1.5 hover:bg-white"
                  >
                    <X size={18} className="text-stone-700" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[0, 1, 2].map((index) => {
                  const car = carsToCompare[index];

                  if (!car) {
                    return (
                      <div
                        key={index}
                        className="flex h-24 items-center justify-center border border-dashed border-stone-300 bg-white/60 p-3 text-xs font-bold uppercase tracking-wider text-stone-500"
                      >
                        <Plus size={18} className="mr-2" />
                        Add vehicle
                      </div>
                    );
                  }

                  return (
                    <div
                      key={car.id}
                      className="group relative border border-stone-300 bg-white p-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCompare(car.id)}
                        className="absolute -right-1 -top-1 border border-stone-300 bg-white p-1 hover:bg-stone-100"
                      >
                        <X size={14} className="text-stone-700" />
                      </button>
                      <div className="flex gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-stone-300 bg-stone-200">
                          <img
                            src={car.images[0] || "/placeholder-car.jpg"}
                            alt={car.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="line-clamp-1 text-sm font-bold text-stone-900">
                            {car.year} {formatBrandName(car.make)} {car.model}
                          </h4>
                          <p className="font-mono text-sm font-bold text-stone-900">
                            {formatPrice(car.price)}
                          </p>
                          <p className="text-xs text-stone-600">
                            {formatNumber(car.mileage)} mi · {car.transmission}
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
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] text-stone-900">
        <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
      </div>
    }>
      <ShopPage />
    </Suspense>
  );
}

export default page;
