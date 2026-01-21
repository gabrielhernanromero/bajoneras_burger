import React, { useState } from 'react';
import { X, Edit2, Save, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { Product } from './types';

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

  const handleImageFile = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleEditProduct(index, 'image', result);
    };
    reader.readAsDataURL(file);
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
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: 'Nuevo Producto',
      description: 'Descripción del producto',
      price: 0,
      image: '/placeholder.jpg',
      category: 'Burgers'
    };
    setEditedProducts([...editedProducts, newProduct]);
    setEditingIndex(editedProducts.length);
  };

  const generateJsonCode = () => {
    return `export const PRODUCTS: Product[] = ${JSON.stringify(editedProducts, null, 2)};`;
  };

  const handleSave = () => {
    onSave(editedProducts);
    alert('Productos actualizados. Copia el código JSON generado y reemplázalo en data.ts');
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
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition"
          >
            <Plus size={20} /> AGREGAR PRODUCTO
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
        </div>

        {/* Código JSON */}
        {showJsonCode && (
          <div className="bg-neutral-800 rounded-lg p-6 mb-6 border-2 border-blue-400">
            <h3 className="text-blue-400 font-bold mb-3 text-sm">CÓDIGO PARA data.ts:</h3>
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

        {/* Productos */}
        <div className="space-y-4">
          {editedProducts.map((product, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
