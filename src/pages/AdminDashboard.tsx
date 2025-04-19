
import React from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText, BarChart2, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminBlogManagement } from "@/components/admin/blog/AdminBlogManagement";
import { AdminBlogAnalytics } from "@/components/admin/blog/AdminBlogAnalytics";
import { UserManagementTab } from "@/components/admin/users/UserManagementTab";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAuthenticated && !user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Admin Dashboard - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-foreground/70">Manage users, content, and system settings</p>
          </div>
        </div>
        
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="users" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blogs</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagementTab />
          </TabsContent>
          
          <TabsContent value="blogs">
            <AdminBlogManagement />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AdminBlogAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
