"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, ShieldCheck, Shield, User } from "lucide-react";

type Role = "Super Admin" | "Admin" | "Organizer" | "Viewer";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  lastActive: string;
}

const mockUsers: AppUser[] = [
  { id: "1", name: "Ayden Dimitrov", email: "ayden@eventflow.io", role: "Super Admin", status: "active", lastActive: "Just now" },
  { id: "2", name: "Elena Petrova", email: "elena@eventflow.io", role: "Admin", status: "active", lastActive: "2 hours ago" },
  { id: "3", name: "Ivan Dimitrov", email: "ivan@eventflow.io", role: "Organizer", status: "active", lastActive: "1 day ago" },
  { id: "4", name: "Maria Georgieva", email: "maria@eventflow.io", role: "Organizer", status: "invited", lastActive: "—" },
  { id: "5", name: "Stoyan Kolev", email: "stoyan@eventflow.io", role: "Viewer", status: "suspended", lastActive: "3 weeks ago" },
];

const roleStyles: Record<Role, string> = {
  "Super Admin": "bg-purple-500/10 text-purple-400",
  Admin: "bg-blue-500/10 text-blue-400",
  Organizer: "bg-emerald-500/10 text-emerald-400",
  Viewer: "bg-zinc-500/10 text-zinc-400",
};

const statusStyles: Record<AppUser["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  invited: "bg-amber-500/10 text-amber-400",
  suspended: "bg-red-500/10 text-red-400",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [users] = useState<AppUser[]>(mockUsers);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users & Roles</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage team members and access permissions
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition">
          <Plus className="h-4 w-4" />
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <ShieldCheck className="h-4 w-4" /> Admins
          </div>
          <p className="text-2xl font-semibold text-white mt-2">
            {users.filter((u) => u.role === "Admin" || u.role === "Super Admin").length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Shield className="h-4 w-4" /> Organizers
          </div>
          <p className="text-2xl font-semibold text-white mt-2">
            {users.filter((u) => u.role === "Organizer").length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <User className="h-4 w-4" /> Total Users
          </div>
          <p className="text-2xl font-semibold text-white mt-2">{users.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400 border-b border-zinc-800">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/70 transition">
                <td className="px-4 py-3">
                  <div className="text-white">{u.name}</div>
                  <div className="text-zinc-500 text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${roleStyles[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${statusStyles[u.status]}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400">{u.lastActive}</td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-lg p-1.5 hover:bg-zinc-800 transition text-zinc-400">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
