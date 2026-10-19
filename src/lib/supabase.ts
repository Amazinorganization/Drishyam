import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vcylpvrufbwlmhphfngg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_fg2z7JnDBglx6Pptty2mrA_23nzrsNI';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);