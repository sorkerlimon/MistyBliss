import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vdoabvrhapptxvdkymlp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jH9XPLPz-q3jOIQLBxXPlA_6PBprcsf';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runCheck() {
  console.log('Testing Supabase connection to:', SUPABASE_URL);

  const tables = ['products', 'orders', 'promo_codes', 'newsletter_subscribers'];

  for (const table of tables) {
    try {
      const { data, error, status, statusText } = await supabase.from(table).select('*').limit(2);
      if (error) {
        console.log(`❌ Table '${table}':`, error.message, `(Code: ${error.code}, Status: ${status})`);
      } else {
        console.log(`✅ Table '${table}': found ${data ? data.length : 0} rows. Sample:`, data);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' exception:`, err);
    }
  }

  // Also test inserting a dummy record if table exists
  console.log('\nTesting insert into newsletter_subscribers with dummy email...');
  const testEmail = `test_${Date.now()}@example.com`;
  const { data: insertData, error: insertError } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email: testEmail, source: 'migration-check' }])
    .select();

  if (insertError) {
    console.log('❌ Insert test error:', insertError.message, `(Code: ${insertError.code})`);
  } else {
    console.log('✅ Insert test succeeded! Created row:', insertData);
  }
}

runCheck().catch(console.error);
