import { getUsers } from "@/lib/actions";
import { UsersClient } from "./users-client";

export default async function UsersPage() {
  const records = await getUsers();
  const users = records.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  return <UsersClient users={users} />;
}
