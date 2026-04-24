"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

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
      style={{ background: "var(--surface-0)" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-[var(--color-kitrack-blue)] text-white font-bold text-lg shadow-sm">
            K
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              KITRACK
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              Connectez-vous à votre espace
            </p>
          </div>
        </div>

        <div
          className="rounded-[var(--radius-card)] border p-6 space-y-4"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthField
              id="email" type="email" label="Email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@exemple.com" autoComplete="email"
            />
            <AuthField
              id="password" type="password" label="Mot de passe"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password"
            />

            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-2">
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm pt-1" style={{ color: "var(--text-muted)" }}>
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium underline-offset-2 hover:underline"
              style={{ color: "var(--color-kitrack-blue)" }}
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthField({
  id, type = "text", label, value, onChange, placeholder, autoComplete,
}: {
  id: string; type?: string; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm outline-none transition-colors"
        style={{
          background: "var(--surface-2)",
          borderColor: "var(--border-default)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-kitrack-blue)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
      />
    </div>
  );
}
