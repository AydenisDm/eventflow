"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Camera, Save, KeyRound, Loader2 } from "lucide-react";
import { updateUserProfile, updateUserPassword } from "@/lib/actions";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email] = useState(session?.user?.email ?? "");
  const [isSavingProfile, startSaveProfile] = useTransition();
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSavingPassword, startSavePassword] = useTransition();
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  function handleSaveProfile() {
    const userId = session?.user?.id;
    if (!userId) return;
    startSaveProfile(async () => {
      await updateUserProfile(userId, { name });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    });
  }

  function handleUpdatePassword() {
    const userId = session?.user?.id;
    if (!userId) return;
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordError("");
    startSavePassword(async () => {
      await updateUserPassword(userId, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2000);
    });
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">My Profile</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your personal account information
        </p>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-semibold text-white">
              {name.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 text-black hover:bg-zinc-200 transition">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="text-white font-medium">{name}</p>
            <p className="text-sm text-zinc-400">{email}</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-60"
          >
            {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {profileSaved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Security
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
          {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
          <button
            onClick={handleUpdatePassword}
            disabled={isSavingPassword}
            className="rounded-lg border border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60"
          >
            {isSavingPassword ? "Updating..." : passwordSaved ? "Password Updated!" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
