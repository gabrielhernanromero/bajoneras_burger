import React, { useState } from 'react';
import { X, Edit2, Save, Trash2, Plus, Eye, EyeOff, Upload, Grid, List, Package, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, Extra } from '../../types';
import { supabaseService } from '../../services';
import { compressImage } from '../../utils';

// Definir todos los extras disponibles globales
const AVAILABLE_EXTRAS: Extra[] = [
  { id: 'extra-doble-cheddar', name: 'Doble Cheddar', price: 1500 },
  { id: 'extra-doble-bacon', name: 'Doble Bacon', price: 1500 },
  { id: 'extra-medallon', name: 'Medallón Extra 120g', price: 3000 },
  { id: 'extra-cheddar-papas', name: 'Cheddar en Papas', price: 2000 },
  { id: 'extra-bacon-papas', name: 'Bacon en Papas', price: 2000 },
  { id: 'extra-cheddar-bacon-papas', name: 'Cheddar y Bacon en Papas', price: 3000 },
];

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
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [customCategories, setCustomCategories] = useState<Set<string>>(new Set());
  const [expandedExtrasIndex, setExpandedExtrasIndex] = useState<number | null>(null);
  const [editingExtraIndex, setEditingExtraIndex] = useState<{ productIdx: number; extraIdx: number } | null>(null);

  // Sincronizar editedProducts cuando cambian los products del padre
  React.useEffect(() => {
    console.log('AdminPanel: Sincronizando productos del padre:', products);
    setEditedProducts(products);
  }, [products]);

  // Obtener categorías únicas de los productos con orden específico
  const getCategoriesInOrder = () => {
    // Obtener categorías de los productos
    const productCategories = Array.from(new Set(editedProducts.map(p => p.category)));
    
    // Combinar con categorías personalizadas creadas
    const allCategories = new Set([...productCategories, ...customCategories]);
    
    const orderMap: { [key: string]: number } = {
      'Combos': 0,
      'Burgers': 1,
      'Postres': 2
    };
    
    // Ordenar por el mapa, y agregar nuevas categorías al final
    return Array.from(allCategories).sort((a, b) => {
      const orderA = orderMap[a] ?? 999;
      const orderB = orderMap[b] ?? 999;
      return orderA - orderB;
    });
  };

  const categories = ['Todos', ...getCategoriesInOrder()];

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
      
      // Subir imagen al servidor local
      alert('📤 Subiendo imagen...');
      let imageUrl: string | null = null;
      
      try {
        imageUrl = await supabaseService.uploadImage(fileToUpload);
      } catch (error) {
        console.error('Error del servicio:', error);
        alert('❌ Error al subir la imagen al servidor:\n\n' + (error instanceof Error ? error.message : 'Error desconocido') + '\n\nAsegúrate de que el servidor local (puerto 3002) está corriendo.');
        return;
      }
      
      if (!imageUrl) {
        alert('❌ No se pudo subir la imagen.\n\nVerifica que el servidor local está corriendo en puerto 3002.');
        return;
      }
      
      // Actualizar la URL de la imagen en el producto
      const updated = [...editedProducts];
      updated[index] = { ...updated[index], image: imageUrl };
      setEditedProducts(updated);
      
      const finalSizeMB = fileToUpload.size / (1024 * 1024);
      alert(`✅ Imagen subida exitosamente!\n\nTamaño: ${finalSizeMB.toFixed(2)}MB\nURL: ${imageUrl}`);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('❌ Error al procesar la imagen:\n\n' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  // Funciones para manejar extras
  const toggleExtraForProduct = (productIdx: number, extra: Extra) => {
    const product = editedProducts[productIdx];
    const existingExtra = product.extras?.find(e => e.id === extra.id);
    
    const updated = [...editedProducts];
    if (!updated[productIdx].extras) {
      updated[productIdx].extras = [];
    }
    
    if (existingExtra) {
      updated[productIdx].extras = updated[productIdx].extras!.filter(e => e.id !== extra.id);
    } else {
      updated[productIdx].extras = [...updated[productIdx].extras!, { ...extra }];
    }
    
    setEditedProducts(updated);
  };

  const updateExtraPrice = (productIdx: number, extraId: string, newPrice: number) => {
    const updated = [...editedProducts];
    const extra = updated[productIdx].extras?.find(e => e.id === extraId);
    if (extra) {
      extra.price = newPrice;
      setEditedProducts(updated);
    }
  };

  const removeExtraFromProduct = (productIdx: number, extraId: string) => {
    const updated = [...editedProducts];
    updated[productIdx].extras = updated[productIdx].extras?.filter(e => e.id !== extraId) || [];
    setEditedProducts(updated);
  };

  const addNewExtraToProduct = (productIdx: number, name: string, price: number) => {
    if (!name.trim() || price <= 0) {
      alert('⚠️ Completa el nombre y precio del extra');
      return;
    }
    
    const updated = [...editedProducts];
    if (!updated[productIdx].extras) {
      updated[productIdx].extras = [];
    }
    
    const newExtra: Extra = {
      id: `extra-${Date.now()}`,
      name: name.trim(),
      price: price
    };
    
    updated[productIdx].extras.push(newExtra);
    setEditedProducts(updated);
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
    
    const trimmedName = newCategoryName.trim();
    
    // Verificar si la sección ya existe (case-insensitive)
    if (categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
      alert(`⚠️ Ya existe una sección con ese nombre`);
      return;
    }

    // Capitalizar la primera letra de cada palabra para consistencia
    const formattedName = trimmedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Agregar la categoría al estado de categorías personalizadas
    setCustomCategories(prev => new Set([...prev, formattedName]));
    
    setSelectedCategory(formattedName);
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    alert(`✅ Sección "${formattedName}" creada exitosamente.\n\nAhora puedes agregar productos a esta sección.\n\nRecuerda hacer click en "GUARDAR CAMBIOS" para guardar los cambios.`);
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
    
    // Eliminar la categoría de las categorías personalizadas
    setCustomCategories(prev => {
      const newSet = new Set(prev);
      newSet.delete(category);
      return newSet;
    });
    
    alert(`✅ Sección "${category}" eliminada`);
  };

  const handleSave = () => {
    onSave(editedProducts);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTEsIDE5MSwgMzYsIDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative bg-gradient-to-br from-neutral-900 to-black rounded-3xl p-10 max-w-md w-full border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 backdrop-blur-sm">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-sm tracking-wider shadow-lg">
            ACCESO RESTRINGIDO
          </div>
          
          <div className="text-center mb-8 mt-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-yellow-400/20 rotate-6 transition hover:rotate-0">
              <Package size={40} className="text-black" />
            </div>
            <h2 className="font-bebas text-5xl text-yellow-400 mb-2 tracking-widest">PANEL ADMIN</h2>
            <p className="text-neutral-400 text-sm">Gestión y control total del sistema</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <label className="text-yellow-400 font-bold text-xs uppercase tracking-wider block mb-2">Contraseña de acceso</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-neutral-800/50 border-2 border-yellow-400/30 rounded-xl px-4 py-3 pr-12 text-white font-bold text-lg focus:outline-none focus:border-yellow-400 transition"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-yellow-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3.5 rounded-xl font-black text-lg hover:from-yellow-300 hover:to-yellow-400 transition shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40"
              >
                INICIAR SESIÓN
              </button>
              <button
                onClick={onClose}
                className="bg-neutral-800 text-yellow-400 py-3.5 px-6 rounded-xl font-black hover:bg-neutral-700 transition border border-yellow-400/30"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-800">
            <p className="text-neutral-500 text-xs text-center">
              Bajoneras Burger © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-black via-neutral-900 to-black overflow-y-auto">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTEsIDE5MSwgMzYsIDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header Superior con Gradient */}
        <div className="bg-gradient-to-r from-neutral-900/90 via-neutral-800/90 to-neutral-900/90 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 mb-6 shadow-xl shadow-yellow-400/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <Package size={30} className="text-black" />
              </div>
              <div>
                <h1 className="font-bebas text-4xl text-yellow-400 tracking-widest">PANEL DE ADMINISTRACIÓN</h1>
                <p className="text-neutral-400 text-sm">Gestión de productos y secciones</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleSave();
                  onClose();
                }}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2.5 rounded-xl font-black flex items-center gap-2 hover:from-yellow-300 hover:to-yellow-400 transition shadow-lg shadow-yellow-400/20"
              >
                <Eye size={20} />
                <span>VER MENÚ</span>
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="bg-neutral-800/50 border border-yellow-400/30 text-yellow-400 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-700/50 transition"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">SALIR</span>
              </button>
              <button
                onClick={onClose}
                className="bg-red-600/90 text-white px-4 py-2.5 rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-600/20 border border-red-500/30"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Acciones Principales */}
        <div className="bg-neutral-900/90 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-5 mb-6 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAddProduct}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:from-green-500 hover:to-green-600 transition shadow-lg shadow-green-600/20"
                  >
                    <Plus size={20} />
                    <span>NUEVO PRODUCTO</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:from-purple-500 hover:to-purple-600 transition shadow-lg shadow-purple-600/20"
                  >
                    <Plus size={20} />
                    <span>NUEVA SECCIÓN</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition ${
                      viewMode === 'grid'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-neutral-800/50 text-neutral-400 hover:text-white border border-neutral-700'
                    }`}
                    title="Vista en cuadrícula"
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition ${
                      viewMode === 'list'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-neutral-800/50 text-neutral-400 hover:text-white border border-neutral-700'
                    }`}
                    title="Vista en lista"
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filtros por Categoría */}
            <div className="bg-neutral-900/90 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-5 mb-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                  <Package size={18} className="text-yellow-400" />
                </div>
                <h3 className="font-bebas text-xl text-yellow-400 tracking-wider">FILTRAR POR SECCIÓN</h3>
              </div>
              
              <div className="flex gap-3 flex-wrap">
                {categories.map((category: string) => {
                  const count = category === 'Todos' 
                    ? editedProducts.length 
                    : editedProducts.filter(p => p.category === category).length;
                  
                  return (
                    <div key={category} className="relative group">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2.5 rounded-xl font-bold transition relative ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-400/20'
                            : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white border border-neutral-700'
                        }`}
                      >
                        {category}
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full font-black ${
                          selectedCategory === category
                            ? 'bg-black text-yellow-400'
                            : 'bg-neutral-900 text-neutral-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                      
                      {category !== 'Todos' && (
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="absolute -top-2.5 -right-2.5 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-700 border border-red-500 hover:scale-110 transform"
                          title={count > 0 ? `Eliminar sección y ${count} producto(s)` : 'Eliminar sección'}
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

        {/* Modal para agregar categoría */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddCategoryModal(false)}></div>
            <div className="relative bg-gradient-to-br from-neutral-900 to-black rounded-2xl p-8 max-w-md w-full border border-purple-400/50 shadow-2xl shadow-purple-400/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-6 py-1.5 rounded-full font-black text-xs tracking-wider">
                NUEVA SECCIÓN
              </div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl mx-auto mb-4 mt-2 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <Plus size={32} className="text-white" />
              </div>
              
              <h2 className="font-bebas text-3xl text-purple-400 mb-2 tracking-widest text-center">CREAR SECCIÓN</h2>
              <p className="text-neutral-400 mb-6 text-sm text-center">
                Crea una nueva sección para organizar tus productos en categorías personalizadas
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-bold block mb-2 text-sm uppercase tracking-wider">Nombre de la sección</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    placeholder="Ej: Bebidas, Postres, Promos..."
                    className="w-full bg-neutral-800/50 border-2 border-purple-400/30 rounded-xl px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-purple-400 transition"
                    autoFocus
                  />
                  <p className="text-neutral-500 text-xs mt-2">💡 Ej: Bebidas, Postres, Promos, Desayunos, etc.</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-black text-lg hover:from-purple-400 hover:to-purple-500 transition shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    CREAR SECCIÓN
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setNewCategoryName('');
                    }}
                    className="bg-neutral-800 text-purple-400 py-3 px-6 rounded-xl font-black hover:bg-neutral-700 transition border border-purple-400/30"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-purple-900/10 border border-purple-400/20 rounded-lg p-3 mt-4">
                  <p className="text-purple-300 text-xs font-bold mb-1">📌 Consejo:</p>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Después de crear la sección, podrás ver un botón "AGREGAR A [SECCIÓN]" en cada categoría para agregar productos fácilmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}



            {/* Productos organizados por categoría */}
            <div className="space-y-6">
              {categories.filter(c => c !== 'Todos').map((category) => {
                const productsInCategory = editedProducts.filter(p => 
                  selectedCategory === 'Todos' ? p.category === category : p.category === selectedCategory
                );
                
                // Mostrar la sección si:
                // 1. Estamos viendo "Todos" y hay productos en la categoría
                // 2. Estamos filtrando por esta categoría (aunque esté vacía)
                const shouldShowSection = (selectedCategory === 'Todos' && productsInCategory.length > 0) || selectedCategory === category;
                
                if (!shouldShowSection) return null;
                
                return (
                  <div key={category} className="bg-neutral-900/90 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-yellow-400" />
                        </div>
                        <div>
                          <h2 className="font-bebas text-2xl text-yellow-400 tracking-wider">{category}</h2>
                          <span className="text-xs text-neutral-500 font-bold">
                            {productsInCategory.length} producto{productsInCategory.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      
                      {/* Botón para agregar producto a esta categoría */}
                      <button
                        onClick={() => {
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
                        }}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:from-green-500 hover:to-green-600 transition shadow-lg shadow-green-600/20"
                      >
                        <Plus size={18} />
                        <span className="hidden sm:inline">AGREGAR A {category.toUpperCase()}</span>
                        <span className="sm:hidden">AGREGAR</span>
                      </button>
                    </div>
                    
                    {productsInCategory.length === 0 ? (
                      <div className="py-12 text-center">
                        <Package size={48} className="text-neutral-600 mx-auto mb-3 opacity-50" />
                        <p className="text-neutral-400 text-lg font-bold mb-4">No hay productos en esta sección</p>
                        <p className="text-neutral-500 text-sm mb-6">Haz click en el botón de arriba para agregar el primer producto</p>
                      </div>
                    ) : (
                    <div className={viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-4'
                    }>
                      {productsInCategory.map((product) => {
                        const index = editedProducts.findIndex(p => p.id === product.id);
                        return (
                          <div 
                            key={product.id} 
                            className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 border border-yellow-400/30 rounded-xl p-5 hover:border-yellow-400/60 transition shadow-lg hover:shadow-yellow-400/10"
                          >
                            {editingIndex === index ? (
                              <div className="space-y-4">
                                {/* Header del modo edición */}
                                <div className="flex items-center gap-2 pb-3 border-b border-yellow-400/20">
                                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                    <Edit2 size={16} className="text-blue-400" />
                                  </div>
                                  <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Editando Producto</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <label className="text-yellow-400 font-bold text-xs uppercase tracking-wider block mb-2">Nombre</label>
                                    <input
                                      type="text"
                                      value={editedProducts[index].name}
                                      onChange={(e) => handleEditProduct(index, 'name', e.target.value)}
                                      className="w-full bg-neutral-700/50 border border-yellow-400/30 rounded-lg px-3 py-2.5 text-white font-medium focus:outline-none focus:border-yellow-400 transition"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="text-yellow-400 font-bold text-xs uppercase tracking-wider block mb-2">Precio</label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-yellow-400 font-bold">$</span>
                                      <input
                                        type="text"
                                        value={editedProducts[index].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                          const numericValue = e.target.value.replace(/\./g, '');
                                          if (/^\d*$/.test(numericValue)) {
                                            handleEditProduct(index, 'price', numericValue);
                                          }
                                        }}
                                        className="w-full bg-neutral-700/50 border border-yellow-400/30 rounded-lg pl-7 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-yellow-400 transition"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-yellow-400 font-bold text-xs uppercase tracking-wider block mb-2">Descripción</label>
                                  <textarea
                                    value={editedProducts[index].description}
                                    onChange={(e) => handleEditProduct(index, 'description', e.target.value)}
                                    className="w-full bg-neutral-700/50 border border-yellow-400/30 rounded-lg px-3 py-2.5 text-white font-medium focus:outline-none focus:border-yellow-400 transition resize-none"
                                    rows={3}
                                  />
                                </div>

                                {/* ===== SECCIÓN DE CONFIGURACIÓN AVANZADA DE PROMOS ===== */}
                                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-500/40 rounded-xl p-6 space-y-6">
                                  <div className="flex items-center gap-2 pb-3 border-b border-purple-400/30">
                                    <span className="text-2xl">🎯</span>
                                    <h3 className="text-purple-300 font-black text-sm uppercase tracking-widest">Configurar Promoción Avanzada</h3>
                                  </div>

                                  {/* FILA 1: Cantidad de Hamburguesas */}
                                  <div className="space-y-2">
                                    <label className="text-purple-200 font-bold text-xs uppercase tracking-wider block">
                                      📊 ¿Cuántas hamburguesas puede elegir el cliente?
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                      {[0, 1, 2, 3, 4].map((num) => (
                                        <button
                                          key={num}
                                          onClick={() => handleEditProduct(index, 'burgersToSelect', num)}
                                          className={`py-3 rounded-lg font-bold text-sm transition border-2 ${
                                            (editedProducts[index].burgersToSelect || 0) === num
                                              ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/50'
                                              : 'bg-neutral-700/50 border-neutral-600 text-neutral-300 hover:border-purple-400/50'
                                          }`}
                                        >
                                          {num === 0 ? 'No' : num}
                                        </button>
                                      ))}
                                    </div>
                                    {editedProducts[index].burgersToSelect && editedProducts[index].burgersToSelect > 0 && (
                                      <div className="mt-2 bg-purple-600/20 border border-purple-400/30 rounded-lg px-3 py-2">
                                        <p className="text-purple-200 text-xs font-semibold">
                                          ✨ El cliente elegirá <span className="font-black text-purple-300">{editedProducts[index].burgersToSelect}</span> hamburguesa{editedProducts[index].burgersToSelect > 1 ? 's' : ''}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* FILA 2: Tipo de Hamburguesas */}
                                  {editedProducts[index].burgersToSelect && editedProducts[index].burgersToSelect > 1 && (
                                    <>
                                      <div className="space-y-2 pt-3 border-t border-purple-400/30">
                                        <label className="text-purple-200 font-bold text-xs uppercase tracking-wider block">
                                          🔄 Tipo de hamburguesas permitidas
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                          <button
                                            onClick={() => handleEditProduct(index, 'allowDuplicateBurgers', true)}
                                            className={`py-3 px-3 rounded-lg font-bold text-xs uppercase transition border-2 text-center ${
                                              editedProducts[index].allowDuplicateBurgers === true
                                                ? 'bg-green-600/80 border-green-400 text-white shadow-lg shadow-green-600/40'
                                                : 'bg-neutral-700/50 border-neutral-600 text-neutral-300 hover:border-green-400/50'
                                            }`}
                                          >
                                            <div className="text-lg mb-1">✅</div>
                                            <div>Iguales o Diferentes</div>
                                            <div className="text-xs opacity-75 mt-0.5">(2x Doble Bacon OK)</div>
                                          </button>

                                          <button
                                            onClick={() => handleEditProduct(index, 'allowDuplicateBurgers', false)}
                                            className={`py-3 px-3 rounded-lg font-bold text-xs uppercase transition border-2 text-center ${
                                              editedProducts[index].allowDuplicateBurgers === false
                                                ? 'bg-blue-600/80 border-blue-400 text-white shadow-lg shadow-blue-600/40'
                                                : 'bg-neutral-700/50 border-neutral-600 text-neutral-300 hover:border-blue-400/50'
                                            }`}
                                          >
                                            <div className="text-lg mb-1">🚫</div>
                                            <div>Solo Diferentes</div>
                                            <div className="text-xs opacity-75 mt-0.5">(Doble Bacon + Super Mell)</div>
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <div>
                                  <label className="text-yellow-400 font-bold text-xs uppercase tracking-wider block mb-2">Imagen</label>
                                  <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={(e) => handleDrop(e, index)}
                                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition ${
                                      dragActive
                                        ? 'border-yellow-400 bg-yellow-400/10'
                                        : 'border-yellow-400/30 bg-neutral-700/20 hover:border-yellow-400/60 hover:bg-neutral-700/30'
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
                                      <Upload size={24} className="text-yellow-400 mx-auto mb-2" />
                                      <p className="text-yellow-400 font-bold mb-1 text-sm">Arrastra una imagen o haz clic</p>
                                      <p className="text-neutral-400 text-xs">PNG, JPG, WEBP (Max 5MB)</p>
                                    </div>
                                  </div>
                                  
                                  {editedProducts[index].image && editedProducts[index].image.startsWith('data:') && (
                                    <div className="mt-3">
                                      <p className="text-neutral-400 text-xs mb-2">Vista previa:</p>
                                      <img
                                        src={editedProducts[index].image}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded-lg border border-yellow-400/30"
                                      />
                                    </div>
                                  )}

                                  <div className="mt-3">
                                    <p className="text-neutral-400 text-xs mb-1.5">O pega una URL:</p>
                                    <input
                                      type="text"
                                      value={editedProducts[index].image.startsWith('data:') ? '' : editedProducts[index].image}
                                      placeholder="https://ejemplo.com/imagen.jpg"
                                      onChange={(e) => handleEditProduct(index, 'image', e.target.value)}
                                      className="w-full bg-neutral-600/50 border border-yellow-400/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition"
                                    />
                                  </div>
                                </div>

                                {/* ===== SECCIÓN DE GESTIÓN DE EXTRAS ===== */}
                                <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-2 border-orange-500/40 rounded-xl p-6 space-y-4">
                                  <button
                                    onClick={() => setExpandedExtrasIndex(expandedExtrasIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between pb-3 border-b border-orange-400/30 hover:opacity-80 transition"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">🌶️</span>
                                      <h3 className="text-orange-300 font-black text-sm uppercase tracking-widest">Gestionar Extras</h3>
                                      {editedProducts[index].extras && editedProducts[index].extras.length > 0 && (
                                        <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold">{editedProducts[index].extras.length}</span>
                                      )}
                                    </div>
                                    {expandedExtrasIndex === index ? <ChevronUp size={20} className="text-orange-400" /> : <ChevronDown size={20} className="text-orange-400" />}
                                  </button>

                                  {expandedExtrasIndex === index && (
                                    <div className="space-y-4 pt-2">
                                      {/* Extras disponibles para agregar */}
                                      <div className="space-y-2">
                                        <p className="text-orange-200 font-bold text-xs uppercase tracking-wider">📋 Extras disponibles:</p>
                                        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                          {AVAILABLE_EXTRAS.map(availableExtra => {
                                            const isSelected = editedProducts[index].extras?.some(e => e.id === availableExtra.id);
                                            return (
                                              <button
                                                key={availableExtra.id}
                                                onClick={() => toggleExtraForProduct(index, availableExtra)}
                                                className={`w-full p-3 rounded-lg border-2 transition flex items-center justify-between font-bold text-sm ${
                                                  isSelected
                                                    ? 'bg-orange-600/30 border-orange-400 text-orange-100'
                                                    : 'bg-neutral-700/30 border-orange-400/30 text-neutral-300 hover:border-orange-400/60'
                                                }`}
                                              >
                                                <span>{availableExtra.name}</span>
                                                <span className="text-xs">${availableExtra.price.toLocaleString()}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Extras seleccionados - edición de precios */}
                                      {editedProducts[index].extras && editedProducts[index].extras.length > 0 && (
                                        <div className="space-y-3 pt-4 border-t border-orange-400/30">
                                          <p className="text-orange-200 font-bold text-xs uppercase tracking-wider">✅ Extras habilitados:</p>
                                          <div className="space-y-2">
                                            {editedProducts[index].extras.map((extra, extraIdx) => (
                                              <div key={extra.id} className="flex gap-2 items-end bg-neutral-700/40 p-3 rounded-lg">
                                                <div className="flex-1">
                                                  <p className="text-neutral-400 text-xs mb-1">{extra.name}</p>
                                                  <div className="flex gap-2">
                                                    <div className="flex-1 relative">
                                                      <span className="absolute left-2 top-2 text-orange-400 font-bold text-sm">$</span>
                                                      <input
                                                        type="text"
                                                        value={extra.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                        onFocus={(e) => e.target.select()}
                                                        onChange={(e) => {
                                                          const numericValue = e.target.value.replace(/\./g, '');
                                                          if (/^\d*$/.test(numericValue)) {
                                                            updateExtraPrice(index, extra.id, parseInt(numericValue) || 0);
                                                          }
                                                        }}
                                                        className="w-full bg-neutral-600/50 border border-orange-400/30 rounded-lg pl-7 pr-2 py-2 text-white font-bold text-sm focus:outline-none focus:border-orange-400 transition"
                                                      />
                                                    </div>
                                                    <button
                                                      onClick={() => removeExtraFromProduct(index, extra.id)}
                                                      className="bg-red-600/20 border border-red-500/30 text-red-400 py-2 px-3 rounded-lg hover:bg-red-600/30 transition"
                                                      title="Remover extra"
                                                    >
                                                      <Trash2 size={16} />
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Agregar extra personalizado */}
                                      <div className="pt-4 border-t border-orange-400/30">
                                        <details className="cursor-pointer">
                                          <summary className="text-orange-200 font-bold text-xs uppercase tracking-wider hover:text-orange-100 transition">+ Agregar extra personalizado</summary>
                                          <div className="mt-3 p-3 bg-neutral-700/30 rounded-lg space-y-2">
                                            <input
                                              type="text"
                                              id={`custom-extra-name-${index}`}
                                              placeholder="Nombre del extra"
                                              className="w-full bg-neutral-600/50 border border-orange-400/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-400 transition"
                                            />
                                            <div className="flex gap-2">
                                              <div className="flex-1 relative">
                                                <span className="absolute left-2 top-2 text-orange-400 font-bold text-sm">$</span>
                                                <input
                                                  type="text"
                                                  id={`custom-extra-price-${index}`}
                                                  placeholder="0"
                                                  className="w-full bg-neutral-600/50 border border-orange-400/30 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-orange-400 transition"
                                                />
                                              </div>
                                              <button
                                                onClick={() => {
                                                  const nameInput = document.getElementById(`custom-extra-name-${index}`) as HTMLInputElement;
                                                  const priceInput = document.getElementById(`custom-extra-price-${index}`) as HTMLInputElement;
                                                  if (nameInput && priceInput) {
                                                    addNewExtraToProduct(index, nameInput.value, parseInt(priceInput.value) || 0);
                                                    nameInput.value = '';
                                                    priceInput.value = '';
                                                  }
                                                }}
                                                className="bg-green-600/20 border border-green-500/30 text-green-400 py-2 px-4 rounded-lg hover:bg-green-600/30 transition font-bold text-sm"
                                              >
                                                <Plus size={16} />
                                              </button>
                                            </div>
                                          </div>
                                        </details>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-neutral-700/50">
                                  <button
                                    onClick={async () => {
                                      try {
                                        await supabaseService.replaceAllProducts(editedProducts);
                                        setEditingIndex(null);
                                        alert('✅ Producto guardado exitosamente');
                                      } catch (error) {
                                        console.error('Error guardando:', error);
                                        alert('❌ Error al guardar el producto');
                                      }
                                    }}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg font-black hover:from-green-500 hover:to-green-600 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                                  >
                                    <Save size={18} />
                                    GUARDAR
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingIndex(null);
                                      setEditedProducts(products);
                                    }}
                                    className="bg-neutral-700/50 text-neutral-300 py-2.5 px-4 rounded-lg font-bold hover:bg-neutral-600/50 hover:text-white transition border border-neutral-600"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col h-full">
                                {/* Imagen del producto */}
                                {product.image && (
                                  <div className="w-full h-40 bg-neutral-900/50 rounded-lg overflow-hidden mb-3 border border-neutral-700/30">
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                      }}
                                    />
                                  </div>
                                )}
                                
                                <div className="flex-1">
                                  <h3 className="text-yellow-400 font-bold text-lg mb-1">{product.name}</h3>
                                  <p className="text-neutral-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                                  
                                  <div className="flex items-center justify-between mb-4">
                                    <span className="text-white font-black text-xl">${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
                                    <span className="text-neutral-500 text-xs bg-neutral-700/30 px-2 py-1 rounded-full">{product.category}</span>
                                  </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditingIndex(index)}
                                    className="flex-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 py-2 rounded-lg font-bold hover:bg-blue-600/30 transition flex items-center justify-center gap-2"
                                  >
                                    <Edit2 size={16} />
                                    <span>Editar</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(index)}
                                    className="bg-red-600/20 border border-red-500/30 text-red-400 py-2 px-4 rounded-lg font-bold hover:bg-red-600/30 transition"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
      </div>
    </div>
  );
};

export default AdminPanel;
