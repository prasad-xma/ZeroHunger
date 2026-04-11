import { useState } from 'react';
import { ShoppingCart, Trash2, Check, Plus, Minus, DollarSign, TrendingUp, X } from 'lucide-react';
import { normalizeIngredientName } from './utils/ingredientNormalizer';

const ShoppingList = ({ shoppingList, onRemoveItem, onToggleChecked, onUpdateQuantity, budget, totalCost, onBudgetChange, onClearAll, onClearChecked }) => {
  const [listName, setListName] = useState('Weekly Groceries');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const updateQuantity = (itemId, change) => {
    const currentItem = shoppingList.find(item => item.product.id === itemId);
    if (currentItem) {
      const newQuantity = Math.max(1, currentItem.quantity + change); // Ensure minimum quantity of 1
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const checkedItems = shoppingList.filter(item => item.checked);
  const uncheckedItems = shoppingList.filter(item => !item.checked);
  const checkedTotal = checkedItems.reduce((total, item) => 
    total + ((item.selectedStore?.price || 0) * item.quantity), 0
  );

  const budgetRemaining = budget - totalCost;
  const isOverBudget = budgetRemaining < 0;
  const savings = Math.max(0, budget - totalCost);

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 outline-none transition-colors"
          />
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOverBudget 
              ? 'bg-red-100 text-red-800' 
              : savings > 0 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {isOverBudget ? 'Over Budget' : savings > 0 ? `Saved LKR ${Math.round(savings)}` : 'On Budget'}
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={budget}
                onChange={(e) => onBudgetChange && onBudgetChange(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-32 px-3 py-2 text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
                step="100"
              />
              <span className="text-lg text-gray-500">LKR</span>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Total Cost</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">LKR {Math.round(totalCost)}</p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            isOverBudget ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className={`flex items-center gap-2 mb-1 ${
              isOverBudget ? 'text-red-600' : 'text-green-600'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Remaining</span>
            </div>
            <p className={`text-2xl font-bold ${
              isOverBudget ? 'text-red-900' : 'text-green-900'
            }`}>
              LKR {Math.abs(Math.round(budgetRemaining))}
              {isOverBudget && ' over'}
            </p>
          </div>
        </div>
      </div>

      {/* Shopping List Items */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shopping Items ({shoppingList.length})
          </h3>
          
          {shoppingList.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Your shopping list is empty</h4>
              <p className="text-gray-600 mb-4">Add products from the Products tab to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shoppingList.map((item) => (
                <div
                  key={item.product.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    item.checked 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-300'
                  } transition-colors`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleChecked(item.product.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.checked
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {item.checked && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      item.checked ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {item.product.name}
                    </h4>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      LKR {Math.round((item.selectedStore?.price || 0) * item.quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  {confirmDeleteId === item.product.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveItem(item.product.id); setConfirmDeleteId(null); }}
                        className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        Yes, remove
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(item.product.id); }}
                      className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors relative z-10"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* List Footer */}
        {shoppingList.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div>
                  <p className="text-sm text-gray-600">
                    {checkedItems.length} of {shoppingList.length} items checked
                  </p>
                  {checkedItems.length > 0 && (
                    <p className="text-sm text-green-600">
                      Checked items total: LKR {Math.round(checkedTotal)}
                    </p>
                  )}
                </div>
                {checkedItems.length > 0 && (
                  <button
                    onClick={onClearChecked}
                    className="px-3 py-1 text-sm rounded-md border border-amber-300 text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    Clear Checked
                  </button>
                )}
                {shoppingList.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="px-3 py-1 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">LKR {Math.round(totalCost)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
