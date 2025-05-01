"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  ShieldCheck,
  Handshake,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ArrowRight,
  Calendar,
  TrendingUp,
  Building,
  Car,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "chariot ",
    role: "Founder & CEO",
    image: "/images/team/chariot.jpg",
    bio: "chariot founded Chariot Auto Sales in 1995 with a vision to create a transparent and customer-focused car buying experience. With over 30 years in the automotive industry, Chariot's expertise and passion for cars has driven the company to become a leader in the market.",
    email: "chariot@chariotsautos.com",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Sales Director",
    image: "/images/team/sarah.jpg",
    bio: "Sarah brings 15 years of automotive sales experience to the team. Her customer-first approach and deep product knowledge ensure that every client finds the perfect vehicle for their needs and budget.",
    email: "sarah@chariotsautos.com",
    phone: "(555) 123-4568",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Service Manager",
    image: "/images/team/michael.jpg",
    bio: "Michael oversees our state-of-the-art service department. With his team of certified technicians, he ensures every vehicle we sell meets our rigorous quality standards and that our customers receive exceptional maintenance service.",
    email: "michael@chariotsautos.com",
    phone: "(555) 123-4569",
  },
  {
    id: 4,
    name: "Lisa Chen",
    role: "Finance Manager",
    image: "/images/team/lisa.jpg",
    bio: "Lisa has over a decade of experience in automotive financing. She works with multiple lenders to secure the best rates for our customers and makes the financing process smooth and transparent.",
    email: "lisa@chariotsautos.com",
    phone: "(555) 123-4570",
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Customer Experience Director",
    image: "/images/team/david.jpg",
    bio: "David ensures that every interaction with Chariot Auto Sales exceeds expectations. From the first website visit to post-purchase support, he's dedicated to creating memorable customer experiences.",
    email: "david@chariotsautos.com",
    phone: "(555) 123-4571",
  },
  {
    id: 6,
    name: "Sophia Martinez",
    role: "Marketing Manager",
    image: "/images/team/sophia.jpg",
    bio: "Sophia leads our marketing initiatives with creativity and data-driven strategies. Her innovative campaigns have helped establish Chariot Auto Sales as a trusted name in the automotive industry.",
    email: "sophia@chariotsautos.com",
    phone: "(555) 123-4572",
  },
];

// Milestones data
const milestones = [
  {
    year: 1995,
    title: "Company Founded",
    description:
      "chariot  opened the first Chariot Auto Sales location with just 15 vehicles and 3 employees.",
    icon: <Building className="h-6 w-6" />,
  },
  {
    year: 2002,
    title: "Expansion to Second Location",
    description:
      "After seven successful years, we opened our second dealership, doubling our inventory and service capacity.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    year: 2008,
    title: "Service Center Launch",
    description:
      "We launched our state-of-the-art service center, offering comprehensive maintenance and repair services.",
    icon: <Car className="h-6 w-6" />,
  },
  {
    year: 2015,
    title: "Online Platform Launch",
    description:
      "Chariot Auto Sales went digital with our online inventory system and virtual showroom experience.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    year: 2020,
    title: "25th Anniversary",
    description:
      "Celebrated 25 years of service with our 10,000th vehicle sold and expansion to our third location.",
    icon: <Award className="h-6 w-6" />,
  },
  {
    year: 2023,
    title: "Electric Vehicle Initiative",
    description:
      "Launched our dedicated EV department, offering the latest in electric and hybrid vehicles.",
    icon: <Heart className="h-6 w-6" />,
  },
];

// Values data
const values = [
  {
    title: "Transparency",
    description:
      "We believe in complete transparency throughout the car buying process, from pricing to vehicle history.",
    icon: <ShieldCheck className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Quality",
    description:
      "Every vehicle undergoes a rigorous 200-point inspection before joining our inventory.",
    icon: <Award className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Customer Focus",
    description:
      "We prioritize customer satisfaction in every interaction, creating relationships that last beyond the sale.",
    icon: <Users className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Integrity",
    description:
      "We operate with honesty and ethical standards that exceed industry expectations.",
    icon: <Handshake className="h-10 w-10 text-blue-500" />,
  },
];

// FAQ data
const faqs = [
  {
    question: "What makes Chariot Auto Sales different from other dealerships?",
    answer:
      "At Chariot Auto Sales, we prioritize transparency, quality, and customer satisfaction above all else. We offer a no-pressure sales environment, rigorous vehicle inspections, clear pricing without hidden fees, and personalized service throughout your car buying journey.",
  },
  {
    question: "Do you offer financing options?",
    answer:
      "Yes, we work with multiple lenders to offer competitive financing options tailored to your needs. Our finance team will help you navigate the process and secure the best rates available for your situation, regardless of credit history.",
  },
  {
    question: "What warranty coverage comes with your vehicles?",
    answer:
      "All our vehicles come with a minimum 90-day/3,000-mile warranty. We also offer extended warranty options that can provide coverage for up to 7 years or 100,000 miles, giving you peace of mind with your purchase.",
  },
  {
    question: "Can I trade in my current vehicle?",
    answer:
      "Absolutely! We accept trade-ins and offer fair market value for your vehicle. Our team will evaluate your car on-site and apply the trade-in value directly to your new purchase, making the process seamless.",
  },
  {
    question: "Do you sell electric and hybrid vehicles?",
    answer:
      "Yes, we have a growing selection of electric and hybrid vehicles. Our dedicated EV specialists can help you understand the benefits of electric vehicle ownership and find the right eco-friendly option for your lifestyle.",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("story");

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
                About Us
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Driving Excellence Since 1995
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Chariot Auto Sales is more than a dealership. We're a team of
                automotive enthusiasts dedicated to providing exceptional
                vehicles and service to our community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Our Inventory
                  <ChevronRight size={16} className="ml-1" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 max-w-7xl">
            <Tabs
              defaultValue="story"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="overflow-x-auto">
                <TabsList className="bg-transparent border-b-0 justify-start h-16">
                  <TabsTrigger
                    value="story"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-5 h-full"
                  >
                    Our Story
                  </TabsTrigger>
                  <TabsTrigger
                    value="mission"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-5 h-full"
                  >
                    Mission & Values
                  </TabsTrigger>

                  <TabsTrigger
                    value="locations"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-5 h-full"
                  >
                    Locations
                  </TabsTrigger>
                  <TabsTrigger
                    value="faq"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-5 h-full"
                  >
                    FAQ
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Our Story Tab Content */}
              <TabsContent value="story">
                {/* Our Story Section */}
                <section className="py-16 bg-white">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <Badge className="bg-blue-100 text-blue-700 mb-3">
                          Our Story
                        </Badge>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                          From Humble Beginnings to Industry Leader
                        </h2>
                        <div className="space-y-4 text-slate-600">
                          <p>
                            Chariot Auto Sales began in 1995 when founder
                            chariot saw an opportunity to transform the car
                            buying experience. Frustrated with the traditional
                            high-pressure sales tactics and lack of transparency
                            in the industry, chariot opened his first dealership
                            with just 15 vehicles and a commitment to honest,
                            customer-focused service.
                          </p>
                          <p>
                            What started as a small operation quickly gained a
                            reputation for integrity and quality. Customers
                            appreciated our straightforward approach, fair
                            pricing, and the exceptional condition of our
                            vehicles. Word spread throughout the community, and
                            Chariot Auto Sales began to grow.
                          </p>
                          <p>
                            By 2002, we had expanded to our second location, and
                            our team had grown from the original three employees
                            to over twenty dedicated professionals. Throughout
                            our growth, we've maintained our founding principles
                            of transparency, quality, and customer satisfaction.
                          </p>
                          <p>
                            Today, Chariot Auto Sales operates three
                            state-of-the-art facilities, offering sales,
                            service, and financing solutions to our valued
                            customers. While much has changed over the years,
                            our commitment to providing an exceptional car
                            buying experience remains stronger than ever.
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="relative rounded-xl overflow-hidden shadow-xl">
                          <Image
                            src="https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Chariot Auto Sales History"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-100 rounded-lg -z-10"></div>
                        <div className="absolute -top-6 -right-6 w-48 h-48 bg-slate-100 rounded-lg -z-10"></div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Timeline Section */}
                <section className="py-16 bg-slate-50">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">
                        Our Journey
                      </Badge>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Milestones Through the Years
                      </h2>
                      <p className="text-slate-600 max-w-3xl mx-auto">
                        For nearly three decades, we've been growing and
                        evolving to better serve our customers and community.
                      </p>
                    </div>

                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200"></div>

                      <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                          <div key={milestone.year} className="relative">
                            <div className="flex items-center justify-center">
                              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10">
                                {milestone.icon}
                              </div>
                            </div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className={`mt-16 md:w-5/12 ${
                                index % 2 === 0
                                  ? "md:mr-auto md:text-right md:pr-12"
                                  : "md:ml-auto md:pl-12"
                              }`}
                            >
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                  {milestone.year}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                  {milestone.title}
                                </h3>
                                <p className="text-slate-600">
                                  {milestone.description}
                                </p>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              {/* Mission & Values Tab Content */}
              <TabsContent value="mission">
                {/* Mission Statement */}
                <section className="py-16 bg-white">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="order-2 lg:order-1">
                        <Badge className="bg-blue-100 text-blue-700 mb-3">
                          Our Mission
                        </Badge>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                          Transforming the Car Buying Experience
                        </h2>
                        <div className="space-y-4 text-slate-600">
                          <p className="text-xl font-medium text-slate-800 italic border-l-4 border-blue-500 pl-4 py-2">
                            "Our mission is to provide exceptional vehicles and
                            service while creating a transparent, pressure-free
                            environment where customers can make confident
                            decisions about their automotive needs."
                          </p>
                          <p>
                            At Chariot Auto Sales, we believe that buying a car
                            should be an exciting and positive experience. We're
                            committed to eliminating the stress and uncertainty
                            often associated with car shopping by providing
                            complete transparency, expert guidance, and
                            personalized service.
                          </p>
                          <p>
                            We strive to build lasting relationships with our
                            customers that extend beyond the initial sale. Our
                            dedicated team of automotive professionals is
                            passionate about helping you find the perfect
                            vehicle for your lifestyle and budget, and providing
                            ongoing support throughout your ownership
                            experience.
                          </p>
                        </div>
                      </div>
                      <div className="order-1 lg:order-2 relative">
                        <div className="relative rounded-xl overflow-hidden shadow-xl">
                          <Image
                            src="https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Our Mission"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-100 rounded-lg -z-10"></div>
                        <div className="absolute -top-6 -left-6 w-48 h-48 bg-slate-100 rounded-lg -z-10"></div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Core Values */}
                <section className="py-16 bg-slate-50">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">
                        Our Values
                      </Badge>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Core Values That Drive Us
                      </h2>
                      <p className="text-slate-600 max-w-3xl mx-auto">
                        These principles guide every decision we make and every
                        interaction we have with our customers.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {values.map((value, index) => (
                        <motion.div
                          key={value.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                        >
                          <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                            {value.icon}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {value.title}
                          </h3>
                          <p className="text-slate-600">{value.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Community Involvement */}
                <section className="py-16 bg-white">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="relative">
                        <div className="relative rounded-xl overflow-hidden shadow-xl">
                          <Image
                            src="/images/community.jpg"
                            alt="Community Involvement"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-100 rounded-lg -z-10"></div>
                        <div className="absolute -top-6 -right-6 w-48 h-48 bg-slate-100 rounded-lg -z-10"></div>
                      </div>
                      <div>
                        <Badge className="bg-blue-100 text-blue-700 mb-3">
                          Community
                        </Badge>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                          Giving Back to Our Community
                        </h2>
                        <div className="space-y-4 text-slate-600">
                          <p>
                            At Chariot Auto Sales, we believe in the importance
                            of supporting the communities we serve. Throughout
                            our history, we've been actively involved in local
                            initiatives and charitable organizations.
                          </p>
                          <p>
                            Our annual "Drive for a Cause" campaign has raised
                            over $500,000 for local charities, and our team
                            regularly volunteers with organizations focused on
                            education, health, and environmental conservation.
                          </p>
                          <p>
                            We're proud to sponsor local youth sports teams,
                            community events, and educational programs. Through
                            these efforts, we strive to make a positive impact
                            beyond the automotive industry and contribute to the
                            well-being of our community.
                          </p>
                        </div>
                        <div className="mt-8">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Learn About Our Initiatives
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              {/* Our Team Tab Content */}
              <TabsContent value="team">
                {/* Team Introduction */}
                <section className="py-16 bg-white">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">
                        Our Team
                      </Badge>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Meet the People Behind Chariot Auto Sales
                      </h2>
                      <p className="text-slate-600 max-w-3xl mx-auto">
                        Our dedicated team of automotive professionals is
                        committed to providing exceptional service and
                        expertise.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {teamMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={
                                member.image || `/images/team/placeholder.jpg`
                              }
                              alt={member.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              {member.name}
                            </h3>
                            <p className="text-blue-600 font-medium mb-4">
                              {member.role}
                            </p>
                            <p className="text-slate-600 mb-4 line-clamp-3">
                              {member.bio}
                            </p>
                            <div className="flex flex-col space-y-2 text-sm">
                              <a
                                href={`mailto:${member.email}`}
                                className="flex items-center text-slate-700 hover:text-blue-600"
                              >
                                <Mail size={16} className="mr-2" />
                                {member.email}
                              </a>
                              <a
                                href={`tel:${member.phone}`}
                                className="flex items-center text-slate-700 hover:text-blue-600"
                              >
                                <Phone size={16} className="mr-2" />
                                {member.phone}
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-12 text-center">
                      <p className="text-slate-600 mb-6">
                        Our team extends beyond these key members to include
                        sales consultants, service technicians, and support
                        staff who are all committed to your satisfaction.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Join Our Team
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Testimonials */}
                <section className="py-16 bg-slate-50">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">
                        Testimonials
                      </Badge>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        What Our Customers Say
                      </h2>
                      <p className="text-slate-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Hear from customers who
                        have experienced the Chariot Auto Sales difference.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative">
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <Star size={16} className="fill-current" />
                        </div>
                        <div className="flex items-center mb-4">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className="text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-slate-600 text-sm">5.0</span>
                        </div>
                        <p className="text-slate-600 italic mb-4">
                          "The team at Chariot Auto Sales made buying a car so
                          easy. No pressure, just helpful guidance and honest
                          answers to all my questions. I'll never go anywhere
                          else!"
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-200 mr-3"></div>
                          <div>
                            <div className="font-medium text-slate-900">
                              Jennifer R.
                            </div>
                            <div className="text-sm text-slate-500">
                              Customer since 2018
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative">
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <Star size={16} className="fill-current" />
                        </div>
                        <div className="flex items-center mb-4">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className="text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-slate-600 text-sm">5.0</span>
                        </div>
                        <p className="text-slate-600 italic mb-4">
                          "I was impressed by the quality of vehicles and the
                          knowledge of the staff. Michael in the service
                          department has been exceptional with maintenance.
                          Truly a dealership that cares."
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-200 mr-3"></div>
                          <div>
                            <div className="font-medium text-slate-900">
                              Robert T.
                            </div>
                            <div className="text-sm text-slate-500">
                              Customer since 2020
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative">
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <Star size={16} className="fill-current" />
                        </div>
                        <div className="flex items-center mb-4">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className="text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-slate-600 text-sm">5.0</span>
                        </div>
                        <p className="text-slate-600 italic mb-4">
                          "Lisa in financing worked miracles to get me approved
                          with a great rate despite my credit challenges. The
                          whole experience was respectful and professional from
                          start to finish."
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-200 mr-3"></div>
                          <div>
                            <div className="font-medium text-slate-900">
                              Marcus D.
                            </div>
                            <div className="text-sm text-slate-500">
                              Customer since 2022
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 text-center">
                      <Link href="/testimonials">
                        <Button
                          variant="outline"
                          className="border-slate-300 hover:border-slate-400 text-slate-800"
                        >
                          Read More Testimonials
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </section>
              </TabsContent>

              {/* Locations Tab Content */}
              <TabsContent value="locations">
                {/* Locations Map */}
                <section className="py-16 bg-white">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">
                        Our Locations
                      </Badge>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Visit Us at One of Our Dealerships
                      </h2>
                      <p className="text-slate-600 max-w-3xl mx-auto">
                        With three convenient locations, we're never far away
                        when you need us.
                      </p>
                    </div>

                    <div className="bg-slate-100 rounded-xl overflow-hidden h-[400px] mb-12 relative">
                      {/* This would be replaced with an actual map component */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-slate-500">
                          Interactive Map Would Be Displayed Here
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Location 1 */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                          Main Showroom
                        </h3>
                        <div className="space-y-3 text-slate-600 mb-6">
                          <div className="flex items-start">
                            <MapPin
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div>
                              123 Auto Drive
                              <br />
                              Cartown, CT 12345
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Phone
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>(555) 123-4567</div>
                          </div>
                          <div className="flex items-center">
                            <Mail
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>main@chariotsautos.com</div>
                          </div>
                          <div className="flex items-start">
                            <Clock
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div>
                              Mon-Fri: 9am-8pm
                              <br />
                              Saturday: 9am-6pm
                              <br />
                              Sunday: 11am-5pm
                            </div>
                          </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Get Directions
                        </Button>
                      </div>

                      {/* Location 2 */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                          Westside Dealership
                        </h3>
                        <div className="space-y-3 text-slate-600 mb-6">
                          <div className="flex items-start">
                            <MapPin
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div>
                              456 West Boulevard
                              <br />
                              Cartown, CT 12346
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Phone
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>(555) 234-5678</div>
                          </div>
                          <div className="flex items-center">
                            <Mail
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>west@chariotsautos.com</div>
                          </div>
                          <div className="flex items-start">
                            <Clock
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div>
                              Mon-Fri: 9am-8pm
                              <br />
                              Saturday: 9am-6pm
                              <br />
                              Sunday: 11am-5pm
                            </div>
                          </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Get Directions
                        </Button>
                      </div>

                      {/* Location 3 */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                          Eastside Service Center
                        </h3>
                        <div className="space-y-3 text-slate-600 mb-6">
                          <div className="flex items-start">
                            <MapPin
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div>
                              789 East Avenue
                              <br />
                              Cartown, CT 12347
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Phone
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>(555) 345-6789</div>
                          </div>
                          <div className="flex items-center">
                            <Mail
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0"
                            />
                            <div>service@chariotsautos.com</div>
                          </div>
                          <div className="flex items-start">
                            <Clock
                              size={18}
                              className="mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <div>
                              Mon-Fri: 8am-6pm
                              <br />
                              Saturday: 8am-4pm
                              <br />
                              Sunday: Closed
                            </div>
                          </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Virtual Tour */}
                <section className="py-16 bg-slate-50">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <Badge className="bg-blue-100 text-blue-700 mb-3">
                          Virtual Tour
                        </Badge>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                          Take a Virtual Tour of Our Facilities
                        </h2>
                        <div className="space-y-4 text-slate-600">
                          <p>
                            Can't visit us in person? No problem! Our virtual
                            tour allows you to explore our showrooms, service
                            centers, and facilities from the comfort of your
                            home.
                          </p>
                          <p>
                            Get a feel for our extensive inventory,
                            state-of-the-art service bays, and comfortable
                            customer lounges before your visit.
                          </p>
                          <p>
                            Our interactive 360° tours provide an immersive
                            experience that showcases the Chariot Auto Sales
                            difference.
                          </p>
                        </div>
                        <div className="mt-8">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Start Virtual Tour
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                          <Image
                            src="/images/virtual-tour.jpg"
                            alt="Virtual Tour"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-blue-600 border-b-8 border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              {/* FAQ Tab Content */}
              <TabsContent value="faq">
                <section className="py-16 bg-white">
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">
                        FAQ
                      </Badge>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Frequently Asked Questions
                      </h2>
                      <p className="text-slate-600 max-w-3xl mx-auto">
                        Find answers to common questions about our services,
                        processes, and policies.
                      </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                      <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    <div className="mt-12 text-center">
                      <p className="text-slate-600 mb-6">
                        Still have questions? We're here to help!
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Phone size={16} className="mr-2" />
                          Contact Us
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-300 hover:border-slate-400 text-slate-800"
                        >
                          <Mail size={16} className="mr-2" />
                          Email Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section - Consistent across all tabs */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Experience the Chariot Auto Sales Difference?
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Visit one of our locations today or browse our online
                  inventory to find your perfect vehicle.
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
                    src="/images/showroom.jpg"
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
