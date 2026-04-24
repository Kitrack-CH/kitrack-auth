import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">KITRACK</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Déconnexion
          </button>
        </form>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Tableau de bord</h2>
          <p className="text-sm text-gray-500 mb-6">Connecté en tant que {user.email}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Applications", value: "—" },
              { label: "Membres", value: "—" },
              { label: "Organisation", value: "—" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
