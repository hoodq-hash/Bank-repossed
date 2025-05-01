"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Car,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Filter,
  ArrowUpDown,
  MapPin,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import ProtectedRoute from "@/components/ProtectedRoute";

// Mock data for car listings - will be replaced with MongoDB data
const initialCarListings = [
  {
    id: 11,
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
    registeredState: "California",
    sellingCondition: "Registered",
    boughtCondition: "Registered",
    fuelType: "Petrol",
    mileage: 42300,
    createdAt: "2025-03-15T10:30:00Z",
    images: [
      "/cars/volkswagen-jetta-gold.jpg",
      "/cars/volkswagen-jetta-gold-interior.jpg",
      "/cars/volkswagen-jetta-gold-rear.jpg",
    ],
    features: [
      "Power Steering",
      "Electric Windows",
      "Air Conditioning",
      "Central Locking",
      "CD Player",
      "Airbags",
      "Alloy Wheels",
    ],
    description:
      "This Volkswagen Jetta 2007 is in excellent condition. It has been well maintained with regular servicing.",
  },
  {
    id: 12,
    title: "Toyota Camry 2015 Black",
    price: 18900,
    currency: "$",
    location: "Los Angeles, CA",
    condition: "Used",
    transmission: "Automatic",
    year: 2015,
    make: "Toyota",
    model: "Camry",
    color: "Black",
    engineSize: "2500",
    registeredState: "California",
    sellingCondition: "Registered",
    boughtCondition: "Registered",
    fuelType: "Petrol",
    mileage: 68500,
    createdAt: "2025-04-02T14:15:00Z",
    images: ["/cars/bmw-320i-black.jpg", "/cars/bmw-320i-black.jpg"],
    features: [
      "Power Steering",
      "Electric Windows",
      "Air Conditioning",
      "Bluetooth",
      "Cruise Control",
      "Keyless Entry",
    ],
    description:
      "Well-maintained Toyota Camry with low mileage. The car is in excellent condition inside and out.",
  },
  {
    id: 13,
    title: "Honda Accord 2018 Silver",
    price: 22500,
    currency: "$",
    location: "Seattle, WA",
    condition: "Used",
    transmission: "Automatic",
    year: 2018,
    make: "Honda",
    model: "Accord",
    color: "Silver",
    engineSize: "2400",
    registeredState: "Washington",
    sellingCondition: "Registered",
    boughtCondition: "Registered",
    fuelType: "Petrol",
    mileage: 45200,
    createdAt: "2025-04-08T09:45:00Z",
    images: [
      "/cars/mercedes-benz-silver.jpg",
      "/cars/mercedes-benz-silver.jpg",
    ],
    features: [
      "Power Steering",
      "Electric Windows",
      "Air Conditioning",
      "Bluetooth",
      "Backup Camera",
      "Lane Departure Warning",
    ],
    description:
      "2018 Honda Accord in great condition. One owner, regular maintenance, and clean history report.",
  },
  {
    id: 14,
    title: "Ford F-150 2016 Red",
    price: 26800,
    currency: "$",
    location: "Dallas, TX",
    condition: "Used",
    transmission: "Automatic",
    year: 2016,
    make: "Ford",
    model: "F-150",
    color: "Red",
    engineSize: "5000",
    registeredState: "Texas",
    sellingCondition: "Registered",
    boughtCondition: "Registered",
    fuelType: "Petrol",
    mileage: 78300,
    createdAt: "2025-02-20T11:30:00Z",
    images: ["/cars/honda-accord-white.jpg", "/cars/honda-accord-white.jpg"],
    features: [
      "Power Steering",
      "Electric Windows",
      "Air Conditioning",
      "Tow Package",
      "Backup Camera",
      "Bluetooth",
    ],
    description:
      "2016 Ford F-150 with towing package. Well maintained and ready for work or play.",
  },
];

// Types
type CarListing = (typeof initialCarListings)[0];
type SortField = "title" | "price" | "createdAt";
type SortDirection = "asc" | "desc";

export default function DashboardPage() {
  const router = useRouter();

  const [filteredListings, setFilteredListings] =
    useState<CarListing[]>(initialCarListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<number | null>(null);

  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  // New car form state
  const [newCar, setNewCar] = useState<Partial<CarListing>>({
    title: "",
    price: 0,
    currency: "$",
    location: "",
    condition: "Used",
    transmission: "Automatic",
    year: new Date().getFullYear(),
    make: "",
    model: "",
    color: "",
    engineSize: "",
    registeredState: "",
    sellingCondition: "Registered",
    boughtCondition: "Registered",
    fuelType: "Petrol",
    mileage: 0,
    description: "",
    features: [],
  });

  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [isEditCarDialogOpen, setIsEditCarDialogOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState<CarListing | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Add this useEffect to fetch car data
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoadingData(true);
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) throw new Error("Failed to fetch cars");

        const data = await response.json();
        setCarListings(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast.error("Failed to load car listings. Please refresh the page.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchCars();
  }, []);

  // Filter and sort listings whenever relevant state changes
  useEffect(() => {
    let result = [...carListings];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((car) => car.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (car) =>
          car.title.toLowerCase().includes(query) ||
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.location.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "price") {
        comparison = a.price - b.price;
      } else if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparison = a.title.localeCompare(b.title);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredListings(result);
  }, [carListings, statusFilter, searchQuery, sortField, sortDirection]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Format price
  const formatPrice = (price: number, currency: string) => {
    return `${currency}${price.toLocaleString()}`;
  };

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Handle car deletion
  const handleDeleteCar = (id: number) => {
    setCarToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm car deletion
  const confirmDeleteCar = () => {
    if (carToDelete) {
      setIsLoading(true);

      // Will be replaced with actual API call
      fetch(`/api/cars/${carToDelete}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete car");
          return response.json();
        })
        .then(() => {
          setCarListings(carListings.filter((car) => car.id !== carToDelete));
          toast.info("The car listing has been successfully deleted.");
        })
        .catch((error) => {
          toast.error("Failed to delete car listing. Please try again.");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
          setIsDeleteDialogOpen(false);
          setCarToDelete(null);
        });
    }
  };

  // Handle edit car
  const handleEditCar = (car: CarListing) => {
    setCarToEdit(car);
    setIsEditCarDialogOpen(true);
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (isEditCarDialogOpen && carToEdit) {
      setCarToEdit({
        ...carToEdit,
        [name]:
          name === "price" || name === "mileage" || name === "year"
            ? Number(value)
            : value,
      });
    } else {
      setNewCar({
        ...newCar,
        [name]:
          name === "price" || name === "mileage" || name === "year"
            ? Number(value)
            : value,
      });
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = (car: Partial<CarListing>) => {
    const errors: Record<string, string> = {};

    if (!car.title?.trim()) errors.title = "Title is required";
    if (!car.price || car.price <= 0) errors.price = "Valid price is required";
    if (!car.make?.trim()) errors.make = "Make is required";
    if (!car.model?.trim()) errors.model = "Model is required";
    if (
      !car.year ||
      car.year < 1900 ||
      car.year > new Date().getFullYear() + 1
    ) {
      errors.year = "Valid year is required";
    }
    if (!car.mileage && car.mileage !== 0)
      errors.mileage = "Mileage is required";

    if (!car.description?.trim())
      errors.description = "Description is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add car submission
  const handleAddCar = () => {
    if (validateForm(newCar)) {
      setIsLoading(true);

      // Will be replaced with actual API call
      fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCar),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to create car listing");
          return response.json();
        })
        .then((data) => {
          setCarListings([data, ...carListings]);
          toast.success(
            "Your car listing has been successfully created and is pending review."
          );
        })
        .catch((error) => {
          toast.error("Failed to create car listing. Please try again.");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
          setIsAddCarDialogOpen(false);
          setNewCar({
            title: "",
            price: 0,
            currency: "$",
            location: "",
            condition: "Used",
            transmission: "Automatic",
            year: new Date().getFullYear(),
            make: "",
            model: "",
            color: "",
            engineSize: "",
            registeredState: "",
            sellingCondition: "Registered",
            boughtCondition: "Registered",
            fuelType: "Petrol",
            mileage: 0,
            description: "",
            features: [],
          });
        });
    }
  };

  // Handle edit car submission
  const handleSaveEdit = () => {
    if (carToEdit && validateForm(carToEdit)) {
      setIsLoading(true);

      // Will be replaced with actual API call
      fetch(`/api/cars/${carToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carToEdit),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to update car listing");
          return response.json();
        })
        .then((data) => {
          setCarListings(
            carListings.map((car) => (car.id === carToEdit.id ? data : car))
          );
          toast.success("Your car listing has been successfully updated.");
        })
        .catch((error) => {
          toast.error("Failed to update car listing. Please try again.");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
          setIsEditCarDialogOpen(false);
          setCarToEdit(null);
        });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        <main className="flex-grow py-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Manage your car listings</p>
              </div>

              <Button
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddCarDialogOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                Add New Car
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div className="w-full md:w-auto relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Search listings..."
                      className="pl-10 w-full md:w-80"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <button
                            className="flex items-center font-medium"
                            onClick={() => handleSort("title")}
                          >
                            Car
                            {sortField === "title" && (
                              <ArrowUpDown size={14} className="ml-1" />
                            )}
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center font-medium"
                            onClick={() => handleSort("price")}
                          >
                            Price
                            {sortField === "price" && (
                              <ArrowUpDown size={14} className="ml-1" />
                            )}
                          </button>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          <button
                            className="flex items-center font-medium"
                            onClick={() => handleSort("createdAt")}
                          >
                            Date Listed
                            {sortField === "createdAt" && (
                              <ArrowUpDown size={14} className="ml-1" />
                            )}
                          </button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingData ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex justify-center items-center">
                              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                              <span className="text-gray-500">
                                Loading car listings...
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredListings.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            {searchQuery || statusFilter !== "all" ? (
                              <>No cars match your search criteria</>
                            ) : (
                              <>You haven't added any cars yet</>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredListings.map((car) => (
                          <TableRow key={car.id}>
                            <TableCell className="py-3">
                              <div className="flex items-center">
                                <div className="relative h-10 w-10 rounded overflow-hidden mr-3">
                                  <Image
                                    src={
                                      car.images[0] || "/placeholder-car.jpg"
                                    }
                                    alt={car.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium truncate max-w-[200px]">
                                    {car.title}
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <MapPin size={10} className="mr-1" />
                                    {car.location}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatPrice(car.price, car.currency)}
                              </div>
                            </TableCell>

                            <TableCell className="hidden md:table-cell text-gray-500">
                              {formatDate(car.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Open menu</span>
                                    <ChevronDown size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/car/${car.id}`)
                                    }
                                  >
                                    <Eye size={16} className="mr-2" />
                                    View Listing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEditCar(car)}
                                  >
                                    <Edit size={16} className="mr-2" />
                                    Edit Listing
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Listing
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Car Listing</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this car listing? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteCar}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Car Dialog */}
        <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Car Listing</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new car listing.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  value={newCar.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Toyota Camry 2018 Black"
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.title}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="make"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Make <span className="text-red-500">*</span>
                </label>
                <Input
                  id="make"
                  name="make"
                  value={newCar.make}
                  onChange={handleInputChange}
                  placeholder="e.g. Toyota"
                  className={formErrors.make ? "border-red-500" : ""}
                />
                {formErrors.make && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.make}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Model <span className="text-red-500">*</span>
                </label>
                <Input
                  id="model"
                  name="model"
                  value={newCar.model}
                  onChange={handleInputChange}
                  placeholder="e.g. Camry"
                  className={formErrors.model ? "border-red-500" : ""}
                />
                {formErrors.model && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.model}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Year <span className="text-red-500">*</span>
                </label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={newCar.year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2018"
                  className={formErrors.year ? "border-red-500" : ""}
                />
                {formErrors.year && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.year}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Color
                </label>
                <Input
                  id="color"
                  name="color"
                  value={newCar.color}
                  onChange={handleInputChange}
                  placeholder="e.g. Black"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">{newCar.currency}</span>
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={newCar.price || ""}
                    onChange={handleInputChange}
                    className={`pl-8 ${
                      formErrors.price ? "border-red-500" : ""
                    }`}
                    placeholder="0"
                  />
                </div>
                {formErrors.price && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.price}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="downPayment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Down Payment
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">{newCar.currency}</span>
                  </div>
                  <Input
                    id="downPayment"
                    name="downPayment"
                    type="number"
                    value={newCar.downPayment || ""}
                    onChange={handleInputChange}
                    className="pl-8"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="mileage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mileage <span className="text-red-500">*</span>
                </label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={newCar.mileage || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 45000"
                  className={formErrors.mileage ? "border-red-500" : ""}
                />
                {formErrors.mileage && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.mileage}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Condition
                </label>
                <Select
                  name="condition"
                  value={newCar.condition}
                  onValueChange={(value) =>
                    setNewCar({ ...newCar, condition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                    <SelectItem value="Certified Pre-Owned">
                      Certified Pre-Owned
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="transmission"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Transmission
                </label>
                <Select
                  name="transmission"
                  value={newCar.transmission}
                  onValueChange={(value) =>
                    setNewCar({ ...newCar, transmission: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Semi-Automatic">
                      Semi-Automatic
                    </SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="fuelType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fuel Type
                </label>
                <Select
                  name="fuelType"
                  value={newCar.fuelType}
                  onValueChange={(value) =>
                    setNewCar({ ...newCar, fuelType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Plug-in Hybrid">
                      Plug-in Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="engineSize"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Engine Size (cc)
                </label>
                <Input
                  id="engineSize"
                  name="engineSize"
                  value={newCar.engineSize}
                  onChange={handleInputChange}
                  placeholder="e.g. 2000"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={newCar.location}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco, CA"
                  className={formErrors.location ? "border-red-500" : ""}
                />
                {formErrors.location && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.location}
                  </p>
                )}
              </div>
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCar.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe the car's condition, history, features, etc."
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Car Images
                </label>
                <ImageUpload
                  images={newCar.images || []}
                  onChange={(images) => setNewCar({ ...newCar, images })}
                  maxImages={5}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddCarDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCar} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Car Dialog */}
        <Dialog
          open={isEditCarDialogOpen}
          onOpenChange={setIsEditCarDialogOpen}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Car Listing</DialogTitle>
              <DialogDescription>
                Update the details of your car listing.
              </DialogDescription>
            </DialogHeader>

            {carToEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="edit-title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Listing Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={carToEdit.title}
                    onChange={handleInputChange}
                    className={formErrors.title ? "border-red-500" : ""}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-make"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Make <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="edit-make"
                    name="make"
                    value={carToEdit.make}
                    onChange={handleInputChange}
                    className={formErrors.make ? "border-red-500" : ""}
                  />
                  {formErrors.make && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.make}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-model"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Model <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="edit-model"
                    name="model"
                    value={carToEdit.model}
                    onChange={handleInputChange}
                    className={formErrors.model ? "border-red-500" : ""}
                  />
                  {formErrors.model && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.model}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="edit-year"
                    name="year"
                    type="number"
                    value={carToEdit.year}
                    onChange={handleInputChange}
                    className={formErrors.year ? "border-red-500" : ""}
                  />
                  {formErrors.year && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.year}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-color"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Color
                  </label>
                  <Input
                    id="edit-color"
                    name="color"
                    value={carToEdit.color}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">
                        {carToEdit.currency}
                      </span>
                    </div>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      value={carToEdit.price}
                      onChange={handleInputChange}
                      className={`pl-8 ${
                        formErrors.price ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {formErrors.price && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-downPayment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Down Payment
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">
                        {carToEdit.currency}
                      </span>
                    </div>
                    <Input
                      id="edit-downPayment"
                      name="downPayment"
                      type="number"
                      value={carToEdit.downPayment || ""}
                      onChange={handleInputChange}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="edit-mileage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mileage <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="edit-mileage"
                    name="mileage"
                    type="number"
                    value={carToEdit.mileage}
                    onChange={handleInputChange}
                    className={formErrors.mileage ? "border-red-500" : ""}
                  />
                  {formErrors.mileage && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.mileage}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-condition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Condition
                  </label>
                  <Select
                    name="condition"
                    value={carToEdit.condition}
                    onValueChange={(value) =>
                      setCarToEdit({ ...carToEdit, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                      <SelectItem value="Certified Pre-Owned">
                        Certified Pre-Owned
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="edit-transmission"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transmission
                  </label>
                  <Select
                    name="transmission"
                    value={carToEdit.transmission}
                    onValueChange={(value) =>
                      setCarToEdit({ ...carToEdit, transmission: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Semi-Automatic">
                        Semi-Automatic
                      </SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="edit-fuelType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fuel Type
                  </label>
                  <Select
                    name="fuelType"
                    value={carToEdit.fuelType}
                    onValueChange={(value) =>
                      setCarToEdit({ ...carToEdit, fuelType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Plug-in Hybrid">
                        Plug-in Hybrid
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="edit-location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="edit-location"
                    name="location"
                    value={carToEdit.location}
                    onChange={handleInputChange}
                    className={formErrors.location ? "border-red-500" : ""}
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.location}
                    </p>
                  )}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={carToEdit.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={formErrors.description ? "border-red-500" : ""}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="edit-images"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Car Images
                  </label>
                  <ImageUpload
                    images={carToEdit.images || []}
                    onChange={(images) =>
                      setCarToEdit({ ...carToEdit, images })
                    }
                    maxImages={5}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditCarDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}
