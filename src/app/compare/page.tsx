"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Car,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Plus,
  DollarSign,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  MapPin,
  LayoutGrid,
  Shield,
  Zap,
  Info,
  Share2,
  Printer,
  Download,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Define the Car type
interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  msrp?: number;
  mileage: number;
  image: string;
  condition: string;
  transmission: string;
  fuelType?: string;
  location?: string;
  exteriorColor?: string;
  interiorColor?: string;
  engine?: string;
  drivetrain?: string;
  fuelEconomy?: {
    city: number;
    highway: number;
    combined: number;
  };
  features?: string[];
  description?: string;
  vin?: string;
  stockNumber?: string;
  dealerName?: string;
  dealerRating?: number;
  dealerReviews?: number;
}

// Define the category type for comparison sections
interface ComparisonCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  attributes: {
    id: string;
    label: string;
    key: keyof Car | ((car: Car) => string | number | React.ReactNode);
    highlight?: boolean;
  }[];
}

function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [carsToCompare, setCarsToCompare] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basics: true,
    performance: true,
    features: true,
    dimensions: true,
    costs: true,
  });

  // Define comparison categories and their attributes
  const comparisonCategories: ComparisonCategory[] = [
    {
      id: "basics",
      label: "Basic Information",
      icon: <Car className="h-5 w-5 text-blue-500" />,
      attributes: [
        { id: "make", label: "Make", key: "make", highlight: true },
        { id: "model", label: "Model", key: "model", highlight: true },
        { id: "year", label: "Year", key: "year" },
        { id: "condition", label: "Condition", key: "condition" },
        {
          id: "mileage",
          label: "Mileage",
          key: (car) => formatNumber(car.mileage) + " mi",
        },
        { id: "exteriorColor", label: "Exterior Color", key: "exteriorColor" },
        { id: "interiorColor", label: "Interior Color", key: "interiorColor" },
        { id: "vin", label: "VIN", key: "vin" },
      ],
    },
    {
      id: "performance",
      label: "Performance & Specifications",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      attributes: [
        { id: "engine", label: "Engine", key: "engine" },
        { id: "transmission", label: "Transmission", key: "transmission" },
        { id: "fuelType", label: "Fuel Type", key: "fuelType" },
      ],
    },
    {
      id: "costs",
      label: "Pricing & Value",
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      attributes: [
        {
          id: "price",
          label: "Price",
          key: (car) => formatPrice(car.price),
          highlight: true,
        },
        // {
        //   id: "msrp",
        //   label: "MSRP",
        //   key: (car) => (car.msrp ? formatPrice(car.msrp) : "N/A"),
        // },
        // {
        //   id: "savings",
        //   label: "Savings",
        //   key: (car) =>
        //     car.msrp && car.msrp > car.price
        //       ? formatPrice(car.msrp - car.price)
        //       : "N/A",
        // },
        // {
        //   id: "savingsPercent",
        //   label: "Savings %",
        //   key: (car) =>
        //     car.msrp && car.msrp > car.price
        //       ? `${Math.round(((car.msrp - car.price) / car.msrp) * 100)}%`
        //       : "N/A",
        // },
      ],
    },
    {
      id: "features",
      label: "Features & Technology",
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      attributes: [
        {
          id: "features",
          label: "Key Features",
          key: (car) => (
            <div className="space-y-1">
              {car.features && car.features.length > 0 ? (
                car.features.slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check
                      size={14}
                      className="mr-1.5 mt-0.5 text-green-500 flex-shrink-0"
                    />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm">
                  Information not available
                </span>
              )}
              {car.features && car.features.length > 5 && (
                <span className="text-blue-600 text-sm font-medium">
                  +{car.features.length - 5} more
                </span>
              )}
            </div>
          ),
        },
      ],
    },
    {
      id: "dealer",
      label: "Dealer Information",
      icon: <MapPin className="h-5 w-5 text-blue-500" />,
      attributes: [
        // { id: "dealerName", label: "Dealer", key: "dealerName" },
        // { id: "location", label: "Location", key: "location" },
        // { id: "stockNumber", label: "Stock #", key: "stockNumber" },
        // {
        //   id: "dealerRating",
        //   label: "Dealer Rating",
        //   key: (car) =>
        //     car.dealerRating ? (
        //       <div className="flex items-center">
        //         <div className="flex">
        //           {[1, 2, 3, 4, 5].map((star) => (
        //             <span
        //               key={star}
        //               className={`text-${
        //                 star <= Math.round(car.dealerRating || 0)
        //                   ? "yellow"
        //                   : "gray"
        //               }-400`}
        //             >
        //               ★
        //             </span>
        //           ))}
        //         </div>
        //         <span className="ml-1 text-sm">
        //           ({car.dealerRating.toFixed(1)})
        //         </span>
        //       </div>
        //     ) : (
        //       "N/A"
        //     ),
        // },
      ],
    },
  ];

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

  // Format brand name properly for display
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

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Add a placeholder car for comparison
  const addPlaceholderCar = () => {
    router.push("/shop");
  };

  // Print comparison
  const printComparison = () => {
    window.print();
  };

  // Determine if there's a winner for a specific attribute
  const getWinner = (attributeId: string, cars: Car[]) => {
    if (cars.length < 2) return null;

    // Define attributes where lower is better
    const lowerIsBetter = ["price", "mileage"];

    // Define attributes where higher is better
    const higherIsBetter = [
      "fuelEconomyCity",
      "fuelEconomyHwy",
      "fuelEconomyCombined",
      "dealerRating",
    ];

    // For these attributes, we can determine a clear winner
    if (
      lowerIsBetter.includes(attributeId) ||
      higherIsBetter.includes(attributeId)
    ) {
      let winnerIndex = 0;

      for (let i = 1; i < cars.length; i++) {
        const currentValue = attributeId.includes("fuelEconomy")
          ? cars[i].fuelEconomy?.[
              attributeId.replace("fuelEconomy", "").toLowerCase() as
                | "city"
                | "highway"
                | "combined"
            ]
          : (cars[i] as any)[attributeId];

        const bestValue = attributeId.includes("fuelEconomy")
          ? cars[winnerIndex].fuelEconomy?.[
              attributeId.replace("fuelEconomy", "").toLowerCase() as
                | "city"
                | "highway"
                | "combined"
            ]
          : (cars[winnerIndex] as any)[attributeId];

        if (!currentValue || !bestValue) continue;

        if (lowerIsBetter.includes(attributeId) && currentValue < bestValue) {
          winnerIndex = i;
        } else if (
          higherIsBetter.includes(attributeId) &&
          currentValue > bestValue
        ) {
          winnerIndex = i;
        }
      }

      return winnerIndex;
    }

    return null;
  };
  // In your useEffect in the compare page, update it to use the stored car data:

  useEffect(() => {
    setIsLoading(true);
    try {
      // Get car data from localStorage
      const storedCarData = JSON.parse(
        localStorage.getItem("carsToCompareData") || "[]"
      );

      // If there are IDs in the URL, use those instead (for sharing functionality)
      const carIdsFromUrl = searchParams.get("ids");

      if (carIdsFromUrl) {
        // Handle URL IDs - this would still need mock data or an API call
        const carIds = carIdsFromUrl.split(",");
        // Create mock cars based on the IDs from URL
        const mockCars: Car[] = carIds.map((id: string, index: number) => ({
          id,
          title: `Sample Car ${index + 1}`,
          make: ["toyota", "honda", "mazda"][index % 3],
          // ... other mock properties
        }));
        setCarsToCompare(mockCars);
      } else if (storedCarData.length > 0) {
        // Use the stored car data directly
        setCarsToCompare(storedCarData);
      } else {
        setCarsToCompare([]);
      }

      setIsLoading(false);
    } catch (err) {
      setError("Failed to load comparison data");
      setIsLoading(false);
    }
  }, [searchParams]);

  // Also update the clearAllCars function:

  const clearAllCars = () => {
    setCarsToCompare([]);
    localStorage.setItem("carsToCompare", JSON.stringify([]));
    localStorage.setItem("carsToCompareData", JSON.stringify([]));
    toast.success("Comparison cleared");
  };

  // And update the removeCar function:

  const removeCar = (carId: string) => {
    setCarsToCompare((prev) => prev.filter((car) => car.id !== carId));

    // Update localStorage to remove the car from comparison (both data and IDs)
    const storedCars = JSON.parse(
      localStorage.getItem("carsToCompareData") || "[]"
    );
    const updatedCars = storedCars.filter((car: Car) => car.id !== carId);
    localStorage.setItem("carsToCompareData", JSON.stringify(updatedCars));

    const storedCarIds = JSON.parse(
      localStorage.getItem("carsToCompare") || "[]"
    );
    const updatedCarIds = storedCarIds.filter((id: string) => id !== carId);
    localStorage.setItem("carsToCompare", JSON.stringify(updatedCarIds));

    toast.success("Vehicle removed from comparison");
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-blue-600">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">Compare Vehicles</span>
          </div>

          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Vehicle Comparison
              </h1>
              <p className="text-gray-600">
                Compare specifications and features side by side
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700"
                onClick={() => router.back()}
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700"
                onClick={printComparison}
              >
                <Printer size={16} className="mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="text-gray-700">
                <Share2 size={16} className="mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700"
                onClick={clearAllCars}
              >
                <Trash2 size={16} className="mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600">Loading comparison data...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Return to Shop
              </Button>
            </div>
          ) : carsToCompare.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <Car className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No vehicles to compare
              </h3>
              <p className="text-gray-600 mb-6">
                Add vehicles to your comparison list while browsing our
                inventory.
              </p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Vehicles
              </Button>
            </div>
          ) : (
            <div className="mb-8">
              {/* Vehicle cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {carsToCompare.map((car, index) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 relative group"
                  >
                    <button
                      onClick={() => removeCar(car.id)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm z-10"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>

                    {/* Image container with aspect ratio */}
                    <div className="relative pb-[60%] overflow-hidden bg-gray-100">
                      <Image
                        src={car.images[0] || "/placeholder-car.jpg"}
                        alt={car.title}
                        fill
                        className="object-cover"
                      />
                      {car.condition && (
                        <span className="absolute top-3 left-3 text-xs font-medium text-white px-2 py-1 rounded-md bg-blue-500">
                          {car.condition}
                        </span>
                      )}
                    </div>

                    {/* Car info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {car.year} {formatBrandName(car.make)} {car.model}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-blue-600">
                          {formatPrice(car.price)}
                        </span>
                        {car.msrp && car.msrp > car.price && (
                          <span className="text-sm text-green-600 font-medium">
                            Save {formatPrice(car.msrp - car.price)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Gauge size={14} className="mr-1 text-gray-400" />
                          {formatNumber(car.mileage)} mi
                        </div>
                        <div className="flex items-center">
                          <Fuel size={14} className="mr-1 text-gray-400" />
                          {car.fuelType || "Gas"}
                        </div>
                        <div className="flex items-center">
                          <Settings size={14} className="mr-1 text-gray-400" />
                          {car.transmission || "Automatic"}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1 text-gray-400" />
                          {car.location || "Local Dealer"}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => router.push(`/car/${car.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add more cars placeholder */}
                {carsToCompare.length < 4 && (
                  <div
                    className="bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={addPlaceholderCar}
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Plus size={24} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Add Vehicle
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      Add another vehicle to compare
                    </p>
                  </div>
                )}
              </div>

              {/* Comparison table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {comparisonCategories.map((category, categoryIndex) => (
                  <div
                    key={category.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <div
                      className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                      onClick={() => toggleSection(category.id)}
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        {category.icon}
                        <span className="ml-2">{category.label}</span>
                      </h3>
                      {expandedSections[category.id] ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>

                    {expandedSections[category.id] && (
                      <div className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="w-1/4">
                                Specification
                              </TableHead>
                              {carsToCompare.map((car) => (
                                <TableHead key={car.id}>
                                  {car.year} {formatBrandName(car.make)}{" "}
                                  {car.model}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.attributes.map((attribute) => (
                              <TableRow
                                key={attribute.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell className="font-medium text-gray-900">
                                  {attribute.label}
                                </TableCell>
                                {carsToCompare.map((car, carIndex) => {
                                  // Determine if this car is the winner for this attribute
                                  const winnerIndex = getWinner(
                                    attribute.id,
                                    carsToCompare
                                  );
                                  const isWinner = winnerIndex === carIndex;

                                  // Get the value to display
                                  let value;
                                  if (typeof attribute.key === "function") {
                                    value = attribute.key(car);
                                  } else {
                                    value = car[attribute.key] || "N/A";
                                  }

                                  return (
                                    <TableCell
                                      key={`${car.id}-${attribute.id}`}
                                      className={`${
                                        attribute.highlight
                                          ? "font-semibold"
                                          : ""
                                      } ${isWinner ? "bg-green-50" : ""}`}
                                    >
                                      <div className="flex items-center">
                                        {isWinner && (
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Check
                                                  size={16}
                                                  className="mr-1.5 text-green-500 flex-shrink-0"
                                                />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Best in comparison</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                        {value}
                                      </div>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary section */}
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-2" />
                    Comparison Summary
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {carsToCompare.map((car) => {
                      // Calculate pros and cons for each car
                      const pros = [];
                      const cons = [];

                      // Price comparison
                      const isLowestPrice = carsToCompare.every(
                        (c) => c === car || c.price >= car.price
                      );
                      if (isLowestPrice)
                        pros.push("Lowest price in comparison");

                      // Mileage comparison
                      const isLowestMileage = carsToCompare.every(
                        (c) => c === car || c.mileage >= car.mileage
                      );
                      if (isLowestMileage)
                        pros.push("Lowest mileage in comparison");

                      // Year comparison
                      const isNewest = carsToCompare.every(
                        (c) => c === car || c.year <= car.year
                      );
                      if (isNewest) pros.push("Newest model year");

                      // Fuel economy comparison if available
                      if (car.fuelEconomy && car.fuelEconomy.combined) {
                        const hasBestFuelEconomy = carsToCompare.every(
                          (c) =>
                            c === car ||
                            !c.fuelEconomy ||
                            c.fuelEconomy.combined <= car.fuelEconomy.combined
                        );
                        if (hasBestFuelEconomy) pros.push("Best fuel economy");
                      }

                      // Add cons based on comparisons
                      const isHighestPrice = carsToCompare.every(
                        (c) => c === car || c.price <= car.price
                      );
                      if (isHighestPrice)
                        cons.push("Highest price in comparison");

                      const isHighestMileage = carsToCompare.every(
                        (c) => c === car || c.mileage <= car.mileage
                      );
                      if (isHighestMileage)
                        cons.push("Highest mileage in comparison");

                      return (
                        <div
                          key={car.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <h4 className="font-semibold text-gray-900 mb-3">
                            {car.year} {formatBrandName(car.make)} {car.model}
                          </h4>

                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-green-600 mb-2 flex items-center">
                              <Check size={16} className="mr-1.5" />
                              Pros
                            </h5>
                            <ul className="space-y-1 pl-6 list-disc text-sm text-gray-700">
                              {pros.length > 0 ? (
                                pros.map((pro, index) => (
                                  <li key={index}>{pro}</li>
                                ))
                              ) : (
                                <li className="text-gray-500">
                                  No standout advantages
                                </li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-red-600 mb-2 flex items-center">
                              <X size={16} className="mr-1.5" />
                              Cons
                            </h5>
                            <ul className="space-y-1 pl-6 list-disc text-sm text-gray-700">
                              {cons.length > 0 ? (
                                cons.map((con, index) => (
                                  <li key={index}>{con}</li>
                                ))
                              ) : (
                                <li className="text-gray-500">
                                  No significant disadvantages
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function page() {
  return (
    <Suspense>
      <ComparePage />
    </Suspense>
  );
}

export default page;
