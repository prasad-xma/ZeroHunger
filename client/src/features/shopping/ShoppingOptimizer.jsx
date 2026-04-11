import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Search, Filter, DollarSign, Heart, AlertTriangle, ArrowLeft } from 'lucide-react';
import ShoppingList from './ShoppingList';
import PriceComparison from './PriceComparison';
import ProductCard from './components/ProductCard';
import { mockProducts } from './utils/productDatabase';

const ShoppingOptimizer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [shoppingList, setShoppingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budget, setBudget] = useState(5000);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userAllergies] = useState(['nuts', 'dairy']); // Mock user allergies

  const categories = ['all', 'dairy', 'produce', 'grains', 'protein', 'snacks'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const isAllergyFree = !product.allergens.some(allergen => 
      userAllergies.includes(allergen.toLowerCase())
    );
    return matchesSearch && matchesCategory && isAllergyFree;
  });

  const addToShoppingList = (product, selectedStore) => {
    if (!selectedStore) {
      // Don't add item if no store is selected
      return;
    }
    if (!shoppingList.find(item => item.product.id === product.id)) {
      setShoppingList([...shoppingList, {
        product,
        quantity: 1,
        checked: false,
        selectedStore: selectedStore
      }]);
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
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'comparison' 
                ? 'bg-white text-orange-600 font-medium shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Price Comparison
          </button>
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
          />
        )}

        {activeTab === 'products' && (
          <div>
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
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {userAllergies.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">
                    Products filtered for allergies: {userAllergies.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToList={addToShoppingList}
                  isInList={shoppingList.some(item => item.product.id === product.id)}
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
          </div>
        )}

        {activeTab === 'comparison' && (
          <PriceComparison 
            shoppingList={shoppingList} 
            selectedStore={selectedStore}
            onStoreSelect={handleStoreSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ShoppingOptimizer;
