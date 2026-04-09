import React, { useState, useEffect } from 'react';
import { mealService } from '../../services/mealService';

const EditMeal = ({ mealId, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    ingredients: [{ name: '', quantity: '', calories: '' }],
    instructions: [''],
    nutrition: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    },
    servingSizeGrams: ''
  });
  //

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMealData();
  }, [mealId]);

  const fetchMealData = async () => {
    try {
      setFetchLoading(true);
      const response = await mealService.getMealById(mealId);
      const meal = response.data;
      
      setFormData({
        name: meal.name || '',
        image: meal.image || '',
        description: meal.description || '',
        ingredients: meal.ingredients?.length > 0 ? meal.ingredients : [{ name: '', quantity: '', calories: '' }],
        instructions: meal.instructions?.length > 0 ? meal.instructions : [''],
        nutrition: {
          calories: meal.nutrition?.calories?.toString() || '',
          protein: meal.nutrition?.protein?.toString() || '',
          carbs: meal.nutrition?.carbs?.toString() || '',
          fat: meal.nutrition?.fat?.toString() || ''
        },
        servingSizeGrams: meal.servingSizeGrams?.toString() || ''
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch meal data');
      console.error('Error fetching meal:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [name]: value
      }
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', calories: '' }]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: updatedIngredients
      }));
    }
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData(prev => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const updatedInstructions = formData.instructions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        instructions: updatedInstructions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Basic client-side validation
      if (!formData.name || formData.name.trim() === '') {
        setError('Meal name is required');
        setLoading(false);
        return;
      }
      if (!formData.description || formData.description.trim() === '') {
        setError('Description is required');
        setLoading(false);
        return;
      }
      if (!formData.servingSizeGrams || formData.servingSizeGrams < 1) {
        setError('Serving size must be at least 1 gram');
        setLoading(false);
        return;
      }

      // Convert string numbers to actual numbers
      const mealData = {
        ...formData,
        ingredients: formData.ingredients.map(ing => ({
          ...ing,
          calories: parseFloat(ing.calories) || 0
        })),
        nutrition: {
          calories: parseFloat(formData.nutrition.calories) || 0,
          protein: parseFloat(formData.nutrition.protein) || 0,
          carbs: parseFloat(formData.nutrition.carbs) || 0,
          fat: parseFloat(formData.nutrition.fat) || 0
        },
        servingSizeGrams: parseFloat(formData.servingSizeGrams) || 0
      };

      // Handle image field - if empty, provide a default asset path
      if (!mealData.image || mealData.image.trim() === '') {
        mealData.image = '/assets/meals/default-meal.jpg';
      }

      console.log('Submitting meal data:', mealData);

      const response = await mealService.updateMeal(mealId, mealData);
      setSuccess('Meal updated successfully!');
      console.log('Updated meal:', response.data);
    } catch (err) {
      console.error('Update error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update meal');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-500">Loading meal data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('meal-detail', { mealId })}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
        >
          ← Back to Details
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Edit Meal</h1>
          <p className="text-orange-100">Update your meal information and nutrition details</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6" noValidate>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meal Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Serving Size (grams) *
                </label>
                <input
                  type="number"
                  name="servingSizeGrams"
                  value={formData.servingSizeGrams}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="5000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="250"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="https://example.com/image.jpg OR /assets/meals/filename.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Valid formats: jpg, jpeg, png, gif, webp. Leave empty to use default image.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your meal in detail..."
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Ingredients</h3>
              <button
                type="button"
                onClick={addIngredient}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center"
              >
                Add Ingredient
              </button>
            </div>

            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={ingredient.calories}
                      onChange={(e) => handleIngredientChange(index, 'calories', e.target.value)}
                      placeholder="Calories"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Cooking Instructions</h3>
              <button
                type="button"
                onClick={addInstruction}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center"
              >
                Add Step
              </button>
            </div>

            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={`Step ${index + 1}: Describe cooking step...`}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Nutrition Information */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Information (per serving)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.nutrition.calories}
                  onChange={handleNutritionChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                  placeholder="400"
                />
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={formData.nutrition.protein}
                  onChange={handleNutritionChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                  placeholder="35"
                />
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={formData.nutrition.carbs}
                  onChange={handleNutritionChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                  placeholder="20"
                />
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
                <input
                  type="number"
                  name="fat"
                  value={formData.nutrition.fat}
                  onChange={handleNutritionChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Updating Meal...
                </>
              ) : (
                <>
                  Update Meal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMeal;
