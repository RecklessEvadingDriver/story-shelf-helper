import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { UserInfo } from "@/components/profile/UserInfo";

const Profile = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">My Profile</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="p-6 bg-card">
              <UserInfo user={user} />
              <Separator className="my-4" />
              <Button
                variant="destructive"
                className="w-full"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Order History</h2>
              <OrderHistory />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;