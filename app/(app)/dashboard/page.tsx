import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mb-6">Connecté en tant que {user?.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Applications", value: "—" },
          { label: "Membres", value: "—" },
          { label: "Société", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
