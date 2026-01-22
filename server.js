import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Configurar CORS
app.use(cors());
app.use(express.json());

// Crear carpetas si no existen
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configurar multer para almacenar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || 'combos';
    const uploadPath = path.join(__dirname, 'public', category);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Limpiar el nombre del archivo
    const cleanName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.-]/g, '');
    
    // Agregar timestamp para evitar duplicados
    const timestamp = Date.now();
    const ext = path.extname(cleanName);
    const name = path.basename(cleanName, ext);
    cb(null, `${name}-${timestamp}${ext}`);
  }
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP, GIF)'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

// Rutas para productos (persistencia de datos)
const PRODUCTS_PATH = path.join(__dirname, 'products.json');

// Cargar productos desde products.json
app.get('/api/products', (req, res) => {
  try {
    if (fs.existsSync(PRODUCTS_PATH)) {
      const data = fs.readFileSync(PRODUCTS_PATH, 'utf-8');
      const products = JSON.parse(data);
      res.json(products);
    } else {
      // Si no existe el archivo, retornar array vacío
      res.json([]);
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).json({ error: 'Error al cargar productos' });
  }
});

// Guardar productos en products.json
app.post('/api/products/save', express.json({ limit: '50mb' }), (req, res) => {
  try {
    const products = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Los datos deben ser un array de productos' });
    }

    // Escribir en products.json
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
    
    console.log(`✅ ${products.length} productos guardados en products.json`);
    res.json({
      success: true,
      message: 'Productos guardados exitosamente',
      count: products.length
    });
  } catch (error) {
    console.error('Error al guardar productos:', error);
    res.status(500).json({ error: 'Error al guardar productos' });
  }
});

// Endpoint para subir imágenes
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const category = req.body.category || 'combos';
    const imageUrl = `/${category}/${req.file.filename}`;

    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      category: category,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB.' });
    }
  }
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de subida de imágenes corriendo en http://localhost:${PORT}`);
  console.log(`📁 Las imágenes se guardarán en la carpeta 'public/'`);
});
