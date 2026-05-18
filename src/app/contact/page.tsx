"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

const HQ = {
  name: SITE.headquarters.label,
  addressLines: SITE.headquarters.addressLines,
  phoneDisplay: SITE.phone.display,
  phoneHref: SITE.phone.href,
  email: SITE.email,
  mapSearchUrl: SITE.headquarters.mapSearchUrl,
};

const inquiryTypes = [
  "Inventory question",
  "Financing",
  "Trade-in",
  "Test drive",
  "Transport / pickup",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
    preferredContact: "email",
    subscribe: false,
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  const [topicError, setTopicError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.inquiryType.trim()) {
      setTopicError("Please choose a topic.");
      return;
    }
    setTopicError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          ...formData,
        }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        setFormStatus({
          submitted: true,
          success: false,
          message: data.error || "Could not send your message. Please call us instead.",
        });
        return;
      }

      setFormStatus({
        submitted: true,
        success: true,
        message:
          "Thank you—your message was sent. We typically reply within one business day during open hours.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: "",
        preferredContact: "email",
        subscribe: false,
      });
    } catch {
      setFormStatus({
        submitted: true,
        success: false,
        message: "Network error. Please try again or contact us by phone.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea] text-stone-900 antialiased">
      <Navbar />

      <main className="flex-grow">
        <section className="border-b border-stone-300 bg-[#f4f1ea] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
              Contact
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              Call, email, or send a message
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
              Questions about repo inventory, paperwork, or financing? Reach us
              directly—we publish the same phone and email across the site.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={HQ.phoneHref}>
                <Button className="h-12 rounded-none border border-stone-300 bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-500">
                  <Phone size={16} className="mr-2" />
                  {HQ.phoneDisplay}
                </Button>
              </a>
              <a href={`mailto:${HQ.email}`}>
                <Button
                  variant="outline"
                  className="h-12 rounded-none border border-stone-300 bg-white px-6 font-bold text-stone-900 hover:bg-stone-900 hover:text-[#f4f1ea]"
                >
                  <Mail size={16} className="mr-2" />
                  Email
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  Headquarters
                </p>
                <h2 className="mt-3 text-2xl font-bold text-stone-900 md:text-3xl">
                  Visit or mail correspondence
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 md:text-base">
                  Our only office is in Houston, Texas—the same location shown
                  on listings and the footer. For the fastest answer on a
                  specific vehicle, include the stock title or link in your
                  message.
                </p>

                <div className="mt-8 space-y-6 border border-stone-300 bg-[#f4f1ea] p-6">
                  <div className="flex gap-3">
                    <MapPin
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        {HQ.name}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-stone-800">
                        {HQ.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                      <a
                        href={HQ.mapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800"
                      >
                        Open in Maps
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-stone-300 pt-6">
                    <Phone
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Phone
                      </p>
                      <a
                        href={HQ.phoneHref}
                        className="mt-1 inline-block font-mono text-sm font-semibold text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800"
                      >
                        {HQ.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-stone-300 pt-6">
                    <Mail
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Email
                      </p>
                      <a
                        href={`mailto:${HQ.email}`}
                        className="mt-1 break-all font-mono text-xs font-semibold text-stone-900 underline decoration-2 underline-offset-4 hover:text-emerald-800 sm:text-sm"
                      >
                        {HQ.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-stone-300 pt-6">
                    <Clock
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Business hours
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-stone-700">
                        <li>
                          <span className="font-semibold text-stone-900">
                            Mon–Fri:
                          </span>{" "}
                          8am–6pm
                        </li>
                        <li>
                          <span className="font-semibold text-stone-900">
                            Sat:
                          </span>{" "}
                          9am–4pm
                        </li>
                        <li>
                          <span className="font-semibold text-stone-900">
                            Sun:
                          </span>{" "}
                          Closed
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
                  Message
                </p>
                <h2 className="mt-3 text-2xl font-bold text-stone-900 md:text-3xl">
                  Send a note
                </h2>
                <p className="mt-3 text-sm text-stone-600 md:text-base">
                  Submit the form and our team will receive your message by email.
                  Include a listing link or stock details when asking about a
                  specific vehicle.
                </p>

                <div className="mt-8">
                  {formStatus?.submitted ? (
                    <div className="border border-stone-300 bg-[#f4f1ea] p-6">
                      <Alert className="border-0 bg-transparent p-0 shadow-none">
                        <div className="flex items-start gap-3">
                          {formStatus.success ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                          ) : (
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                          )}
                          <div>
                            <AlertTitle className="text-stone-900">
                              {formStatus.success
                                ? "Message sent"
                                : "Something went wrong"}
                            </AlertTitle>
                            <AlertDescription className="mt-1 text-stone-600">
                              {formStatus.message}
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                      <Button
                        type="button"
                        onClick={() => {
                          setFormStatus(null);
                          setTopicError(null);
                        }}
                        className="mt-6 rounded-none border border-stone-300 bg-stone-900 font-bold text-[#f4f1ea] hover:bg-stone-800"
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="border border-stone-300 bg-[#f4f1ea] p-6 md:p-8"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <Label htmlFor="firstName" className="text-stone-800">
                            First name <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-2 rounded-none border-stone-300 bg-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-stone-800">
                            Last name <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-2 rounded-none border-stone-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                          <Label htmlFor="email" className="text-stone-800">
                            Email <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-2 rounded-none border-stone-300 bg-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-stone-800">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-2 rounded-none border-stone-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label className="text-stone-800">
                          Topic <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={formData.inquiryType}
                          onValueChange={(value) => {
                            setTopicError(null);
                            handleSelectChange("inquiryType", value);
                          }}
                        >
                          <SelectTrigger className="mt-2 rounded-none border-stone-300 bg-white">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {topicError && (
                          <p className="mt-2 text-sm text-red-700">{topicError}</p>
                        )}
                      </div>

                      <div className="mt-6">
                        <Label htmlFor="message" className="text-stone-800">
                          Message <span className="text-red-600">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="mt-2 rounded-none border-stone-300 bg-white"
                        />
                      </div>

                      <div className="mt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          Preferred reply
                        </p>
                        <RadioGroup
                          value={formData.preferredContact}
                          onValueChange={(value) =>
                            handleRadioChange("preferredContact", value)
                          }
                          className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="email" id="c-email" />
                            <Label htmlFor="c-email" className="font-normal">
                              Email
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="phone" id="c-phone" />
                            <Label htmlFor="c-phone" className="font-normal">
                              Phone
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="either" id="c-either" />
                            <Label htmlFor="c-either" className="font-normal">
                              Either
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-6 flex items-start gap-2">
                        <Checkbox
                          id="subscribe"
                          checked={formData.subscribe}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("subscribe", checked === true)
                          }
                        />
                        <Label
                          htmlFor="subscribe"
                          className="text-sm font-normal leading-snug text-stone-600"
                        >
                          Email me occasional inventory highlights (optional).
                        </Label>
                      </div>

                      <div className="mt-8">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-none border border-stone-300 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
                        >
                          {isSubmitting ? "Sending…" : "Send message"}
                          <Send size={16} className="ml-2" />
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-[#f4f1ea] py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
              Other channels
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-900 md:text-3xl">
              Prefer chat or social?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-stone-600 md:text-base">
              The site chat widget appears on most pages during business hours.
              You can also reach us through the links in the footer.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="border border-stone-300 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center border border-stone-300 bg-[#f4f1ea]">
                  <MessageCircle className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">
                  On-site chat
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  Look for the chat control in the corner while you browse—same
                  team as phone and email.
                </p>
              </div>
              <div className="border border-stone-300 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center border border-stone-300 bg-[#f4f1ea]">
                  <Phone className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">
                  Urgent question
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  For time-sensitive units, calling is usually fastest.
                </p>
                <a
                  href={HQ.phoneHref}
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-stone-900 underline decoration-2 underline-offset-4"
                >
                  Call now
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-white py-14 md:py-16">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
              FAQ
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-900 md:text-3xl">
              Quick answers
            </h2>
            <div className="mt-8 space-y-4">
              <div className="border border-stone-300 bg-[#f4f1ea] p-5">
                <h3 className="font-bold text-stone-900">
                  What are your business hours?
                </h3>
                <p className="mt-2 text-sm text-stone-600 md:text-base">
                  Monday–Friday 8am–6pm, Saturday 9am–4pm. We are closed Sundays.
                  Times match the footer site-wide.
                </p>
              </div>
              <div className="border border-stone-300 bg-[#f4f1ea] p-5">
                <h3 className="font-bold text-stone-900">
                  How fast do you respond?
                </h3>
                <p className="mt-2 text-sm text-stone-600 md:text-base">
                  We aim for within one business day on email and voicemail. For
                  same-day help, call during open hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-stone-900 py-14 text-[#f4f1ea] md:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
                  Inventory
                </p>
                <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                  Ready to browse repo listings?
                </h2>
                <p className="mt-4 text-sm text-stone-300 md:text-base">
                  Filters, photos, and listing detail are built to save you time
                  before you call or visit.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/shop">
                    <Button className="rounded-none border border-stone-400 bg-emerald-600 px-8 font-bold text-white hover:bg-emerald-500">
                      Browse inventory
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      variant="outline"
                      className="rounded-none border border-stone-500 bg-transparent font-bold text-[#f4f1ea] hover:bg-[#f4f1ea] hover:text-stone-900"
                    >
                      About us
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative aspect-[16/10] border border-stone-600 bg-stone-800">
                <Image
                  src="/photo-1652992253402-15729d9b97fc.avif"
                  alt="Dealership lot"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
