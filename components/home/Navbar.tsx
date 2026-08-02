import { NavbarClient } from "@/components/shared/navbar-client";
import { getSessionUser } from "@/lib/auth";
import type { User } from "@/types";

/**
 * Server Component navbar.
 *
 * Reads the session on the server (via httpOnly cookies) and passes the user
 * (or null) down to the interactive client component, which conditionally
 * renders either the auth buttons (guest) or the profile dropdown (signed in).
 */
interface NavbarProps {
  user?: User | null;
}

export default async function Navbar({ user: suppliedUser }: NavbarProps = {}) {
  const user = suppliedUser === undefined ? await getSessionUser() : suppliedUser;
  return <NavbarClient user={user} />;
}
