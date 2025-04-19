
import React from "react";
import { Button } from "@/components/ui/Button";
import { User, UserCheck } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface UserListItem {
  id: string;
  email: string;
  created_at: string;
  isAdmin: boolean;
}

interface UserListTableProps {
  users: UserListItem[];
  promotingUserId: string | null;
  onMakeAdmin: (userId: string) => Promise<void>;
}

export function UserListTable({ users, promotingUserId, onMakeAdmin }: UserListTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <UserCheck className="mr-1 h-3 w-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <User className="mr-1 h-3 w-3" />
                      User
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {!user.isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMakeAdmin(user.id)}
                    isLoading={promotingUserId === user.id}
                    disabled={promotingUserId === user.id}
                  >
                    Make Admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
