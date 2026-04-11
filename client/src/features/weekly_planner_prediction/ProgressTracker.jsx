import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressService } from '../../services/progressService';
import { TrendingUp, Plus, Trash2, BarChart3, Target, ArrowLeft } from 'lucide-react';

const ProgressTracker = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    weekStartDate: '',
    weight: ''
  });
  const navigate = useNavigate();

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await progressService.getHistory();
      setProgress(response.data || response);
    } catch (error) {
      console.error('Error fetching progress:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new progress entry
  const addProgress = async (e) => {
    e.preventDefault();
    try {
      await progressService.addProgress(formData);
      setFormData({ weekStartDate: '', weight: '' });
      setShowAddForm(false);
      fetchProgress();
    } catch (error) {
      console.error('Error adding progress:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  // Get prediction
  const getPrediction = async (goal) => {
    try {
      const response = await progressService.getPrediction(goal);
      setPrediction(response.data || response);
    } catch (error) {
      console.error('Error getting prediction:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  // Delete progress entry
  const deleteProgress = async (progressId) => {
    try {
      await progressService.deleteProgress(progressId);
      setProgress(progress.filter(p => p._id !== progressId));
    } catch (error) {
      console.error('Error deleting progress:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  // Delete all progress entries
  const deleteAllProgress = async () => {
    if (!window.confirm('Are you sure you want to delete all progress entries? This cannot be undone.')) {
      return;
    }
    try {
      await progressService.deleteAllProgress();
      setProgress([]);
      setPrediction(null);
    } catch (error) {
      console.error('Error deleting all progress:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-lg">Loading progress data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-30"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header section with gradient background */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-white/90 hover:text-white transition-colors flex items-center gap-2 font-medium z-10"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Progress Tracker</h1>
                  <p className="text-orange-100">Track your fitness journey and get AI predictions</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="p-6 bg-white">
            <div className="flex justify-end space-x-3">
              <button
                onClick={deleteAllProgress}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Delete All Progress
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-2 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Add Progress
              </button>
            </div>
          </div>
        </div>

        {/* Add Progress Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-96">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 -m-8 mb-6 rounded-t-3xl">
                <h2 className="text-xl font-bold text-white text-center">Add Progress Entry</h2>
              </div>
              
              <form onSubmit={addProgress} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Week Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.weekStartDate}
                    onChange={(e) => setFormData({...formData, weekStartDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter your weight"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Add Progress
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Progress History Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Progress History
            </h2>
          </div>
          
          {/* Prediction Section */}
          <div className="p-6 bg-orange-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-500" />
              Get Weight Prediction
            </h3>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => getPrediction('weight_loss')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Predict Weight Loss
              </button>
              <button
                onClick={() => getPrediction('muscle_gain')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Predict Muscle Gain
              </button>
            </div>
            
            {prediction && (
              <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Prediction Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium mb-1">Predicted Weight (1 month)</p>
                    <p className="text-2xl font-bold text-blue-600">{prediction.predictedWeight} kg</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-600 font-medium mb-1">Current Weight</p>
                    <p className="text-2xl font-bold text-green-600">{prediction.currentWeight} kg</p>
                  </div>
                </div>
                {prediction.advice && (
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium mb-2">AI Advice:</p>
                    <div className="text-gray-900">
                      {Array.isArray(prediction.advice) ? (
                        <ul className="list-disc list-inside space-y-1">
                          {prediction.advice.map((tip, index) => (
                            <li key={index} className="text-sm">{tip}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">{prediction.advice}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress List */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Progress Entries</h3>
            <div className="space-y-4">
              {progress.map((entry) => (
                <div key={entry._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(entry.weekStartDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Weight: {entry.weight} kg</p>
                    {entry.performance !== undefined && (
                      <p className="text-sm text-orange-600">Performance: {entry.performance.toFixed(1)}%</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteProgress(entry._id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {progress.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-gray-600">No progress entries yet. Start tracking your journey!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
