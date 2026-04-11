import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserHealthProfiles, deleteHealthProfile } from '../../services/healthService';
import { User, Trash2, ArrowLeft } from 'lucide-react';

const HealthProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUserHealthProfiles();
      if (response.data.success) {
        setProfiles(response.data.data);
      } else {
        setError(response.data.message || 'Unable to load profiles');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this health profile?');
    if (!confirmed) return;
    setDeleting(id);
    try {
      const response = await deleteHealthProfile(id);
      if (response.data.success) {
        setProfiles((prev) => prev.filter((item) => item._id !== id));
      } else {
        setError(response.data.message || 'Could not delete profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete profile');
    } finally {
      setDeleting('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4">
      <div className="relative max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-linear-to-r from-orange-500 to-amber-500 p-8 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white">Health Profiles</h1>
              <p className="text-orange-100 mt-1">A quick view of your saved profiles.</p>
            </div>
            <button
              onClick={() => navigate('/health-dashboard')}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white text-orange-600 rounded-2xl shadow-sm hover:bg-orange-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {profiles.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <p className="text-lg font-semibold text-gray-900">No health profiles found.</p>
            <p className="text-gray-600 mt-2">Create a profile from the dashboard to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile._id} className="bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{profile.profile_name}</h2>
                        <p className="text-sm text-gray-500">{profile.user_profile.goal || 'Goal not set'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(profile._id)}
                      disabled={deleting === profile._id}
                      className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Age</span>
                      <span>{profile.user_profile.age} yrs</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Diet</span>
                      <span className="capitalize">{profile.user_profile.dietary_preference || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Activity</span>
                      <span className="capitalize">{profile.user_profile.activity_level || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Calories</span>
                      <span>{profile.recommendations?.daily_calories || '-'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/health-dashboard/profile/${profile._id}`)}
                  className="mt-6 w-full px-4 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfiles;
