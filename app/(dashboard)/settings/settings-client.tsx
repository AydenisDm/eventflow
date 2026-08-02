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
    setOrgError("");
    startTransition(async () => {
      try {
        if (!organization) return;
        await updateOrganization(organization.id, { name: orgName, colorHex });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setOrgError(err instanceof Error ? err.message : "Failed to update organization");
      }
    });
  }

  function handleSaveProfile() {
    startTransition(async () => {
      try {
        if (!currentUser) return;
        await updateUserProfile(currentUser.id, { name: currentUser.name });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error(err);
      }
    });
  }

  function toggleNotif(key: string) {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="flex gap-2 border-b mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "organization" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand color</label>
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="h-10 w-20 border rounded"
            />
          </div>
          {orgError && <p className="text-red-600 text-sm">{orgError}</p>}
          <button
            onClick={handleSaveOrganization}
            disabled={isPending}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-3">
          {Object.keys(notifPrefs).map((key) => (
            <label key={key} className="flex items-center justify-between border rounded px-4 py-3">
              <span>{key}</span>
              <input
                type="checkbox"
                checked={notifPrefs[key]}
                onChange={() => toggleNotif(key)}
              />
            </label>
          ))}
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-4">
          <p className="text-gray-600">Manage your subscription and payment methods.</p>
          <button className="bg-gray-800 text-white px-4 py-2 rounded">Manage billing</button>
        </div>
      )}

      {activeTab === "appearance" && (
        <div className="space-y-4">
          <p className="text-gray-600">Theme preferences coming soon.</p>
        </div>
      )}
    </div>
  );
}
