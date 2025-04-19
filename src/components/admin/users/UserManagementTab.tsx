
import React, { useState } from "react";
import { Search, User, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useUsers } from "@/hooks/useUsers";
import { UserListTable } from "./UserListTable";
import { AlertCircle } from "lucide-react";

export function UserManagementTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, isLoading, promotingUserId, handleMakeAdmin } = useUsers();
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      
      <div className="mb-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
          <p>No users found matching your search criteria.</p>
        </div>
      ) : (
        <UserListTable 
          users={filteredUsers}
          promotingUserId={promotingUserId}
          onMakeAdmin={handleMakeAdmin}
        />
      )}
    </div>
  );
}
