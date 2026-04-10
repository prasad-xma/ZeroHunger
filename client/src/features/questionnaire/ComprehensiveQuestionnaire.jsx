import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAllergyRecommendations } from '../../services/aiFoodAllergyService';
import { createHealthProfile, generateHealthAdvice } from '../../services/healthService';
import {
  Heart,
  Activity,
  Shield,
  Utensils,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Check,
  User,
  AlertTriangle
} from 'lucide-react';

const HealthQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Personal Information
    personal: {
      age: '',
      gender: '',
      height_cm: '',
      weight_kg: '',
      target_weight_kg: '',
      activity_level: '',
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
    },
    // Allergies
    allergies: [],
    // Lifestyle Preferences
    lifestyle: {
      stress_level: '',
      work_environment: '',
      eating_habits: '',
      cooking_skills: '',
      budget_preference: '',
      time_constraints: ''
    }
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [medicalConditionInput, setMedicalConditionInput] = useState('');
  const [targetAreaInput, setTargetAreaInput] = useState('');
  const [cuisineInput, setCuisineInput] = useState('');

  const commonAllergies = [
    'Peanuts', 'Tree nuts', 'Shellfish', 'Fish', 'Milk', 'Eggs',
    'Wheat', 'Soy', 'Sesame', 'Gluten', 'Lactose', 'Corn'
  ];

  const commonMedicalConditions = [
    'Diabetes', 'Hypertension', 'Heart disease', 'Asthma', 'Arthritis',
    'Thyroid', 'Kidney disease', 'Liver disease', 'Anemia', 'High cholesterol'
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

  const addToArray = (section, fieldOrValue, value) => {
    const isTopLevelArray = typeof value === 'undefined';
    const arrayField = isTopLevelArray ? section : fieldOrValue;
    const actualValue = isTopLevelArray ? fieldOrValue : value;
    const trimmedValue = actualValue.trim();

    if (!trimmedValue) {
      return false;
    }

    const currentArray = isTopLevelArray ? formData[arrayField] : formData[section][arrayField];
    if (currentArray.includes(trimmedValue)) {
      return false;
    }

    setFormData(prev => ({
      ...prev,
      [section]: isTopLevelArray
        ? [...prev[arrayField], trimmedValue]
        : {
          ...prev[section],
          [arrayField]: [...prev[section][arrayField], trimmedValue]
        }
    }));

    return true;
  };

  const removeFromArray = (section, fieldOrValue, valueToRemove) => {
    const isTopLevelArray = typeof valueToRemove === 'undefined';
    const arrayField = isTopLevelArray ? section : fieldOrValue;
    const actualValue = isTopLevelArray ? fieldOrValue : valueToRemove;

    setFormData(prev => ({
      ...prev,
      [section]: isTopLevelArray
        ? prev[arrayField].filter(item => item !== actualValue)
        : {
          ...prev[section],
          [arrayField]: prev[section][arrayField].filter(item => item !== actualValue)
        }
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // If user has allergies, submit them to the allergy API
      if (formData.allergies.length > 0) {
        try {
          await generateAllergyRecommendations(formData.allergies);
        } catch (allergyErr) {
          console.warn('Failed to generate allergy recommendations:', allergyErr);
          // Don't fail the submission if allergy API fails
        }
      }

      // Create new health recommendation profile
      let createdProfileId = null;
      try {
        const profileData = {
          profile_name: 'Main Health Profile',
          user_profile: {
            ...formData.personal,
            allergies: formData.allergies
          }
        };
        const profileRes = await createHealthProfile(profileData);
        if (profileRes.data && profileRes.data.success && profileRes.data.data) {
          createdProfileId = profileRes.data.data._id;
        }
      } catch (profileErr) {
        console.warn('Failed to create health profile:', profileErr);
        throw new Error('Failed to create health profile');
      }

      // Generate health advice based on the new profile
      if (createdProfileId) {
        try {
          await generateHealthAdvice(createdProfileId);
        } catch (adviceErr) {
          console.warn('Failed to generate health advice:', adviceErr);
        }
      }

      const payload = {
        submittedAt: new Date().toISOString(),
        formData,
      };
      localStorage.setItem('healthQuestionnaireResult', JSON.stringify(payload));
      navigate('/health-dashboard');
    } catch (err) {
      setError(err.message || 'Failed to submit questionnaire. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormKeyDown = (e) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (e.key === 'Enter' && (targetTag === 'input' || targetTag === 'select')) {
      e.preventDefault();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-orange-500" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.personal.age}
                  onChange={(e) => handleInputChange('personal', 'age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="25"
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.personal.gender}
                  onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.personal.height_cm}
                  onChange={(e) => handleInputChange('personal', 'height_cm', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="175"
                  min="50"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
                <input
                  type="number"
                  value={formData.personal.weight_kg}
                  onChange={(e) => handleInputChange('personal', 'weight_kg', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="70"
                  min="20"
                  max="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (kg)</label>
                <input
                  type="number"
                  value={formData.personal.target_weight_kg}
                  onChange={(e) => handleInputChange('personal', 'target_weight_kg', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="65"
                  min="20"
                  max="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                <select
                  value={formData.personal.goal}
                  onChange={(e) => handleInputChange('personal', 'goal', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select your goal</option>
                  <option value="lose">Lose weight</option>
                  <option value="gain">Gain weight</option>
                  <option value="maintain">Maintain weight</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                <select
                  value={formData.personal.activity_level}
                  onChange={(e) => handleInputChange('personal', 'activity_level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select activity level</option>
                  {activityLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                <select
                  value={formData.personal.dietary_preference}
                  onChange={(e) => handleInputChange('personal', 'dietary_preference', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select dietary preference</option>
                  {dietaryPreferences.map(pref => (
                    <option key={pref.value} value={pref.value}>{pref.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-orange-500" />
              Health & Allergies
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Food Allergies (Click to add common allergies)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonAllergies.map((allergy) => (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => addToArray('allergies', allergy)}
                    disabled={formData.allergies.includes(allergy)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.allergies.includes(allergy)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
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

              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy) => (
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
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Medical Conditions (Click to add common conditions)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonMedicalConditions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => addToArray('personal', 'medical_conditions', condition)}
                    disabled={formData.personal.medical_conditions.includes(condition)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.personal.medical_conditions.includes(condition)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={medicalConditionInput}
                  onChange={(e) => setMedicalConditionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (addToArray('personal', 'medical_conditions', medicalConditionInput)) {
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
                    if (addToArray('personal', 'medical_conditions', medicalConditionInput)) {
                      setMedicalConditionInput('');
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.personal.medical_conditions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.personal.medical_conditions.map((condition) => (
                    <span
                      key={condition}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeFromArray('personal', 'medical_conditions', condition)}
                        className="ml-1 hover:text-yellow-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-orange-500" />
              Lifestyle & Exercise
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Type</label>
                <select
                  value={formData.personal.exercise.type}
                  onChange={(e) => handleNestedInputChange('personal', 'exercise', 'type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select exercise type</option>
                  {exerciseTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Frequency (days/week)</label>
                <input
                  type="number"
                  value={formData.personal.exercise.frequency}
                  onChange={(e) => handleNestedInputChange('personal', 'exercise', 'frequency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="3"
                  min="0"
                  max="7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.personal.exercise.duration_min}
                  onChange={(e) => handleNestedInputChange('personal', 'exercise', 'duration_min', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="45"
                  min="0"
                  max="480"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Hours</label>
                <input
                  type="number"
                  value={formData.personal.sleep_hours}
                  onChange={(e) => handleInputChange('personal', 'sleep_hours', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="8"
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (liters)</label>
                <input
                  type="number"
                  value={formData.personal.water_intake}
                  onChange={(e) => handleInputChange('personal', 'water_intake', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="2.5"
                  min="0"
                  max="20"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Frequency</label>
                <input
                  type="number"
                  value={formData.personal.meal_frequency}
                  onChange={(e) => handleInputChange('personal', 'meal_frequency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="3"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Time Preference</label>
                <select
                  value={formData.personal.cooking_time}
                  onChange={(e) => handleInputChange('personal', 'cooking_time', e.target.value)}
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

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-orange-500" />
              Preferences & Goals
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Target Areas (Click to add)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonTargetAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => addToArray('personal', 'target_areas', area)}
                    disabled={formData.personal.target_areas.includes(area)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.personal.target_areas.includes(area)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                  >
                    {area}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={targetAreaInput}
                  onChange={(e) => setTargetAreaInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (addToArray('personal', 'target_areas', targetAreaInput)) {
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
                    if (addToArray('personal', 'target_areas', targetAreaInput)) {
                      setTargetAreaInput('');
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.personal.target_areas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.personal.target_areas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => removeFromArray('personal', 'target_areas', area)}
                        className="ml-1 hover:text-purple-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Cuisine Preferences (Click to add)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {commonCuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => addToArray('personal', 'cuisine_preferences', cuisine)}
                    disabled={formData.personal.cuisine_preferences.includes(cuisine)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.personal.cuisine_preferences.includes(cuisine)
                        ? 'bg-orange-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (addToArray('personal', 'cuisine_preferences', cuisineInput)) {
                        setCuisineInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter custom cuisine"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (addToArray('personal', 'cuisine_preferences', cuisineInput)) {
                      setCuisineInput('');
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.personal.cuisine_preferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.personal.cuisine_preferences.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {cuisine}
                      <button
                        type="button"
                        onClick={() => removeFromArray('personal', 'cuisine_preferences', cuisine)}
                        className="ml-1 hover:text-green-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Check className="w-6 h-6 text-orange-500" />
              Review Summary
            </h3>

            <div className="space-y-4">
              {/* Personal Information Summary */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-700 font-medium">Age</p>
                    <p className="text-blue-900">{formData.personal.age || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Gender</p>
                    <p className="text-blue-900">{formData.personal.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Height</p>
                    <p className="text-blue-900">{formData.personal.height_cm ? `${formData.personal.height_cm} cm` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Current Weight</p>
                    <p className="text-blue-900">{formData.personal.weight_kg ? `${formData.personal.weight_kg} kg` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Target Weight</p>
                    <p className="text-blue-900">{formData.personal.target_weight_kg ? `${formData.personal.target_weight_kg} kg` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Goal</p>
                    <p className="text-blue-900 capitalize">{formData.personal.goal || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Activity Level</p>
                    <p className="text-blue-900">{formData.personal.activity_level || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Dietary Preference</p>
                    <p className="text-blue-900">{formData.personal.dietary_preference || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Health Information Summary */}
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-red-900 mb-3">Health Information</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-red-700 font-medium">Food Allergies</p>
                    <p className="text-red-900">{formData.allergies.length > 0 ? formData.allergies.join(', ') : 'None'}</p>
                  </div>
                  <div>
                    <p className="text-red-700 font-medium">Medical Conditions</p>
                    <p className="text-red-900">{formData.personal.medical_conditions.length > 0 ? formData.personal.medical_conditions.join(', ') : 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Lifestyle Summary */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Lifestyle & Exercise</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-purple-700 font-medium">Exercise Type</p>
                    <p className="text-purple-900">{formData.personal.exercise.type || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-medium">Frequency</p>
                    <p className="text-purple-900">{formData.personal.exercise.frequency ? `${formData.personal.exercise.frequency} days/week` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-medium">Duration</p>
                    <p className="text-purple-900">{formData.personal.exercise.duration_min ? `${formData.personal.exercise.duration_min} min` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-medium">Sleep Hours</p>
                    <p className="text-purple-900">{formData.personal.sleep_hours ? `${formData.personal.sleep_hours} hrs` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-medium">Water Intake</p>
                    <p className="text-purple-900">{formData.personal.water_intake ? `${formData.personal.water_intake} L` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-medium">Meal Frequency</p>
                    <p className="text-purple-900">{formData.personal.meal_frequency ? `${formData.personal.meal_frequency} meals/day` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-medium">Cooking Time</p>
                    <p className="text-purple-900">{formData.personal.cooking_time || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Preferences Summary */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 mb-3">Preferences</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-green-700 font-medium">Target Areas</p>
                    <p className="text-green-900">{formData.personal.target_areas.length > 0 ? formData.personal.target_areas.join(', ') : 'None'}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Cuisine Preferences</p>
                    <p className="text-green-900">{formData.personal.cuisine_preferences.length > 0 ? formData.personal.cuisine_preferences.join(', ') : 'None'}</p>
                  </div>
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
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>

      <div className="relative w-full max-w-4xl">
        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header section with gradient background */}
          <div className="bg-linear-to-r from-orange-500 to-amber-500 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Health Questionnaire</h1>
            <p className="text-orange-100">Tell us about your health, lifestyle, and preferences for personalized recommendations</p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${index + 1 <= currentStep
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
                className="bg-linear-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form section */}
          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="p-8">
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
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Complete Questionnaire
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>ZeroHunger Health Assessment</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthQuestionnaire;
