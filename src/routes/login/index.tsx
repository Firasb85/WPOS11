import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME, APP_NAME_FULL } from "@/lib/constants";
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Public self-registration disabled — accounts are admin-provisioned only.
  const mode = "login" as const;

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard/ceo", replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login")) {
          setError("Invalid email or password. Please try again.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please check your email and confirm your account before signing in.");
        } else {
          setError(authError.message);
        }
        return;
      }

      // Auth state change will be picked up by AuthProvider
      // and the useEffect above will redirect
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            role: "USER",
            first_name: email.split("@")[0],
            last_name: "",
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(authError.message);
        }
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccess("Account created! Check your email for a confirmation link, then sign in.");
        setMode("login");
      } else if (data.session) {
        // Auto-confirmed (email confirmations disabled in Supabase)
        setSuccess("Account created successfully! Redirecting...");
        // AuthProvider will pick up the session
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">WP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h1>
          <p className="text-sm text-gray-500 mt-1">{APP_NAME_FULL}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </h2>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleSignUp} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={6}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
            {mode === "login" ? (
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          WPOS v1.0.0 · Workforce Performance Operating System
        </p>
      </div>
    </div>
  );
}
