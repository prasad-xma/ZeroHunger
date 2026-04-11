import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getHealthProfileById, 
  getHealthAdvice, 
  generateHealthAdvice,
  updateHealthProfile,
  deleteHealthProfile,
  recalculateHealthMetrics
} from '../../services/healthService';
import { getUserAllergyProfile } from '../../services/aiFoodAllergyService';
import { 
  Heart, 
  Activity, 
  Target, 
  TrendingUp, 
  Calendar,
  User,
  Droplets,
  Moon,
  Utensils,
  ChevronLeft,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield
} from 'lucide-react';
import HealthMetricsChart from './components/HealthMetricsChart';
import BMIGauge from './components/BMIGauge';

const ProfileDetails = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [allergyProfile, setAllergyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [profileId]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profileResponse, adviceResponse, allergyResponse] = await Promise.all([
        getHealthProfileById(profileId),
        getHealthAdvice(profileId).catch(() => null), // Advice might not exist yet
        getUserAllergyProfile().catch(() => null) // Allergy profile might not exist
      ]);

      if (profileResponse.data.success) {
        setProfile(profileResponse.data.data);
      }

      if (adviceResponse?.data.success) {
        setAdvice(adviceResponse.data.data);
      }

      if (allergyResponse?.data.success) {
        setAllergyProfile(allergyResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      const response = await generateHealthAdvice(profileId);
      if (response.data.success) {
        setAdvice(response.data.data);
      } else {
        setError(response.data.message || 'Failed to generate health advice');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while generating advice');
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  const handleRecalculateMetrics = async () => {
    setIsRecalculating(true);
    try {
      const response = await recalculateHealthMetrics(profileId);
      if (response.data.success) {
        setProfile(response.data.data);
      } else {
        setError(response.data.message || 'Failed to recalculate metrics');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while recalculating metrics');
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm('Are you sure you want to delete this health profile? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteHealthProfile(profileId);
      if (response.data.success) {
        navigate('/health-dashboard');
      } else {
        setError(response.data.message || 'Failed to delete profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting profile');
    } finally {
      setIsDeleting(false);
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/health-dashboard')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <User className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">The health profile you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/health-dashboard')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-linear-to-r from-orange-500 to-amber-500 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/health-dashboard')}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.profile_name}</h1>
                  <p className="text-orange-100">Health Profile Details</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  profile.status === 'generated' ? 'bg-green-100 text-green-800' :
                  profile.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {profile.status}
                </span>
                <button
                  onClick={() => navigate(`/health-dashboard/edit/${profileId}`)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Edit className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleDeleteProfile}
                  disabled={isDeleting}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleGenerateAdvice}
            disabled={isGeneratingAdvice}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            {isGeneratingAdvice ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Advice...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Generate Health Advice
              </>
            )}
          </button>
          <button
            onClick={handleRecalculateMetrics}
            disabled={isRecalculating}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            {isRecalculating ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Recalculating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Recalculate Metrics
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-orange-500" />
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{profile.user_profile.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium capitalize">{profile.user_profile.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium">{profile.user_profile.height_cm} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{profile.user_profile.weight_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Weight:</span>
                  <span className="font-medium">{profile.user_profile.target_weight_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goal:</span>
                  <span className="font-medium capitalize">{profile.user_profile.goal}</span>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-orange-500" />
                Lifestyle
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Activity Level:</span>
                  <span className="font-medium text-sm">{profile.user_profile.activity_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sleep:</span>
                  <span className="font-medium">{profile.user_profile.sleep_hours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Intake:</span>
                  <span className="font-medium">{profile.user_profile.water_intake} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meal Frequency:</span>
                  <span className="font-medium">{profile.user_profile.meal_frequency}x/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cooking Time:</span>
                  <span className="font-medium text-sm">{profile.user_profile.cooking_time}</span>
                </div>
              </div>
            </div>

            {/* Exercise */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-orange-500" />
                Exercise
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{profile.user_profile.exercise.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">{profile.user_profile.exercise.frequency} days/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{profile.user_profile.exercise.duration_min} min</span>
                </div>
              </div>
            </div>

            {/* Allergies Section */}
            {allergyProfile && allergyProfile.allergies && allergyProfile.allergies.length > 0 && (
              <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-3xl shadow-xl p-6 border-2 border-red-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Food Allergies
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {allergyProfile.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => window.location.href = '/ai-food-allergies/results'}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  View Allergy Recommendations
                </button>
              </div>
            )}
          </div>

          {/* Metrics and Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* BMI Gauge */}
            {profile.recommendations?.bmi && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  BMI Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <BMIGauge bmi={profile.recommendations.bmi.value} />
                    <p className={`text-lg font-semibold mt-2 ${getBMICategory(profile.recommendations.bmi.value).color}`}>
                      {getBMICategory(profile.recommendations.bmi.value).category}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-orange-600 mb-1">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Daily Calories</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {profile.recommendations?.daily_calories || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Droplets className="w-4 h-4" />
                        <span className="text-sm font-medium">Water Goal</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {profile.recommendations?.water_intake_goal || 0}L
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Macronutrients Chart */}
            {profile.recommendations?.macronutrients && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-orange-500" />
                  Macronutrients Distribution
                </h2>
                <HealthMetricsChart 
                  data={profile.recommendations.macronutrients}
                  type="macro"
                />
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-xl font-bold text-orange-600">
                      {profile.recommendations.macronutrients.protein}g
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-xl font-bold text-amber-600">
                      {profile.recommendations.macronutrients.carbs}g
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {profile.recommendations.macronutrients.fat}g
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Health Advice */}
            {advice && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-orange-500" />
                    Health Advice
                  </h2>
                  <span className="text-sm text-gray-500">
                    Generated {new Date(advice.generated_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-medium text-green-800 mb-2">Meal Management</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      {advice.advice?.meal_management?.timing?.slice(0, 3).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-green-600 rounded-full mt-2 shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Hydration Tips</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {advice.advice?.lifestyle_tips?.hydration?.slice(0, 3).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="font-medium text-purple-800 mb-2">Exercise</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      {advice.advice?.lifestyle_tips?.exercise?.slice(0, 3).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <h3 className="font-medium text-indigo-800 mb-2">Sleep & Recovery</h3>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      {advice.advice?.lifestyle_tips?.sleep?.slice(0, 3).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-indigo-600 rounded-full mt-2 shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Meal Suggestions */}
            {profile.recommendations?.meal_suggestions?.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-orange-500" />
                  Meal Suggestions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.recommendations.meal_suggestions.map((meal, index) => (
                    <div key={index} className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-800">{meal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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

export default ProfileDetails;
