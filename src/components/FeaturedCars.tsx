"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  MapPin,
  Loader2,
  AlertCircle,
  Car,
  Star,
  Filter,
  X,
  Gauge,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

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

const PRICE_BANDS: {
  id: string;
  title: string;
  subtitle: string;
  min: string;
  max: string;
}[] = [
  { id: "all", title: "All prices", subtitle: "No limit", min: "", max: "" },
  {
    id: "under5k",
    title: "Under $5K",
    subtitle: "Budget friendly",
    min: "0",
    max: "5000",
  },
  {
    id: "5to10k",
    title: "$5K – $10K",
    subtitle: "Great value",
    min: "5000",
    max: "10000",
  },
  {
    id: "10to15k",
    title: "$10K – $15K",
    subtitle: "Popular range",
    min: "10000",
    max: "15000",
  },
  {
    id: "15to20k",
    title: "$15K – $20K",
    subtitle: "Mid-range",
    min: "15000",
    max: "20000",
  },
  {
    id: "over20k",
    title: "Over $20K",
    subtitle: "Premium",
    min: "20000",
    max: "1000000",
  },
];

export default function FeaturedCars() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState("all");

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

  const activePriceBand = useMemo(
    () => PRICE_BANDS.find((b) => b.id === priceFilter),
    [priceFilter]
  );

  const activePriceLabel = activePriceBand?.title ?? "";

  const shopHrefForBrand = (brandId: string) =>
    `/shop?brand=${encodeURIComponent(brandId)}`;

  const shopHrefForPrice = (min: string, max: string) =>
    `/shop?min=${encodeURIComponent(min)}&max=${encodeURIComponent(max)}`;

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
    <>
      <section className="border-y border-stone-300 bg-[#f4f1ea] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-stone-300 pb-12 md:grid-cols-12 md:gap-8 md:pb-14">
            <div className="md:col-span-5">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                Fresh listings
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-stone-900 md:text-4xl">
                Repo inventory near you
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-600 md:text-base">
                Filter by brand and budget—every vehicle is listed with clear
                condition and pricing so you can compare with confidence.
              </p>
            </div>
            <div className="flex flex-col justify-end md:col-span-7 md:text-right">
              <p className="text-xs text-stone-500">
                Showing a curated slice of inventory. Open the shop for the full
                catalog and saved searches.
              </p>
              <Link
                href="/shop"
                className="mt-3 inline-flex items-center font-bold text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800 md:ml-auto"
              >
                View full inventory
                <ChevronRight size={16} className="ml-0.5" />
              </Link>
            </div>
          </div>

          <div className="mt-12 md:mt-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-xl font-bold text-stone-900 md:text-2xl">
                Browse by brand
              </h3>
              <Link
                href="/shop"
                className="text-sm font-bold text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800"
              >
                View all brands
              </Link>
            </div>

            {isLoading ? (
              <div className="mt-8 flex justify-center py-10">
                <Loader2 className="h-9 w-9 animate-spin text-stone-900" />
              </div>
            ) : error ? (
              <div className="mt-8 border-2 border-red-800 bg-red-50 px-4 py-6 text-center">
                <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-700" />
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap gap-2">
                {popularBrands.map((brand) => {
                  const active = selectedBrand === brand.id;
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() =>
                        setSelectedBrand(active ? null : brand.id)
                      }
                      className={`group flex items-center gap-2 border border-stone-300 px-3 py-2 text-left text-sm font-bold transition-colors ${
                        active
                          ? "bg-stone-900 text-[#f4f1ea]"
                          : "bg-[#f4f1ea] text-stone-900 hover:bg-stone-200"
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-stone-300 bg-white">
                        <img
                          src={brand.image}
                          alt=""
                          width={28}
                          height={28}
                          className="max-h-7 max-w-7 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector("[data-fb]")) {
                              const fb = document.createElement("span");
                              fb.dataset.fb = "1";
                              fb.className =
                                "text-xs font-black text-stone-900";
                              fb.textContent = brand.displayName
                                .charAt(0)
                                .toUpperCase();
                              parent.appendChild(fb);
                            }
                          }}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block leading-tight">
                          {brand.displayName}
                        </span>
                        <span
                          className={`mt-0.5 block text-[10px] font-mono font-normal uppercase tracking-wider ${
                            active ? "text-emerald-300" : "text-stone-500"
                          }`}
                        >
                          {brand.count} in stock
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedBrand && (
              <p className="mt-4 text-xs text-stone-600">
                Matching this brand on the homepage preview.{" "}
                <Link
                  href={shopHrefForBrand(selectedBrand)}
                  className="font-bold text-stone-900 underline"
                >
                  See all {popularBrands.find((b) => b.id === selectedBrand)?.displayName ?? ""} in shop
                </Link>
              </p>
            )}
          </div>

          <div className="mt-14 border-t border-stone-300 pt-12 md:mt-16 md:pt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-xl font-bold text-stone-900 md:text-2xl">
                Filter by price range
              </h3>
              {priceFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setPriceFilter("all")}
                  className="text-left text-sm font-bold text-stone-900 underline decoration-2 underline-offset-4"
                >
                  Reset price
                </button>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Tap a band to preview featured units in that window. Your selection
              stays on this page until you clear it.
            </p>

            <div className="mt-8 grid gap-px border border-stone-300 bg-stone-300 sm:grid-cols-2 lg:grid-cols-3">
              {PRICE_BANDS.map((band) => {
                const active = priceFilter === band.id;
                return (
                  <button
                    key={band.id}
                    type="button"
                    onClick={() => setPriceFilter(band.id)}
                    className={`flex flex-col items-start px-5 py-5 text-left transition-colors sm:min-h-[7.5rem] ${
                      active
                        ? "bg-emerald-600 text-white"
                        : "bg-[#f4f1ea] text-stone-900 hover:bg-amber-100"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">
                      {band.id === "all" ? "Any" : "Band"}
                    </span>
                    <span className="mt-2 text-lg font-bold leading-snug">
                      {band.title}
                    </span>
                    <span
                      className={`mt-1 text-xs ${
                        active ? "text-emerald-100" : "text-stone-600"
                      }`}
                    >
                      {band.subtitle}
                    </span>
                    {band.id !== "all" && (
                      <Link
                        href={shopHrefForPrice(band.min, band.max)}
                        onClick={(e) => e.stopPropagation()}
                        className={`mt-3 text-xs font-bold underline underline-offset-2 ${
                          active ? "text-white" : "text-stone-900"
                        }`}
                      >
                        Open in shop
                      </Link>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {(selectedBrand || priceFilter !== "all") && (
            <div className="mt-8 flex flex-wrap items-center gap-3 border border-dashed border-stone-300 bg-white/60 px-4 py-4">
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-500">
                <Filter size={14} className="mr-2" />
                Active
              </span>
              {selectedBrand && (
                <span className="inline-flex items-center gap-2 border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold">
                  {popularBrands.find((b) => b.id === selectedBrand)
                    ?.displayName ?? selectedBrand}
                  <button
                    type="button"
                    aria-label="Remove brand filter"
                    onClick={() => setSelectedBrand(null)}
                    className="text-stone-500 hover:text-stone-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {priceFilter !== "all" && (
                <span className="inline-flex items-center gap-2 border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold">
                  {activePriceLabel}
                  <button
                    type="button"
                    aria-label="Remove price filter"
                    onClick={() => setPriceFilter("all")}
                    className="text-stone-500 hover:text-stone-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-xs font-bold uppercase tracking-wider text-stone-900 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="mt-14 flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-stone-900" />
                <p className="text-sm text-stone-600">Loading featured cars…</p>
              </div>
            </div>
          ) : error ? (
            <div className="mt-14 border-2 border-red-800 bg-red-50 px-4 py-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-10 w-10 text-red-700" />
              <p className="mb-4 text-red-900">{error}</p>
              <Button
                variant="outline"
                className="rounded-none border border-stone-300"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          ) : (
            <div className="mt-14 space-y-0 divide-y divide-stone-300 border-y border-stone-300">
              {filteredCars.map((car) => (
                <Link
                  href={`/car/${car.id}`}
                  key={car.id}
                  className="group flex flex-col gap-6 bg-[#f4f1ea] py-8 transition-colors hover:bg-amber-100/50 md:flex-row md:items-stretch md:gap-10 md:py-10"
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border border-stone-300 bg-stone-200 md:aspect-auto md:h-auto md:w-[42%] md:max-w-md">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model} ${car.year}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full min-h-[12rem] items-center justify-center text-stone-400">
                        <Car size={48} />
                      </div>
                    )}
                    {car.featured && (
                      <div className="absolute left-3 top-3 flex items-center border border-stone-300 bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-950">
                        <Star size={12} className="mr-1" fill="currentColor" />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between md:py-1">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="font-mono text-2xl font-bold text-stone-900 md:text-3xl">
                          {formatPrice(car.price, car.currency)}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${getConditionColor(
                            car.condition
                          )}`}
                        >
                          {car.condition}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-stone-900 md:text-2xl">
                        {formatBrandName(car.make)} {car.model}{" "}
                        <span className="font-mono text-stone-500">
                          · {car.year}
                        </span>
                      </h3>
                      <p className="mt-2 flex items-center text-sm text-stone-600">
                        <MapPin size={16} className="mr-1.5 shrink-0" />
                        {car.location || SITE.listingLocationDefault}
                        {car.area ? `, ${car.area}` : ""}
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="border border-stone-300 bg-white px-3 py-2">
                        <p className="font-mono text-[10px] uppercase text-stone-500">
                          Miles
                        </p>
                        <p className="mt-1 flex items-center text-sm font-semibold">
                          <Gauge size={14} className="mr-1.5 opacity-60" />
                          {formatMileage(car.mileage)}
                        </p>
                      </div>
                      <div className="border border-stone-300 bg-white px-3 py-2">
                        <p className="font-mono text-[10px] uppercase text-stone-500">
                          Trans
                        </p>
                        <p className="mt-1 flex items-center text-sm font-semibold">
                          <Car size={14} className="mr-1.5 opacity-60" />
                          {car.transmission}
                        </p>
                      </div>
                      <div className="border border-stone-300 bg-white px-3 py-2">
                        <p className="font-mono text-[10px] uppercase text-stone-500">
                          Year
                        </p>
                        <p className="mt-1 flex items-center text-sm font-semibold">
                          <Calendar size={14} className="mr-1.5 opacity-60" />
                          {car.year}
                        </p>
                      </div>
                      {car.color && (
                        <div className="border border-stone-300 bg-white px-3 py-2">
                          <p className="font-mono text-[10px] uppercase text-stone-500">
                            Color
                          </p>
                          <p className="mt-1 flex items-center text-sm font-semibold">
                            <span
                              className="mr-2 inline-block h-3 w-3 border border-stone-300"
                              style={{
                                backgroundColor: car.color.toLowerCase(),
                              }}
                            />
                            {car.color}
                          </p>
                        </div>
                      )}
                    </div>

                    <span className="mt-6 inline-flex items-center text-sm font-bold text-stone-900 group-hover:underline">
                      View listing
                      <ArrowRight size={16} className="ml-2" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredCars.length === 0 && (
            <div className="mt-12 border border-stone-300 bg-white px-6 py-14 text-center md:px-12">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-stone-500">
                No matches
              </p>
              <h3 className="mt-4 text-2xl font-bold text-stone-900 md:text-3xl">
                No cars match your criteria
              </h3>
              <p className="mx-auto mt-4 max-w-md text-stone-600">
                Try adjusting your filters or browse all available cars in our
                inventory.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-none border border-stone-300 bg-stone-900 px-8 font-bold text-[#f4f1ea] hover:bg-stone-800"
                >
                  Clear filters
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/shop")}
                  className="rounded-none border border-stone-300 bg-transparent px-8 font-bold text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea]"
                >
                  Browse all inventory
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredCars.length > 0 && (
            <div className="mt-12 flex justify-center border-t border-stone-300 pt-10">
              <Link href="/shop">
                <Button className="rounded-none border border-stone-300 bg-emerald-600 px-10 py-6 text-base font-bold text-white hover:bg-emerald-500">
                  Browse all cars
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
