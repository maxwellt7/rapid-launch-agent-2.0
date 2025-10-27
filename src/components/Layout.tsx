import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { 
  Rocket, 
  Target, 
  Users, 
  TrendingUp, 
  Brain, 
  FileText,
  LayoutDashboard,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, name: 'Offer Builder', path: '/project/offer', icon: Target },
  { id: 2, name: 'Avatar Builder', path: '/project/avatar', icon: Users },
  { id: 3, name: 'Competitor Intelligence', path: '/project/competitors', icon: TrendingUp },
  { id: 4, name: 'AI Avatar Manifold', path: '/project/manifold', icon: Brain },
  { id: 5, name: 'Launch Document', path: '/project/launch-doc', icon: FileText },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const currentProject = useProjectStore((state) => state.currentProject);
  const currentStep = currentProject?.currentStep || 1;

  const handleSignOut = () => {
    signOut();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug: Log user info to console
  console.log('User info:', user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Rocket className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rapid Launch Agent</h1>
                <p className="text-sm text-gray-500">{currentProject?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/project/dashboard')}
                className="btn btn-outline flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              {/* Custom User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isComplete = currentStep > step.id;
                const isCurrent = location.pathname === step.path;
                const isAccessible = step.id <= currentStep;
                const Icon = step.icon;

                return (
                  <li key={step.id} className="flex items-center">
                    <button
                      onClick={() => isAccessible && navigate(step.path)}
                      disabled={!isAccessible}
                      className={clsx(
                        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                        isCurrent && 'bg-primary-50 text-primary-700',
                        isComplete && !isCurrent && 'text-green-600 hover:bg-green-50',
                        !isComplete && !isCurrent && 'text-gray-400',
                        isAccessible && 'cursor-pointer',
                        !isAccessible && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <div className={clsx(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2',
                        isCurrent && 'border-primary-600 bg-primary-600 text-white',
                        isComplete && 'border-green-600 bg-green-600 text-white',
                        !isComplete && !isCurrent && 'border-gray-300'
                      )}>
                        {isComplete ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium hidden md:block">
                        {step.name}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

