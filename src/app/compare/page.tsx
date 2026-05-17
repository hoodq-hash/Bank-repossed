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
  MapPin,
  Shield,
  Zap,
  Info,
  Share2,
  Printer,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { SITE } from "@/lib/site";

/** Aligns shop localStorage, API payloads, and compare UI */
interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  msrp?: number;
  mileage: number;
  images: string[];
  condition: string;
  transmission: string;
  fuelType?: string;
  location?: string;
  /** Shop listings use `color`; API may use exteriorColor */
  color?: string;
  exteriorColor?: string;
  interiorColor?: string;
  engine?: string;
  engineSize?: string;
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

function normalizeCarForCompare(raw: Record<string, unknown>): Car | null {
  const id = String(raw.id ?? raw._id ?? "");
  if (!id) return null;

  const images = Array.isArray(raw.images)
    ? (raw.images as string[]).filter((u) => typeof u === "string" && u.length > 0)
    : [];

  const year = Number(raw.year);
  const price = Number(raw.price);
  const mileage = Number(raw.mileage);

  return {
    id,
    title: String(raw.title || `${raw.year ?? ""} ${raw.make ?? ""} ${raw.model ?? ""}`.trim() || "Vehicle"),
    make: String(raw.make ?? ""),
    model: String(raw.model ?? ""),
    year: Number.isFinite(year) ? year : 0,
    price: Number.isFinite(price) ? price : 0,
    msrp: raw.msrp != null && Number.isFinite(Number(raw.msrp)) ? Number(raw.msrp) : undefined,
    mileage: Number.isFinite(mileage) ? mileage : 0,
    images: images.length > 0 ? images : ["/cars/placeholder-car.jpg"],
    condition: String(raw.condition ?? "Used"),
    transmission: String(raw.transmission ?? "Automatic"),
    fuelType: raw.fuelType != null ? String(raw.fuelType) : undefined,
    location: raw.location != null ? String(raw.location) : undefined,
    color: raw.color != null ? String(raw.color) : undefined,
    exteriorColor:
      raw.exteriorColor != null ? String(raw.exteriorColor) : undefined,
    interiorColor:
      raw.interiorColor != null ? String(raw.interiorColor) : undefined,
    engine: raw.engine != null ? String(raw.engine) : undefined,
    engineSize: raw.engineSize != null ? String(raw.engineSize) : undefined,
    drivetrain: raw.drivetrain != null ? String(raw.drivetrain) : undefined,
    fuelEconomy:
      raw.fuelEconomy &&
      typeof raw.fuelEconomy === "object" &&
      raw.fuelEconomy !== null
        ? (raw.fuelEconomy as Car["fuelEconomy"])
        : undefined,
    features: Array.isArray(raw.features)
      ? (raw.features as string[]).filter((f) => typeof f === "string")
      : undefined,
    description: raw.description != null ? String(raw.description) : undefined,
    vin: raw.vin != null ? String(raw.vin) : undefined,
    stockNumber: raw.stockNumber != null ? String(raw.stockNumber) : undefined,
    dealerName: raw.dealerName != null ? String(raw.dealerName) : undefined,
    dealerRating:
      raw.dealerRating != null && Number.isFinite(Number(raw.dealerRating))
        ? Number(raw.dealerRating)
        : undefined,
    dealerReviews:
      raw.dealerReviews != null && Number.isFinite(Number(raw.dealerReviews))
        ? Number(raw.dealerReviews)
        : undefined,
  };
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
    costs: true,
  });

  // Define comparison categories and their attributes
  const comparisonCategories: ComparisonCategory[] = [
    {
      id: "basics",
      label: "Basic Information",
      icon: <Car className="h-5 w-5 text-emerald-500" />,
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
        {
          id: "exteriorColor",
          label: "Exterior Color",
          key: (car) => car.exteriorColor || car.color || "N/A",
        },
        { id: "interiorColor", label: "Interior Color", key: "interiorColor" },
        { id: "vin", label: "VIN", key: "vin" },
      ],
    },
    {
      id: "performance",
      label: "Performance & Specifications",
      icon: <Zap className="h-5 w-5 text-emerald-500" />,
      attributes: [
        {
          id: "engine",
          label: "Engine",
          key: (car) => car.engine || car.engineSize || "N/A",
        },
        { id: "transmission", label: "Transmission", key: "transmission" },
        { id: "fuelType", label: "Fuel Type", key: "fuelType" },
      ],
    },
    {
      id: "costs",
      label: "Pricing & Value",
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
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
      icon: <Shield className="h-5 w-5 text-emerald-500" />,
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
                <span className="text-sm text-stone-500">
                  Information not available
                </span>
              )}
              {car.features && car.features.length > 5 && (
                <span className="text-emerald-600 text-sm font-medium">
                  +{car.features.length - 5} more
                </span>
              )}
            </div>
          ),
        },
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const carIdsFromUrl = searchParams.get("ids");

        if (carIdsFromUrl) {
          const carIds = carIdsFromUrl
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);

          const results = await Promise.all(
            carIds.map(async (id) => {
              const res = await fetch(`/api/cars/${id}`);
              if (!res.ok) return null;
              const data = (await res.json()) as Record<string, unknown>;
              return normalizeCarForCompare(data);
            })
          );

          const cars = results.filter((c): c is Car => c !== null);
          if (!cancelled) setCarsToCompare(cars.slice(0, 3));
        } else {
          const raw = JSON.parse(
            localStorage.getItem("carsToCompareData") || "[]"
          );
          const list = Array.isArray(raw) ? raw : [];
          const cars = list
            .map((item) =>
              item && typeof item === "object"
                ? normalizeCarForCompare(item as Record<string, unknown>)
                : null
            )
            .filter((c): c is Car => c !== null);
          if (!cancelled) setCarsToCompare(cars.slice(0, 3));
        }
      } catch {
        if (!cancelled) setError("Failed to load comparison data");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
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
    <div className="flex min-h-screen flex-col bg-[#f4f1ea] text-stone-900 antialiased">
      <Navbar />

      <main className="flex-grow py-8 md:py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center text-sm text-stone-500">
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-emerald-700">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-stone-800">Compare</span>
          </div>

          {/* Page header */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                Compare
              </p>
              <h1 className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
                Vehicle comparison
              </h1>
              <p className="mt-2 text-sm text-stone-600 md:text-base">
                Compare specifications and features side by side (up to three
                vehicles).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-stone-300 text-stone-800"
                onClick={() => router.back()}
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-stone-300 text-stone-800"
                onClick={printComparison}
              >
                <Printer size={16} className="mr-1" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-stone-300 text-stone-800"
              >
                <Share2 size={16} className="mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-stone-300 text-stone-800"
                onClick={clearAllCars}
              >
                <Trash2 size={16} className="mr-1" />
                Clear all
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="border border-stone-300 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
              <p className="text-stone-600">Loading comparison…</p>
            </div>
          ) : error ? (
            <div className="border border-stone-300 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                Something went wrong
              </h3>
              <p className="mb-6 text-stone-600">{error}</p>
              <Button
                onClick={() => router.push("/shop")}
                className="rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              >
                Return to shop
              </Button>
            </div>
          ) : carsToCompare.length === 0 ? (
            <div className="border border-stone-300 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Car className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                No vehicles to compare
              </h3>
              <p className="mb-6 text-stone-600">
                Add vehicles from the shop using the compare control on each
                listing.
              </p>
              <Button
                onClick={() => router.push("/shop")}
                className="rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              >
                Browse inventory
              </Button>
            </div>
          ) : (
            <div className="mb-8">
              {/* Vehicle cards */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {carsToCompare.map((car) => (
                  <div
                    key={car.id}
                    className="group relative overflow-hidden border border-stone-300 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => removeCar(car.id)}
                      className="absolute right-2 top-2 z-10 rounded-full border border-stone-300 bg-white/95 p-1.5 shadow-sm hover:bg-white"
                    >
                      <X size={16} className="text-stone-600" />
                    </button>

                    {/* Image container with aspect ratio */}
                    <div className="relative overflow-hidden bg-stone-200 pb-[60%]">
                      <Image
                        src={car.images[0] || "/cars/placeholder-car.jpg"}
                        alt={car.title}
                        fill
                        className="object-cover"
                      />
                      {car.condition && (
                        <span className="absolute top-3 left-3 text-xs font-medium text-white px-2 py-1 rounded-md bg-emerald-500">
                          {car.condition}
                        </span>
                      )}
                    </div>

                    {/* Car info */}
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-semibold text-stone-900">
                        {car.year} {formatBrandName(car.make)} {car.model}
                      </h3>

                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xl font-bold text-emerald-700">
                          {formatPrice(car.price)}
                        </span>
                        {car.msrp && car.msrp > car.price && (
                          <span className="text-sm font-medium text-emerald-800">
                            Save {formatPrice(car.msrp - car.price)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-stone-600">
                        <div className="flex items-center">
                          <Gauge size={14} className="mr-1 text-stone-400" />
                          {formatNumber(car.mileage)} mi
                        </div>
                        <div className="flex items-center">
                          <Fuel size={14} className="mr-1 text-stone-400" />
                          {car.fuelType || "Gas"}
                        </div>
                        <div className="flex items-center">
                          <Settings size={14} className="mr-1 text-stone-400" />
                          {car.transmission || "Automatic"}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1 text-stone-400" />
                          {car.location || SITE.listingLocationDefault}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          className="w-full rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                          onClick={() => router.push(`/car/${car.id}`)}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add more cars placeholder */}
                {carsToCompare.length < 3 && (
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        addPlaceholderCar();
                      }
                    }}
                    className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-stone-400 bg-[#f4f1ea] p-8 transition-colors hover:bg-amber-100/50"
                    onClick={addPlaceholderCar}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <Plus size={24} className="text-emerald-700" />
                    </div>
                    <h3 className="mb-1 font-medium text-stone-900">
                      Add vehicle
                    </h3>
                    <p className="text-center text-sm text-stone-500">
                      Choose another listing from the shop (max three).
                    </p>
                  </div>
                )}
              </div>

              {/* Comparison table */}
              <div className="overflow-hidden border border-stone-300 bg-white shadow-sm">
                {comparisonCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border-b border-stone-300 last:border-b-0"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between bg-stone-100/80 p-4"
                      onClick={() => toggleSection(category.id)}
                    >
                      <h3 className="flex items-center font-semibold text-stone-900">
                        {category.icon}
                        <span className="ml-2">{category.label}</span>
                      </h3>
                      {expandedSections[category.id] ? (
                        <ChevronUp size={18} className="text-stone-500" />
                      ) : (
                        <ChevronDown size={18} className="text-stone-500" />
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
                                className="hover:bg-stone-50"
                              >
                                <TableCell className="font-medium text-stone-900">
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
                                      } ${isWinner ? "bg-emerald-50" : ""}`}
                                    >
                                      <div className="flex items-center">
                                        {isWinner && (
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Check
                                                  size={16}
                                                  className="mr-1.5 flex-shrink-0 text-emerald-600"
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
              <div className="mt-8 overflow-hidden border border-stone-300 bg-white shadow-sm">
                <div className="border-b border-stone-200 bg-emerald-50/80 p-4">
                  <h3 className="flex items-center font-semibold text-stone-900">
                    <Info className="mr-2 h-5 w-5 text-emerald-600" />
                    Comparison summary
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
                          className="border border-stone-300 bg-[#f4f1ea] p-4"
                        >
                          <h4 className="mb-3 font-semibold text-stone-900">
                            {car.year} {formatBrandName(car.make)} {car.model}
                          </h4>

                          <div className="mb-4">
                            <h5 className="mb-2 flex items-center text-sm font-medium text-emerald-800">
                              <Check size={16} className="mr-1.5" />
                              Pros
                            </h5>
                            <ul className="list-disc space-y-1 pl-6 text-sm text-stone-700">
                              {pros.length > 0 ? (
                                pros.map((pro, index) => (
                                  <li key={index}>{pro}</li>
                                ))
                              ) : (
                                <li className="text-stone-500">
                                  No standout advantages
                                </li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <h5 className="mb-2 flex items-center text-sm font-medium text-red-700">
                              <X size={16} className="mr-1.5" />
                              Cons
                            </h5>
                            <ul className="list-disc space-y-1 pl-6 text-sm text-stone-700">
                              {cons.length > 0 ? (
                                cons.map((con, index) => (
                                  <li key={index}>{con}</li>
                                ))
                              ) : (
                                <li className="text-stone-500">
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

export default function ComparePageRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-[#f4f1ea]">
          <Navbar />
          <main className="flex flex-grow items-center justify-center px-4 py-16">
            <div className="border border-stone-300 bg-white px-10 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
              <p className="text-sm text-stone-600">Loading compare…</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <ComparePage />
    </Suspense>
  );
}
