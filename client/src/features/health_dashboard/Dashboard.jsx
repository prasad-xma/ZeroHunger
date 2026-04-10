import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserHealthProfiles, getAllHealthAdvice } from '../../services/healthService';
import { getUserAllergyProfile } from '../../services/aiFoodAllergyService';
import {
  Activity,
  Heart,
  TrendingUp,
  Plus,
  Calendar,
  User,
  Target,
  Droplets,
  Moon,
  AlertTriangle,
  Shield,
  ArrowLeft
} from 'lucide-react';
import HealthMetricsChart from './components/HealthMetricsChart';
import BMIGauge from './components/BMIGauge';

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [advices, setAdvices] = useState([]);
  const [allergyProfile, setAllergyProfile] = useState(null);
  const [formResult, setFormResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    loadFormResult();
  }, []);

  const loadFormResult = () => {
    try {
      const saved = localStorage.getItem('healthQuestionnaireResult');
      if (saved) {
        setFormResult(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to parse saved questionnaire', err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profilesResponse, advicesResponse, allergyResponse] = await Promise.all([
        getUserHealthProfiles(),
        getAllHealthAdvice(),
        getUserAllergyProfile().catch(() => null) // Allergy profile might not exist
      ]);

      if (profilesResponse.data.success) {
        setProfiles(profilesResponse.data.data);
      }

      if (advicesResponse.data.success) {
        setAdvices(advicesResponse.data.data);
      }

      if (allergyResponse?.data.success) {
        setAllergyProfile(allergyResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const getLatestProfile = () => {
    return profiles.length > 0 ? profiles[0] : null;
  };

  const getLatestAdvice = () => {
    return advices.length > 0 ? advices[0] : null;
  };

  const buildMacroData = () => {
    if (!formResult?.formData) return { protein: 90, carbs: 180, fat: 60 };
    const goal = formResult.formData.personal.goal;
    if (goal === 'lose') return { protein: 120, carbs: 140, fat: 55 };
    if (goal === 'gain') return { protein: 140, carbs: 240, fat: 80 };
    return { protein: 100, carbs: 190, fat: 65 };
  };

  const buildProgressData = () => {
    if (!formResult?.formData) return null;
    const currentWeight = Number(formResult.formData.personal.weight_kg) || 70;
    const targetWeight = Number(formResult.formData.personal.target_weight_kg) || currentWeight;
    const startWeight = formResult.formData.personal.goal === 'lose'
      ? currentWeight + 4
      : formResult.formData.personal.goal === 'gain'
        ? currentWeight - 3
        : currentWeight;

    return {
      labels: ['Start', 'Current', 'Target'],
      weight: [startWeight, currentWeight, targetWeight],
      targetWeight: [targetWeight, targetWeight, targetWeight],
    };
  };

  const buildSummaryItems = () => {
    if (!formResult?.formData) return [];
    const data = formResult.formData.personal;
    return [
      { label: 'Diet', value: data.dietary_preference || 'Not set' },
      { label: 'Activity Level', value: data.activity_level || 'Not set' },
      { label: 'Goal', value: data.goal || 'Not set' },
      { label: 'Sleep', value: `${data.sleep_hours || '-'} hrs` },
      { label: 'Water', value: `${data.water_intake || '-'} L` },
      { label: 'Meals', value: `${data.meal_frequency || '-'} / day` },
      { label: 'Cooking', value: data.cooking_time || 'Not set' },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading your health dashboard...</p>
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
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const latestProfile = getLatestProfile();
  const latestAdvice = getLatestAdvice();

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-white/90 hover:text-white transition-colors flex items-center gap-2 font-medium z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="bg-linear-to-r from-orange-500 to-amber-500 p-8 text-center pt-12">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Health Dashboard</h1>
            <p className="text-orange-100">Your personalized health and wellness center</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => navigate('/health-dashboard/create-profile')}
            className="bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Health Profile
          </button>
        </div>

        {formResult && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Submission</h2>
                <p className="text-sm text-gray-500">Latest questionnaire data from your form submission.</p>
              </div>
              <span className="text-sm text-gray-500">Submitted {new Date(formResult.submittedAt).toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-orange-700 mb-3">Form summary</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {buildSummaryItems().map(item => (
                    <div key={item.label} className="flex justify-between border-b border-orange-100 pb-2">
                      <span>{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-orange-700 mb-3">Details</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Allergies</span>
                    <span className="font-semibold text-gray-900">{formResult.formData.allergies.length || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical conditions</span>
                    <span className="font-semibold text-gray-900">{formResult.formData.personal.medical_conditions.length || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target areas</span>
                    <span className="font-semibold text-gray-900">{formResult.formData.personal.target_areas.length || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuisines</span>
                    <span className="font-semibold text-gray-900">{formResult.formData.personal.cuisine_preferences.length || 'None'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Weight Progress</h3>
                    <p className="text-sm text-gray-500">Simple progress estimate from your submitted goals.</p>
                  </div>
                </div>
                <HealthMetricsChart data={buildProgressData()} type="progress" />
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recommended Macros</h3>
                    <p className="text-sm text-gray-500">Based on your goal and dietary preference.</p>
                  </div>
                </div>
                <HealthMetricsChart data={buildMacroData()} type="macro" />
              </div>
            </div>
          </div>
        )}

        {profiles.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <Activity className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Health Profiles Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your health journey by creating your first health profile. Get personalized recommendations and track your progress over time.
            </p>
            <button
              onClick={() => navigate('/health-dashboard/create-profile')}
              className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-lg font-semibold"
            >
              Create Your First Profile
            </button>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-6">
            {/* Health Profiles Overview */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-orange-500" />
                  Health Profiles ({profiles.length})
                </h2>
                <button
                  onClick={() => navigate('/health-dashboard/profiles')}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.slice(0, 3).map((profile) => (
                  <div
                    key={profile._id}
                    onClick={() => navigate(`/health-dashboard/profile/${profile._id}`)}
                    className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                  >

                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-50 to-amber-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                          <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{profile.profile_name}</h3>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                          <span className="w-20 text-gray-500 font-medium">Age</span>
                          <span className="font-semibold text-gray-900">{profile.user_profile.age} years</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                          <span className="w-20 text-gray-500 font-medium">Goal</span>
                          <span className="font-semibold text-gray-900 capitalize">{profile.user_profile.goal}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${profile.status === 'Generated' || profile.status === 'Active'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-orange-50 text-orange-600 border border-orange-100'
                        } capitalize`}>
                        {profile.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/health-dashboard/profile/${profile._id}`);
                        }}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        View Details
                        <ArrowLeft className="w-4 h-4 rotate-180 transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {latestProfile && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BMI and Basic Metrics */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    Current Metrics
                  </h2>

                  <div className="space-y-4">
                    {/* BMI Gauge */}
                    {latestProfile.recommendations?.bmi && (
                      <div className="text-center">
                        <BMIGauge bmi={latestProfile.recommendations.bmi.value} />
                        <p className={`text-lg font-semibold mt-2 ${getBMICategory(latestProfile.recommendations.bmi.value).color}`}>
                          {getBMICategory(latestProfile.recommendations.bmi.value).category}
                        </p>
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-orange-600 mb-1">
                          <Target className="w-4 h-4" />
                          <span className="text-sm font-medium">Daily Calories</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {latestProfile.recommendations?.daily_calories || 0}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <Droplets className="w-4 h-4" />
                          <span className="text-sm font-medium">Water Goal</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {latestProfile.recommendations?.water_intake_goal || 0}L
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macronutrients Chart */}
                {latestProfile.recommendations?.macronutrients && (
                  <div className="bg-white rounded-3xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-orange-500" />
                      Macronutrients
                    </h2>
                    <HealthMetricsChart
                      data={latestProfile.recommendations.macronutrients}
                      type="macro"
                    />
                  </div>
                )}
              </div>
            )}

            {latestAdvice && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white rounded-3xl shadow-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-16 translate-x-16 opacity-50 blur-2xl"></div>
                  <div className="relative z-10">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <Target className="w-6 h-6 text-orange-500" />
                      Personalized Health Plan
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Generated {new Date(latestAdvice.generated_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2.5 bg-red-50 text-red-500 rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Daily Energy</h3>
                        <p className="text-sm text-gray-500">Calories and macro targets</p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-red-50 p-6 text-center mb-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 mb-2">Daily calories</p>
                      <p className="text-4xl font-extrabold text-gray-900">{latestAdvice.advice?.calorie_management?.daily_target || 0}</p>
                      <p className="text-sm text-gray-500 mt-2">kcal per day</p>
                    </div>

                    <div className="space-y-3">
                      {['protein','carbs','fats'].map((key) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700 capitalize">{key}</span>
                          <span className="text-gray-900 font-bold">{latestAdvice.advice?.nutrition_levels?.[key]?.target || 0}g</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-3xl bg-white p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Nutrition sources</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {['protein','carbs','fats'].map((key) => (
                          <div key={key}>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">{key}</p>
                            <div className="flex flex-wrap gap-2">
                              {latestAdvice.advice?.nutrition_levels?.[key]?.sources?.slice(0, 4).map((item) => (
                                <span key={item} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{item}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 rounded-3xl bg-white p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Meal distribution</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        {Object.entries(latestAdvice.advice?.calorie_management?.meal_distribution || {}).map(([meal, value]) => (
                          <div key={meal} className="rounded-2xl bg-gray-100 p-3">
                            <p className="font-semibold capitalize">{meal}</p>
                            <p>{value} kcal</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 rounded-3xl bg-white p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Calorie tips</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {latestAdvice.advice?.calorie_management?.tips?.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="xl:col-span-2 grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-green-50 text-green-500 rounded-2xl">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Meal Management</h3>
                          <p className="text-sm text-gray-500">Timing, portion control, prep</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-gray-50 p-5">
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Recommended</p>
                          <p className="text-lg font-semibold text-gray-900">{latestAdvice.advice?.meal_management?.frequency}</p>
                          <div className="mt-4 space-y-2 text-sm text-gray-600">
                            {latestAdvice.advice?.meal_management?.timing?.map((time, idx) => (
                              <p key={idx} className="flex items-start gap-2">
                                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                                {time}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-3xl bg-gray-50 p-5">
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Portion control</p>
                          <p className="text-sm text-gray-700">{latestAdvice.advice?.meal_management?.portion_control}</p>
                          <div className="mt-4 space-y-2 text-sm text-gray-700">
                            {latestAdvice.advice?.meal_management?.meal_preparation?.map((tip, idx) => (
                              <p key={idx} className="flex items-start gap-2">
                                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-green-400"></span>
                                {tip}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-blue-50 text-blue-500 rounded-2xl">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Lifestyle Tips</h3>
                          <p className="text-sm text-gray-500">Hydration, movement, rest and stress</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { title:'Hydration', key:'hydration', color:'bg-blue-100 text-blue-700' },
                          { title:'Exercise', key:'exercise', color:'bg-emerald-100 text-emerald-700' },
                          { title:'Sleep', key:'sleep', color:'bg-purple-100 text-purple-700' },
                          { title:'Stress', key:'stress_management', color:'bg-pink-100 text-pink-700' }
                        ].map((section) => (
                          <div key={section.key} className="rounded-3xl bg-gray-50 p-4 h-full">
                            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${section.color} inline-flex rounded-full px-3 py-1 mb-4`}>{section.title}</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {latestAdvice.advice?.lifestyle_tips?.[section.key]?.slice(0, 3).map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2.5 bg-amber-50 text-amber-500 rounded-2xl">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Meal Suggestions</h3>
                        <p className="text-sm text-gray-500">Easy meals to match your daily targets</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['breakfast','lunch','dinner','snacks'].map((mealTime) => {
                        const meal = latestAdvice.advice?.meal_suggestions?.[mealTime]?.[0];
                        if (!meal) return null;
                        return (
                          <div key={mealTime} className="rounded-3xl border border-gray-100 p-5 bg-gray-50">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">{mealTime}</p>
                            <p className="font-bold text-gray-900 mb-2">{meal.name}</p>
                            <p className="text-sm text-gray-500 mb-3">Prep {meal.prep_time} · {meal.calories} kcal</p>
                            <div className="flex flex-wrap gap-2">
                              {meal.ingredients?.slice(0, 4).map((ingredient) => (
                                <span key={ingredient} className="inline-flex items-center px-3 py-1 rounded-full bg-white text-gray-700 text-xs border border-gray-200">{ingredient}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2.5 bg-slate-50 text-slate-500 rounded-2xl">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Nutrition Overview</h3>
                        <p className="text-sm text-gray-500">Vitamins and minerals to keep in focus</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Vitamins</p>
                        <div className="flex flex-wrap gap-2">
                          {latestAdvice.advice?.nutrition_levels?.vitamins?.map((item) => (
                            <span key={item} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{item}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Minerals</p>
                        <div className="flex flex-wrap gap-2">
                          {latestAdvice.advice?.nutrition_levels?.minerals?.map((item) => (
                            <span key={item} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Allergy Profile Card */}
            {allergyProfile && allergyProfile.allergies && allergyProfile.allergies.length > 0 && (
              <div className="group relative bg-white border border-red-100 rounded-3xl p-6 hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden">
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-red-50 to-orange-50 rounded-full -translate-y-24 translate-x-24 opacity-60 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 shadow-xs">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">Your Food Allergies</h2>
                      <p className="text-sm font-medium text-gray-500 mt-1">Active dietary restrictions</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/ai-food-allergies/results')}
                    className="inline-flex items-center text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl transition-colors shadow-xs hover:shadow-sm self-start"
                  >
                    Manage Profile
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="relative z-10 flex flex-wrap gap-3">
                  {allergyProfile.allergies.map((allergy) => (
                    <div
                      key={allergy}
                      className="px-4 py-2.5 bg-white border-2 border-red-50 text-red-700 rounded-2xl text-sm font-bold shadow-xs hover:border-red-200 hover:shadow-md transition-all cursor-default flex items-center gap-2.5"
                    >
                      <Shield className="w-4 h-4 text-red-400" />
                      {allergy}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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

export default Dashboard;
