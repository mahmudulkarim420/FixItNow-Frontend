"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser, logoutUser } from "@/lib/api";
import type { User } from "@/types";
import { RootPreloader } from "@/components/auth/root-preloader";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setSessionUser: (user: User | null) => void;
  refreshSession: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let inFlightSessionPromise: Promise<User | null> | null = null;

export function AuthProvider({
  children,
  initialUser = undefined,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(initialUser === undefined);

  const setSessionUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    setIsLoading(false);
  }, []);

  const refreshSession = useCallback(async (): Promise<User | null> => {
    if (inFlightSessionPromise) {
      return inFlightSessionPromise;
    }

    inFlightSessionPromise = (async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
        return currentUser;
      } catch {
        setUser(null);
        setIsLoading(false);
        return null;
      } finally {
        inFlightSessionPromise = null;
      }
    })();

    return inFlightSessionPromise;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setUser(null);
    setIsLoading(false);
    try {
      await logoutUser();
    } catch {
      /* Swallow network/logout errors, user state is cleared */
    }
  }, []);

  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser);
      setIsLoading(false);
    } else {
      refreshSession();
    }
  }, [initialUser, refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setSessionUser,
        refreshSession,
        logout,
      }}
    >
      <RootPreloader />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
