import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookManagement } from "@/components/admin/BookManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { RevenueStats } from "@/components/admin/RevenueStats";

const Admin = () => {
  const { user } = useAuth();

  // Redirect if not logged in or not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>
        
        <Tabs defaultValue="books" className="space-y-6">
          <TabsList>
            <TabsTrigger value="books">Books Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="revenue">Revenue & Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-4">
            <BookManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <RevenueStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;