import { ShoppingCart, Plus, AlertTriangle, DollarSign, Heart } from 'lucide-react';
import AllergyBadge from './AllergyBadge';

const ProductCard = ({ product, onAddToList, isInList }) => {
  const cheapestStore = product.stores.reduce((cheapest, store) => 
    store.price < cheapest.price ? store : cheapest
  );

  const handleAddToList = () => {
    onAddToList(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Health Score Indicator */}
      <div className={`h-1 bg-gradient-to-r ${
        product.healthScore >= 80 
          ? 'from-green-400 to-green-500'
          : product.healthScore >= 60 
            ? 'from-yellow-400 to-yellow-500'
            : 'from-red-400 to-red-500'
      }`}></div>

      <div className="p-4">
        {/* Product Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          
          {/* Health Score Badge */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.healthScore >= 80 
              ? 'bg-green-100 text-green-800'
              : product.healthScore >= 60 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {product.healthScore}/100
          </div>
        </div>

        {/* Allergy Warnings */}
        {product.allergens && product.allergens.length > 0 && (
          <div className="mb-3">
            <AllergyBadge allergens={product.allergens} />
          </div>
        )}

        {/* Nutritional Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Calories:</span>
              <span className="font-medium text-gray-900">{product.nutrition.calories}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Protein:</span>
              <span className="font-medium text-gray-900">{product.nutrition.protein}g</span>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Best Price:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">${cheapestStore.price}</span>
              <span className="text-xs text-gray-500">at {cheapestStore.name}</span>
            </div>
          </div>
          
          {/* Other Stores */}
          <div className="space-y-1">
            {product.stores
              .filter(store => store.name !== cheapestStore.name)
              .slice(0, 2)
              .map(store => (
                <div key={store.name} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{store.name}</span>
                  <span className="text-gray-900">${store.price}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Add to List Button */}
        <button
          onClick={handleAddToList}
          disabled={isInList}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isInList
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {isInList ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              In List
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to List
            </>
          )}
        </button>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
