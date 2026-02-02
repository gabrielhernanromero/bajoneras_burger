import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dqbclseihofrzfagxfev.supabase.co',
  'sb_publishable_TeyoyzRFDTMARtqhZW_bpA_TOan6Ik7'
);

async function checkCombos() {
  console.log('📦 Verificando combos en Supabase...\n');
  
  const { data, error } = await supabase
    .from('Productos')
    .select('*')
    .eq('categoria', 'Combos');
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Encontrados ${data.length} combos:\n`);
  data.forEach((p, index) => {
    console.log(`${index + 1}. ID (number): ${p.id}`);
    console.log(`   ID (string): ${p.id_producto || 'N/A'}`);
    console.log(`   Nombre: ${p.nombre}`);
    console.log(`   Precio: $${p.precio}`);
    console.log('');
  });
}

checkCombos();
