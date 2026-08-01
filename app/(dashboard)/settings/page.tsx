"use client";

import { useState } from "react";
import { Building2, Bell, CreditCard, Palette, Save } from "lucide-react";

const tabs = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");

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
                  defaultValue="EventFlow Inc."
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@eventflow.io"
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
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
              <button className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-white mb-2">Notification Preferences</h2>
              {[
                "Email me when a new participant registers",
                "Email me when a payment fails",
                "Weekly summary reports",
                "Product updates and announcements",
              ].map((label) => (
                <label key={label} className="flex items-center justify-between rounded-lg border border-zinc-800 px-4 py-3">
                  <span className="text-sm text-zinc-300">{label}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-white" />
                </label>
              ))}
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-white mb-2">Billing Plan</h2>
              <div className="rounded-lg border border-zinc-800 p-4">
                <p className="text-white font-medium">Pro Plan</p>
                <p className="text-sm text-zinc-400 mt-1">$49/month · Renews on Apr 12, 2025</p>
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
