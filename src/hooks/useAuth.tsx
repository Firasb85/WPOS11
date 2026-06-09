import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import {
  type AppRole,
  type PermissionCode,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from "@/lib/rbac";

/** @deprecated Use AppRole from @/lib/rbac instead */
export type Role = AppRole;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole;
  permissions: PermissionCode[];
  isLoading: boolean;
  signOut: () => Promise<void>;
  /** Check if the current user has a specific permission */
  can: (permission: PermissionCode) => boolean;
  /** Check if the current user has ALL specified permissions */
  canAll: (permissions: PermissionCode[]) => boolean;
  /** Check if the current user has ANY of the specified permissions */
  canAny: (permissions: PermissionCode[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole>("USER");
  const [permissions, setPermissions] = useState<PermissionCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        setSession(s);
        setUser(s?.user ?? null);
        extractRbac(s?.user);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      extractRbac(s?.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const extractRbac = (authUser: User | undefined | null) => {
    if (!authUser) {
      setRole("USER");
      setPermissions([]);
      return;
    }
    // SECURITY: Only trust app_metadata.role (server-controlled).
    // user_metadata is user-editable and MUST NOT be used for authorization.
    const userRole = (authUser.app_metadata?.role || "USER") as AppRole;
    setRole(userRole);

    // Assign permissions from centralized RBAC config
    const rolePerms = ROLE_PERMISSIONS[userRole] ?? ROLE_PERMISSIONS.USER;
    setPermissions([...rolePerms]);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const can = (permission: PermissionCode) => hasPermission(role, permission);
  const canAll = (perms: PermissionCode[]) => hasAllPermissions(role, perms);
  const canAny = (perms: PermissionCode[]) => hasAnyPermission(role, perms);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        permissions,
        isLoading,
        signOut,
        can,
        canAll,
        canAny,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Ensure your app tree is wrapped.",
    );
  }
  return context;
}
