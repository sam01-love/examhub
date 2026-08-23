import React, { useState } from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { Logo } from '../components/Logo';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ExamCategory } from '../types';

export const RegisterPage: React.FC = () => {
  const { loginUser, setActiveTab, setSelectedExam } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState<ExamCategory>('JAMB');

  // Special OTP / PIN State
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate OTP / Security PIN
  const handleGenerateOtp = () => {
    setErrorMessage('');
    if (selectedRole === 'student') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setVerificationCode(code); // Pre-fill for easy candidate testing
      setOtpSent(true);
      setOtpVerified(true);
    } else {
      const adminPin = 'ADMIN-2026';
      setGeneratedOtp(adminPin);
      setVerificationCode(adminPin); // Pre-fill for easy admin testing
      setOtpSent(true);
      setOtpVerified(true);
    }
  };

  const handleVerifyCodeManual = () => {
    setErrorMessage('');
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter your special code / PIN.');
      return;
    }

    if (selectedRole === 'student') {
      if (verificationCode.trim().length >= 4) {
        setOtpVerified(true);
      } else {
        setErrorMessage('Student PIN must be at least 4 characters.');
      }
    } else {
      // Admin verification check
      if (
        verificationCode.trim().toUpperCase() === 'ADMIN-2026' ||
        verificationCode.trim() === '990022' ||
        verificationCode.trim() === generatedOtp
      ) {
        setOtpVerified(true);
      } else {
        setErrorMessage('Invalid Admin Clearance PIN. Use ADMIN-2026 or click Generate.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified && !verificationCode.trim()) {
      setErrorMessage(
        selectedRole === 'admin'
          ? 'Admin Clearance PIN required. Use ADMIN-2026 or click Generate.'
          : 'Candidate Verification OTP required. Click Generate OTP.'
      );
      return;
    }

    setSelectedExam(targetExam);
    const finalName =
      name || (selectedRole === 'admin' ? 'System Administrator' : 'New Candidate');
    const finalEmail = email || (selectedRole === 'admin' ? 'admin@examhub.ng' : 'candidate@examhub.ng');

    loginUser(finalEmail, selectedRole, finalName);
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl font-extrabold uppercase text-slate-900 tracking-tight">
          Create Account & Verify
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Select role and generate unique OTP / PIN to register
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase block">
            Select Account Type
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setOtpVerified(false);
                setGeneratedOtp(null);
                setVerificationCode('');
                setErrorMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                selectedRole === 'student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setOtpVerified(false);
                setGeneratedOtp(null);
                setVerificationCode('');
                setErrorMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                selectedRole === 'admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">
              {selectedRole === 'admin' ? 'Administrator Name' : 'Candidate Full Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'e.g. Dr. Amina Bello' : 'e.g. David Okonjo'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'admin' ? 'admin@examhub.ng' : 'david@student.oauife.edu.ng'
                }
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Target Exam (If Student) */}
          {selectedRole === 'student' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Target Primary Examination
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value as ExamCategory)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
              >
                <option value="JAMB">JAMB UTME (4-Subject Combination)</option>
                <option value="WAEC">WAEC SSCE (Senior Secondary)</option>
                <option value="POST_UTME">OAU Post-UTME (Great Ife Aptitude)</option>
              </select>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Special Verification Code / Unique PIN Section */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {selectedRole === 'admin' ? 'Admin Clearance PIN' : 'Candidate Unique OTP PIN'}
                </span>
              </label>

              <button
                type="button"
                onClick={handleGenerateOtp}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-500 uppercase flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{selectedRole === 'admin' ? 'Get Clearance PIN' : 'Generate OTP'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setOtpVerified(false);
                    setErrorMessage('');
                  }}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'e.g. ADMIN-2026 or 990022'
                      : 'e.g. 6-Digit OTP (e.g. 849201)'
                  }
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:outline-hidden ${
                    otpVerified ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 focus:border-blue-600'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyCodeManual}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition flex items-center gap-1 shrink-0 ${
                  otpVerified
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {otpVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </>
                ) : (
                  <span>Verify</span>
                )}
              </button>
            </div>

            {/* Generated Code Toast Notification */}
            {generatedOtp && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {selectedRole === 'admin'
                      ? `Admin Key Generated: `
                      : `Candidate OTP Sent: `}
                    <strong className="font-mono text-blue-800 uppercase px-1 rounded bg-blue-100">
                      {generatedOtp}
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Active</span>
              </div>
            )}

            {errorMessage && (
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-wide">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Registration Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
              selectedRole === 'admin'
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <span>
              Register as {selectedRole === 'admin' ? 'Administrator' : 'Candidate Student'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500 font-semibold">
            Already registered?{' '}
            <button
              onClick={() => setActiveTab('login')}
              className="text-blue-600 font-bold hover:underline uppercase"
            >
              Login Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
