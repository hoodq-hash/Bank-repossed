import { NextResponse } from "next/server";
import { getSitePhone, updateSitePhone } from "@/lib/site-settings";

export async function GET() {
  try {
    const phone = await getSitePhone();
    return NextResponse.json({ phone });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const phoneInput =
      typeof body.phone === "string" ? body.phone : body.phoneDisplay;

    if (typeof phoneInput !== "string" || !phoneInput.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const phone = await updateSitePhone(phoneInput);
    return NextResponse.json({ phone });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update phone number";
    const status = message.includes("valid") ? 400 : 500;
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
