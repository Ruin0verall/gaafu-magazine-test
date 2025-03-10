import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/database";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create the main client with anon key
export const db = createClient<Database>(supabaseUrl, supabaseKey);

// Create an admin client with service role key if available
export const adminDb = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null;

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await db.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Helper function to check if we're authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await db.auth.getSession();
  return !!session;
};
