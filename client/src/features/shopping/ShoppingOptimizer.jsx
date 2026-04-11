import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Search, Filter, DollarSign, Heart, AlertTriangle, ArrowLeft } from 'lucide-react';
import ShoppingList from './ShoppingList';
import PriceComparison from './PriceComparison';
import ProductCard from './components/ProductCard';
import { updateIngredient, deleteIngredient } from '../../services/shoppingService';
import { normalizeIngredientName, normalizeIngredientWithQuantity } from './utils/ingredientNormalizer';
import api from '../../services/api';

const ShoppingOptimizer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [shoppingList, setShoppingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budget, setBudget] = useState(5000);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userAllergies] = useState(['nuts', 'dairy']); // Mock user allergies
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customItem, setCustomItem] = useState({
    name: '',
    quantity: 1,
    unit: 'pcs',
    price: ''
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const categories = ['all', 'dairy', 'produce', 'grains', 'protein', 'snacks'];

  // Fetch shopping lists and flatten ingredients on component mount
  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await api.get('/shopping');
        
        const shoppingLists = response.data;
        console.log('Shopping lists response:', shoppingLists);
        
        // Flatten all ingredients from all shopping lists
        const flattenedIngredients = [];
        shoppingLists.forEach((list, index) => {
          console.log(`Shopping list ${index}:`, list);
          console.log(`Ingredients for list ${index}:`, list.ingredients);
          
          if (list.ingredients && Array.isArray(list.ingredients)) {
            list.ingredients.forEach((ingredient, ingIndex) => {
              console.log(`Ingredient ${ingIndex}:`, ingredient);
              flattenedIngredients.push({
                id: ingredient._id || ingredient.name,
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit
              });
            });
          }
        });
        
        console.log('Flattened ingredients:', flattenedIngredients);
        setProducts(flattenedIngredients);
      } catch (err) {
        setError(err.message || 'Failed to load shopping lists');
        console.error('Error fetching shopping lists:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShoppingLists();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Category filter disabled - dropdown commented out
    const isAllergyFree = true; // No allergen data in shopping list ingredients
    return matchesSearch && isAllergyFree;
  });

  const addToShoppingList = (product, priceInfo) => {
    if (!priceInfo || priceInfo.price === undefined) {
      return;
    }
    if (!shoppingList.find(item => item.product.id === product.id)) {
      setShoppingList([...shoppingList, {
        product,
        quantity: 1,
        checked: false,
        selectedStore: priceInfo
      }]);
    }
  };

  const handleUpdateProduct = async (id, updatedFields) => {
    try {
      console.log('Frontend update request:', { id, updatedFields });
      const result = await updateIngredient(id, updatedFields);
      if (result.success) {
        // Update local state
        setProducts(prevProducts => {
          const updatedProducts = prevProducts.map(product =>
            product.id === id ? { ...product, ...updatedFields } : product
          );
          
          const mergedProducts = [];
          const seenNames = new Set();
          
          updatedProducts.forEach(product => {
            const normalized = normalizeIngredientWithQuantity(product.name);
            const normalizedName = normalized.name;
            const extractedQuantity = normalized.quantity;
            
            if (!seenNames.has(normalizedName)) {
              seenNames.add(normalizedName);
              mergedProducts.push({
                ...product,
                quantity: extractedQuantity
              });
            } else {
              const existingIndex = mergedProducts.findIndex(p =>
                normalizeIngredientName(p.name) === normalizedName && p.unit === product.unit
              );
              if (existingIndex !== -1) {
                mergedProducts[existingIndex] = {
                  ...mergedProducts[existingIndex],
                  quantity: mergedProducts[existingIndex].quantity + extractedQuantity
                };
              }
            }
          });
          
          console.log('Merged products:', mergedProducts);
          return mergedProducts;
        });
      } else {
        setError(result.error || 'Failed to update ingredient');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      setError('Failed to update ingredient');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      // Check if this is a custom product (created in frontend only)
      if (id.startsWith('custom-')) {
        // Custom products only exist in frontend state, remove locally
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        return;
      }

      // For database products, call backend API
      const result = await deleteIngredient(id);
      if (result.success) {
        // Update local state
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      } else {
        setError(result.error || 'Failed to delete ingredient');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete ingredient');
    }
  };

  const removeFromShoppingList = (productId) => {
    setShoppingList(shoppingList.filter(item => item.product.id !== productId));
  };

  const toggleItemChecked = (productId) => {
    setShoppingList(shoppingList.map(item =>
      item.product.id === productId 
        ? { ...item, checked: !item.checked }
        : item
    ));
  };

  const updateQuantity = (productId, newQuantity) => {
    setShoppingList(shoppingList.map(item =>
      item.product.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const clearAllFromShoppingList = () => {
    setShoppingList([]);
  };

  const clearCheckedFromShoppingList = () => {
    setShoppingList(shoppingList.filter(item => !item.checked));
  };

  const handleAddCustomItem = () => {
    if (!customItem.name.trim() || !customItem.price) {
      setError('Please fill in item name and price');
      return;
    }

    const normalizedItem = {
      name: normalizeIngredientName(customItem.name),
      quantity: parseFloat(customItem.quantity) || 1,
      unit: customItem.unit,
      price: parseFloat(customItem.price) || 0
    };

    const newProduct = {
      id: `custom-${Date.now()}`,
      name: normalizedItem.name,
      quantity: normalizedItem.quantity,
      unit: normalizedItem.unit,
      category: 'Custom',
      healthScore: 50,
      stores: [],
      isCustom: true
    };

    setProducts([...products, newProduct]);

    setCustomItem({
      name: '',
      quantity: 1,
      unit: 'pcs',
      price: ''
    });
    setShowCustomForm(false);
    setError('');
  };

  const handleStoreSelect = (storeName) => {
    setSelectedStore(storeName);
  };

  const totalCost = shoppingList.reduce((total, item) => {
    const storePrice = item.selectedStore?.price || 0;
    return total + (storePrice * item.quantity);
  }, 0);

  const budgetRemaining = budget - totalCost;
  const isOverBudget = budgetRemaining < 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Optimizer</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Budget</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-24 px-2 py-1 text-right font-semibold border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isOverBudget ? 'text-red-600 border-red-300' : 'text-green-600 border-green-300'
                    }`}
                    min="0"
                    step="100"
                  />
                  <span className="text-sm text-gray-500">LKR</span>
                </div>
                <p className={`text-xs mt-1 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  Remaining: LKR {Math.round(budgetRemaining)}
                </p>
              </div>
              <div className="flex items-center text-orange-500 font-medium group-hover:text-orange-600 transition-colors">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">LKR {Math.round(totalCost)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'list' 
                ? 'bg-white text-orange-600 font-medium shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Shopping List
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'products' 
                ? 'bg-white text-orange-600 font-medium shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products
          </button>
          {/* Price Comparison tab button temporarily disabled */}
          {/* <button
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'comparison' 
                ? 'bg-white text-orange-600 font-medium shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Price Comparison
          </button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'list' && (
          <ShoppingList
            shoppingList={shoppingList}
            onRemoveItem={removeFromShoppingList}
            onToggleChecked={toggleItemChecked}
            onUpdateQuantity={updateQuantity}
            budget={budget}
            totalCost={totalCost}
            onBudgetChange={setBudget}
            onClearAll={clearAllFromShoppingList}
            onClearChecked={clearCheckedFromShoppingList}
          />
        )}

        {activeTab === 'products' && (
          <div>
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            {/* Content */}
            {!loading && !error && (
              <>
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {/* Category dropdown filter temporarily disabled */}
                      {/* <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select> */}
                      <button
                        onClick={() => setShowCustomForm(!showCustomForm)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                      >
                        {showCustomForm ? 'Cancel' : 'Add Custom Item'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom Item Form */}
                {showCustomForm && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-orange-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Add Custom Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Item Name</label>
                        <input
                          type="text"
                          value={customItem.name}
                          onChange={(e) => setCustomItem({...customItem, name: e.target.value})}
                          placeholder="Enter item name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
                        <input
                          type="number"
                          value={customItem.quantity}
                          onChange={(e) => setCustomItem({...customItem, quantity: e.target.value})}
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Unit</label>
                        <select
                          value={customItem.unit}
                          onChange={(e) => setCustomItem({...customItem, unit: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="l">l</option>
                          <option value="ml">ml</option>
                          <option value="pcs">pcs</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="cup">cup</option>
                          <option value="oz">oz</option>
                          <option value="lb">lb</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Price (LKR)</label>
                        <input
                          type="number"
                          value={customItem.price}
                          onChange={(e) => setCustomItem({...customItem, price: e.target.value})}
                          placeholder="Enter price"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={handleAddCustomItem}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Add to Product
                      </button>
                      <button
                        onClick={() => setShowCustomForm(false)}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToList={addToShoppingList}
                      isInList={shoppingList.some(item => item.product.id === product.id)}
                      onUpdate={handleUpdateProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Price Comparison feature temporarily disabled */}
        {/* {activeTab === 'comparison' && (
          <PriceComparison 
            shoppingList={shoppingList} 
            selectedStore={selectedStore}
            onStoreSelect={handleStoreSelect}
          />
        )} */}
      </div>
    </div>
  );
};

export default ShoppingOptimizer;
