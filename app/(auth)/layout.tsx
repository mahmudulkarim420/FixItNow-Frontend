import { redirect } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { getSessionUser } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/auth-constants";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (user) {
    redirect(ROLE_HOME[user.role]);
  }

  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}

