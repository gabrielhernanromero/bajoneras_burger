import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dqbclseihofrzfagxfev.supabase.co',
  'sb_publishable_TeyoyzRFDTMARtqhZW_bpA_TOan6Ik7'
);

async function addColumn() {
  console.log('📦 Agregando columna "hamburguesas_a_elegir" a la tabla Productos...\n');
  
  // Primero verificar si la columna ya existe
  const { data: existingData, error: selectError } = await supabase
    .from('Productos')
    .select('hamburguesas_a_elegir')
    .limit(1);
  
  if (!selectError) {
    console.log('✅ La columna "hamburguesas_a_elegir" ya existe en la tabla.\n');
  } else if (selectError.code === '42703') {
    console.log('⚠️ La columna no existe. Necesitas agregarla manualmente en Supabase.\n');
    console.log('📋 Instrucciones:');
    console.log('1. Ve a https://supabase.com/dashboard/project/dqbclseihofrzfagxfev/editor');
    console.log('2. Selecciona la tabla "Productos"');
    console.log('3. Click en "Add Column"');
    console.log('4. Nombre: hamburguesas_a_elegir');
    console.log('5. Type: int4 (integer)');
    console.log('6. Default value: null');
    console.log('7. Allow nullable: ✅ Yes');
    console.log('8. Click "Save"\n');
  } else {
    console.log('❌ Error verificando columna:', selectError);
  }
  
  // Ahora actualizar los combos existentes
  console.log('📝 Configurando combos existentes...\n');
  
  try {
    // BURGER X2 (ID: 18) -> 2 hamburguesas
    const { error: error1 } = await supabase
      .from('Productos')
      .update({ hamburguesas_a_elegir: 2 })
      .eq('id', 18);
    
    if (error1) {
      console.log('⚠️ No se pudo actualizar BURGER X2:', error1.message);
    } else {
      console.log('✅ BURGER X2 configurado para 2 hamburguesas');
    }
    
    // PROMO PARA COMPARTIR (ID: 1) -> 2 hamburguesas
    const { error: error2 } = await supabase
      .from('Productos')
      .update({ hamburguesas_a_elegir: 2 })
      .eq('id', 1);
    
    if (error2) {
      console.log('⚠️ No se pudo actualizar PROMO PARA COMPARTIR:', error2.message);
    } else {
      console.log('✅ PROMO PARA COMPARTIR configurado para 2 hamburguesas');
    }
    
    console.log('\n✨ Proceso completado!\n');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

addColumn();
