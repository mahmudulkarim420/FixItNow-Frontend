import { NavbarClient } from "@/components/shared/navbar-client";
import { getSessionUser } from "@/lib/auth";

/**
 * Server Component navbar.
 *
 * Reads the session on the server (via httpOnly cookies) and passes the user
 * (or null) down to the interactive client component, which conditionally
 * renders either the auth buttons (guest) or the profile dropdown (signed in).
 */
export default async function Navbar() {
  const user = await getSessionUser();
  return <NavbarClient user={user} />;
}
