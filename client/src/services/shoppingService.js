import api from './api';
import { normalizeIngredientName } from '../features/shopping/utils/ingredientNormalizer';

// Add meal ingredients to shopping list
export const addMealToShopping = async (mealId) => {
  try {
    // First, get the meal details
    const mealResponse = await api.get(`/meals/${mealId}`);
    console.log('Full meal response structure:', JSON.stringify(mealResponse.data, null, 2));
    const meal = mealResponse.data.data;
    
    console.log('Meal object keys:', Object.keys(meal || {}));
    console.log('Full meal object:', JSON.stringify(meal, null, 2));
    
    // Check if meal exists and has ingredients
    if (!meal) {
      return {
        success: false,
        error: 'Meal not found'
      };
    }
    
    // Try different possible ingredient locations
    let ingredients = null;
    if (meal.ingredients && Array.isArray(meal.ingredients)) {
      ingredients = meal.ingredients;
    } else if (meal.data && meal.data.ingredients && Array.isArray(meal.data.ingredients)) {
      ingredients = meal.data.ingredients;
    } else if (meal.meal && meal.meal.ingredients && Array.isArray(meal.meal.ingredients)) {
      ingredients = meal.meal.ingredients;
    }
    
    console.log('Found ingredients:', ingredients);
    
    if (!ingredients || ingredients.length === 0) {
      return {
        success: false,
        error: 'Meal has no ingredients'
      };
    }
    
    // Extract ingredients with name, quantity, and extract unit from quantity string
    const processedIngredients = ingredients.map(ingredient => {
      // Parse quantity string to extract number and unit
      const quantityStr = ingredient.quantity || '1';
      const quantityMatch = quantityStr.match(/^(\d+\.?\d*)\s*(.*)$/);
      const quantity = quantityMatch ? parseFloat(quantityMatch[1]) : 1;
      const unit = quantityMatch && quantityMatch[2].trim() ? quantityMatch[2].trim() : 'pcs';
      
      return {
        name: normalizeIngredientName(ingredient.name),
        quantity: quantity,
        unit: unit
      };
    });
    
    // Create shopping list with meal ingredients
    // Send ingredients directly with required fields
    const shoppingListData = {
      name: `${meal.name} Ingredients`,
      recipes: [],
      ingredients: processedIngredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        purchased: false,
        consolidated: false
      }))
    };
    
    console.log('Sending shopping list data:', JSON.stringify(shoppingListData, null, 2));
    
    // Post to shopping endpoint
    const shoppingResponse = await api.post('/shopping', shoppingListData);
    console.log('Shopping API response:', JSON.stringify(shoppingResponse, null, 2));
    console.log('Shopping API response status:', shoppingResponse.status);
    console.log('Shopping API response data:', JSON.stringify(shoppingResponse.data, null, 2));
    
    return {
      success: true,
      data: shoppingResponse.data
    };
  } catch (error) {
    console.error('Error in addMealToShopping:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to add meal ingredients to shopping list'
    };
  }
};

// Update single ingredient
export const updateIngredient = async (ingredientId, data) => {
  try {
    const response = await api.patch(`/shopping/ingredient/${ingredientId}`, {
      name: data.name,
      quantity: data.quantity,
      unit: data.unit
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in updateIngredient:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update ingredient'
    };
  }
};

// Delete single ingredient
export const deleteIngredient = async (ingredientId) => {
  try {
    const response = await api.delete(`/shopping/ingredient/${ingredientId}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in deleteIngredient:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete ingredient'
    };
  }
};
