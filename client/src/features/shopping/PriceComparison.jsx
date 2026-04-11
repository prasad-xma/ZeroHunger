import { DollarSign, TrendingDown, Store, ShoppingCart } from 'lucide-react';

const PriceComparison = ({ shoppingList }) => {
  if (shoppingList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items to compare</h3>
        <p className="text-gray-600">Add items to your shopping list to see price comparisons</p>
      </div>
    );
  }

  // Calculate prices for each store
  const storePrices = {};
  const storeTotals = {};

  shoppingList.forEach(item => {
    item.product.stores.forEach(store => {
      if (!storePrices[store.name]) {
        storePrices[store.name] = [];
        storeTotals[store.name] = 0;
      }
      
      const itemTotal = store.price * item.quantity;
      storePrices[store.name].push({
        product: item.product.name,
        quantity: item.quantity,
        unitPrice: store.price,
        totalPrice: itemTotal
      });
      
      storeTotals[store.name] += itemTotal;
    });
  });

  // Sort stores by total price
  const sortedStores = Object.entries(storeTotals)
    .sort(([, a], [, b]) => a - b)
    .map(([name, total]) => ({ name, total }));

  const cheapestStore = sortedStores[0];
  const mostExpensiveStore = sortedStores[sortedStores.length - 1];
  const maxSavings = mostExpensiveStore.total - cheapestStore.total;

  return (
    <div className="space-y-6">
      {/* Price Comparison Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Price Comparison</h3>
        
        {/* Store Rankings */}
        <div className="space-y-3">
          {sortedStores.map((store, index) => (
            <div
              key={store.name}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                index === 0 
                  ? 'border-green-300 bg-green-50' 
                  : index === sortedStores.length - 1
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 
                    ? 'bg-green-500 text-white' 
                    : index === sortedStores.length - 1
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{store.name}</h4>
                  {index === 0 && (
                    <p className="text-sm text-green-600 font-medium">Cheapest Option</p>
                  )}
                  {index === sortedStores.length - 1 && index !== 0 && (
                    <p className="text-sm text-red-600 font-medium">Most Expensive</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">${store.total.toFixed(2)}</p>
                {index > 0 && (
                  <p className="text-sm text-gray-600">
                    +${(store.total - cheapestStore.total).toFixed(2)} more
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Savings Highlight */}
        {maxSavings > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Maximum Savings</h4>
                <p className="text-green-700">
                  Save ${maxSavings.toFixed(2)} by shopping at {cheapestStore.name} instead of {mostExpensiveStore.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Price Breakdown</h3>
        
        <div className="space-y-6">
          {sortedStores.map(store => (
            <div key={store.name} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">{store.name}</h4>
                  </div>
                  <p className="font-semibold text-gray-900">${store.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {storePrices[store.name].map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-gray-600">
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-3">Smart Shopping Tips</h3>
        <ul className="space-y-2 text-orange-800">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>Shop at {cheapestStore.name} to save ${maxSavings.toFixed(2)} on your current list</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>Consider buying in bulk for frequently used items to maximize savings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>Check for weekly sales and promotions at your preferred store</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PriceComparison;
