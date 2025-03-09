import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/database";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const db = createClient<Database>(supabaseUrl, supabaseKey);
