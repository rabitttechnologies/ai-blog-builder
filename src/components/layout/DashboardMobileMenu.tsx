
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, CreditCard, LogOut, Globe, Users, PenTool, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

type DashboardMobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  handleLogout: () => void;
};

const DashboardMobileMenu: React.FC<DashboardMobileMenuProps> = ({ isOpen, onClose, handleLogout }) => {
  const { user } = useAuth();
  const [articleWriterExpanded, setArticleWriterExpanded] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden">
      <div className="bg-white w-64 h-full overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
        </div>
        <nav className="py-4 px-3 space-y-1">
          <Link to="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/blogs" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <FileText className="w-5 h-5" />
            <span>My Blogs</span>
          </Link>
          
          <div className="space-y-1">
            <button
              onClick={() => setArticleWriterExpanded(!articleWriterExpanded)}
              className="flex items-center justify-between w-full space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <div className="flex items-center space-x-2">
                <PenTool className="w-5 h-5" />
                <span>Article Writer AI Agent</span>
              </div>
              {articleWriterExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {articleWriterExpanded && (
              <div className="pl-7 space-y-1">
                <Link 
                  to="/article-writer" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
                  onClick={onClose}
                >
                  <span>Overview</span>
                </Link>
                <Link 
                  to="/article-writer/keyword" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
                  onClick={onClose}
                >
                  <span>Enter a keyword</span>
                </Link>
                <Link 
                  to="/article-writer/select-keywords" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
                  onClick={onClose}
                >
                  <span>Select Keywords</span>
                </Link>
                <Link 
                  to="/article-writer/title-description" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
                  onClick={onClose}
                >
                  <span>Title & Description</span>
                </Link>
                <Link 
                  to="/article-writer/outline" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
                  onClick={onClose}
                >
                  <span>Article Outline</span>
                </Link>
                <Link 
                  to="/article-writer/generated" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm"
                  onClick={onClose}
                >
                  <span>Generated Article</span>
                </Link>
              </div>
            )}
          </div>
          
          <Link to="/blog" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <Globe className="w-5 h-5" />
            <span>Blog</span>
          </Link>
          <Link to="/account" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <Settings className="w-5 h-5" />
            <span>Account</span>
          </Link>
          <Link to="/subscription" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <CreditCard className="w-5 h-5" />
            <span>Subscription</span>
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
              <Users className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
          <button 
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DashboardMobileMenu;
