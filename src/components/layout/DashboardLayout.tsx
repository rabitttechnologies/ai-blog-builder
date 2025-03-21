import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  User
} from "lucide-react";
import { useAuth } from "@/context/auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2 text-foreground/70"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            
            <Link to="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              BlogCraft
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <button 
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.email?.split('@')[0]}</span>
                <ChevronDown className="hidden md:block w-4 h-4" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-foreground/60">Free Trial</p>
                  </div>
                  <Link 
                    to="/account" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Link 
                    to="/subscription" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Subscription
                  </Link>
                  <button 
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-56 bg-white h-[calc(100vh-57px)] sticky top-[57px] border-r">
          <nav className="py-4 px-3 space-y-1">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/blogs" 
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <FileText className="w-5 h-5" />
              <span>My Blogs</span>
            </Link>
            <Link 
              to="/account" 
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <Settings className="w-5 h-5" />
              <span>Account</span>
            </Link>
            <Link 
              to="/subscription" 
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <CreditCard className="w-5 h-5" />
              <span>Subscription</span>
            </Link>
            <button 
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </nav>
        </aside>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden">
            <div className="bg-white w-64 h-full overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Menu</h2>
              </div>
              <nav className="py-4 px-3 space-y-1">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/blogs" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  <span>My Blogs</span>
                </Link>
                <Link 
                  to="/account" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Account</span>
                </Link>
                <Link 
                  to="/subscription" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Subscription</span>
                </Link>
                <button 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
