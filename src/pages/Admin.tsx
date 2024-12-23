import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookManagement } from "@/components/admin/BookManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { RevenueStats } from "@/components/admin/RevenueStats";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="w-full justify-start mb-8 overflow-x-auto flex-wrap gap-2">
          <TabsTrigger value="books" className="px-4 py-2">
            Books Management
          </TabsTrigger>
          <TabsTrigger value="users" className="px-4 py-2">
            User Management
          </TabsTrigger>
          <TabsTrigger value="revenue" className="px-4 py-2">
            Revenue & Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="books" className="mt-4">
          <BookManagement />
        </TabsContent>
        
        <TabsContent value="users" className="mt-4">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-4">
          <RevenueStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;