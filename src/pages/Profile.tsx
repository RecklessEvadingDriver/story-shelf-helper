import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { UserInfo } from "@/components/profile/UserInfo";
import { Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wishlist } from "@/components/profile/Wishlist";
import { toast } from "sonner";
import { Settings, Crown } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    toast.error("Please sign in to view your profile");
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">My Profile</h1>
        
        <div className="grid gap-8 md:grid-cols-12">
          {/* Profile Info Card */}
          <div className="md:col-span-4 lg:col-span-3">
            <Card className="p-6 bg-card shadow-md">
              <UserInfo user={user} />
              <Separator className="my-6" />
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                {user.role === 'admin' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/admin")}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-8 lg:col-span-9">
            <Card className="p-4 md:p-6 bg-card shadow-md">
              <Tabs defaultValue="orders" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-4">
                  <OrderHistory />
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-4">
                  <Wishlist />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;