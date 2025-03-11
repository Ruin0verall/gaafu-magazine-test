import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", {
        hasSession: !!session,
        user: session?.user ?? null,
      });
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", {
        event: _event,
        hasSession: !!session,
        user: session?.user ?? null,
      });
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      console.log("Attempting sign in...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      console.log("Sign in successful:", {
        user: data.user,
        session: data.session,
      });
      return data;
    } catch (err: any) {
      console.error("Sign in error caught:", err);
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Sign out successful");
    } catch (err: any) {
      console.error("Sign out error:", err);
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
  };
}
