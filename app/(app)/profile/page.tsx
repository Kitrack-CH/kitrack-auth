"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  locale: string;
  timezone: string;
};

const LOCALES = ["fr", "en", "de", "it", "es", "nl"];

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
      <div className="max-w-xl space-y-4">
        <div className="h-6 rounded-lg animate-pulse" style={{ background: "var(--surface-2)", width: "160px" }} />
        <div className="h-4 rounded animate-pulse" style={{ background: "var(--surface-2)", width: "220px" }} />
        <div className="h-64 rounded-[var(--radius-card)] animate-pulse" style={{ background: "var(--surface-1)" }} />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        Mon profil
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Informations de votre compte
      </p>

      <form
        onSubmit={handleSubmit}
        className="rounded-[var(--radius-card)] border p-6 space-y-5"
        style={{
          background: "var(--surface-1)",
          borderColor: "var(--border-default)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {error && (
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={{
              background: "color-mix(in srgb, var(--color-kitrack-orangeDark) 10%, transparent)",
              borderColor: "var(--color-kitrack-orange)",
              color: "var(--color-kitrack-orangeDark)",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={{
              background: "color-mix(in srgb, var(--color-kitrack-green) 10%, transparent)",
              borderColor: "var(--color-kitrack-green)",
              color: "var(--color-kitrack-greenDark)",
            }}
          >
            Profil mis à jour.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <ProfileField label="Prénom" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Jean" />
          <ProfileField label="Nom" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Dupont" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Email
          </label>
          <input
            type="email"
            value={form.email}
            disabled
            className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm cursor-not-allowed"
            style={{
              background: "var(--surface-2)",
              borderColor: "var(--border-default)",
              color: "var(--text-muted)",
              opacity: 0.7,
            }}
          />
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Non modifiable depuis cette page
          </p>
        </div>

        <ProfileField label="Téléphone" name="phone" value={form.phone} onChange={handleChange} placeholder="+33 6 00 00 00 00" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
              Langue
            </label>
            <select
              name="locale"
              value={form.locale}
              onChange={handleChange}
              className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm outline-none transition-colors"
              style={{ background: "var(--surface-2)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-kitrack-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
              Fuseau horaire
            </label>
            <input
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm outline-none transition-colors"
              style={{ background: "var(--surface-2)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-kitrack-blue)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
            />
          </div>
        </div>

        <div className="pt-1 flex items-center gap-3">
          <Button type="submit" variant="primary" size="md" loading={saving}>
            Enregistrer
          </Button>
          {saving && (
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Enregistrement…</span>
          )}
        </div>
      </form>
    </div>
  );
}

function ProfileField({
  label, name, value, onChange, placeholder,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm outline-none transition-colors"
        style={{ background: "var(--surface-2)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-kitrack-blue)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
      />
    </div>
  );
}
