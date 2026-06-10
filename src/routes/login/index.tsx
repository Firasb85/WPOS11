import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME, APP_NAME_FULL } from "@/lib/constants";
import { clientEnv } from "@/config/env";
import {
  Eye, EyeOff, LogIn, AlertCircle, Shield, Users, BarChart3,
  Loader2, CheckCircle, Zap, Globe, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/login/")({ component: LoginPage });

/* ── Role-based redirect map ─────────────────────────── */
const ROLE_HOME: Record<string, string> = {
  ADMIN: "/dashboard/ceo",
  CEO: "/dashboard/ceo",
  MANAGER: "/dashboard/department",
  USER: "/dashboard/ceo",
};

/* ── Test accounts ───────────────────────────────────── */
const TEST_ACCOUNTS = [
  { label: "Admin", role: "ADMIN", email: "admin@wpos.com", pw: "Password123!", color: "from-red-500 to-rose-600", icon: <Shield className="w-4 h-4" /> },
  { label: "CEO", role: "CEO", email: "ceo@wpos.com", pw: "Password123!", color: "from-purple-500 to-indigo-600", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Manager", role: "MANAGER", email: "manager@wpos.com", pw: "Password123!", color: "from-blue-500 to-cyan-600", icon: <Users className="w-4 h-4" /> },
];

function LoginPage() {
  const navigate = useNavigate();
  const { user, role, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const addDebug = (msg: string) => {
    const ts = new Date().toLocaleTimeString();
    setDebugLog((p) => [...p.slice(-9), `[${ts}] ${msg}`]);
    console.log(`[WPOS Auth] ${msg}`);
  };

  /* Redirect if already logged in — route by role */
  useEffect(() => {
    if (!authLoading && user) {
      const target = ROLE_HOME[role] || "/dashboard/ceo";
      addDebug(`Authenticated as ${role} → redirecting to ${target}`);
      navigate({ to: target, replace: true });
    }
  }, [user, authLoading, role, navigate]);

  const signIn = async (nextEmail: string, nextPassword: string, isQuick = false) => {
    setError(null);
    setLoading(true);
    if (isQuick) setQuickLoading(nextEmail);
    addDebug(`Attempting sign-in: ${nextEmail}`);
    addDebug(`Project: ${clientEnv.VITE_SUPABASE_PROJECT_ID}`);
    addDebug(`URL: ${clientEnv.VITE_SUPABASE_URL}`);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: nextEmail.trim(),
        password: nextPassword,
      });

      if (authError) {
        const projectId = clientEnv.VITE_SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");
        const detail = `${authError.message} | Status: ${authError.status ?? "?"} | Code: ${(authError as any).code ?? "?"} | Project: ${projectId}`;
        addDebug(`❌ Auth error: ${detail}`);
        setError(detail);
        return;
      }

      if (!data.session) {
        addDebug("⚠️ No session returned");
        setError("Sign-in succeeded but no session was created.");
        return;
      }

      const userRole = data.user?.app_metadata?.role ?? "USER";
      addDebug(`✅ Signed in as ${data.user?.email} (${userRole})`);
      addDebug(`Session token: ${data.session.access_token.substring(0, 20)}…`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addDebug(`💥 Exception: ${msg}`);
      setError(`Unexpected error: ${msg}`);
    } finally {
      setLoading(false);
      setQuickLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#0a1628]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200 text-sm">Loading WPOS…</p>
        </div>
      </div>
    );
  }

  const projectId = clientEnv.VITE_SUPABASE_PROJECT_ID || "unknown";
  const isCorrectProject = projectId === "nsbmrtohkdttsufxwzdi";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#0a1628]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-800 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-800 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
              <p className="text-blue-300 text-xs">{APP_NAME_FULL}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Workforce Performance<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Operating System
            </span>
          </h2>
          <p className="text-blue-200/80 text-lg max-w-md">
            Detect gaps · Collect evidence · Diagnose root causes · Intervene effectively · Track outcomes
          </p>
          <div className="flex gap-6">
            {[
              { n: "93", l: "Routes" },
              { n: "36", l: "Tables" },
              { n: "4", l: "Roles" },
              { n: "6", l: "KPIs" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs text-blue-300/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-blue-400/50 text-xs">
          <Globe className="w-3 h-3" />
          <span>Enterprise-grade · RBAC · RLS · Bilingual AR/EN</span>
        </div>
      </div>

      {/* Right panel — sign-in */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
            <h1 className="text-xl font-bold text-white">{APP_NAME}</h1>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to your workspace</p>

            {error && (
              <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400 break-all font-mono">{error}</p>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@wpos.com" required autoComplete="email" className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all" />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" minLength={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/5 text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm pr-10 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-all shadow-md">
                {loading && !quickLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Sign In
              </button>
            </form>

            {/* Quick login */}
            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3 h-3 text-blue-600" />
                <p className="text-xs text-gray-500 font-medium">One-click Demo Login</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TEST_ACCOUNTS.map((acc) => {
                  const isThisLoading = quickLoading === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={loading}
                      onClick={() => signIn(acc.email, acc.pw, true)}
                      className={`relative group flex flex-col items-center gap-1 py-3 px-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center shadow-lg`}>
                        {isThisLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : acc.icon}
                      </div>
                      <span className="text-xs font-medium text-gray-800 dark:text-white">{acc.label}</span>
                      <span className="text-[10px] text-gray-400">{acc.role}</span>
                      {isThisLoading && (
                        <div className="absolute inset-0 rounded-xl border-2 border-blue-500 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Debug log (collapsible) */}
            {debugLog.length > 0 && (
              <details className="mt-4">
                <summary className="text-[10px] text-gray-400 cursor-pointer hover:text-blue-300/50">Auth Debug Log ({debugLog.length})</summary>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-32 overflow-y-auto">
                  {debugLog.map((log, i) => (
                    <p key={i} className="text-[10px] text-gray-500 dark:text-gray-400 font-mono leading-relaxed">{log}</p>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 mt-6 text-[11px] text-gray-400">
            <span>WPOS v1.0</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              {isCorrectProject ? <CheckCircle className="w-3 h-3 text-green-500" /> : <AlertCircle className="w-3 h-3 text-blue-600/60" />}
              {projectId.substring(0, 8)}…
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
