import { NavbarClient } from "@/components/shared/navbar-client";
import type { User } from "@/types";

/**
 * Server Component navbar.
 *
 * Passes optional supplied user down to NavbarClient. When user is not supplied
 * (e.g. on static pages), NavbarClient resolves session client-side if a cookie exists.
 */
interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps = {}) {
  return <NavbarClient user={user} />;
}

