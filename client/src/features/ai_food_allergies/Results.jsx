import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserAllergyProfile, deleteAllergyProfile } from '../../services/aiFoodAllergyService';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
  BookOpen,
  Phone,
  ArrowLeft,
  Trash2,
  RefreshCw,
  Lightbulb,
  Apple,
  Home,
  Utensils
} from 'lucide-react';

const ResultsPage = () => {
  const [allergyData, setAllergyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If data was passed from questionnaire, use it
    if (location.state?.allergyData) {
      setAllergyData(location.state.allergyData);
    } else {
      // Otherwise fetch from API
      fetchAllergyData();
    }
  }, [location.state]);

  const fetchAllergyData = async () => {
    setIsLoading(true);
    try {
      const response = await getUserAllergyProfile();
      if (response.data.success) {
        setAllergyData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch allergy data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm('Are you sure you want to delete your allergy profile? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteAllergyProfile();
      if (response.data.success) {
        navigate('/ai-food-allergies/questionnaire');
      } else {
        setError(response.data.message || 'Failed to delete profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting profile');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNewAssessment = () => {
    navigate('/ai-food-allergies/questionnaire');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading your allergy profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/ai-food-allergies/questionnaire')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!allergyData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <Info className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Allergy Profile Found</h2>
            <p className="text-gray-600 mb-6">You haven't completed an allergy assessment yet.</p>
            <button
              onClick={() => navigate('/ai-food-allergies/questionnaire')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { allergies, ai_response, response_metadata } = allergyData;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>

      <div className="relative max-w-4xl mx-auto">
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
              <Shield className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Your Allergy Profile</h1>
            <p className="text-orange-100">Personalized recommendations based on your allergies</p>
          </div>

          {/* Allergies summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Allergies</h2>
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="px-3 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
            {response_metadata && (
              <p className="text-sm text-gray-500 mt-3">
                Generated on {new Date(response_metadata.generated_at).toLocaleDateString()}
                {response_metadata.model_used && ` using ${response_metadata.model_used}`}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleNewAssessment}
            className="flex-1 bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow flex items-center justify-center gap-2 text-gray-700"
          >
            <RefreshCw className="w-5 h-5" />
            New Assessment
          </button>
          <button
            onClick={handleDeleteProfile}
            disabled={isDeleting}
            className="flex-1 bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
            {isDeleting ? 'Deleting...' : 'Delete Profile'}
          </button>
        </div>

        {/* AI Response sections */}
        <div className="space-y-6">
          {/* Recommendations */}
          {ai_response?.recommendations?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {ai_response.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Personalized Advice */}
          {ai_response?.personalized_advice && Object.keys(ai_response.personalized_advice).length > 0 && (
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Personalized Advice</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Management */}
                {ai_response.personalized_advice?.health_management?.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      <h4 className="font-semibold text-gray-900">Health Management</h4>
                    </div>
                    <ul className="space-y-2">
                      {ai_response.personalized_advice.health_management.map((advice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                          <span className="text-sm text-gray-700">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nutrition Tips */}
                {ai_response.personalized_advice?.nutrition_tips?.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <Apple className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-gray-900">Nutrition Tips</h4>
                    </div>
                    <ul className="space-y-2">
                      {ai_response.personalized_advice.nutrition_tips.map((advice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></span>
                          <span className="text-sm text-gray-700">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Lifestyle Recommendations */}
                {ai_response.personalized_advice?.lifestyle_recommendations?.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <Home className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold text-gray-900">Lifestyle Tips</h4>
                    </div>
                    <ul className="space-y-2">
                      {ai_response.personalized_advice.lifestyle_recommendations.map((advice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></span>
                          <span className="text-sm text-gray-700">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dining Guidance */}
                {ai_response.personalized_advice?.dining_guidance?.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <Utensils className="w-5 h-5 text-orange-500" />
                      <h4 className="font-semibold text-gray-900">Dining Guide</h4>
                    </div>
                    <ul className="space-y-2">
                      {ai_response.personalized_advice.dining_guidance.map((advice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></span>
                          <span className="text-sm text-gray-700">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Foods to avoid */}
          {ai_response?.foods_to_avoid?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-semibold text-gray-900">Foods to Avoid</h3>
              </div>
              <ul className="space-y-2">
                {ai_response.foods_to_avoid.map((food, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-700">{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safe alternatives */}
          {ai_response?.safe_alternatives?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">Safe Alternatives</h3>
              </div>
              <ul className="space-y-2">
                {ai_response.safe_alternatives.map((alternative, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-700">{alternative}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cross contamination notes */}
          {ai_response?.cross_contamination_notes?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-900">Cross-Contamination Notes</h3>
              </div>
              <ul className="space-y-2">
                {ai_response.cross_contamination_notes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-700">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reading labels tips */}
          {ai_response?.reading_labels_tips?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">Reading Labels Tips</h3>
              </div>
              <ul className="space-y-2">
                {ai_response.reading_labels_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency precautions */}
          {ai_response?.emergency_precautions?.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-800">Emergency Precautions</h3>
              </div>
              <ul className="space-y-2">
                {ai_response.emergency_precautions.map((precaution, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-700 font-medium">{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>ZeroHunger AI Food Allergies</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
