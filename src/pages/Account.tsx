
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });
        
        logout();
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Account Settings - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <div className="glass p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <div className="flex">
              <input
                type="email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-gray-50"
                value={user?.email}
                readOnly
              />
              <div className="ml-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Verified</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          
          {!isChangingPassword ? (
            <div>
              <p className="text-foreground/70 mb-4">
                Update your password to keep your account secure.
              </p>
              <Button 
                onClick={() => setIsChangingPassword(true)}
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          ) : (
            <>
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{passwordError}</span>
                </div>
              )}
              
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
        
        <div className="glass p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
          
          <p className="text-foreground/70 mb-4">
            Once you delete your account, all your data will be permanently removed. This action cannot be undone.
          </p>
          
          <Button 
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Account;
