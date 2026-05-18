import { NextResponse } from "next/server";
import { sendActivityEmail } from "@/lib/email";

type ContactPayload = {
  type: "contact";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  subscribe?: boolean;
};

type VehicleInquiryPayload = {
  type: "vehicle-inquiry";
  carId: string;
  vehicleTitle: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  message: string;
  preferredContact: string;
  requestFinancing?: boolean;
};

type SellListingPayload = {
  type: "sell-listing";
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  transmission: string;
  fuelType?: string;
  color?: string;
  price: string;
  description?: string;
  location?: string;
  name: string;
  email: string;
  phone: string;
};

type EmailPayload =
  | ContactPayload
  | VehicleInquiryPayload
  | SellListingPayload;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EmailPayload;

    if (!body?.type) {
      return NextResponse.json({ error: "Missing email type" }, { status: 400 });
    }

    switch (body.type) {
      case "contact": {
        if (
          !isNonEmptyString(body.firstName) ||
          !isNonEmptyString(body.lastName) ||
          !isNonEmptyString(body.email) ||
          !isNonEmptyString(body.inquiryType) ||
          !isNonEmptyString(body.message)
        ) {
          return NextResponse.json(
            { error: "Please fill in all required fields" },
            { status: 400 }
          );
        }
        if (!isValidEmail(body.email)) {
          return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 }
          );
        }

        const name = `${body.firstName.trim()} ${body.lastName.trim()}`;
        const subject = `Contact: ${body.inquiryType} — ${name}`;
        const text = [
          `Name: ${name}`,
          `Email: ${body.email}`,
          body.phone ? `Phone: ${body.phone}` : null,
          `Topic: ${body.inquiryType}`,
          `Preferred reply: ${body.preferredContact}`,
          body.subscribe ? "Newsletter: Yes" : null,
          "",
          body.message,
        ]
          .filter(Boolean)
          .join("\n");

        await sendActivityEmail({
          activity: "contact",
          subject,
          text,
          replyTo: body.email.trim(),
          htmlLines: [
            { label: "Name", value: name },
            { label: "Email", value: body.email },
            { label: "Topic", value: body.inquiryType },
            ...(body.phone ? [{ label: "Phone", value: body.phone }] : []),
          ],
        });
        break;
      }

      case "vehicle-inquiry": {
        if (
          !isNonEmptyString(body.name) ||
          !isNonEmptyString(body.email) ||
          !isNonEmptyString(body.phone) ||
          !isNonEmptyString(body.message) ||
          !isNonEmptyString(body.vehicleTitle)
        ) {
          return NextResponse.json(
            { error: "Please fill in all required fields" },
            { status: 400 }
          );
        }
        if (!isValidEmail(body.email)) {
          return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 }
          );
        }

        const subject = `Vehicle inquiry: ${body.vehicleTitle}${body.carId ? ` (ID: ${body.carId})` : ""}`;
        const text = [
          `Vehicle: ${body.vehicleTitle}`,
          body.carId ? `Listing ID: ${body.carId}` : null,
          `Name: ${body.name}`,
          `Email: ${body.email}`,
          `Phone: ${body.phone}`,
          body.address ? `Address: ${body.address}` : null,
          `Preferred contact: ${body.preferredContact}`,
          body.requestFinancing ? "Financing info requested: Yes" : null,
          "",
          body.message,
        ]
          .filter(Boolean)
          .join("\n");

        await sendActivityEmail({
          activity: "vehicle-inquiry",
          subject,
          text,
          replyTo: body.email.trim(),
          htmlLines: [
            { label: "Vehicle", value: body.vehicleTitle },
            { label: "Name", value: body.name },
            { label: "Email", value: body.email },
            { label: "Phone", value: body.phone },
          ],
        });
        break;
      }

      case "sell-listing": {
        if (
          !isNonEmptyString(body.make) ||
          !isNonEmptyString(body.model) ||
          !isNonEmptyString(body.year) ||
          !isNonEmptyString(body.name) ||
          !isNonEmptyString(body.email) ||
          !isNonEmptyString(body.phone)
        ) {
          return NextResponse.json(
            { error: "Please fill in all required fields" },
            { status: 400 }
          );
        }
        if (!isValidEmail(body.email)) {
          return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 }
          );
        }

        const vehicle = `${body.year} ${body.make} ${body.model}`;
        const subject = `Sell my car: ${vehicle}`;
        const text = [
          `Vehicle: ${vehicle}`,
          body.mileage ? `Mileage: ${body.mileage}` : null,
          body.condition ? `Condition: ${body.condition}` : null,
          body.transmission ? `Transmission: ${body.transmission}` : null,
          body.fuelType ? `Fuel: ${body.fuelType}` : null,
          body.color ? `Color: ${body.color}` : null,
          body.price ? `Asking price: ${body.price}` : null,
          body.location ? `Location: ${body.location}` : null,
          "",
          `Seller: ${body.name}`,
          `Email: ${body.email}`,
          `Phone: ${body.phone}`,
          "",
          body.description || "(No description provided)",
        ]
          .filter(Boolean)
          .join("\n");

        await sendActivityEmail({
          activity: "sell-listing",
          subject,
          text,
          replyTo: body.email.trim(),
          htmlLines: [
            { label: "Vehicle", value: vehicle },
            { label: "Seller", value: body.name },
            { label: "Email", value: body.email },
            { label: "Phone", value: body.phone },
          ],
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unknown email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Email send error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send message";
    const isConfig = message.includes("SMTP is not configured");
    return NextResponse.json(
      {
        error: isConfig
          ? "Email is not configured on the server. Add SMTP settings to .env.local."
          : "Unable to send your message. Please try again or call us directly.",
      },
      { status: isConfig ? 503 : 500 }
    );
  }
}
