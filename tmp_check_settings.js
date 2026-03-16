import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'main')
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
    return;
  }

  console.log('Current Settings:', JSON.stringify(data, null, 2));
}

checkSettings();
