import { useState, useEffect } from 'react';
import axios from 'axios';
import TabAbstract from './TabAbstract';

class ProductTabs extends TabAbstract {
  constructor() {
    super([
      { title: 'Productos Iniciales', id: 'add' },
      { title: 'Gestión de Productos', id: 'manage' }
    ]);
  }

  renderContent(activeTab) {
    switch (activeTab) {
      case 0:
        return <AddProductTab />;
      case 1:
        return <ManageProductsTab />;
      default:
        return <div>Pestaña no encontrada</div>;
    }
  }
}

// Componente para añadir productos
function AddProductTab() {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Validaciones
    if (!product.name.trim()) {
      setError('El nombre del producto es obligatorio');
      setLoading(false);
      return;
    }
    
    if (!product.category.trim()) {
      setError('La categoría es obligatoria');
      setLoading(false);
      return;
    }
    
    const price = parseFloat(product.price);
    if (isNaN(price) || price < 0) {
      setError('El precio debe ser un número positivo');
      setLoading(false);
      return;
    }
    
    const stock = parseInt(product.stock);
    if (isNaN(stock) || stock < 0) {
      setError('El stock debe ser un número entero positivo');
      setLoading(false);
      return;
    }
    
    try {
      // Convertir a número los campos numéricos
      const productData = {
        ...product,
        price: price,
        stock: stock
      };
      
      await axios.post('http://localhost:8080/api/products', productData);
      
      setSuccess('Producto creado correctamente');
      // Limpiar el formulario después de guardar
      setProduct({
        id: '',
        name: '',
        category: '',
        price: '',
        stock: ''
      });
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError(err.response?.data?.error || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Añadir Nuevo Producto</h2>
      
      {error && <p className="text-red-600 bg-red-100 p-2 mb-4 rounded">{error}</p>}
      {success && <p className="text-green-600 bg-green-100 p-2 mb-4 rounded">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="block mb-1">ID:</label>
          <input 
            type="text" 
            name="id" 
            value={product.id} 
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Dejar vacío para generar automáticamente"
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-1">Nombre:</label>
          <input 
            type="text" 
            name="name" 
            value={product.name} 
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-1">Categoría:</label>
          <input 
            type="text" 
            name="category" 
            value={product.category} 
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-1">Precio:</label>
          <input 
            type="number" 
            name="price" 
            value={product.price} 
            onChange={handleChange}
            className="w-full border p-2 rounded"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-1">Stock:</label>
          <input 
            type="number" 
            name="stock" 
            value={product.stock} 
            onChange={handleChange}
            className="w-full border p-2 rounded"
            min="0"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
}

// Componente para gestionar productos
function ManageProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete'

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para cargar productos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal
  const openModal = (product, mode) => {
    setSelectedProduct({...product});
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Función para eliminar un producto
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      // Actualizar la lista eliminando el producto
      setProducts(products.filter(product => product.id !== id));
      closeModal();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto');
    }
  };

  // Función para actualizar un producto
  const updateProduct = async () => {
    try {
      await axios.put(`http://localhost:8080/api/products/${selectedProduct.id}`, selectedProduct);
      // Actualizar la lista con el producto modificado
      setProducts(products.map(product => 
        product.id === selectedProduct.id ? selectedProduct : product
      ));
      closeModal();
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      setError('Error al actualizar el producto');
    }
  };

  // Manejar cambios en los inputs del modal
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convertir a número si es precio o stock
    if (name === 'price') {
      setSelectedProduct({...selectedProduct, [name]: parseFloat(value)});
    } else if (name === 'stock') {
      setSelectedProduct({...selectedProduct, [name]: parseInt(value)});
    } else {
      setSelectedProduct({...selectedProduct, [name]: value});
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>
      
      {error && <p className="text-red-600 bg-red-100 p-2 mb-4 rounded">{error}</p>}
      
      {loading ? (
        <p className="text-blue-600">Cargando productos...</p>
      ) : (
        <div>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Categoría</th>
                <th className="py-2 px-4 border-b">Precio</th>
                <th className="py-2 px-4 border-b">Stock</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{product.id}</td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal(product, 'view')} 
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => openModal(product, 'edit')} 
                        className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => openModal(product, 'delete')} 
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <p className="text-center py-4">No hay productos disponibles</p>
          )}
        </div>
      )}
      
      {/* Modal para ver, editar o eliminar productos */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full">
            {modalMode === 'view' && (
              <>
                <h3 className="text-lg font-bold mb-4">Detalles del Producto</h3>
                <div className="space-y-2">
                  <p><strong>ID:</strong> {selectedProduct.id}</p>
                  <p><strong>Nombre:</strong> {selectedProduct.name}</p>
                  <p><strong>Categoría:</strong> {selectedProduct.category}</p>
                  <p><strong>Precio:</strong> ${selectedProduct.price.toFixed(2)}</p>
                  <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={closeModal}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
            
            {modalMode === 'edit' && (
              <>
                <h3 className="text-lg font-bold mb-4">Editar Producto</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1">Nombre:</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={selectedProduct.name} 
                      onChange={handleModalInputChange}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Categoría:</label>
                    <input 
                      type="text" 
                      name="category" 
                      value={selectedProduct.category} 
                      onChange={handleModalInputChange}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Precio:</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={selectedProduct.price} 
                      onChange={handleModalInputChange}
                      className="w-full border p-2 rounded"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Stock:</label>
                    <input 
                      type="number" 
                      name="stock" 
                      value={selectedProduct.stock} 
                      onChange={handleModalInputChange}
                      className="w-full border p-2 rounded"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    onClick={updateProduct}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={closeModal}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
            
            {modalMode === 'delete' && (
              <>
                <h3 className="text-lg font-bold mb-4">Eliminar Producto</h3>
                <p>¿Estás seguro de que deseas eliminar el producto "{selectedProduct.name}"?</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => deleteProduct(selectedProduct.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                  <button 
                    onClick={closeModal}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Exportar el componente final de gestión de productos
export default function ProductManagement() {
  const productTabs = new ProductTabs();
  const TabComponent = productTabs.TabComponent.bind(productTabs);
  
  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
      <TabComponent />
    </div>
  );
}