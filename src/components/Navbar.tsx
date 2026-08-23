import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  HelpCircle,
  Clock,
  BarChart3,
  Flame,
  Menu,
  X,
  LayoutDashboard,
  Phone,
  Info,
  ShieldCheck,
  Sparkles,
  Award,
  LogOut,
  User,
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    studentProgress,
    userRole,
    currentUser,
    logoutUser,
    triggerSplash,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }

  // Navigation Items according to User Role
  const publicNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'tutorials', label: 'Tutorials', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const studentNavItems: NavItem[] = [
    { id: 'student-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'my-courses', label: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'past-questions', label: 'Past Questions', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'cbt', label: 'CBT Simulator', icon: <Clock className="w-4 h-4" />, badge: 'CBT' },
    { id: 'results', label: 'Results', icon: <Award className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai-tutor', label: 'AI Tutor', icon: <Sparkles className="w-4 h-4" />, badge: 'AI' },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const currentNavItems =
    userRole === 'admin'
      ? adminNavItems
      : userRole === 'student'
      ? studentNavItems
      : publicNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(userRole === 'admin' ? 'admin-dashboard' : userRole === 'student' ? 'student-dashboard' : 'home')}
              className="text-left group focus:outline-hidden"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls (Auth Buttons or User Profile / Logout) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {userRole === 'public' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {userRole === 'student' && (
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>{studentProgress.streakDays}d Streak</span>
                  </div>
                )}

                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-900">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>{currentUser?.name || (userRole === 'admin' ? 'Administrator' : 'Student')}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold uppercase">
                    {userRole}
                  </span>
                </div>

                <button
                  onClick={logoutUser}
                  title="Logout"
                  className="p-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl border border-slate-200 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-300 bg-slate-100 text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-2">
          {currentNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs uppercase tracking-wider ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] rounded font-extrabold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {userRole === 'public' ? (
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl text-center"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-xs"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Logged in as {currentUser?.name} ({userRole})
              </span>
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs uppercase rounded-xl"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
