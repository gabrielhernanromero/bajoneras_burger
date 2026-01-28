import React, { useState } from 'react';
import { X, Edit2, Save, Trash2, Plus, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Product } from './types';
import { supabaseService } from './supabaseClient';

interface AdminPanelProps {
  products: Product[];
  onClose: () => void;
  onSave: (products: Product[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onClose, onSave }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedProducts, setEditedProducts] = useState<Product[]>(products);
  const [showPassword, setShowPassword] = useState(false);
  const [showJsonCode, setShowJsonCode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Obtener categorías únicas de los productos
  const categories = ['Todos', ...Array.from(new Set(editedProducts.map(p => p.category)))];

  const ADMIN_PASSWORD = 'burger2024'; // Cambiar esta contraseña

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
      setPassword('');
    }
  };

  const compressImage = (file: File, maxSizeMB: number = 1): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar si es muy grande (máximo 1920px de ancho)
          const maxWidth = 1920;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprimir con calidad reducida
          let quality = 0.8;
          
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Error al comprimir la imagen'));
                  return;
                }
                
                const compressedSize = blob.size / (1024 * 1024);
                
                // Si aún es muy grande, reducir más la calidad
                if (compressedSize > maxSizeMB && quality > 0.1) {
                  quality -= 0.1;
                  tryCompress();
                } else {
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });
                  resolve(compressedFile);
                }
              },
              'image/jpeg',
              quality
            );
          };
          
          tryCompress();
        };
        img.onerror = () => reject(new Error('Error al cargar la imagen'));
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
    });
  };

  const handleImageFile = async (file: File, index: number) => {
    try {
      const originalSizeMB = file.size / (1024 * 1024);
      
      let fileToUpload = file;
      
      // Si la imagen es muy grande, comprimirla automáticamente
      if (originalSizeMB > 1) {
        alert(`⏳ Comprimiendo imagen (${originalSizeMB.toFixed(2)}MB)...\n\nEspera un momento...`);
        
        try {
          fileToUpload = await compressImage(file, 1);
          const compressedSizeMB = fileToUpload.size / (1024 * 1024);
          console.log(`Imagen comprimida: ${originalSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB`);
        } catch (compressError) {
          console.error('Error al comprimir:', compressError);
          alert('⚠️ No se pudo comprimir automáticamente. Se intentará subir la imagen original.');
        }
      }
      
      // Subir imagen a Supabase Storage
      alert('📤 Subiendo imagen a Supabase...');
      const imageUrl = await supabaseService.uploadImage(fileToUpload);
      
      if (!imageUrl) {
        alert('❌ Error al subir la imagen a Supabase.\n\nVerifica que el bucket "product-images" existe y es público.');
        return;
      }
      
      // Actualizar la URL de la imagen en el producto
      const updated = [...editedProducts];
      updated[index] = { ...updated[index], image: imageUrl };
      setEditedProducts(updated);
      
      const finalSizeMB = fileToUpload.size / (1024 * 1024);
      alert(`✅ Imagen subida exitosamente!\n\nTamaño: ${finalSizeMB.toFixed(2)}MB\nURL: ${imageUrl.substring(0, 50)}...`);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('❌ Error al procesar la imagen:\n\n' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageFile(file, index);
      } else {
        alert('Por favor selecciona una imagen');
      }
    }
  };

  const handleEditProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...editedProducts];
    if (field === 'price') {
      updated[index] = { ...updated[index], [field]: parseInt(value) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEditedProducts(updated);
  };

  const handleDeleteProduct = (index: number) => {
    if (confirm('¿Eliminar este producto?')) {
      setEditedProducts(editedProducts.filter((_, i) => i !== index));
    }
  };

  const handleAddProduct = () => {
    const category = selectedCategory === 'Todos' ? (categories.length > 1 ? categories[1] : 'General') : selectedCategory;
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: 'Nuevo Producto',
      description: 'Descripción del producto',
      price: 0,
      image: '/placeholder.jpg',
      category: category
    };
    setEditedProducts([...editedProducts, newProduct]);
    setEditingIndex(editedProducts.length);
    setSelectedCategory(category);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('⚠️ Por favor ingresa un nombre para la sección');
      return;
    }
    
    if (categories.includes(newCategoryName)) {
      alert('⚠️ Ya existe una sección con ese nombre');
      return;
    }

    setSelectedCategory(newCategoryName);
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    alert(`✅ Sección "${newCategoryName}" creada.\n\nAhora puedes agregar productos a esta sección.`);
  };

  const handleDeleteCategory = (category: string) => {
    const productsInCategory = editedProducts.filter(p => p.category === category);
    
    if (productsInCategory.length > 0) {
      const confirmDelete = confirm(
        `⚠️ La sección "${category}" tiene ${productsInCategory.length} producto(s).\n\n` +
        `¿Deseas eliminar la sección y todos sus productos?`
      );
      
      if (!confirmDelete) return;
      
      setEditedProducts(editedProducts.filter(p => p.category !== category));
      setSelectedCategory('Todos');
    }
    
    alert(`✅ Sección "${category}" eliminada`);
  };

  const generateJsonCode = () => {
    return `export const PRODUCTS: Product[] = ${JSON.stringify(editedProducts, null, 2)};`;
  };

  const handleSave = () => {
    onSave(editedProducts);
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todos los productos a los valores originales? Se perderán todos los cambios guardados.')) {
      localStorage.removeItem('bajoneras_products');
      window.location.reload();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
        <div className="bg-neutral-900 rounded-2xl p-8 max-w-md w-full border-2 border-yellow-400">
          <h2 className="font-bebas text-4xl text-yellow-400 mb-6 tracking-widest">PANEL ADMIN</h2>
          <p className="text-neutral-400 mb-4">Ingresa la contraseña para acceder</p>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Contraseña"
                className="w-full bg-neutral-800 border-2 border-yellow-400 rounded-lg px-4 py-3 text-white font-bold text-lg focus:outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-yellow-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 bg-yellow-400 text-black py-3 rounded-lg font-black text-lg hover:bg-white transition"
              >
                ENTRAR
              </button>
              <button
                onClick={onClose}
                className="bg-neutral-800 text-yellow-400 py-3 px-6 rounded-lg font-black hover:bg-neutral-700 transition"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bebas text-5xl text-yellow-400 tracking-widest">GESTOR DE PRODUCTOS</h1>
          <button
            onClick={onClose}
            className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition"
          >
            <Plus size={20} /> AGREGAR PRODUCTO
          </button>
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700 transition"
          >
            <Plus size={20} /> AGREGAR SECCIÓN
          </button>
          <button
            onClick={() => setShowJsonCode(!showJsonCode)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {showJsonCode ? 'OCULTAR CÓDIGO' : 'VER CÓDIGO JSON'}
          </button>
          <button
            onClick={handleSave}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-black flex items-center gap-2 hover:bg-white transition"
          >
            <Save size={20} /> GUARDAR CAMBIOS
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition"
          >
            <RotateCcw size={20} /> RESETEAR A ORIGINAL
          </button>
        </div>

        {/* Modal para agregar categoría */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddCategoryModal(false)}></div>
            <div className="relative bg-neutral-900 rounded-2xl p-8 max-w-md w-full border-2 border-purple-400">
              <h2 className="font-bebas text-3xl text-purple-400 mb-4 tracking-widest">NUEVA SECCIÓN</h2>
              <p className="text-neutral-400 mb-6 text-sm">
                Crea una nueva sección para organizar tus productos
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-bold block mb-2">NOMBRE DE LA SECCIÓN</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    placeholder="Ej: Bebidas, Postres, Promos..."
                    className="w-full bg-neutral-800 border-2 border-purple-400 rounded-lg px-4 py-3 text-white font-bold text-lg focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 bg-purple-400 text-black py-3 rounded-lg font-black text-lg hover:bg-purple-300 transition"
                  >
                    CREAR SECCIÓN
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setNewCategoryName('');
                    }}
                    className="bg-neutral-800 text-purple-400 py-3 px-6 rounded-lg font-black hover:bg-neutral-700 transition"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Código JSON */}
        {showJsonCode && (
          <div className="bg-neutral-800 rounded-lg p-6 mb-6 border-2 border-blue-400">
            <div className="mb-4 bg-green-400/10 border border-green-400/30 rounded-lg p-4">
              <h4 className="text-green-400 font-bold text-sm mb-2">✅ SISTEMA DE SUBIDA AUTOMÁTICA ACTIVADO</h4>
              <p className="text-neutral-300 text-xs leading-relaxed mb-3">
                <strong>¡Ahora es súper fácil!</strong>
                <br/>
                1. Arrastra o selecciona una imagen desde tu PC
                <br/>
                2. La imagen se sube automáticamente a la carpeta correcta
                <br/>
                3. Haz click en "GUARDAR CAMBIOS"
                <br/>
                4. ¡Listo! La imagen queda guardada permanentemente
              </p>
              <p className="text-neutral-400 text-xs">
                <strong>Nota:</strong> Asegúrate de iniciar la app con <code className="bg-black/30 px-2 py-1 rounded">npm start</code> 
                para que el servidor de subida funcione.
              </p>
            </div>
            <h3 className="text-blue-400 font-bold mb-3 text-sm">CÓDIGO PARA data.ts (Backup Manual):</h3>
            <pre className="bg-black p-4 rounded text-xs text-green-400 overflow-x-auto border border-green-400">
              {generateJsonCode()}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateJsonCode());
                alert('Código copiado al portapapeles');
              }}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
            >
              COPIAR CÓDIGO
            </button>
          </div>
        )}

        {/* Filtro por categoría */}
        <div className="mb-6 flex gap-3 flex-wrap">
          {categories.map((category: string) => {
            const count = category === 'Todos' 
              ? editedProducts.length 
              : editedProducts.filter(p => p.category === category).length;
            
            return (
              <div key={category} className="relative group">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-bold transition relative ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'bg-neutral-700 text-white hover:bg-neutral-600'
                  }`}
                >
                  {category}
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category
                      ? 'bg-black text-yellow-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {count}
                  </span>
                </button>
                
                {/* Botón eliminar sección (solo si no es "Todos" y no tiene productos) */}
                {category !== 'Todos' && (
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className={`absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition ${
                      count > 0 ? 'hover:bg-red-700' : 'hover:bg-red-700'
                    }`}
                    title={count > 0 ? `Eliminar sección y ${count} producto(s)` : 'Eliminar sección'}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Productos organizados por categoría */}
        <div className="space-y-8">
          {categories.filter(c => c !== 'Todos').map((category) => {
            const productsInCategory = editedProducts.filter(p => 
              selectedCategory === 'Todos' ? p.category === category : p.category === selectedCategory
            );
            
            if (productsInCategory.length === 0 && selectedCategory !== 'Todos') return null;
            if (productsInCategory.length === 0 && selectedCategory === 'Todos') return null;
            
            return (
              <div key={category}>
                {selectedCategory === 'Todos' && (
                  <h2 className="font-bebas text-3xl text-yellow-400 mb-4 border-b-2 border-yellow-400 pb-2 flex items-center justify-between">
                    <span>{category}</span>
                    <span className="text-sm text-neutral-400 font-normal">
                      {productsInCategory.length} producto{productsInCategory.length !== 1 ? 's' : ''}
                    </span>
                  </h2>
                )}
                
                <div className="space-y-4">
                  {productsInCategory.map((product) => {
                    const index = editedProducts.findIndex(p => p.id === product.id);
                    return (
                      <div key={product.id} className="bg-neutral-800 border-2 border-yellow-400 rounded-lg p-6">
                        {editingIndex === index ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-yellow-400 font-bold block mb-2">NOMBRE</label>
                      <input
                        type="text"
                        value={editedProducts[index].name}
                        onChange={(e) => handleEditProduct(index, 'name', e.target.value)}
                        className="w-full bg-neutral-700 border border-yellow-400 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-yellow-400 font-bold block mb-2">PRECIO</label>
                      <input
                        type="number"
                        value={editedProducts[index].price}
                        onChange={(e) => handleEditProduct(index, 'price', e.target.value)}
                        className="w-full bg-neutral-700 border border-yellow-400 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-yellow-400 font-bold block mb-2">DESCRIPCIÓN</label>
                    <textarea
                      value={editedProducts[index].description}
                      onChange={(e) => handleEditProduct(index, 'description', e.target.value)}
                      className="w-full bg-neutral-700 border border-yellow-400 rounded px-3 py-2 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-yellow-400 font-bold block mb-2">IMAGEN</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition ${
                        dragActive
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-yellow-400/30 bg-neutral-700/30 hover:border-yellow-400/60'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageFile(e.target.files[0], index);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="pointer-events-none">
                        <p className="text-yellow-400 font-bold mb-2">Arrastra una imagen aquí o haz clic</p>
                        <p className="text-neutral-400 text-sm">PNG, JPG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                    
                    {/* Preview de imagen */}
                    {editedProducts[index].image && editedProducts[index].image.startsWith('data:') && (
                      <div className="mt-3">
                        <p className="text-neutral-400 text-xs mb-2">Preview:</p>
                        <img
                          src={editedProducts[index].image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded border border-yellow-400/30"
                        />
                      </div>
                    )}

                    {/* Input URL como alternativa */}
                    <div className="mt-3">
                      <p className="text-neutral-400 text-xs mb-1">O pega una URL:</p>
                      <input
                        type="text"
                        value={editedProducts[index].image.startsWith('data:') ? '' : editedProducts[index].image}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        onChange={(e) => handleEditProduct(index, 'image', e.target.value)}
                        className="w-full bg-neutral-600 border border-yellow-400/30 rounded px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="flex-1 bg-yellow-400 text-black py-2 rounded font-bold hover:bg-white"
                    >
                      LISTO
                    </button>
                  </div>
                </div>
                        ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl">{product.name}</h3>
                    <p className="text-neutral-400 text-sm mt-1">{product.description}</p>
                    <div className="flex gap-6 mt-3 text-sm">
                      <span className="text-white font-bold">Precio: ${product.price.toLocaleString()}</span>
                      <span className="text-neutral-400">Categoría: {product.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(index)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
