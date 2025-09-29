import { useEffect } from "react";
import { useAppStore } from "./store";
import { Header } from "./components/common/Header";
import { MobileNavigation } from "./components/common/MobileNavigation";
import { Dashboard } from "./components/tabs/Dashboard";
import { CurrentHome } from "./components/tabs/CurrentHome";
// import { FuturePlots } from './components/tabs/FuturePlots';
// import { Timeline } from './components/tabs/Timeline';
import "./index.css";

function App() {
  const { activeTab, isLoading, loadFromStorage } = useAppStore();

  useEffect(() => {
    // Load data from localStorage on app start
    loadFromStorage();
  }, [loadFromStorage]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "current":
        return <CurrentHome />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Plot Planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="tab-content active animate-fade-in">
          {renderActiveTab()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl font-bold text-gray-900">
                Plot Planner
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Smart planning tool for plot investments and financial analysis
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 Plot Planner. Built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
