import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHealthProfile } from '../../services/healthService';
import { 
  User, 
  Activity, 
  Target, 
  Clock, 
  Utensils,
  Heart,
  ChevronLeft,
  Save
} from 'lucide-react';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    profile_name: '',
    user_profile: {
      age: '',
      gender: '',
      height_cm: '',
      weight_kg: '',
      target_weight_kg: '',
      activity_level: '',
      allergies: [],
      goal: '',
      target_areas: [],
      dietary_preference: '',
      medical_conditions: [],
      exercise: {
        type: '',
        frequency: '',
        duration_min: ''
      },
      sleep_hours: '',
      water_intake: '',
      meal_frequency: '',
      cooking_time: '',
      cuisine_preferences: []
    }
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [medicalConditionInput, setMedicalConditionInput] = useState('');
  const [targetAreaInput, setTargetAreaInput] = useState('');
  const [cuisineInput, setCuisineInput] = useState('');

  const totalSteps = 4;

  const commonAllergies = [
    'Peanuts', 'Tree nuts', 'Shellfish', 'Fish', 'Milk', 'Eggs', 
    'Wheat', 'Soy', 'Sesame', 'Gluten', 'Lactose'
  ];

  const commonMedicalConditions = [
    'Diabetes', 'Hypertension', 'Heart disease', 'Asthma', 'Arthritis',
    'Thyroid', 'Kidney disease', 'Liver disease', 'Anemia'
  ];

  const commonTargetAreas = [
    'Belly', 'Arms', 'Thighs', 'Buttocks', 'Chest', 'Back', 'Full body'
  ];

  const commonCuisines = [
    'Italian', 'Asian', 'Mexican', 'Indian', 'Mediterranean', 
    'American', 'Chinese', 'Japanese', 'Thai', 'French'
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'lightly active', label: 'Lightly active (1-3 days/week)' },
    { value: 'moderately active', label: 'Moderately active (3-5 days/week)' },
    { value: 'very active', label: 'Very active (6-7 days/week)' },
    { value: 'extra active', label: 'Extra active (very hard exercise/physical job)' }
  ];

  const exerciseTypes = [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'flexibility', label: 'Flexibility/Yoga' },
    { value: 'balance', label: 'Balance' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'none', label: 'No Exercise' }
  ];

  const dietaryPreferences = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'non-vegetarian', label: 'Non-Vegetarian' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
    { value: 'other', label: 'Other' }
  ];

  const cookingTimes = [
    { value: '< 15 min', label: 'Less than 15 minutes' },
    { value: '15-30 min', label: '15-30 minutes' },
    { value: '30-60 min', label: '30-60 minutes' },
    { value: '> 60 min', label: 'More than 60 minutes' }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const addToArray = (field, value) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !formData.user_profile[field].includes(trimmedValue)) {
      setFormData(prev => ({
        ...prev,
        user_profile: {
          ...prev.user_profile,
          [field]: [...prev.user_profile[field], trimmedValue]
        }
      }));
      return true;
    }
    return false;
  };

  const removeFromArray = (field, valueToRemove) => {
    setFormData(prev => ({
      ...prev,
      user_profile: {
        ...prev.user_profile,
        [field]: prev.user_profile[field].filter(item => item !== valueToRemove)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await createHealthProfile(formData);
      if (response.data.success) {
        navigate('/health-dashboard', { 
          state: { message: 'Health profile created successfully!' } 
        });
      } else {
        setError(response.data.message || 'Failed to create health profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Name
              </label>
              <input
                type="text"
                value={formData.profile_name}
                onChange={(e) => setFormData(prev => ({ ...prev, profile_name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="My Health Profile"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.user_profile.age}
                  onChange={(e) => handleInputChange('user_profile', 'age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="25"
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.user_profile.gender}
                  onChange={(e) => handleInputChange('user_profile', 'gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.user_profile.height_cm}
                  onChange={(e) => handleInputChange('user_profile', 'height_cm', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="175"
                  min="50"
                  max="300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.user_profile.weight_kg}
                  onChange={(e) => handleInputChange('user_profile', 'weight_kg', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="70"
                  min="20"
                  max="500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.user_profile.target_weight_kg}
                  onChange={(e) => handleInputChange('user_profile', 'target_weight_kg', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="65"
                  min="20"
                  max="500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal
              </label>
              <select
                value={formData.user_profile.goal}
                onChange={(e) => handleInputChange('user_profile', 'goal', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select your goal</option>
                <option value="lose">Lose weight</option>
                <option value="gain">Gain weight</option>
                <option value="maintain">Maintain weight</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                value={formData.user_profile.activity_level}
                onChange={(e) => handleInputChange('user_profile', 'activity_level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select activity level</option>
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Exercise Type</label>
                  <select
                    value={formData.user_profile.exercise.type}
                    onChange={(e) => handleNestedInputChange('user_profile', 'exercise', 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {exerciseTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Frequency (days/week)</label>
                  <input
                    type="number"
                    value={formData.user_profile.exercise.frequency}
                    onChange={(e) => handleNestedInputChange('user_profile', 'exercise', 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="3"
                    min="0"
                    max="7"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.user_profile.exercise.duration_min}
                    onChange={(e) => handleNestedInputChange('user_profile', 'exercise', 'duration_min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="45"
                    min="0"
                    max="480"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Hours
                </label>
                <input
                  type="number"
                  value={formData.user_profile.sleep_hours}
                  onChange={(e) => handleInputChange('user_profile', 'sleep_hours', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="8"
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Intake (liters)
                </label>
                <input
                  type="number"
                  value={formData.user_profile.water_intake}
                  onChange={(e) => handleInputChange('user_profile', 'water_intake', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="2.5"
                  min="0"
                  max="20"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Frequency
                </label>
                <input
                  type="number"
                  value={formData.user_profile.meal_frequency}
                  onChange={(e) => handleInputChange('user_profile', 'meal_frequency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="3"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooking Time Preference
                </label>
                <select
                  value={formData.user_profile.cooking_time}
                  onChange={(e) => handleInputChange('user_profile', 'cooking_time', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select preference</option>
                  {cookingTimes.map(time => (
                    <option key={time.value} value={time.value}>{time.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preference
              </label>
              <select
                value={formData.user_profile.dietary_preference}
                onChange={(e) => handleInputChange('user_profile', 'dietary_preference', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select dietary preference</option>
                {dietaryPreferences.map(pref => (
                  <option key={pref.value} value={pref.value}>{pref.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Allergies (Click to add common allergies)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonAllergies.map((allergy) => (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => addToArray('allergies', allergy)}
                    disabled={formData.user_profile.allergies.includes(allergy)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.user_profile.allergies.includes(allergy)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (addToArray('allergies', allergyInput)) {
                        setAllergyInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter custom allergy"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (addToArray('allergies', allergyInput)) {
                      setAllergyInput('');
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.user_profile.allergies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.user_profile.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeFromArray('allergies', allergy)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Medical Conditions (Click to add common conditions)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonMedicalConditions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => addToArray('medical_conditions', condition)}
                    disabled={formData.user_profile.medical_conditions.includes(condition)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.user_profile.medical_conditions.includes(condition)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={medicalConditionInput}
                  onChange={(e) => setMedicalConditionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (addToArray('medical_conditions', medicalConditionInput)) {
                        setMedicalConditionInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter custom medical condition"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (addToArray('medical_conditions', medicalConditionInput)) {
                      setMedicalConditionInput('');
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.user_profile.medical_conditions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.user_profile.medical_conditions.map((condition) => (
                    <span
                      key={condition}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeFromArray('medical_conditions', condition)}
                        className="ml-1 hover:text-yellow-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Areas (Click to add)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonTargetAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => addToArray('target_areas', area)}
                    disabled={formData.user_profile.target_areas.includes(area)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.user_profile.target_areas.includes(area)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetAreaInput}
                  onChange={(e) => setTargetAreaInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (addToArray('target_areas', targetAreaInput)) {
                        setTargetAreaInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter custom target area"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (addToArray('target_areas', targetAreaInput)) {
                      setTargetAreaInput('');
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.user_profile.target_areas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.user_profile.target_areas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => removeFromArray('target_areas', area)}
                        className="ml-1 hover:text-purple-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cuisine Preferences (Click to add)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonCuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => addToArray('cuisine_preferences', cuisine)}
                    disabled={formData.user_profile.cuisine_preferences.includes(cuisine)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.user_profile.cuisine_preferences.includes(cuisine)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (addToArray('cuisine_preferences', cuisineInput)) {
                        setCuisineInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter custom cuisine preference"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (addToArray('cuisine_preferences', cuisineInput)) {
                      setCuisineInput('');
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.user_profile.cuisine_preferences.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.user_profile.cuisine_preferences.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {cuisine}
                      <button
                        type="button"
                        onClick={() => removeFromArray('cuisine_preferences', cuisine)}
                        className="ml-1 hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Health Profile</h1>
            <p className="text-orange-100">Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
              >
                Next
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Profile
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>ZeroHunger Health Dashboard</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
