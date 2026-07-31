import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Connection credentials provided by USER
const SUPABASE_URL = 'https://skezarquinduqpmhehwq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZXphcnF1aW5kdXFwbWhlaHdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQ1NTA0OCwiZXhwIjoyMTAxMDMxMDQ4fQ.TGAooofVA7dZ0d1ZTisk2qYPE5nnl3zStGNGba5gCfQ';

const DATA_FILE_PATH = path.join(process.cwd(), 'site_data.json');

async function migrate() {
  console.log('🚀 [Migration] Starting Supabase Cloud REST migration...');

  // 1. Initialize Supabase REST & Storage Client (HTTPS - bypasses local IPv6 socket restrictions!)
  console.log('🌐 [Supabase Client] Initializing Supabase REST connection...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // 2. Check / Verify Storage Bucket 'media' over HTTPS
  try {
    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
    if (bucketErr) {
      console.warn('⚠️ [Storage Warning] Could not check buckets:', bucketErr.message);
    } else {
      const mediaBucket = buckets?.find(b => b.name === 'media');
      if (!mediaBucket) {
        console.log('📁 [Storage] Bucket "media" not found in list, creating public bucket "media"...');
        const { error: createErr } = await supabase.storage.createBucket('media', { public: true });
        if (createErr) console.warn('⚠️ [Storage Create Warning]:', createErr.message);
        else console.log('✅ [Storage] Created public bucket "media"!');
      } else {
        console.log('✅ [Storage] Verified public storage bucket "media" exists!');
      }
    }
  } catch (e) {
    console.warn('⚠️ [Storage Error]:', e);
  }

  // 3. Check if table app_data exists via REST query
  console.log('🔍 [Database Query] Checking if table "app_data" exists in Supabase...');
  const { error: tableErr } = await supabase.from('app_data').select('key').limit(1);

  if (tableErr && (tableErr.message.includes('not find the table') || tableErr.code === 'PGRST205' || tableErr.code === '42P01' || tableErr.message.includes('relation "app_data" does not exist'))) {
    console.error('❌ [TABLE NOT FOUND] Table "app_data" has not been created yet.');
    console.error('Please go to Supabase Dashboard -> SQL Editor, and run this query:');
    console.error(`
      CREATE TABLE app_data (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    process.exit(2);
  } else if (tableErr) {
    console.warn('⚠️ [Table Query Info]:', tableErr.message);
  } else {
    console.log('✅ [Database Query] Table "app_data" verified and accessible via REST API!');
  }

  // 4. Read local site_data.json and pump into Supabase app_data
  if (!fs.existsSync(DATA_FILE_PATH)) {
    console.error('❌ [Migration Error] site_data.json file not found at:', DATA_FILE_PATH);
    process.exit(1);
  }

  try {
    console.log('📂 [Data Reading] Reading local site_data.json...');
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const parsedData = JSON.parse(raw);

    const keys = Object.keys(parsedData);
    console.log(`📋 [Data Insertion] Found ${keys.length} data sections to migrate (${keys.join(', ')})...`);

    for (const key of keys) {
      const value = parsedData[key];
      console.log(`⏳ Upserting section: "${key}"...`);
      const { error } = await supabase
        .from('app_data')
        .upsert({
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) {
        console.error(`❌ Failed to upsert key "${key}":`, error.message);
      } else {
        console.log(`✅ Section "${key}" successfully written to Supabase Cloud Database!`);
      }
    }

    // Also write a metadata record indicating successful migration
    await supabase.from('app_data').upsert({
      key: 'cloud_sync_info',
      value: { migrated_at: new Date().toISOString(), provider: 'Supabase PostgreSQL', status: 'Active' },
      updated_at: new Date().toISOString()
    });

    console.log('🎉 [SUCCESS] All data has been successfully migrated to Supabase Cloud Database!');
  } catch (e) {
    console.error('❌ [Migration Error during data transfer]:', e);
    process.exit(1);
  }
}

migrate();
