import { useState } from 'react';
import { ShoppingCart, Plus, AlertTriangle, DollarSign, Heart, Check, Edit, Trash2, X } from 'lucide-react';

const ProductCard = ({ product, onAddToList, isInList, onUpdate, onDelete }) => {
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: product.name,
    quantity: product.quantity,
    unit: product.unit
  });

const handleAddToList = () => {
    const priceValue = parseFloat(price) || 0;
    onAddToList(product, { price: priceValue });
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Pre-populate edit form with current product data
    setEditForm({
      name: product.name,
      quantity: product.quantity,
      unit: product.unit
    });
  };

  const handleSave = () => {
    console.log('Saving product:', editForm);
    onUpdate(product.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: product.name,
      quantity: product.quantity,
      unit: product.unit
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(product.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group relative">
      <div className="p-4">
        {/* Product Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ingredient name"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({...editForm, quantity: parseFloat(e.target.value) || 1})}
                    className="w-24 px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Quantity"
                    min="0"
                    step="0.1"
                  />
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
                    className="px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.quantity} {product.unit}</p>
              </>
            )}
          </div>
          <div className="flex gap-2 z-10 relative">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit ingredient"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {showDeleteConfirm ? (
  <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
    <span className="text-xs text-red-700 font-medium whitespace-nowrap">Delete?</span>
    <button
      onClick={handleCancelDelete}
      className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={handleConfirmDelete}
      className="px-2 py-0.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
    >
      OK
    </button>
  </div>
) : (
  <button
    onClick={handleDelete}
    className="p-1 text-red-600 hover:text-red-800 transition-colors"
    title="Delete ingredient"
  >
    <Trash2 className="w-4 h-4" />
  </button>
)}
              </>
            )}
          </div>
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Price (LKR):</div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full px-4 py-2 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
            min="0"
            step="0.01"
          />
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
