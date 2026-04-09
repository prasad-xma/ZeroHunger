import React, { useState, useEffect } from 'react';
import { mealService } from '../../services/mealService';
import { 
  Plus, 
  Minus, 
  X, 
  Upload, 
  Image as ImageIcon, 
  ChefHat, 
  Clock, 
  Zap, 
  Award, 
  TrendingUp, 
  Target, 
  Flame, 
  Heart, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Sparkles,
  BarChart3,
  Calculator,
  Utensils,
  Apple,
  Coffee,
  Cookie,
  Camera,
  Brain,
  Lightbulb,
  Timer,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  ArrowRight,
  ArrowLeft,
  Users,
  Activity,
  Wind,
  Droplets
} from 'lucide-react';

const AddMeal = ({ onNavigate }) => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [totalSteps] = useState(4);
  const [imagePreview, setImagePreview] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    calculateFormProgress();
    generateSmartSuggestions();
  }, [formData]);

  const calculateFormProgress = () => {
    let progress = 0;
    const fields = ['name', 'image', 'description', 'servingSizeGrams'];
    fields.forEach(field => {
      if (formData[field]) progress += 10;
    });
    
    if (formData.ingredients.every(ing => ing.name && ing.quantity && ing.calories)) progress += 20;
    if (formData.instructions.every(inst => inst.trim())) progress += 20;
    if (formData.nutrition.calories && formData.nutrition.protein && formData.nutrition.carbs && formData.nutrition.fat) progress += 20;
    
    setFormProgress(Math.min(progress, 100));
  };

  const generateSmartSuggestions = () => {
    const smart = [
      { name: 'High Protein Bowl', type: 'protein', icon: Target, color: 'red' },
      { name: 'Low Carb Wrap', type: 'lowcarb', icon: Wind, color: 'blue' },
      { name: 'Energy Smoothie', type: 'energy', icon: Zap, color: 'yellow' },
      { name: 'Mediterranean Plate', type: 'healthy', icon: Heart, color: 'green' }
    ];
    setSmartSuggestions(smart);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Generate suggestions for meal names
    if (name === 'name' && value.length > 2) {
      generateMealSuggestions(value);
    }
  };

  const applySmartSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.name
    }));
    setSuggestions([]);
  };

  const generateMealSuggestions = (query) => {
    const mealSuggestions = [
      'Grilled Chicken Salad', 'Protein Smoothie Bowl', 'Vegetable Stir Fry',
      'Salmon with Quinoa', 'Turkey Wrap', 'Greek Yogurt Parfait',
      'Egg White Omelette', 'Lean Beef Bowl', 'Tuna Salad Sandwich'
    ];
    
    const filtered = mealSuggestions.filter(meal => 
      meal.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 3));
  };

  const handleImageChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, image: value }));
    
    if (value && (value.startsWith('http') || value.startsWith('/assets/'))) {
      setImagePreview(value);
    } else {
      setImagePreview('');
    }
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

  const nextStep = () => {
    if (activeStep < totalSteps) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Meal name is required');
      }
      if (formData.name.trim().length < 2) {
        throw new Error('Meal name must be at least 2 characters long');
      }
      if (formData.name.trim().length > 100) {
        throw new Error('Meal name must be less than 100 characters');
      }

      if (!formData.image.trim()) {
        throw new Error('Image URL is required');
      }
      // Validate image URL format (accept both external URLs and local asset paths)
      const externalImageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
      const localAssetRegex = /^\/assets\/meals\/.+\.(jpg|jpeg|png|gif|webp)$/i;
      if (!externalImageRegex.test(formData.image.trim()) && !localAssetRegex.test(formData.image.trim())) {
        throw new Error('Image URL must be a valid image URL (jpg, jpeg, png, gif, or webp) or local asset path (/assets/meals/filename.jpg)');
      }

      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (formData.description.trim().length < 10) {
        throw new Error('Description must be at least 10 characters long');
      }
      if (formData.description.trim().length > 500) {
        throw new Error('Description must be less than 500 characters');
      }

      if (!formData.servingSizeGrams || formData.servingSizeGrams < 1) {
        throw new Error('Serving size must be at least 1 gram');
      }
      if (formData.servingSizeGrams > 5000) {
        throw new Error('Serving size must be less than 5000 grams');
      }

      // Validate ingredients
      const validIngredients = formData.ingredients.filter(ing => 
        ing.name.trim() && ing.quantity.trim() && ing.calories !== ''
      );
      
      if (validIngredients.length === 0) {
        throw new Error('At least one ingredient is required');
      }

      for (const ingredient of validIngredients) {
        if (!ingredient.name.trim()) {
          throw new Error('Ingredient name is required');
        }
        if (ingredient.name.trim().length > 100) {
          throw new Error('Ingredient name must be less than 100 characters');
        }
        if (!ingredient.quantity.trim()) {
          throw new Error('Ingredient quantity is required');
        }
        if (ingredient.quantity.trim().length > 50) {
          throw new Error('Ingredient quantity must be less than 50 characters');
        }
        const calories = parseFloat(ingredient.calories);
        if (isNaN(calories) || calories < 0) {
          throw new Error('Ingredient calories must be a positive number');
        }
        if (calories > 10000) {
          throw new Error('Ingredient calories must be less than 10000');
        }
      }

      // Validate instructions
      const validInstructions = formData.instructions.filter(inst => inst.trim());
      if (validInstructions.length === 0) {
        throw new Error('At least one instruction step is required');
      }

      for (const instruction of validInstructions) {
        if (!instruction.trim()) {
          throw new Error('Instruction step cannot be empty');
        }
        if (instruction.trim().length > 200) {
          throw new Error('Each instruction step must be less than 200 characters');
        }
      }

      // Validate nutrition
      const calories = parseFloat(formData.nutrition.calories);
      const protein = parseFloat(formData.nutrition.protein);
      const carbs = parseFloat(formData.nutrition.carbs);
      const fat = parseFloat(formData.nutrition.fat);

      if (isNaN(calories) || calories < 0 || calories > 10000) {
        throw new Error('Calories must be between 0 and 10000');
      }
      if (isNaN(protein) || protein < 0 || protein > 500) {
        throw new Error('Protein must be between 0 and 500 grams');
      }
      if (isNaN(carbs) || carbs < 0 || carbs > 1000) {
        throw new Error('Carbs must be between 0 and 1000 grams');
      }
      if (isNaN(fat) || fat < 0 || fat > 500) {
        throw new Error('Fat must be between 0 and 500 grams');
      }

      // Format and clean data
      const mealData = {
        name: formData.name.trim(),
        image: formData.image.trim(),
        description: formData.description.trim(),
        ingredients: validIngredients.map(ing => ({
          name: ing.name.trim(),
          quantity: ing.quantity.trim(),
          calories: parseFloat(ing.calories)
        })),
        instructions: validInstructions.map(inst => inst.trim()),
        nutrition: {
          calories: calories,
          protein: protein,
          carbs: carbs,
          fat: fat
        },
        servingSizeGrams: parseFloat(formData.servingSizeGrams)
      };

      console.log('Sending meal data:', mealData);
      const response = await mealService.createMeal(mealData);
      setSuccess('Meal created successfully!');
      
      // Reset form
      setFormData({
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
      setImagePreview('');
      setActiveStep(1);
      
      console.log('Created meal:', response.data);
    } catch (err) {
      // Handle different error types
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create meal. Please check all fields and try again.');
      }
      console.error('Error creating meal:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Enhanced Meal Name */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <ChefHat className="w-4 h-4 text-orange-500" />
                <span>Meal Name *</span>
                <span className="text-xs text-gray-500">(2-100 characters)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Utensils className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength="2"
                  maxLength="100"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                  placeholder="e.g., Grilled Chicken Salad"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, name: suggestion }));
                          setSuggestions([]);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center space-x-3"
                      >
                        <Utensils className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Serving Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>Serving Size (grams) *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-sm text-gray-500 font-medium">g</span>
                  </div>
                  <input
                    type="number"
                    name="servingSizeGrams"
                    value={formData.servingSizeGrams}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="5000"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    placeholder="250"
                  />
                </div>
              </div>

              {/* Enhanced Image Upload */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Camera className="w-4 h-4 text-green-500" />
                  <span>Image URL *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleImageChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                    placeholder="/assets/meals/meal-image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Image Preview */}
            {imagePreview && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative rounded-2xl overflow-hidden border-2 border-green-200 shadow-xl">
                  <img
                    src={imagePreview}
                    alt="Meal preview"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Live Preview</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Description */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span>Description *</span>
                <span className="text-xs text-gray-500">(10-500 characters)</span>
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  minLength="10"
                  maxLength="500"
                  rows="4"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none text-lg"
                  placeholder="Describe your meal in detail, including taste, texture, and cooking method..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-lg border">
                  {formData.description.length}/500
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-4">
                <Apple className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ingredients</h3>
              <p className="text-gray-600">Add all the ingredients that make up your meal</p>
            </div>

            <div className="space-y-4">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="Ingredient name"
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="text"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={ingredient.calories}
                        onChange={(e) => handleIngredientChange(index, 'calories', e.target.value)}
                        placeholder="Calories"
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addIngredient}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Add Ingredient
            </button>

                      </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-4">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Cooking Instructions</h3>
              <p className="text-gray-600">Share the step-by-step cooking process</p>
            </div>

            <div className="space-y-4">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
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
                      className="px-3 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                    >
                      <Minus size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addInstruction}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Add Step
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-4">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Nutrition Information</h3>
              <p className="text-gray-600">Add the nutritional values per serving</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                <div className="relative">
                  <Flame className="absolute top-3 right-3 w-5 h-5 text-orange-500" />
                  <input
                    type="number"
                    name="calories"
                    value={formData.nutrition.calories}
                    onChange={handleNutritionChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white pr-10"
                    placeholder="400"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                <div className="relative">
                  <Target className="absolute top-3 right-3 w-5 h-5 text-amber-500" />
                  <input
                    type="number"
                    name="protein"
                    value={formData.nutrition.protein}
                    onChange={handleNutritionChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white pr-10"
                    placeholder="35"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                <div className="relative">
                  <Cookie className="absolute top-3 right-3 w-5 h-5 text-orange-500" />
                  <input
                    type="number"
                    name="carbs"
                    value={formData.nutrition.carbs}
                    onChange={handleNutritionChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white pr-10"
                    placeholder="20"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
                <div className="relative">
                  <Heart className="absolute top-3 right-3 w-5 h-5 text-amber-500" />
                  <input
                    type="number"
                    name="fat"
                    value={formData.nutrition.fat}
                    onChange={handleNutritionChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white pr-10"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

                      </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50'}`}>
      {/* Unique Animated Background for AddMeal - MealGallery Colors */}
      <div className="fixed top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full filter blur-3xl opacity-30 animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full filter blur-3xl opacity-25 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-300 to-orange-300 rounded-full filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        
        {/* Unique geometric patterns with MealGallery colors */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg rotate-45 opacity-10 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-15 animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-orange-300 rounded-full opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden border border-orange-200 transform hover:scale-[1.01] transition-transform duration-300">
          {/* Unique Header with Diamond Pattern - MealGallery Colors */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-8 text-white relative overflow-hidden">
            {/* Diamond pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M30 5L55 30L30 55L5 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3 flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    Creative Meal Studio
                  </h1>
                  <p className="text-orange-100 text-lg">Design extraordinary meals with intelligent assistance</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1 bg-white/20 px-4 py-2 rounded-xl">{activeStep}/{totalSteps}</div>
                  <p className="text-sm text-orange-100">Creative Step</p>
                </div>
              </div>
            </div>
          </div>

          {/* Unique Wave Progress Bar - MealGallery Colors */}
          <div className="h-4 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 transition-all duration-700 relative"
              style={{ width: `${(activeStep / totalSteps) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
            {/* Wave effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-wave"></div>
            </div>
          </div>

          {/* Enhanced Form Progress with Unique Design - MealGallery Colors */}
          <div className="px-8 py-6 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-b border-orange-200 relative">
            {/* Decorative circles */}
            <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-15 animate-bounce"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Creative Progress</span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-orange-600 mr-2">{formProgress}%</span>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 h-4 rounded-full transition-all duration-500 relative"
                style={{ width: `${formProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                {/* Particle effect */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

                    
          {error && (
            <div className="px-8 py-4 bg-red-50 border-b border-red-200">
              <p className="text-red-600 font-medium flex items-center">
                <AlertCircle className="w-6 h-6 mr-3" />
                Validation Error:
              </p>
              <p className="text-red-600 text-sm mt-2 ml-9">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="px-8 py-4 bg-green-50 border-b border-green-200">
              <p className="text-green-600 font-medium flex items-center">
                <CheckCircle className="w-6 h-6 mr-3" />
                {success}
              </p>
            </div>
          )}

          {/* Enhanced Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            {renderStepContent()}

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={prevStep}
                disabled={activeStep === 1}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold"
              >
                <ArrowLeft size={24} className="mr-3" />
                Previous
              </button>

              {activeStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center text-lg font-semibold"
                >
                  Next
                  <ArrowRight size={24} className="ml-3" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      Creating Meal...
                    </>
                  ) : (
                    <>
                      <Save size={24} className="mr-3" />
                      Create Meal
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMeal;
