"use client";
import React, { useState, useEffect } from "react";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Modified testimonials array to include at least 20 reviews from US, Canada, and UK
const testimonials = [
  {
    name: "Michael ",
    location: "New York, USA",
    title: "Chariot Auto Sales exceeded my expectations!",
    content:
      "I had been searching for a reliable SUV for months when I discovered Chariot Auto Sales online. Their detailed inspection report gave me complete confidence in my purchase. The entire process was transparent and efficient - from selecting the vehicle to finalizing the paperwork. Their team handled everything professionally and I got an excellent deal on a Toyota RAV4 that was in perfect condition.",
    date: "15 Mar, 2025",
    avatar: "/avatars/michael.jpg",
    rating: 5,
  },
  {
    name: "Sarah Miller",
    location: "London, UK",
    title: "Impressed with their service!",
    content:
      "I recently purchased a 2021 BMW 3 Series through Chariot Auto Sales. The inspection report was incredibly comprehensive and when I visited to see the car, everything matched exactly what was documented. Their staff were knowledgeable and helped negotiate a fair price. The international shipping process was handled seamlessly. I would absolutely recommend Chariot Auto Sales to anyone looking for quality vehicles worldwide.",
    date: "28 Feb, 2025",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
  },
  {
    name: "David Chen",
    location: "Toronto, Canada",
    title: "Excellent customer experience!",
    content:
      "What impressed me most about Chariot Auto Sales was their detailed inspection report. It was far more comprehensive than anything a local mechanic could provide. They connected me with the seller, facilitated our meeting at their center, and helped with negotiations. I got my Mercedes C-Class at a competitive price, and after six months of driving, I haven't encountered a single issue. Their after-sales support has been outstanding as well.",
    date: "12 Jan, 2025",
    avatar: "/avatars/david.jpg",
    rating: 4,
  },
  {
    name: "Robert Johnson",
    location: "Chicago, USA",
    title: "Top-notch vehicle selection and service",
    content:
      "After my local dealerships disappointed me with their limited inventory, I found exactly what I was looking for at Chariot Auto Sales. Their online platform made browsing easy, and their team was incredibly responsive to my questions. The Jeep Wrangler I purchased was in immaculate condition and priced fairly. The paperwork was handled efficiently, and they even helped arrange delivery to my home in Chicago.",
    date: "5 Feb, 2025",
    avatar: "/avatars/robert.jpg",
    rating: 5,
  },
  {
    name: "Emily Wilson",
    location: "Manchester, UK",
    title: "Seamless purchase from start to finish",
    content:
      "As someone who dreads car shopping, Chariot Auto Sales made the experience surprisingly pleasant. Their no-pressure approach and transparent pricing were refreshing. They found me a certified pre-owned Volvo XC60 that met all my requirements and arranged for delivery to Manchester without any hassle. Their attention to detail in the inspection report gave me complete peace of mind with my purchase.",
    date: "20 Jan, 2025",
    avatar: "/avatars/emily.jpg",
    rating: 5,
  },
  {
    name: "Jennifer Adams",
    location: "Boston, USA",
    title: "Exceptional value and customer service",
    content:
      "Chariot Auto Sales helped me find a certified pre-owned Audi A4 that was significantly below market value. Their inspection process is incredibly thorough, identifying even minor issues that were addressed before delivery. The sales team was knowledgeable without being pushy, and they handled all the paperwork efficiently. I've already recommended them to several friends looking for quality vehicles.",
    date: "7 Dec, 2024",
    avatar: "/avatars/jennifer.jpg",
    rating: 5,
  },
  {
    name: "William Taylor",
    location: "Edinburgh, UK",
    title: "Trustworthy and professional service",
    content:
      "I was initially hesitant about purchasing a vehicle from a dealer I hadn't visited in person, but Chariot Auto Sales quickly earned my trust. Their video walkaround of the Range Rover I was interested in was comprehensive, and they were completely transparent about its history and condition. The import process to Scotland was handled seamlessly, and the vehicle arrived exactly as described. I couldn't be happier with my experience.",
    date: "15 Nov, 2024",
    avatar: "/avatars/william.jpg",
    rating: 5,
  },
  {
    name: "Jessica Martinez",
    location: "Vancouver, Canada",
    title: "Found my perfect car at a great price",
    content:
      "Chariot Auto Sales helped me find a Honda CR-V with all the features I wanted at a price well below what local dealerships were offering. Their team was patient as I compared different options, and they provided detailed information about each vehicle's history and condition. The purchase process was straightforward, and they handled all the paperwork efficiently. The vehicle has performed flawlessly since I received it.",
    date: "3 Oct, 2024",
    avatar: "/avatars/jessica.jpg",
    rating: 5,
  },
  {
    name: "Andrew Wilson",
    location: "Seattle, USA",
    title: "Remarkable attention to detail",
    content:
      "As someone who knows cars well, I was impressed by Chariot Auto Sales' technical knowledge and thorough inspection process. They provided comprehensive reports on the BMW M3 I was interested in, including compression tests and detailed diagnostics. They were honest about a minor issue with the suspension and had it fixed before delivery. Their transparency and expertise made the entire process smooth and reassuring.",
    date: "18 Sep, 2024",
    avatar: "/avatars/andrew.jpg",
    rating: 5,
  },
  {
    name: "Elizabeth Brown",
    location: "Bristol, UK",
    title: "Excellent service from start to finish",
    content:
      "Chariot Auto Sales made importing a vehicle to the UK incredibly straightforward. They handled all the complex paperwork and ensured the Mazda CX-5 I purchased met all UK regulations. Their communication was excellent throughout the process, and they were always available to answer my questions despite the time difference. The car arrived in perfect condition and exactly as described in their detailed report.",
    date: "25 Aug, 2024",
    avatar: "/avatars/elizabeth.jpg",
    rating: 5,
  },
  {
    name: "Ryan Campbell",
    location: "Ottawa, Canada",
    title: "Simplified the import process",
    content:
      "Importing a vehicle to Canada can be complicated, but Chariot Auto Sales made it straightforward. They were knowledgeable about Canadian regulations and handled all the necessary documentation. The Ford Explorer I purchased was thoroughly inspected and arrived in excellent condition. Their after-sales support has been exceptional, even helping me find a local service center for routine maintenance.",
    date: "10 Jul, 2024",
    avatar: "/avatars/ryan.jpg",
    rating: 5,
  },
  {
    name: "Olivia Parker",
    location: "Austin, USA",
    title: "Outstanding vehicle selection",
    content:
      "Chariot Auto Sales offered me access to vehicles I simply couldn't find locally. Their online platform was easy to navigate and allowed me to compare multiple options. When I had questions about specific features, their team provided detailed answers and even sent additional photos and videos. The Subaru Outback I purchased arrived in perfect condition and exactly as described. The entire experience was professional from start to finish.",
    date: "5 Jun, 2024",
    avatar: "/avatars/olivia.jpg",
    rating: 4,
  },
  {
    name: "Thomas Wright",
    location: "Birmingham, UK",
    title: "Hassle-free international purchase",
    content:
      "Chariot Auto Sales took all the stress out of buying a car from overseas. Their detailed inspection reports and transparent pricing gave me confidence in my purchase decision. They guided me through the entire import process, handling all the documentation and ensuring my Lexus RX met UK standards. Their customer service was exceptional, with prompt responses to all my queries despite the time difference.",
    date: "12 May, 2024",
    avatar: "/avatars/thomas.jpg",
    rating: 5,
  },
  {
    name: "Amanda Rodriguez",
    location: "Miami, USA",
    title: "Fantastic selection and service",
    content:
      "After searching local dealerships for months, I found my dream car through Chariot Auto Sales. Their inventory was impressive and their online platform made it easy to find exactly what I wanted. The Audi Q7 I purchased was meticulously inspected and in better condition than advertised. Their team was professional throughout the process and handled all the paperwork efficiently. I couldn't be happier with my experience.",
    date: "28 Apr, 2024",
    avatar: "/avatars/amanda.jpg",
    rating: 5,
  },
  {
    name: "James Harrison",
    location: "Montreal, Canada",
    title: "Exceeded all expectations",
    content:
      "Chariot Auto Sales provided an exceptional car buying experience from start to finish. Their inspection process is incredibly thorough, and they were completely transparent about the vehicle's history and condition. They handled all the import paperwork for my Volkswagen GTI and even arranged for winter tires to be installed before delivery. Their attention to detail and customer service is unmatched in the industry.",
    date: "15 Apr, 2024",
    avatar: "/avatars/james.jpg",
    rating: 5,
  },
  {
    name: "Katherine Lewis",
    location: "Glasgow, UK",
    title: "Professional and reliable service",
    content:
      "I was nervous about purchasing a vehicle from abroad, but Chariot Auto Sales made the process incredibly smooth. Their detailed inspection report of the Mercedes GLC I was interested in covered everything, giving me complete confidence in my purchase. They handled all the shipping and import documentation flawlessly, and the car arrived in perfect condition. I've already recommended them to several friends.",
    date: "2 Apr, 2024",
    avatar: "/avatars/katherine.jpg",
    rating: 5,
  },
  {
    name: "Daniel Morgan",
    location: "Philadelphia, USA",
    title: "Transparent and trustworthy",
    content:
      "What sets Chariot Auto Sales apart is their transparency and honesty. When the initial inspection of my chosen vehicle revealed some minor issues, they immediately informed me and offered solutions. They repaired everything before shipping and provided detailed documentation of the work done. The Toyota 4Runner arrived in excellent condition, and their follow-up service has been equally impressive.",
    date: "20 Mar, 2024",
    avatar: "/avatars/daniel.jpg",
    rating: 5,
  },
  {
    name: "Sophia Clark",
    location: "Calgary, Canada",
    title: "Excellent value and service",
    content:
      "Chariot Auto Sales helped me find a vehicle that would have cost thousands more at local dealerships. Their inspection process gave me confidence in the purchase, and they handled all the complex import paperwork. The Subaru Forester I bought has been perfect for Canadian winters, and they even helped me find a local mechanic for regular maintenance. I couldn't be more satisfied with my experience.",
    date: "5 Mar, 2024",
    avatar: "/avatars/sophia.jpg",
    rating: 5,
  },
  {
    name: "Christopher Allen",
    location: "Cardiff, UK",
    title: "Smooth international purchase",
    content:
      "Chariot Auto Sales made buying a car from overseas remarkably easy. Their knowledge of UK import regulations was impressive, and they handled all the paperwork flawlessly. The BMW X3 I purchased was exactly as described in their comprehensive inspection report. Their communication throughout the process was excellent, and they were always available to answer my questions. I would definitely use their services again.",
    date: "18 Feb, 2024",
    avatar: "/avatars/christopher.jpg",
    rating: 5,
  },
  {
    name: "Rachel ",
    location: "Denver, USA",
    title: "Exceptional customer service",
    content:
      "The team at Chariot Auto Sales went above and beyond to help me find the perfect vehicle. They listened to my requirements and suggested several options that matched my needs. The inspection report for the Jeep Grand Cherokee I selected was incredibly detailed, noting even minor issues that were addressed before shipping. The vehicle arrived on time and in perfect condition. Their service was truly exceptional.",
    date: "5 Feb, 2024",
    avatar: "/avatars/rachel.jpg",
    rating: 5,
  },
  {
    name: "Matthew Wilson",
    location: "Toronto, Canada",
    title: "Professional from start to finish",
    content:
      "Chariot Auto Sales provided a level of professionalism I haven't experienced with other dealerships. Their inspection process is thorough and transparent, giving me complete confidence in my purchase. They handled all the import documentation for my Audi Q5 and kept me updated throughout the shipping process. The vehicle arrived exactly as described, and their after-sales support has been excellent.",
    date: "22 Jan, 2024",
    avatar: "/avatars/matthew.jpg",
    rating: 5,
  },
  {
    name: "Victoria Edwards",
    location: "Liverpool, UK",
    title: "Outstanding vehicle quality and service",
    content:
      "I was hesitant about buying a car without seeing it in person, but Chariot Auto Sales provided such detailed information and videos that I felt completely confident. The Range Rover Sport I purchased was in immaculate condition, exactly as described. They handled all the import requirements efficiently, and their communication throughout was excellent. I would definitely recommend their services to anyone looking for quality vehicles.",
    date: "10 Jan, 2024",
    avatar: "/avatars/victoria.jpg",
    rating: 5,
  },
  {
    name: "Benjamin Carter",
    location: "San Francisco, USA",
    title: "Impressive attention to detail",
    content:
      "As someone who's particular about cars, I appreciated Chariot Auto Sales' meticulous inspection process. They documented every aspect of the Porsche Macan I was interested in, from mechanical condition to cosmetic details. They were upfront about a small scratch on the door and had it repaired before delivery. The car arrived in perfect condition, and the entire experience was smooth and professional.",
    date: "28 Dec, 2023",
    avatar: "/avatars/benjamin.jpg",
    rating: 5,
  },
  {
    name: "Natalie Scott",
    location: "Edmonton, Canada",
    title: "Simplified the import process",
    content:
      "Chariot Auto Sales made importing a vehicle to Canada incredibly straightforward. Their knowledge of Canadian regulations saved me from potential headaches, and they handled all the necessary paperwork. The Honda Pilot I purchased was thoroughly inspected and arrived in excellent condition. Their customer service was outstanding throughout the process, and I've already recommended them to several colleagues.",
    date: "15 Dec, 2023",
    avatar: "/avatars/natalie.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  // Testimonial carousel state
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-600 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What our clients say
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-6"></div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white border border-gray-200 shadow-lg p-8 md:p-10 max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">
                          {testimonial.name}
                        </h4>
                        <div className="text-gray-500 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {testimonial.location}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < testimonial.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-md font-bold mb-4 text-gray-900">
                      {testimonial.title}
                    </h3>

                    <div className="relative mb-8">
                      <div className="absolute -top-4 -left-4 text-6xl text-blue-200 opacity-50">
                        "
                      </div>
                      <p className="text-gray-600 text-sm relative z-10 pl-6">
                        {testimonial.content}
                      </p>
                      <div className="absolute -bottom-8 -right-4 text-6xl text-blue-200 opacity-50 transform rotate-180">
                        "
                      </div>
                    </div>

                    <div className="text-gray-500 text-sm">
                      {testimonial.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 md:-translate-x-0 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-blue-600 focus:outline-none z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 md:translate-x-0 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:text-blue-600 focus:outline-none z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  activeSlide === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
