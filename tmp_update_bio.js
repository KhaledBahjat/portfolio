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

async function updateBio() {
  const newSubtitle = "Designing and building high-performance mobile applications.";
  const newBio = "I am a Computer Science student with a solid foundation in C++, Object-Oriented Programming (OOP), Data Structures, and MySQL. I have a strong interest in mobile app development and am currently focused on mastering Flutter to build high-performance, cross-platform mobile applications";

  const { error } = await supabase
    .from('settings')
    .update({ 
      title: 'Fresh Flutter Dev',
      bio: newBio 
    })
    .eq('id', 'main');

  if (error) {
    console.error('Error updating bio settings:', error);
    return;
  }

  console.log('Successfully updated bio and title in Supabase');
}

updateBio();
