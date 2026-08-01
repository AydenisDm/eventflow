import { getOrganization, getCurrentUserProfile } from "@/lib/actions";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const [organization, currentUser] = await Promise.all([
    getOrganization(),
    getCurrentUserProfile(),
  ]);

  return (
    <SettingsClient
      organization={
        organization
          ? {
              id: organization.id,
              name: organization.name,
              colorHex: organization.colorHex,
              logoUrl: organization.logoUrl,
            }
          : null
      }
      currentUser={
        currentUser
          ? { id: currentUser.id, name: currentUser.name, email: currentUser.email }
          : null
      }
    />
  );
}
