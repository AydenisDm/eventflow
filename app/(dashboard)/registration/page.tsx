import { getEventOptions } from "@/lib/actions";
import { RegistrationClient } from "./registration-client";

export default async function RegistrationPage() {
  const events = await getEventOptions();
  return <RegistrationClient events={events} />;
}
