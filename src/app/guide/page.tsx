import { getSession } from "@/lib/session";
import GuideClient from "./GuideClient";

export default async function GuidePage() {
  const session = await getSession();
  return <GuideClient userEmail={session?.email ?? ""} />;
}
