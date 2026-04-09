import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserHealthProfiles, getAllHealthAdvice } from '../../services/healthService';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Plus, 
  Calendar,
  User,
  Target,
  Droplets,
  Moon
} from 'lucide-react';
import HealthMetricsChart from './components/HealthMetricsChart';
import BMIGauge from './components/BMIGauge';

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profilesResponse, advicesResponse] = await Promise.all([
        getUserHealthProfiles(),
        getAllHealthAdvice()
      ]);

      if (profilesResponse.data.success) {
        setProfiles(profilesResponse.data.data);
      }

      if (advicesResponse.data.success) {
        setAdvices(advicesResponse.data.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-center">
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
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Health Profile
          </button>
        </div>

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.slice(0, 3).map((profile) => (
                  <div
                    key={profile._id}
                    onClick={() => navigate(`/health-dashboard/profile/${profile._id}`)}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{profile.profile_name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Age: {profile.user_profile.age} years</p>
                      <p>Goal: {profile.user_profile.goal}</p>
                      <p>Status: <span className="capitalize text-orange-600">{profile.status}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Profile Metrics */}
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

            {/* Latest Health Advice */}
            {latestAdvice && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    Latest Health Advice
                  </h2>
                  <span className="text-sm text-gray-500">
                    Generated {new Date(latestAdvice.generated_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-medium text-green-800 mb-2">Meal Tips</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      {latestAdvice.advice?.meal_management?.timing?.slice(0, 2).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Hydration</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {latestAdvice.advice?.lifestyle_tips?.hydration?.slice(0, 2).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="font-medium text-purple-800 mb-2">Exercise</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      {latestAdvice.advice?.lifestyle_tips?.exercise?.slice(0, 2).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <h3 className="font-medium text-indigo-800 mb-2">Sleep</h3>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      {latestAdvice.advice?.lifestyle_tips?.sleep?.slice(0, 2).map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
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
