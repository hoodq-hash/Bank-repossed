"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  Car,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Location data
const locations = [
  {
    id: 1,
    name: "Headquarters",
    address: "562 State St, Clearfield, UT 84015, United States",
    email: "contact@charriotautosales.com",
    phone: "+1 (631) 282-8230",
    hours: "Mon-Fri: 9am-8pm\nSaturday: 9am-6pm\nSunday: 11am-5pm",
    mapUrl: "https://maps.google.com/?q=123+Auto+Drive+Cartown+CT+12345",
  },
];

// Inquiry types
const inquiryTypes = [
  "Sales Inquiry",
  "Service Appointment",
  "Parts Order",
  "Financing Question",
  "Vehicle Trade-In",
  "Test Drive Request",
  "Employment Opportunity",
  "Other",
];

// Departments
const departments = [
  "Sales",
  "Service",
  "Parts",
  "Finance",
  "Management",
  "Human Resources",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    department: "",
    preferredLocation: "",
    message: "",
    preferredContact: "email",
    subscribe: false,
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message:
          "Thank you for your message! Our team will get back to you shortly.",
      });

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryType: "",
        department: "",
        preferredLocation: "",
        message: "",
        preferredContact: "email",
        subscribe: false,
      });
    }, 1000);
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
                Contact Us
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get in Touch with Our Team
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Have questions about our vehicles, services, or anything else?
                We're here to help! Reach out to our team using any of the
                methods below.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Call Us Now
                  <Phone size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-blue-100 text-blue-700 mb-3">
                  Our Locations
                </Badge>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Visit Us at One of Our Dealerships
                </h2>
                <p className="text-slate-600 mb-8">
                  With three convenient locations throughout Cartown, we're
                  never far away when you need us. Stop by during our business
                  hours.
                </p>

                <div className="space-y-8">
                  {locations.map((location) => (
                    <Card
                      key={location.id}
                      className="overflow-hidden border-slate-200"
                    >
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                          {location.name}
                        </h3>
                        <div className="space-y-3 text-slate-600">
                          <div className="flex items-start">
                            <MapPin
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div className="whitespace-pre-line">
                              {location.address}
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Mail
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>{location.email}</div>
                          </div>
                          <div className="flex items-center">
                            <Phone
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>{location.phone}</div>
                          </div>
                          <div className="flex items-start">
                            <Clock
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div className="whitespace-pre-line">
                              {location.hours}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-700 mb-3">
                Get in Touch
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Have a question ? Fill out the form below and our team will get
                back to you as soon as possible.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {formStatus?.submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
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
                            formStatus.success
                              ? "text-green-800"
                              : "text-red-800"
                          }
                        >
                          {formStatus.success
                            ? "Message Sent Successfully"
                            : "Error Sending Message"}
                        </AlertTitle>
                        <AlertDescription
                          className={
                            formStatus.success
                              ? "text-green-700"
                              : "text-red-700"
                          }
                        >
                          {formStatus.message}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => setFormStatus(null)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Send Another Message
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-slate-700 mb-1.5 block"
                      >
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                        className="border-slate-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="text-slate-700 mb-1.5 block"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                        className="border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-slate-700 mb-1.5 block"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        className="border-slate-300"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-slate-700 mb-1.5 block"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label
                        htmlFor="inquiryType"
                        className="text-slate-700 mb-1.5 block"
                      >
                        Inquiry Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) =>
                          handleSelectChange("inquiryType", value)
                        }
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="department"
                        className="text-slate-700 mb-1.5 block"
                      >
                        Department
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleSelectChange("department", value)
                        }
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="preferredLocation"
                      className="text-slate-700 mb-1.5 block"
                    >
                      Preferred Location
                    </Label>
                    <Select
                      value={formData.preferredLocation}
                      onValueChange={(value) =>
                        handleSelectChange("preferredLocation", value)
                      }
                    >
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="Select preferred location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="message"
                      className="text-slate-700 mb-1.5 block"
                    >
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      className="border-slate-300 min-h-[120px]"
                    />
                  </div>

                  <div className="mb-6">
                    <Label className="text-slate-700 mb-2 block">
                      Preferred Contact Method
                    </Label>
                    <RadioGroup
                      value={formData.preferredContact}
                      onValueChange={(value) =>
                        handleRadioChange("preferredContact", value)
                      }
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="contact-email" />
                        <Label htmlFor="contact-email" className="font-normal">
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="contact-phone" />
                        <Label htmlFor="contact-phone" className="font-normal">
                          Phone
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="either" id="contact-either" />
                        <Label htmlFor="contact-either" className="font-normal">
                          Either
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="subscribe"
                        checked={formData.subscribe}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("subscribe", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="subscribe"
                        className="font-normal text-slate-600"
                      >
                        Subscribe to our newsletter for updates on new inventory
                        and special offers
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                      Send Message
                      <Send size={16} className="ml-2" />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Additional Contact Methods */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-700 mb-3">
                More Ways to Connect
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                We're Always Here to Help
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Choose the contact method that works best for you. Our team is
                ready to assist you with any questions or concerns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Call Us
                </h3>
                <p className="text-slate-600 mb-4">
                  Speak directly with our team for immediate assistance with
                  your questions.
                </p>
                <div className="font-medium text-blue-600 mb-4">
                  (555) 123-4567
                </div>
                <Button variant="outline" className="w-full border-slate-300">
                  Call Now
                </Button>
              </motion.div> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Live Chat
                </h3>
                <p className="text-slate-600 mb-4">
                  Chat with our sales or service team in real-time during
                  business hours.
                </p>
                <div className="font-medium text-green-600 mb-4">
                  Available Now
                </div>
                <Button variant="outline" className="w-full border-slate-300">
                  Start Chat
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-700 mb-3">
                Quick Answers
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Frequently Asked Contact Questions
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Find quick answers to common questions about contacting our
                team.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  What are your business hours?
                </h3>
                <p className="text-slate-600">
                  Our sales departments are open Monday-Friday from 9am-8pm,
                  Saturday from 9am-6pm, and Sunday from 11am-5pm. Service
                  center hours vary by location, so please check the specific
                  location information above.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  How quickly will someone respond to my inquiry?
                </h3>
                <p className="text-slate-600">
                  We strive to respond to all inquiries within 24 business
                  hours. For urgent matters, we recommend calling us directly
                  for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Find Your Perfect Vehicle?
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Browse our inventory online or visit one of our locations to
                  see our selection in person.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white hover:bg-gray-100 text-blue-700">
                    Browse Inventory
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/contact-cta.jpg"
                    alt="Chariot Auto Sales Showroom"
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
