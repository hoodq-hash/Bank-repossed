"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Upload,
  Camera,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function SellMyCarPage() {
  // Form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    transmission: "",
    fuelType: "",
    color: "",
    price: "",
    description: "",
    location: "",
    name: "",
    email: "",
    phone: "",
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Car makes and models for dropdowns
  const carMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "Nissan",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Hyundai",
    "Kia",
    "Lexus",
    "Mazda",
    "Subaru",
    "Tesla",
  ];

  // Years for dropdown
  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - i
  );

  // Conditions for dropdown
  const conditions = ["New", "Used", "Certified Pre-Owned"];

  // Transmissions for dropdown
  const transmissions = ["Automatic", "Manual", "CVT", "Semi-Automatic"];

  // Fuel types for dropdown
  const fuelTypes = [
    "Petrol",
    "Diesel",
    "Electric",
    "Hybrid",
    "Plug-in Hybrid",
    "CNG",
  ];

  // Colors for dropdown
  const colors = [
    "Black",
    "White",
    "Silver",
    "Gray",
    "Blue",
    "Red",
    "Green",
    "Brown",
    "Gold",
    "Orange",
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Simulate upload process
    setIsUploading(true);
    setUploadProgress(0);

    // Create preview URLs for the images
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedImages((prevImages) => [...prevImages, ...newImages]);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Remove uploaded image
  const removeImage = (id) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "make",
      "model",
      "year",
      "mileage",
      "condition",
      "transmission",
      "fuelType",
      "color",
      "price",
      "name",
      "email",
      "phone",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (
      formData.phone &&
      !/^\d{10,15}$/.test(formData.phone.replace(/[^\d]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Price validation
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a number";
    }

    // Mileage validation
    if (formData.mileage && isNaN(Number(formData.mileage))) {
      newErrors.mileage = "Mileage must be a number";
    }

    // Image validation
    if (uploadedImages.length === 0) {
      newErrors.images = "Please upload at least one image of your car";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would send the form data to your backend here
      // const response = await fetch('/api/sell-car', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     images: uploadedImages.map(img => img.url)
      //   })
      // });

      // if (!response.ok) throw new Error('Failed to submit');

      setSubmitSuccess(true);

      // Reset form after successful submission
      setFormData({
        make: "",
        model: "",
        year: "",
        mileage: "",
        condition: "",
        transmission: "",
        fuelType: "",
        color: "",
        price: "",
        description: "",
        location: "",
        name: "",
        email: "",
        phone: "",
      });
      setUploadedImages([]);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Page header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sell Your Car
            </h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <ChevronRight size={14} className="mx-1" />
              <span>Sell Your Car</span>
            </div>
          </div>

          {/* Success message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle2
                className="text-green-500 mt-0.5 mr-3 flex-shrink-0"
                size={20}
              />
              <div className="flex-grow">
                <h3 className="text-green-800 font-medium mb-1">
                  Listing submitted successfully!
                </h3>
                <p className="text-green-700 text-sm">
                  Thank you for listing your car with us. Our team will review
                  your listing and it will be published soon. You will receive a
                  confirmation email with further details.
                </p>
                <div className="mt-3">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-sm"
                    onClick={() => setSubmitSuccess(false)}
                  >
                    List another car
                  </Button>
                </div>
              </div>
              <button
                className="text-green-500 hover:text-green-700"
                onClick={() => setSubmitSuccess(false)}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Error message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle
                className="text-red-500 mt-0.5 mr-3 flex-shrink-0"
                size={20}
              />
              <div>
                <h3 className="text-red-800 font-medium mb-1">
                  Failed to submit listing
                </h3>
                <p className="text-red-700 text-sm">
                  There was an error submitting your car listing. Please try
                  again or contact our support team for assistance.
                </p>
                <div className="mt-3">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-sm"
                    onClick={() => setSubmitError(false)}
                  >
                    Try again
                  </Button>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setSubmitError(false)}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* How it works section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Submit your car details</h3>
                <p className="text-sm text-gray-600">
                  Fill out the form with your car information and upload photos
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Get verified</h3>
                <p className="text-sm text-gray-600">
                  Our team reviews your listing and verifies the information
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Connect with buyers</h3>
                <p className="text-sm text-gray-600">
                  Get inquiries from interested buyers and sell your car
                </p>
              </div>
            </div>
          </div>

          {/* Sell your car form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Form sections */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Car Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Make */}
                <div>
                  <label
                    htmlFor="make"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Make *
                  </label>
                  <select
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.make ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="">Select Make</option>
                    {carMakes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                  {errors.make && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.make}
                    </p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Model *
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g. Camry, Civic, F-150"
                    className={`w-full p-2 border ${
                      errors.model ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.model && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.model}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year *
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.year ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.year}
                    </p>
                  )}
                </div>

                {/* Mileage */}
                <div>
                  <label
                    htmlFor="mileage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mileage (km) *
                  </label>
                  <input
                    type="text"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="e.g. 50000"
                    className={`w-full p-2 border ${
                      errors.mileage ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.mileage && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.mileage}
                    </p>
                  )}
                </div>

                {/* Condition */}
                <div>
                  <label
                    htmlFor="condition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.condition ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="">Select Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.condition}
                    </p>
                  )}
                </div>

                {/* Transmission */}
                <div>
                  <label
                    htmlFor="transmission"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transmission *
                  </label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.transmission ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="">Select Transmission</option>
                    {transmissions.map((transmission) => (
                      <option key={transmission} value={transmission}>
                        {transmission}
                      </option>
                    ))}
                  </select>
                  {errors.transmission && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.transmission}
                    </p>
                  )}
                </div>

                {/* Fuel Type */}
                <div>
                  <label
                    htmlFor="fuelType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fuel Type *
                  </label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.fuelType ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map((fuelType) => (
                      <option key={fuelType} value={fuelType}>
                        {fuelType}
                      </option>
                    ))}
                  </select>
                  {errors.fuelType && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.fuelType}
                    </p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Color *
                  </label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.color ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="">Select Color</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  {errors.color && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.color}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Asking Price ($) *
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 15000"
                    className={`w-full p-2 border ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 md:mt-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your car's condition, features, history, etc."
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Include important details about your car that would help
                  potential buyers.
                </p>
              </div>
            </div>

            {/* Image upload section */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Car Photos</h2>

              <div className="mb-4">
                <div
                  className={`border-2 border-dashed ${
                    errors.images
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } rounded-lg p-4 text-center`}
                >
                  <input
                    type="file"
                    id="car-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="car-images"
                    className="cursor-pointer flex flex-col items-center justify-center py-4"
                  >
                    <Camera size={40} className="text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drag photos here or click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                      Upload up to 10 photos (JPEG, PNG, max 5MB each)
                    </p>
                    <Button
                      type="button"
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        document.getElementById("car-images").click()
                      }
                    >
                      <Upload size={16} className="mr-2" />
                      Select Photos
                    </Button>
                  </label>
                </div>
                {errors.images && (
                  <p className="text-red-500 text-xs mt-1 error-message">
                    {errors.images}
                  </p>
                )}
              </div>

              {/* Upload progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Uploaded images */}
              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Photos ({uploadedImages.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-w-16 aspect-h-12 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={image.url}
                            alt="Car photo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image.id)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-start">
                <Info
                  size={16}
                  className="text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                />
                <p className="text-xs text-gray-600">
                  Include clear photos of the exterior (front, back, sides),
                  interior, dashboard, and any damage or special features. Good
                  photos increase your chances of selling quickly.
                </p>
              </div>
            </div>

            {/* Contact information */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-4">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 error-message">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  By submitting this form, I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  . I understand that my information will be used to process my
                  car listing request.
                </label>
              </div>
            </div>

            {/* Submit button */}
            <div className="p-4 md:p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="order-2 sm:order-1"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 order-1 sm:order-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Car Listing"}
                </Button>
              </div>
            </div>
          </form>

          {/* Why sell with us section */}
          <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">
              Why sell your car with us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="font-medium">Free Listings</h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  List your car for free and reach thousands of potential buyers
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="font-medium">Verified Buyers</h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Connect with serious, verified buyers in your area
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="font-medium">Secure Process</h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Our secure platform helps protect both buyers and sellers
                </p>
              </div>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">
                  How long will it take to sell my car?
                </h3>
                <p className="text-sm text-gray-600">
                  The time it takes to sell your car depends on various factors
                  including price, condition, demand, and location. Well-priced,
                  popular models in good condition typically sell faster.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  Is there a fee to list my car?
                </h3>
                <p className="text-sm text-gray-600">
                  No, listing your car on our platform is completely free. We
                  only charge a small commission when your car is successfully
                  sold.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  How do I know what price to set?
                </h3>
                <p className="text-sm text-gray-600">
                  Our platform provides market value estimates based on similar
                  vehicles in your area. You can also research comparable
                  listings to determine a competitive price.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  Can I edit my listing after submitting?
                </h3>
                <p className="text-sm text-gray-600">
                  Yes, you can edit your listing at any time from your account
                  dashboard. Keep your listing updated to attract more potential
                  buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
