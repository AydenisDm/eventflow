"use client";

import { useState, useTransition } from "react";
import { Building2, Bell, CreditCard, Palette, Save, Loader2 } from "lucide-react";
import {
  updateOrganizationValidated as updateOrganization,
  updateUserProfileValidated as updateUserProfile,
} from "@/lib/actions";

const tabs = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
];

interface SettingsClientProps {
  organization: { id: string; name: string; colorHex: string | null; logoUrl: string | null } | null;
  currentUser: { id: string; name: string; email: string } | null;
}

export default function SettingsClient({ organization, currentUser }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("organization");
  const [isPending, startTransition] = useTransition();
  const [orgName, setOrgName] = useState(organization?.name ?? "");
  const [colorHex, setColorHex] = useState(organization?.colorHex ?? "#6366f1");
  const [saved, setSaved] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    "New participant registers": true,
    "Payment fails": true,
    "Weekly summary reports": true,
    "Product updates and announcements": false,
  });

  const [orgError, setOrgError] = useState("");
    function handleSaveOrganization() {
    if (!organization) return;
    setOrgError("");
    startTransition(async () => {
      try {
        await updateOrganization(organization.id, { name: orgName, colorHex });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setOrgError(err instanceof Error ? err.message : "Failed to save changes.");
      }
    });
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your organization preferences and configuration
        </p>
      </div>
      <div className="flex gap-6">
        <div className="w-48 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          {activeTab === "organization" && (
            <div className="space-y-5">
              <h2 className="text-sm font-medium text-white">Organization Details</h2>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Brand Color</label>
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-10 w-20 rounded-lg bg-zinc-900 border border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Timezone</label>
                <select className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600">
                  <option>Europe/Sofia (GMT+2)</option>
                  <option>UTC</option>
                  <option>America/New_York (GMT-5)</option>
                </select>
              </div>
              {orgError && <p className="text-sm text-red-400">{orgError}</p>}
              <button
                onClick={handleSaveOrganization}
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-white mb-2">Notification Preferences</h2>
              {Object.keys(notifPrefs).map((label) => (
                <label key={label} className="flex items-center justify-between rounded-lg border border-zinc-800 px-4 py-3">
                  <span className="text-sm text-zinc-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs[label]}
                    onChange={() =>
                      setNotifPrefs((prev) => ({ ...prev, [label]: !prev[label] }))
                    }
                    className="h-4 w-4 accent-white"
                  />
                </label>
              ))}
            </div>
          )}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-white mb-2">Billing Plan</h2>
              <div className="rounded-lg border border-zinc-800 p-4">
                <p className="text-white font-medium">Pro Plan</p>
                <p className="text-sm text-zinc-400 mt-1">$49/month · Renews next billing cycle</p>
              </div>
              <button className="rounded-lg border border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-800 transition">
                Manage Subscription
              </button>
            </div>
          )}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-white mb-2">Theme</h2>
              <div className="flex gap-3">
                {["Dark", "Light", "System"].map((theme) => (
                  <button
                    key={theme}
                    className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
