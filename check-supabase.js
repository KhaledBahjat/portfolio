const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function diagnostic() {
  console.log('🚀 Starting Supabase Diagnostic (v2)...');
  console.log('URL:', supabaseUrl);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Missing URL or Key in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('\n--- Testing Database (projects table) ---');
    const { data: dbData, error: dbError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (dbError) {
      console.error('❌ Database Error:', dbError.message);
      if (dbError.message.includes('schema cache')) {
        console.log('👉 Hint: The table might have been dropped or the Supabase API needs a refresh. Try running the SQL script again.');
      }
    } else {
      console.log('✅ Database reachable. Found', dbData.length, 'projects.');
    }

    console.log('\n--- Testing Storage ---');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('❌ Storage Error:', storageError.message);
    } else {
      const portfolioBucket = buckets.find(b => b.name === 'portfolio');
      if (portfolioBucket) {
        console.log('✅ Storage bucket "portfolio" found!');
        console.log('   Public:', portfolioBucket.public ? 'Yes' : 'No');
      } else {
        console.log('❌ Bucket "portfolio" not found in list.');
        console.log('   Available buckets:', buckets.map(b => b.name).join(', ') || 'None');
      }
    }

    console.log('\n--- Final Test: App Services ---');
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'main')
      .single();
    
    if (settingsError) {
      console.error('❌ Settings Error:', settingsError.message);
    } else {
      console.log('✅ Settings data found for:', settings.developer_name);
    }

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
  }

  console.log('\n--- End of Diagnostic ---');
}

diagnostic();
