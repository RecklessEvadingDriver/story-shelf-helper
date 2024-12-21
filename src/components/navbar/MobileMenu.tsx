import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuProps {
  categories: string[];
  isActiveLink: (path: string) => boolean;
}

export const MobileMenu = ({ categories, isActiveLink }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)] mt-6">
          <div className="flex flex-col space-y-3">
            <Button
              variant="ghost"
              className={`justify-start ${isActiveLink('/') ? 'bg-accent' : ''}`}
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className={`justify-start ${
                  isActiveLink(`/books?category=${category}`) ? 'bg-accent' : ''
                }`}
                onClick={() => navigate(`/books?category=${category}`)}
              >
                {category}
              </Button>
            ))}

            {user ? (
              <>
                <Button
                  variant="ghost"
                  className={`justify-start ${isActiveLink('/profile') ? 'bg-accent' : ''}`}
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </Button>
                
                <Button
                  variant="ghost"
                  className={`justify-start ${isActiveLink('/cart') ? 'bg-accent' : ''}`}
                  onClick={() => navigate('/cart')}
                >
                  Cart
                </Button>

                {isAdmin && (
                  <Button
                    variant="ghost"
                    className={`justify-start ${isActiveLink('/admin') ? 'bg-accent' : ''}`}
                    onClick={() => navigate('/admin')}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="ghost"
                className={`justify-start ${isActiveLink('/auth') ? 'bg-accent' : ''}`}
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};