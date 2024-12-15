import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, UserCog, UserMinus } from "lucide-react";

export const UserManagement = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
    { id: 2, name: "Admin User", email: "admin@example.com", role: "admin" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
      
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <UserCog className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};