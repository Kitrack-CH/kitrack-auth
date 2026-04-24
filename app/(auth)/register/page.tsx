"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-[var(--color-kitrack-blue)] text-white font-bold text-lg shadow-sm">
            K
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              KITRACK
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              Créez votre compte
            </p>
          </div>
        </div>

        <div
          className="rounded-[var(--radius-card)] border p-6 space-y-4 shadow-[var(--shadow-card)]"
          style={{ background: "var(--surface-0)", borderColor: "var(--border-default)" }}
        >
          {error && (
            <div
              className="rounded-lg border px-4 py-3 text-sm"
              style={{
                background: "color-mix(in srgb, var(--color-kitrack-orangeDark) 8%, transparent)",
                borderColor: "var(--color-kitrack-orange)",
                color: "var(--color-kitrack-orangeDark)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                id="firstName"
                name="firstName"
                label="Prénom"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Jean"
                autoComplete="given-name"
              />
              <InputField
                id="lastName"
                name="lastName"
                label="Nom"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Dupont"
                autoComplete="family-name"
              />
            </div>

            <InputField
              id="email"
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              placeholder="jean@exemple.com"
              autoComplete="email"
            />

            <div>
              <InputField
                id="password"
                name="password"
                type="password"
                label="Mot de passe"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
              />
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                Minimum 8 caractères
              </p>
            </div>

            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-2">
              Créer mon compte
            </Button>
          </form>

          <p className="text-center text-sm pt-1" style={{ color: "var(--text-muted)" }}>
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium underline-offset-2 hover:underline"
              style={{ color: "var(--color-kitrack-blue)" }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  id, name, label, value, onChange, placeholder, type = "text", autoComplete, minLength,
}: {
  id: string; name: string; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; autoComplete?: string; minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm outline-none transition-all"
        style={{ background: "var(--surface-1)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-kitrack-blue)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
      />
    </div>
  );
}
