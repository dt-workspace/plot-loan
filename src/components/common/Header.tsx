import React from 'react';
import { Menu, X } from 'lucide-react';
import { useAppStore } from '../../store';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { activeTab, isMobileNavOpen, setMobileNavOpen } = useAppStore();

  const getTabDisplay = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return { icon: '📊', label: 'Dashboard' };
      case 'current':
        return { icon: '🏠', label: 'Current Home' };
      case 'future':
        return { icon: '📍', label: 'Future Plots' };
      case 'timeline':
        return { icon: '⏰', label: 'Timeline' };
      default:
        return { icon: '📊', label: 'Dashboard' };
    }
  };

  const currentTab = getTabDisplay(activeTab);

  return (
    <header className={`bg-white shadow-custom border-b border-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl lg:text-3xl font-bold text-primary-600">
              📍
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Plot Planner
              </h1>
              <p className="text-sm text-gray-600 hidden lg:block">
                Smart planning tool for plot investments and financial analysis
              </p>
            </div>
          </div>

          {/* Mobile Current Tab Indicator */}
          <div className="lg:hidden mobile-current-tab">
            <span className="text-lg mr-2">{currentTab.icon}</span>
            {currentTab.label}
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex space-x-1">
            <NavButton
              isActive={activeTab === 'dashboard'}
              onClick={() => useAppStore.getState().setActiveTab('dashboard')}
              icon="📊"
              label="Dashboard"
            />
            <NavButton
              isActive={activeTab === 'current'}
              onClick={() => useAppStore.getState().setActiveTab('current')}
              icon="🏠"
              label="Current Home"
            />
            <NavButton
              isActive={activeTab === 'future'}
              onClick={() => useAppStore.getState().setActiveTab('future')}
              icon="📍"
              label="Future Plots"
            />
            <NavButton
              isActive={activeTab === 'timeline'}
              onClick={() => useAppStore.getState().setActiveTab('timeline')}
              icon="⏰"
              label="Timeline"
            />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileNavOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`nav-tab ${isActive ? 'active' : ''}`}
    >
      <span className="text-lg mr-2">{icon}</span>
      {label}
    </button>
  );
};
