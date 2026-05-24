"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, EyeOff } from "lucide-react";

export default function CreateClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    projectName: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: "", email: "", phone: "", password: "", projectName: "" });
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-3 border border-[#C5A258] text-[#C5A258] text-xs tracking-wider uppercase font-semibold hover:bg-[#C5A258] hover:text-white transition-all"
      >
        <Plus size={14} /> New Client & Project
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#C5A258]/30 p-6 mb-6">
      <h3 className="font-[family-name:var(--font-display)] text-lg mb-4">Create New Client</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#8A8279] font-semibold mb-1.5">
            Client Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#8A8279] font-semibold mb-1.5">
            Email (Login)
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
            placeholder="client@email.com"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#8A8279] font-semibold mb-1.5">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
            placeholder="+971 50 000 0000"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#8A8279] font-semibold mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258] pr-10"
              placeholder="Client login password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8279]"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs tracking-wider uppercase text-[#8A8279] font-semibold mb-1.5">
            Project Name
          </label>
          <input
            required
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            className="w-full px-3 py-2.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
            placeholder="Villa Al Barsha — Interior Design"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-[#C5A258] text-white text-xs tracking-wider uppercase font-semibold hover:bg-[#A68A3E] transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Client & Project"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2.5 border border-[#C8BFB2] text-[#8A8279] text-xs tracking-wider uppercase font-semibold hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
