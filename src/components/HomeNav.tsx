"use client";

import { useRouter } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";
import { Company } from "@/lib/db";

interface Props {
  userEmail: string;
  companies: Company[];
}

export default function HomeNav({ userEmail, companies }: Props) {
  const router = useRouter();
  return (
    <ProfileDropdown
      userEmail={userEmail}
      companies={companies}
      activeCompanyId={companies[0]?.id ?? ""}
      onSelectCompany={() => router.push("/guide")}
      onNewCompany={() => router.push("/guide")}
      onDeleteCompany={() => {}}
    />
  );
}
