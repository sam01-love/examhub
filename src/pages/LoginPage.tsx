import React, { useState } from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, setActiveTab } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('david.o@student.oauife.edu.ng');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(
      email,
      selectedRole,
      selectedRole === 'admin' ? 'System Administrator' : 'David Okonjo'
    );
  };

  const handleDemoStudent = () => {
    loginUser('student@examhub.ng', 'student', 'David Okonjo');
  };

  const handleDemoAdmin = () => {
    loginUser('admin@examhub.ng', 'admin', 'System Administrator');
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl font-extrabold uppercase text-slate-900 tracking-tight">
          Portal Account Login
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Sign in with your credentials to enter student or admin mode
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('student');
              setEmail('david.o@student.oauife.edu.ng');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
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
              setEmail('admin@examhub.ng');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
              selectedRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
              selectedRole === 'admin' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <span>Login as {selectedRole === 'admin' ? 'Administrator' : 'Student'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Helpers */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">
            Instant Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoStudent}
              className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[10px] uppercase rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Student</span>
            </button>
            <button
              onClick={handleDemoAdmin}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-semibold">
            Don't have an account?{' '}
            <button
              onClick={() => setActiveTab('register')}
              className="text-blue-600 font-bold hover:underline uppercase"
            >
              Register Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
