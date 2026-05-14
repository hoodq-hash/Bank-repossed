"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean; username?: string };

      if (!res.ok) {
        setError(data.error || "Invalid username or password");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.username || username);

      toast.success("Signed in successfully.");
      router.push("/dashboard");
    } catch {
      setError("Unable to reach the server. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea] text-stone-900 antialiased">
      <header className="border-b border-stone-300 bg-[#f4f1ea] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <Link
            href="/"
            className="relative block h-12 w-[200px] shrink-0 outline-none ring-emerald-600/0 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea]"
            aria-label="Bank Repossessed Cars home"
          >
            <Image
              src="/bklogo.png"
              alt="Bank Repossessed Cars"
              fill
              className="object-contain object-left"
              sizes="200px"
              priority
            />
          </Link>
        </div>
      </header>

      <div className="flex flex-grow flex-col justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-md border border-stone-300 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-stone-500">
              Staff
            </p>
            <h1 className="mt-2 text-2xl font-bold text-stone-900">
              Dashboard login
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Sign in to manage listings and inventory.
            </p>
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-stone-800"
              >
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={18}
                />
                <Input
                  id="username"
                  type="text"
                  placeholder="Your admin username"
                  className="rounded-none border-stone-300 pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-stone-800"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="rounded-none border-stone-300 pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-none border border-stone-300 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-stone-500">
            <Link href="/" className="font-semibold text-stone-800 underline underline-offset-4 hover:text-emerald-800">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
