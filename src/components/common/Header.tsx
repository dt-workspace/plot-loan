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
        return { label: 'Dashboard' };
      case 'current':
        return { label: 'Current Home' };
      default:
        return { label: 'Dashboard' };
    }
  };

  const currentTab = getTabDisplay(activeTab);

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Plot Planner
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 hidden md:block">
                Smart planning tool for plot investments
              </p>
            </div>
          </div>

          {/* Mobile Current Tab Indicator */}
          <div className="lg:hidden mobile-current-tab">
            {currentTab.label}
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex space-x-1">
            <NavButton
              isActive={activeTab === 'dashboard'}
              onClick={() => useAppStore.getState().setActiveTab('dashboard')}
              label="Dashboard"
            />
            <NavButton
              isActive={activeTab === 'current'}
              onClick={() => useAppStore.getState().setActiveTab('current')}
              label="Current Home"
            />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileNavOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
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
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ isActive, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`nav-tab ${isActive ? 'active' : ''}`}
    >
      {label}
    </button>
  );
};
