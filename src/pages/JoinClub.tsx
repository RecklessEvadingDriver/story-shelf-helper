import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const JoinClub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Join Our Book Club</h1>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Join our exclusive book club to get access to special features and connect with other readers.
            </p>
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full"
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="w-full"
              >
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JoinClub;