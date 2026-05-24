"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2C2620] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23C5A258' stroke-width='0.5'/%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#C5A258] tracking-wider mb-2">
            EVA Interiors
          </h1>
          <p className="text-[#C8BFB2] text-sm tracking-widest uppercase">
            Client Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-[#C5A258]/20 p-8 backdrop-blur-sm">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[#FAF8F5] mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-[#A65B4A]/10 border border-[#A65B4A]/30 text-[#A65B4A] text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs tracking-widest uppercase text-[#C8BFB2] mb-2 font-semibold">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-[#C8BFB2]/20 text-[#FAF8F5] placeholder-[#8A8279] focus:outline-none focus:border-[#C5A258] transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs tracking-widest uppercase text-[#C8BFB2] mb-2 font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-[#C8BFB2]/20 text-[#FAF8F5] placeholder-[#8A8279] focus:outline-none focus:border-[#C5A258] transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-3.5 border border-[#C5A258] text-[#C5A258] text-sm tracking-widest uppercase font-semibold hover:bg-[#C5A258] hover:text-[#2C2620] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-[#8A8279] text-xs">
          Your login credentials were provided by your Relationship Manager.
        </p>
      </div>
    </div>
  );
}
