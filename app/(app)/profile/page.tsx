"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  locale: string;
  timezone: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, phone, locale, timezone")
        .eq("id", user.id)
        .single();

      const p: Profile = {
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        email: data?.email ?? user.email ?? "",
        phone: data?.phone ?? "",
        locale: data?.locale ?? "fr",
        timezone: data?.timezone ?? "Europe/Paris",
      };
      setProfile(p);
      setForm(p);
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        full_name: `${form.first_name} ${form.last_name}`.trim(),
        phone: form.phone || null,
        locale: form.locale,
        timezone: form.timezone,
      })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
    } else {
      setProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-xl">
        <div className="h-6 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-100 rounded w-56" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Mon profil</h1>
      <p className="text-sm text-gray-500 mb-6">Informations de votre compte</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            Profil mis à jour.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Jean" />
          <Field label="Nom" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Dupont" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-400">Non modifiable depuis cette page</p>
        </div>

        <Field label="Téléphone" name="phone" value={form.phone} onChange={handleChange} placeholder="+33 6 00 00 00 00" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
            <select
              name="locale"
              value={form.locale}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["fr", "en", "de", "it", "es", "nl"].map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label>
            <input
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, name, value, onChange, placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
