
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, CreditCard, LogOut, Globe, Users, PenTool } from "lucide-react";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  handleLogout: () => void;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ handleLogout }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [articleWriterExpanded, setArticleWriterExpanded] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="hidden md:block w-56 bg-white h-[calc(100vh-57px)] sticky top-[57px] border-r overflow-y-auto">
      <nav className="py-4 px-3 space-y-1">
        <Link 
          to="/dashboard" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
            isActive("/dashboard") && "bg-gray-100 font-medium"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/blogs" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
            isActive("/blogs") && "bg-gray-100 font-medium"
          )}
        >
          <FileText className="w-5 h-5" />
          <span>My Blogs</span>
        </Link>
        <div className="space-y-1">
          <button 
            onClick={() => setArticleWriterExpanded(!articleWriterExpanded)}
            className={cn(
              "flex items-center justify-between w-full space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
              (isActive("/article-writer") || articleWriterExpanded) && "bg-gray-100 font-medium"
            )}
          >
            <div className="flex items-center space-x-2">
              <PenTool className="w-5 h-5" />
              <span>Article Writer AI Agent</span>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={cn("transition-transform", articleWriterExpanded ? "transform rotate-180" : "")}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {articleWriterExpanded && (
            <div className="pl-7 space-y-1">
              <Link 
                to="/article-writer" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm",
                  location.pathname === "/article-writer" && "bg-gray-100 font-medium"
                )}
              >
                <span>Overview</span>
              </Link>
              <Link 
                to="/article-writer/keyword" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm",
                  location.pathname === "/article-writer/keyword" && "bg-gray-100 font-medium"
                )}
              >
                <span>Enter a keyword</span>
              </Link>
              <Link 
                to="/article-writer/select-keywords" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm",
                  location.pathname === "/article-writer/select-keywords" && "bg-gray-100 font-medium"
                )}
              >
                <span>Select Keywords</span>
              </Link>
              <Link 
                to="/article-writer/title-description" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm",
                  location.pathname === "/article-writer/title-description" && "bg-gray-100 font-medium"
                )}
              >
                <span>Title & Description</span>
              </Link>
              <Link 
                to="/article-writer/outline" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm",
                  location.pathname === "/article-writer/outline" && "bg-gray-100 font-medium"
                )}
              >
                <span>Article Outline</span>
              </Link>
              <Link 
                to="/article-writer/generated" 
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm",
                  location.pathname === "/article-writer/generated" && "bg-gray-100 font-medium"
                )}
              >
                <span>Generated Article</span>
              </Link>
            </div>
          )}
        </div>
        <Link 
          to="/blog" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
            isActive("/blog") && "bg-gray-100 font-medium"
          )}
        >
          <Globe className="w-5 h-5" />
          <span>Blog</span>
        </Link>
        <Link 
          to="/account" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
            isActive("/account") && "bg-gray-100 font-medium"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Account</span>
        </Link>
        <Link 
          to="/subscription" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
            isActive("/subscription") && "bg-gray-100 font-medium"
          )}
        >
          <CreditCard className="w-5 h-5" />
          <span>Subscription</span>
        </Link>
        {user?.isAdmin && (
          <Link 
            to="/admin" 
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700",
              isActive("/admin") && "bg-gray-100 font-medium"
            )}
          >
            <Users className="w-5 h-5" />
            <span>Admin Dashboard</span>
          </Link>
        )}
        <button 
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
