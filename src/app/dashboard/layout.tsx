import type { CSSProperties, ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";
import { createClient } from "@/lib/server";

const dashboardShellStyle = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as CSSProperties;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fire-and-forget: this RPC used to `await` here on EVERY dashboard
  // navigation, adding a Supabase round-trip (~100–300ms) to every route
  // change and making the whole app feel like it stalls between clicks. It's
  // just an activity heartbeat — nothing on this page reads from it — so run
  // it in the background and let the render proceed. `.catch` prevents an
  // unhandled promise rejection if the RPC fails.
  void supabase.rpc("touch_user_activity").then(({ error: touchError }) => {
    if (touchError) {
      console.warn("[dashboard] touch_user_activity failed:", touchError.message);
    }
  });

  const displayName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    user.email ||
    "User";
  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;

  return (
    <DashboardShell
      shellStyle={dashboardShellStyle}
      currentUser={{
        avatarUrl,
        email: user.email ?? "",
        name: displayName,
      }}
    >
      {children}
    </DashboardShell>
  );
}
