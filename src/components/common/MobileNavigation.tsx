import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const { activeTab, isMobileNavOpen, setActiveTab, setMobileNavOpen } = useAppStore();

  const handleTabClick = (tab: 'dashboard' | 'current' | 'future' | 'timeline') => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  const handleOverlayClick = () => {
    setMobileNavOpen(false);
  };

  if (!isMobileNavOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-nav-overlay ${isMobileNavOpen ? 'active' : ''}`}
        onClick={handleOverlayClick}
      />

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav-menu ${isMobileNavOpen ? 'active' : ''} ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Plot Planner
          </h3>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          <MobileNavItem
            isActive={activeTab === 'dashboard'}
            onClick={() => handleTabClick('dashboard')}
            icon="📊"
            label="Dashboard"
            description="View salary growth and financial overview"
          />
          <MobileNavItem
            isActive={activeTab === 'current'}
            onClick={() => handleTabClick('current')}
            icon="🏠"
            label="Current Home"
            description="Calculate current plot investment details"
          />
          <MobileNavItem
            isActive={activeTab === 'future'}
            onClick={() => handleTabClick('future')}
            icon="📍"
            label="Future Plots"
            description="Plan and add new plot investments"
          />
          <MobileNavItem
            isActive={activeTab === 'timeline'}
            onClick={() => handleTabClick('timeline')}
            icon="⏰"
            label="Timeline"
            description="View investment timeline and milestones"
          />
        </nav>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Smart planning tool for plot investments
          </p>
        </div>
      </div>
    </>
  );
};

interface MobileNavItemProps {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  description: string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  isActive,
  onClick,
  icon,
  label,
  description
}) => {
  return (
    <button
      onClick={onClick}
      className={`mobile-nav-item ${isActive ? 'active' : ''} w-full text-left`}
    >
      <div className="flex items-center">
        <span className="text-xl mr-3">{icon}</span>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
    </button>
  );
};
