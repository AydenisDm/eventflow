"use client";

import { useState, useTransition } from "react";
import { Search, ShieldCheck, Shield, User as UserIcon } from "lucide-react";
import { updateUserRole } from "@/lib/actions";

type Role = "SUPER_ADMIN" | "ADMINISTRATOR" | "REGISTRATION_STAFF" | "CHECKIN_STAFF" | "FINANCE";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

const roleStyles: Record<Role, string> = {
  SUPER_ADMIN: "bg-purple-500/10 text-purple-400",
  ADMINISTRATOR: "bg-blue-500/10 text-blue-400",
  REGISTRATION_STAFF: "bg-emerald-500/10 text-emerald-400",
  CHECKIN_STAFF: "bg-cyan-500/10 text-cyan-400",
  FINANCE: "bg-amber-500/10 text-amber-400",
};

const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMINISTRATOR: "Administrator",
  REGISTRATION_STAFF: "Registration Staff",
  CHECKIN_STAFF: "Check-in Staff",
  FINANCE: "Finance",
};

const allRoles: Role[] = ["SUPER_ADMIN", "ADMINISTRATOR", "REGISTRATION_STAFF", "CHECKIN_STAFF", "FINANCE"];

export function UsersClient({ users: initialUsers }: { users: AppUser[] }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [isPending, startTransition] = useTransition();

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, role: Role) => {
    startTransition(async () => {
      await updateUserRole(userId, role as any);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    });
  };

  const adminCount = users.filter((u) => u.role === "ADMINISTRATOR" || u.role === "SUPER_ADMIN").length;
  const staffCount = users.filter((u) => u.role === "REGISTRATION_STAFF" || u.role === "CHECKIN_STAFF").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users & Roles</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage team members and access permissions
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <ShieldCheck className="h-4 w-4" /> Admins
          </div>
          <p className="text-2xl font-semibold text-white mt-2">{adminCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Shield className="h-4 w-4" /> Staff
          </div>
          <p className="text-2xl font-semibold text-white mt-2">{staffCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <UserIcon className="h-4 w-4" /> Total Users
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
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Change Role</th>
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
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400">{u.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={u.role}
                    disabled={isPending}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                    className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  >
                    {allRoles.map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
