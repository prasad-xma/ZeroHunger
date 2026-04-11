import { useState } from 'react';

import { Link } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, MapPin, Calendar, ClipboardList, Target, BarChart3, Utensils } from 'lucide-react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Utensils, ClipboardList, Target, BarChart2, Leaf, Rocket, AlertTriangle, CheckCircle } from 'lucide-react';
import { register as registerService } from '../../services/authService';

const FloatingIcon = ({ icon: Icon, style }) => (
  <div
    className="absolute rounded-2xl flex items-center justify-center shadow-lg"
    style={style}
  >
    <Icon size={20} color="white" />
  </div>
);

const InputField = ({ label, icon: Icon, type, name, value, onChange, placeholder, rightElement }) => (
  <div>
    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#4B3F35', fontFamily: "'Nunito', sans-serif" }}>
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
        <Icon className="h-4.5 w-4.5 transition-colors duration-200 group-focus-within:text-orange-500" style={{ color: '#C4B5A8', width: 18, height: 18 }} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-3 border-2 rounded-2xl text-sm transition-all duration-200 bg-orange-50/40 placeholder-orange-200 focus:outline-none focus:bg-white"
        style={{
          paddingLeft: '2.5rem',
          paddingRight: rightElement ? '3rem' : '1rem',
          borderColor: '#EDD5C5',
          color: '#3D2C1E',
          fontFamily: "'Nunito', sans-serif",
        }}
        onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
        onBlur={e => { e.target.style.borderColor = '#EDD5C5'; e.target.style.boxShadow = 'none'; }}
      />
      {rightElement}
    </div>
  </div>
);

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phoneNumber.trim()) return 'Phone number is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (!formData.confirmPassword) return 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setIsLoading(true);
    try {
      const response = await registerService(formData);
      setSuccess(response.data?.message || 'User registered successfully');
      setFormData({
        firstName: '', lastName: '', email: '', phoneNumber: '',
        gender: '', dateOfBirth: '',
        address: { street: '', city: '', state: '', country: '', postalCode: '' },
        password: '', confirmPassword: ''
      });
      setTimeout(() => { if (onSwitchToLogin) onSwitchToLogin(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Fredoka+One&display=swap');

        .register-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #FFF7ED 0%, #FEF3E2 40%, #FDE8C8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        .bg-blob-1 {
          position: absolute;
          top: -80px;
          left: -80px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(251,146,60,0.18) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .bg-blob-2 {
          position: absolute;
          bottom: -100px;
          right: -60px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .bg-blob-3 {
          position: absolute;
          top: 40%;
          left: 30%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .card-wrapper {
          position: relative;
          width: 100%;
          max-width: 1050px;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(180,90,20,0.18), 0 8px 24px rgba(180,90,20,0.10);
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          background: white;
        }

        @media (max-width: 1023px) {
          .card-wrapper { grid-template-columns: 1fr; }
          .left-panel { display: none !important; }
        }

        .left-panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem;
          background: linear-gradient(160deg, #F97316 0%, #FB923C 40%, #FBBF24 100%);
          position: relative;
          overflow: hidden;
          color: white;
        }

        .left-panel::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 220px;
          height: 220px;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
        }

        .left-panel::after {
          content: '';
          position: absolute;
          bottom: 60px;
          left: -40px;
          width: 160px;
          height: 160px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.03em;
          width: fit-content;
        }

        .hero-emoji-ring {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 1.5rem 0;
        }

        .emoji-ring {
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 52px;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255,255,255,0.3);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 0;
        }

        .feature-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .feature-card h3 {
          font-weight: 700;
          font-size: 14px;
          margin: 0 0 6px;
        }

        .feature-card p {
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          margin: 0;
          line-height: 1.5;
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          font-size: 18px;
        }

        .dot-pattern {
          position: absolute;
          bottom: 120px;
          right: 20px;
          opacity: 0.2;
          display: grid;
          grid-template-columns: repeat(5, 8px);
          gap: 6px;
        }

        .dot { width: 4px; height: 4px; background: white; border-radius: 50%; }

        .right-panel {
          padding: 2rem 2.5rem 2rem;
          overflow-y: auto;
          max-height: 90vh;
          background: white;
        }

        .right-panel::-webkit-scrollbar { width: 4px; }
        .right-panel::-webkit-scrollbar-track { background: transparent; }
        .right-panel::-webkit-scrollbar-thumb { background: #FDDCBB; border-radius: 99px; }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #F97316;
          font-weight: 700;
          font-size: 13px;
          background: #FFF7ED;
          padding: 8px 14px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          margin-bottom: 1.25rem;
        }

        .back-btn:hover { background: #FFEDD5; transform: translateX(-2px); }

        .page-title {
          font-family: 'Fredoka One', cursive;
          font-size: 30px;
          color: #2D1810;
          margin: 0 0 4px;
          letter-spacing: 0.01em;
        }

        .page-subtitle {
          color: #A0856E;
          font-size: 13.5px;
          margin: 0 0 1.25rem;
          font-weight: 500;
        }

        .step-indicator {
          display: flex;
          gap: 6px;
          margin-bottom: 1.5rem;
        }

        .step-dot {
          height: 4px;
          border-radius: 99px;
          background: #FDDCBB;
          flex: 1;
          transition: background 0.3s;
        }

        .step-dot.active { background: linear-gradient(90deg, #F97316, #FBBF24); }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .form-grid-2 { grid-template-columns: 1fr; } }

        .form-space { display: flex; flex-direction: column; gap: 12px; }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FBBF24 100%);
          color: white;
          font-weight: 800;
          font-size: 15px;
          padding: 14px;
          border-radius: 18px;
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(249,115,22,0.35);
          letter-spacing: 0.02em;
          font-family: 'Nunito', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(249,115,22,0.42);
          background: linear-gradient(135deg, #EA6C10 0%, #F97316 50%, #F59E0B 100%);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .alert-error {
          background: #FFF1F2;
          border: 1.5px solid #FECDD3;
          border-radius: 14px;
          padding: 10px 14px;
          color: #BE123C;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert-success {
          background: #F0FDF4;
          border: 1.5px solid #BBF7D0;
          border-radius: 14px;
          padding: 10px 14px;
          color: #15803D;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0;
        }

        .divider-line { flex: 1; height: 1px; background: #F0E6DE; }
        .divider-text { font-size: 12px; color: #C4AFA7; font-weight: 600; }

        .signin-row {
          text-align: center;
          font-size: 13px;
          color: #9C8070;
          font-weight: 500;
        }

        .signin-link {
          color: #F97316;
          font-weight: 800;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-size: 13px;
          font-family: 'Nunito', sans-serif;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .eye-btn {
          position: absolute;
          inset-y: 0;
          right: 0;
          padding-right: 12px;
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #C4B5A8;
          transition: color 0.2s;
        }

        .eye-btn:hover { color: #F97316; }

        .section-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #D4A88A;
          margin-bottom: 8px;
          margin-top: 4px;
        }
      `}</style>

      <div className="register-bg">
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
        <div className="bg-blob-3" />

        <div className="card-wrapper">
          {/* ── LEFT PANEL ── */}
          <div className="left-panel">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="brand-badge">
                <Utensils size={14} className="text-orange-200" />

                <span>ZeroHunger</span>
              </div>

              <div className="hero-emoji-ring" style={{ marginTop: '1.5rem' }}>
                <div className="emoji-ring">
                  <Utensils size={52} className="text-white/40" />
                </div>
              </div>

              <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, margin: '0 0 10px', lineHeight: 1.2 }}>
                Join the Nutrition<br />Management System
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, margin: 0 }}>
                Create your account and start managing meals, nutrition, and health goals in one place.
              </p>
            </div>

            {/* dot pattern decoration */}
            <div className="dot-pattern">
              {Array.from({ length: 25 }).map((_, i) => <div key={i} className="dot" />)}
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon"><Leaf size={18} color="white" /></div>
                  <h3>Track Nutrition</h3>
                  <p>Monitor healthy food choices and meal planning daily.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><ClipboardList size={18} color="white" /></div>
                  <h3>Stay Organized</h3>
                  <p>All user health and meal data in one system.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><Target size={18} color="white" /></div>
                  <h3>Set Goals</h3>
                  <p>Define and achieve personal nutrition targets.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><BarChart2 size={18} color="white" /></div>
                  <h3>Smart Reports</h3>
                  <p>Visual insights into your nutrition journey.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel">
            <Link to="/login" className="back-btn" style={{ textDecoration: 'none' }}>
              <ArrowLeft size={15} />
              Back to Login
            </Link>

            <h2 className="page-title">Create Account</h2>
            <p className="page-subtitle">Fill in your details to get started</p>

            <div className="step-indicator">
              <div className="step-dot active" />
              <div className="step-dot active" />
              <div className="step-dot active" />
              <div className="step-dot" />
            </div>

            <form onSubmit={handleSubmit} className="form-space">
              {/* Personal Info */}
              <p className="section-label">Personal Info</p>
              <div className="form-grid-2">
                <InputField
                  label="First Name"
                  icon={User}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
                <InputField
                  label="Last Name"
                  icon={User}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>

              {/* Contact */}
              <p className="section-label" style={{ marginTop: 4 }}>Contact Details</p>
              <InputField
                label="Email Address"
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
              <InputField
                label="Phone Number"
                icon={Phone}
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 000 000 0000"
              />

              <div className="form-grid-2">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#4B3F35', fontFamily: "'Nunito', sans-serif" }}>
                    Gender
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4.5 w-4.5 group-focus-within:text-orange-500" style={{ color: '#C4B5A8', width: 18, height: 18 }} />
                    </div>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full py-3 pl-10 pr-4 border-2 rounded-2xl text-sm transition-all bg-orange-50/40 focus:outline-none focus:bg-white"
                      style={{ borderColor: '#EDD5C5', color: '#3D2C1E', fontFamily: "'Nunito', sans-serif" }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <InputField
                  label="Date of Birth"
                  icon={Calendar}
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              {/* Address Section */}
              <p className="section-label" style={{ marginTop: 4 }}>Address Information</p>
              <InputField
                label="Street Address"
                icon={MapPin}
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="123 Main St"
              />
              <div className="form-grid-2">
                <InputField
                  label="City"
                  icon={MapPin}
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                <InputField
                  label="State"
                  icon={MapPin}
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
              <div className="form-grid-2">
                <InputField
                  label="Country"
                  icon={MapPin}
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
                <InputField
                  label="Postal Code"
                  icon={MapPin}
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                />
              </div>

              {/* Security */}
              <p className="section-label" style={{ marginTop: 4 }}>Security</p>
              <div className="form-grid-2">
                <InputField
                  label="Password"
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 chars"
                  rightElement={
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <InputField
                  label="Confirm Password"
                  icon={Lock}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  rightElement={
                    <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(p => !p)}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              {error && (
                <div className="alert-error">
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="alert-success">
                  <CheckCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{success}</span>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><span className="spinner" /> Creating Account...</>
                ) : (
                  <><Rocket size={16} /> Create Account</>
                )}
              </button>
            </form>

            <div className="divider" style={{ marginTop: 16 }}>
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <div className="signin-row">
              Already have an account?{' '}
              <Link to="/login" className="signin-link">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;