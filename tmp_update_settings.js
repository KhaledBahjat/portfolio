import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateSettings() {
  // First get existing social links to merge
  const { data, error: fetchError } = await supabase
    .from('settings')
    .select('social_links')
    .eq('id', 'main')
    .single();

  if (fetchError) {
    console.error('Error fetching settings:', fetchError);
    return;
  }

  const updatedSocialLinks = {
    ...data.social_links,
    location: 'Qena Egypt',
    phone: '+201143481912'
  };

  const { error: updateError } = await supabase
    .from('settings')
    .update({ social_links: updatedSocialLinks })
    .eq('id', 'main');

  if (updateError) {
    console.error('Error updating settings:', updateError);
    return;
  }

  console.log('Successfully updated contact information in Supabase');
}

updateSettings();
