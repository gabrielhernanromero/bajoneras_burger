import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dqbclseihofrzfagxfev.supabase.co',
  'sb_publishable_TeyoyzRFDTMARtqhZW_bpA_TOan6Ik7'
);

async function addColumn() {
  console.log('📦 Agregando columna "allow_duplicate_burgers" a la tabla Productos...\n');
  
  // Primero verificar si la columna ya existe
  const { data: existingData, error: selectError } = await supabase
    .from('Productos')
    .select('allow_duplicate_burgers')
    .limit(1);
  
  if (!selectError) {
    console.log('✅ La columna "allow_duplicate_burgers" ya existe en la tabla.\n');
  } else if (selectError.code === '42703') {
    console.log('⚠️ La columna no existe. Necesitas agregarla manualmente en Supabase.\n');
    console.log('📋 Instrucciones:');
    console.log('1. Ve a https://supabase.com/dashboard/project/dqbclseihofrzfagxfev/editor');
    console.log('2. Selecciona la tabla "Productos"');
    console.log('3. Click en "Add Column"');
    console.log('4. Nombre: allow_duplicate_burgers');
    console.log('5. Type: bool (boolean)');
    console.log('6. Default value: true');
    console.log('7. Allow nullable: ✅ Yes');
    console.log('8. Click "Save"\n');
  } else {
    console.log('❌ Error verificando columna:', selectError);
  }
}

addColumn();
