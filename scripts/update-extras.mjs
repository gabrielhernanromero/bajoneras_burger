import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8').split(/\r?\n/);
for (const line of env) {
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  const key = line.slice(0, idx);
  const val = line.slice(idx + 1);
  process.env[key] = val;
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Faltan credenciales en .env');
  process.exit(1);
}

const supabase = createClient(url, key);

const extras = [
  { id: 'extra-medallon', name: 'Extra Medallón de Carne', price: 3000 },
  { id: 'extra-doble-cheddar', name: 'Extra de Doble Cheddar', price: 1500 },
  { id: 'extra-bacon', name: 'Extra de Bacon', price: 1500 },
  { id: 'extra-bacon-papas', name: 'Extra de Bacon en Papas', price: 2000 },
  { id: 'extra-cheddar-papas', name: 'Extra de Cheddar en Papas', price: 2000 },
  { id: 'extra-cheddar-bacon-papas', name: 'Extra de Cheddar y Bacon en Papas', price: 3000 }
];

const { data, error } = await supabase
  .from('Productos')
  .update({ extras })
  .eq('categoria', 'Burgers')
  .select('id,nombre,categoria');

if (error) {
  console.error('Error actualizando extras:', error);
  process.exit(1);
}

console.log(`Extras actualizados en productos: ${data?.length ?? 0}`);
