import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

type AdminUserLean = {
  username: string;
  passwordHash: string;
  role: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await AdminUser.findOne({ username }).lean<AdminUserLean | null>();

    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      username: user.username,
      role: user.role,
    });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "Unable to sign in. Try again later." },
      { status: 500 }
    );
  }
}
