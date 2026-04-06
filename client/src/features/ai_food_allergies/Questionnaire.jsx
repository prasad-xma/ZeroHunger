import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAllergyRecommendations } from '../../services/aiFoodAllergyService';
import { AlertCircle, Plus, X, ChevronRight } from 'lucide-react';

const QuestionnairePage = () => {
  const [allergies, setAllergies] = useState([]);
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const commonAllergies = [
    'Peanuts', 'Tree nuts', 'Shellfish', 'Fish', 'Milk', 'Eggs', 
    'Wheat', 'Soy', 'Sesame', 'Gluten', 'Lactose', 'Corn'
  ];

  const addAllergy = (allergy) => {
    const trimmedAllergy = allergy.trim();
    if (trimmedAllergy && !allergies.includes(trimmedAllergy)) {
      setAllergies([...allergies, trimmedAllergy]);
      setCurrentAllergy('');
      setError('');
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  const handleCustomAllergySubmit = (e) => {
    e.preventDefault();
    if (currentAllergy.trim()) {
      addAllergy(currentAllergy);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (allergies.length === 0) {
      setError('Please add at least one allergy');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await generateAllergyRecommendations(allergies);
      
      if (response.data.success) {
        navigate('/ai-food-allergies/results', { 
          state: { allergyData: response.data.data } 
        });
      } else {
        setError(response.data.message || 'Failed to generate recommendations');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while generating recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="relative w-full max-w-2xl">
        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header section with gradient background */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Food Allergy Assessment</h1>
            <p className="text-orange-100">Tell us about your food allergies for personalized recommendations</p>
          </div>

          {/* Form section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Common Allergies (Click to add)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {commonAllergies.map((allergy) => (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => addAllergy(allergy)}
                      disabled={allergies.includes(allergy)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        allergies.includes(allergy)
                          ? 'bg-orange-500 text-white cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom allergy input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Custom Allergy
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentAllergy}
                    onChange={(e) => setCurrentAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomAllergySubmit(e)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter an allergy not listed above"
                  />
                  <button
                    type="button"
                    onClick={() => addAllergy(currentAllergy)}
                    disabled={!currentAllergy.trim()}
                    className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Selected allergies */}
              {allergies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Allergies ({allergies.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <div
                        key={allergy}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="ml-1 hover:text-orange-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || allergies.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    Generate Recommendations
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Decorative element at bottom */}
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

export default QuestionnairePage;
