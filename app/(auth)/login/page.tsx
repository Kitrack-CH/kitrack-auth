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
      style={{ background: "var(--surface-1)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-[var(--color-kitrack-blue)] text-white font-bold text-lg shadow-sm">
            K
          </div>
          <div className="text-center">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              KITRACK
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              Connectez-vous à votre espace
            </p>
          </div>
        </div>

        <div
          className="rounded-[var(--radius-card)] border p-6 space-y-4 shadow-[var(--shadow-card)]"
          style={{
            background: "var(--surface-0)",
            borderColor: "var(--border-default)",
          }}
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
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@exemple.com"
                className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm outline-none transition-all"
                style={{
                  background: "var(--surface-1)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-kitrack-blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[var(--radius-card)] border px-3 py-2 text-sm outline-none transition-all"
                style={{
                  background: "var(--surface-1)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-kitrack-blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              />
            </div>

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
